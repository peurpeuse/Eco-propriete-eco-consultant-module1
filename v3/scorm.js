/* Éco-Consultant — couche SCORM (1.2 prioritaire, 2004 toléré, sinon stockage local).
   Expose window.LMS : init(), get(k), set(k,v), commit(), finish(), mode */
(function () {
  function findAPI(win, name) {
    var n = 0;
    try {
      while (win && n < 12) {
        if (win[name]) return win[name];
        if (win.parent && win.parent !== win) { win = win.parent; n++; } else break;
      }
    } catch (e) { /* cross-origin parent */ }
    return null;
  }
  function locate(name) {
    var api = findAPI(window, name);
    if (!api) { try { if (window.opener) api = findAPI(window.opener, name); } catch (e) {} }
    return api;
  }
  var api12 = locate('API'), api04 = api12 ? null : locate('API_1484_11');
  var mode = api12 ? 'scorm12' : (api04 ? 'scorm2004' : 'local');
  var MAP04 = {
    'cmi.core.lesson_status': 'cmi.completion_status',
    'cmi.core.lesson_location': 'cmi.location',
    'cmi.core.score.raw': 'cmi.score.raw',
    'cmi.core.score.min': 'cmi.score.min',
    'cmi.core.score.max': 'cmi.score.max',
    'cmi.core.session_time': 'cmi.session_time',
    'cmi.core.student_name': 'cmi.learner_name',
    'cmi.core.exit': 'cmi.exit',
    'cmi.suspend_data': 'cmi.suspend_data'
  };
  var KEY = window.SCORM_KEY || 'eco-consultant-v3';
  var local = {};
  try { local = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { local = {}; }
  var t0 = Date.now(), finished = false;

  function iso8601(ms) { var s = Math.round(ms / 1000); return 'PT' + Math.floor(s / 3600) + 'H' + Math.floor(s % 3600 / 60) + 'M' + (s % 60) + 'S'; }
  function hms(ms) { var s = Math.round(ms / 1000), p = function (x, n) { x = String(x); while (x.length < n) x = '0' + x; return x; };
    return p(Math.floor(s / 3600), 4) + ':' + p(Math.floor(s % 3600 / 60), 2) + ':' + p(s % 60, 2); }

  var LMS = {
    mode: mode,
    init: function () {
      try {
        if (mode === 'scorm12') api12.LMSInitialize('');
        else if (mode === 'scorm2004') api04.Initialize('');
      } catch (e) { LMS.mode = mode = 'local'; }
      var st = LMS.get('cmi.core.lesson_status');
      if (!st || st === 'not attempted' || st === 'unknown') LMS.set('cmi.core.lesson_status', 'incomplete');
      if (mode === 'scorm12') { LMS.set('cmi.core.score.min', '0'); LMS.set('cmi.core.score.max', '100'); }
    },
    get: function (k) {
      try {
        if (mode === 'scorm12') return api12.LMSGetValue(k) || '';
        if (mode === 'scorm2004') return api04.GetValue(MAP04[k] || k) || '';
      } catch (e) {}
      return local[k] || '';
    },
    set: function (k, v) {
      v = String(v);
      try {
        if (mode === 'scorm12') return api12.LMSSetValue(k, v);
        if (mode === 'scorm2004') {
          if (k === 'cmi.core.lesson_status') {
            if (v === 'passed' || v === 'failed') { api04.SetValue('cmi.success_status', v); v = 'completed'; }
            return api04.SetValue('cmi.completion_status', v === 'completed' ? 'completed' : 'incomplete');
          }
          if (k === 'cmi.core.score.raw') { api04.SetValue('cmi.score.scaled', String(Math.max(0, Math.min(1, Number(v) / 100)))); }
          if (k === 'cmi.core.exit') v = (v === 'suspend') ? 'suspend' : 'normal';
          if (/^cmi\.interactions\.\d+\.student_response$/.test(k)) k = k.replace('student_response', 'learner_response');
          if (/^cmi\.interactions\.\d+\.result$/.test(k) && v === 'wrong') v = 'incorrect';
          if (/^cmi\.interactions\.\d+\.type$/.test(k) && v === 'choice') v = 'choice';
          return api04.SetValue(MAP04[k] || k, v);
        }
      } catch (e) {}
      local[k] = v;
      try { localStorage.setItem(KEY, JSON.stringify(local)); } catch (e) {}
      return 'true';
    },
    commit: function () {
      try {
        if (mode === 'scorm12') api12.LMSCommit('');
        else if (mode === 'scorm2004') api04.Commit('');
      } catch (e) {}
    },
    learner: function () { var n = LMS.get('cmi.core.student_name'); if (!n) return ''; var p = n.split(','); return (p[1] ? p[1].trim() : p[0].trim()); },
    finish: function () {
      if (finished) return; finished = true;
      var ms = Date.now() - t0;
      if (mode === 'scorm12') LMS.set('cmi.core.session_time', hms(ms));
      else if (mode === 'scorm2004') { try { api04.SetValue('cmi.session_time', iso8601(ms)); } catch (e) {} }
      LMS.set('cmi.core.exit', LMS.get('cmi.core.lesson_status') === 'completed' || LMS.get('cmi.core.lesson_status') === 'passed' ? '' : 'suspend');
      LMS.commit();
      try {
        if (mode === 'scorm12') api12.LMSFinish('');
        else if (mode === 'scorm2004') api04.Terminate('');
      } catch (e) {}
    }
  };
  window.LMS = LMS;
  window.addEventListener('pagehide', function () { LMS.finish(); });
  window.addEventListener('beforeunload', function () { LMS.finish(); });
})();

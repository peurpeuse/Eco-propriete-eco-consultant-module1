/* Éco-Consultant v3 — parcours de 34 capsules (5 étapes : regarder, se tester, télécharger, pratiquer, déposer).
   Données : window.COURSE = {meta, modules:[{id,title,entry,exit,capsules:[…],case,reminders}], global, scope, preview, pdf} */
(function () {
  'use strict';
  var C = window.COURSE, G = C.global || {}, $ = function (id) { return document.getElementById(id); };
  var main = $('main');
  var PREVIEW = C.preview === true && LMS.mode === 'local';
  var SCOPE = C.scope || { modules: [1, 2, 3, 4, 5], start: true, end: true };
  var MODS = C.modules.filter(function (m) { return SCOPE.modules.indexOf(m.id) >= 0; });
  var STEPS = [
    { k: 'v', n: 'Je regarde', s: 'vidéo 8 min' }, { k: 'q', n: 'Je me teste', s: 'quiz flash' },
    { k: 'r', n: 'Je télécharge', s: 'la ressource' }, { k: 'p', n: 'Je pratique', s: 'exercice' }, { k: 'd', n: 'Je dépose', s: 'livrable' }];
  var MCOL = { 1: 'm1', 2: 'm2', 3: 'm3', 4: 'm4', 5: 'm5' };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function nl(s) { return esc(s).replace(/\n/g, '<br>'); }
  function announce(t) { $('live').textContent = ''; setTimeout(function () { $('live').textContent = t; }, 30); }
  function capById(id) { for (var i = 0; i < C.modules.length; i++) { var m = C.modules[i]; for (var j = 0; j < m.capsules.length; j++) if (m.capsules[j].id === id) return { m: m, c: m.capsules[j], i: j }; } return null; }
  function modById(id) { for (var i = 0; i < C.modules.length; i++) if (C.modules[i].id === +id) return C.modules[i]; return null; }
  function setMod(m) {
    var r = document.documentElement.style;
    if (!m) { r.setProperty('--mc', 'var(--g)'); r.setProperty('--ms', 'var(--g-s)'); return; }
    r.setProperty('--mc', 'var(--m' + m.id + ')'); r.setProperty('--ms', 'var(--m' + m.id + 's)');
  }

  /* ---------- État ---------- */
  LMS.init();
  var S = { v: 3, c: {}, k: {}, r: {}, t: {}, cur: null };
  try { var raw = LMS.get('cmi.suspend_data'); if (raw) { var o = JSON.parse(raw); if (o && o.v === 3) S = o; } } catch (e) {}
  S.c = S.c || {}; S.k = S.k || {}; S.r = S.r || {}; S.t = S.t || {};
  var DKEY = 'eco-v3-depots-' + (C.meta && C.meta.key || 'all');
  var DEP = {}; try { DEP = JSON.parse(localStorage.getItem(DKEY) || '{}') || {}; } catch (e) { DEP = {}; }
  function saveDep() { try { localStorage.setItem(DKEY, JSON.stringify(DEP)); } catch (e) {} }
  function cs(id) { return S.c[id] || (S.c[id] = {}); }
  function stepsDone(id) { var s = S.c[id] || {}; return STEPS.filter(function (x) { return s[x.k] != null && s[x.k] !== false; }).length; }
  function capDone(id) { return stepsDone(id) === 5; }
  function modDone(m) { return m.capsules.every(function (c) { return capDone(c.id); }) && !!S.k[m.id]; }
  function total() {
    var n = 0, d = 0;
    MODS.forEach(function (m) { m.capsules.forEach(function (c) { n += 5; d += stepsDone(c.id); }); n++; if (S.k[m.id]) d++; });
    if (SCOPE.start) { n++; if (S.t.pos != null) d++; }
    if (SCOPE.end) { n += 2; if (S.t.fin != null) d++; if (S.t.dos) d++; }
    return Math.round(100 * d / n);
  }
  function save() {
    var j = JSON.stringify(S);
    if (j.length > 4000) { Object.keys(S.c).forEach(function (k) { delete S.c[k].qa; }); j = JSON.stringify(S); }
    LMS.set('cmi.suspend_data', j);
    if (S.cur) LMS.set('cmi.core.lesson_location', S.cur.join(':').slice(0, 250));
    report(); LMS.commit();
    var p = total(); $('progbar').style.width = p + '%'; $('pct').textContent = p + ' %';
  }
  function report() {
    var raw = null;
    if (SCOPE.end && S.t.fin != null) raw = S.t.fin;
    else {
      var t = 0, n = 0; MODS.forEach(function (m) { m.capsules.forEach(function (c) { var q = (S.c[c.id] || {}).q; if (q != null) { t += q; n++; } }); });
      if (n) raw = Math.round(t / n);
    }
    if (raw != null) LMS.set('cmi.core.score.raw', raw);
    var all = MODS.every(modDone) && (!SCOPE.end || (S.t.fin != null && S.t.dos)) && (!SCOPE.start || S.t.pos != null);
    if (all) LMS.set('cmi.core.lesson_status', 'completed');
  }
  var nInter = null;
  function interaction(id, resp, ok, correct) {
    try {
      if (nInter == null) nInter = parseInt(LMS.get('cmi.interactions._count'), 10) || 0;
      var p = 'cmi.interactions.' + nInter + '.';
      LMS.set(p + 'id', id); LMS.set(p + 'type', 'choice');
      if (correct) LMS.set(p + 'correct_responses.0.pattern', correct);
      LMS.set(p + 'student_response', resp); LMS.set(p + 'result', ok ? 'correct' : 'wrong'); LMS.set(p + 'weighting', '1');
      nInter++;
    } catch (e) {}
  }

  /* ---------- Routage ---------- */
  function go(route) { S.cur = route; render(); save(); try { main.focus({ preventScroll: true }); } catch (e) {} window.scrollTo(0, 0); }
  $('homeBtn').onclick = function () { go(['home']); };
  $('dossierBtn').onclick = function () { go(['dossier']); };
  function crumbs(parts) {
    $('crumbs').innerHTML = parts.map(function (p, i) { return p[1] ? '<button data-r="' + esc(JSON.stringify(p[1])) + '">' + esc(p[0]) + '</button>' : '<b>' + esc(p[0]) + '</b>'; }).join(' › ');
    [].forEach.call($('crumbs').querySelectorAll('button'), function (b) { b.onclick = function () { go(JSON.parse(b.getAttribute('data-r'))); }; });
  }
  function render() {
    var r = S.cur || ['home'], v = V[r[0]] || V.home;
    setMod(null);
    main.innerHTML = v(r);
    if (B[r[0]]) B[r[0]](r);
    bindDocLinks();
  }

  /* ---------- Morceaux réutilisables ---------- */
  function mcqHtml(q, key, idx, opts) {
    opts = opts || {};
    return '<div class="q" data-key="' + esc(key) + '"><div class="qt">' + (opts.num ? esc(opts.num) + ' · ' : '') + esc(q.question) + '</div><div class="opts" role="radiogroup">' +
      q.options.map(function (o, i) { return '<button class="opt" role="radio" aria-checked="false" data-i="' + i + '"><span class="dot" aria-hidden="true"></span><span>' + esc(o) + '<span class="why" hidden></span></span></button>'; }).join('') +
      '</div><div class="row" style="margin-top:8px"><button class="btn p val" disabled>Valider</button></div><div class="fbx"></div></div>';
  }
  function bindMcq(root, q, store, onDone) {
    var sel = null, opts = root.querySelectorAll('.opt'), val = root.querySelector('.val');
    function show(i, silent) {
      var ok = i === q.answer;
      [].forEach.call(opts, function (b) { var j = +b.getAttribute('data-i'); b.disabled = true; b.setAttribute('aria-checked', String(j === i));
        if (j === q.answer) b.classList.add('ok'); else if (j === i) b.classList.add('ko');
        if (j === q.answer || j === i) { var w = b.querySelector('.why'); w.hidden = false; w.textContent = (q.whys || [])[j] || ''; } });
      val.style.display = 'none';
      root.querySelector('.fbx').innerHTML = '<div class="fb ' + (ok ? 'ok' : 'ko') + '"><span class="ic">' + (ok ? '✓' : '✗') + '</span><div><b>' + (ok ? 'Bonne réponse — ' : 'Pas tout à fait — ') + esc(q.fb_title) + '</b><br>' + esc(q.fb_text) + '</div></div>';
      if (!silent) announce(ok ? 'Bonne réponse' : 'Réponse incorrecte');
      return ok;
    }
    [].forEach.call(opts, function (b) { b.onclick = function () { sel = +b.getAttribute('data-i'); [].forEach.call(opts, function (x) { x.setAttribute('aria-checked', String(x === b)); }); val.disabled = false; }; });
    val.onclick = function () { var ok = show(sel); store(sel, ok); if (onDone) onDone(); };
    return show;
  }
  function docHtml(d, kind) {
    var h = '<article class="doc">' + (d.fict ? '<span class="fict">Document fictif à usage pédagogique</span>' : '') + '<div class="dh"><div class="eyebrow">' + esc(kind || '') + '</div><h2>' + esc(d.title) + '</h2></div>' + (d.intro ? '<p>' + nl(d.intro) + '</p>' : '');
    (d.sections || []).forEach(function (s) {
      h += '<h3>' + esc(s.heading || '') + '</h3>';
      var t = s.type || (s.rows ? 'table' : s.items ? 'list' : 'text');
      if (t === 'table') h += '<div class="tw"><table><thead><tr>' + (s.headers || []).map(function (x) { return '<th>' + esc(x) + '</th>'; }).join('') + '</tr></thead><tbody>' + (s.rows || []).map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + nl(x) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
      else if (t === 'checklist') h += '<ul class="ck">' + (s.items || []).map(function (x) { return '<li><span>' + nl(x) + '</span></li>'; }).join('') + '</ul>';
      else if (t === 'steps') h += '<ol>' + (s.items || []).map(function (x) { return '<li>' + nl(x) + '</li>'; }).join('') + '</ol>';
      else if (t === 'list') h += '<ul>' + (s.items || []).map(function (x) { return '<li>' + nl(x) + '</li>'; }).join('') + '</ul>';
      else if (t === 'formula') h += '<div class="fx">' + esc(s.text) + '</div>';
      else h += '<p>' + nl(s.text) + '</p>';
      if (s.text && (t === 'list' || t === 'checklist' || t === 'steps' || t === 'table')) h += '<p>' + nl(s.text) + '</p>';
    });
    if (d.footer) h += '<div class="foot">' + nl(d.footer) + '</div>';
    return h + '</article>';
  }
  function docRefs(text) { return esc(text).replace(/\b(D(0[1-9]|1\d|20))\b/g, '<button class="doclink" data-doc="$1">$1</button>'); }
  function bindDocLinks() { [].forEach.call(main.querySelectorAll('[data-doc]'), function (b) { b.onclick = function () { openDoc(b.getAttribute('data-doc')); }; }); }
  function openDoc(id) {
    var d = ((G.dossier || {}).documents || []).filter(function (x) { return x.id === id; })[0];
    if (!d) return;
    var m = document.createElement('div'); m.className = 'modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
    m.innerHTML = '<div class="box"><button class="btn s x" type="button">Fermer ✕</button>' + docHtml({ title: d.id + ' · ' + d.title, sections: d.sections, fict: true }, 'Dossier fil rouge') + '</div>';
    document.body.appendChild(m);
    var close = function () { m.remove(); document.removeEventListener('keydown', k); };
    var k = function (e) { if (e.key === 'Escape') close(); };
    m.querySelector('.x').onclick = close; m.onclick = function (e) { if (e.target === m) close(); };
    document.addEventListener('keydown', k); m.querySelector('.x').focus();
  }
  function copy(text, btn) {
    var done = function () { var o = btn.textContent; btn.textContent = 'Copié ✓'; setTimeout(function () { btn.textContent = o; }, 1600); };
    try { navigator.clipboard.writeText(text).then(done, function () { fallback(); }); } catch (e) { fallback(); }
    function fallback() { var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (e) {} t.remove(); }
  }
  function pdfLink(file, label) {
    if (!C.pdf) return '';
    return '<a class="btn s" href="pdf/' + esc(file) + '" target="_blank" rel="noopener">⬇ ' + esc(label || 'Télécharger le PDF') + '</a>';
  }

  /* ---------- Vues ---------- */
  var V = {}, B = {};

  V.home = function () {
    crumbs([['Parcours']]);
    var nCaps = MODS.reduce(function (a, m) { return a + m.capsules.length; }, 0);
    var h = '<div class="wrap"><div class="hero"><div class="eyebrow">' + esc(C.meta.program) + ' · format en ligne</div><h1>' + esc(C.meta.title) + '</h1><p class="lead">' + esc(C.meta.subtitle) + '</p></div>' +
      '<div class="loop"><span class="eyebrow">Chaque capsule :</span>' + STEPS.map(function (s, i) { return '<span class="step"><b>' + (i + 1) + '</b>' + s.n + ' <small>' + s.s + '</small></span>'; }).join('<span aria-hidden="true">→</span>') + '</div>' +
      '<div class="band ia"><b>L’IA, fil conducteur</b><span>' + esc(C.meta.bands.ia) + '</span></div>' +
      '<div class="band neuro"><b>Neurosciences</b><span>' + esc(C.meta.bands.neuro) + '</span></div>' +
      '<div class="band fr"><b>Fil rouge</b><span>' + esc(C.meta.bands.fr) + '</span></div>' +
      '<div class="map">';
    if (SCOPE.start) h += '<div class="side"><div class="eyebrow">Début</div><button class="sbtn" data-go=\'["start"]\'>Accès à la plateforme</button><button class="sbtn dark" data-go=\'["test","pos"]\'>Test de positionnement' + (S.t.pos != null ? '<br><span class="chip ok">' + S.t.pos + ' %</span>' : '') + '</button><button class="sbtn" data-go=\'["dossier"]\'>Présentation du dossier fil rouge</button></div>';
    MODS.forEach(function (m) {
      h += '<section class="mcol ' + MCOL[m.id] + '" style="--mc:var(--m' + m.id + ');--ms:var(--m' + m.id + 's)"><div class="mh">Module ' + m.id + ' · ' + m.capsules.length + ' capsules</div>' +
        '<div class="mt"><button data-go=\'["module",' + m.id + ']\'>' + esc(m.title) + '</button></div><div class="io"><div class="eyebrow">Entrée</div>' + esc(m.entry) + '</div><div class="caps">' +
        m.capsules.map(function (c) { var d = stepsDone(c.id); return '<button class="cap" data-go=\'["cap","' + c.id + '",0]\'><span class="ct"><span class="n">' + c.id + '</span><span>' + esc(c.title) + '</span>' + (c.ia ? '<span class="chip ia">IA</span>' : '') + '</span><span class="dots" aria-label="' + d + ' étapes sur 5">' + [0, 1, 2, 3, 4].map(function (i) { return '<i class="' + (i < d ? 'on' : '') + '"></i>'; }).join('') + '</span></button>'; }).join('') +
        '</div><div class="foot"><button class="casebtn" data-go=\'["case",' + m.id + ']\'><span class="eyebrow">Cas pratique' + (S.k[m.id] ? ' · déposé ✓' : '') + '</span><br>' + esc(m.case.title) + '</button><button class="rembtn" data-go=\'["rem",' + m.id + ']\'>Rappels espacés J+1 · J+7 · J+30</button><div class="io"><div class="eyebrow">Sortie</div>' + esc(m.exit) + '</div></div></section>';
    });
    if (SCOPE.end) h += '<div class="side"><div class="eyebrow">Fin</div><button class="sbtn dark" data-go=\'["end"]\'>Dossier fil rouge complet' + (S.t.dos ? '<br><span class="chip ok">déposé</span>' : '') + '</button><button class="sbtn" data-go=\'["test","fin"]\'>Quiz final' + (S.t.fin != null ? '<br><span class="chip ok">' + S.t.fin + ' %</span>' : '') + '</button><button class="sbtn" data-go=\'["sat"]\'>Questionnaire de satisfaction</button><button class="sbtn" data-go=\'["att"]\'>Attestation</button></div>';
    h += '</div><p class="note" style="margin-top:14px"><span class="chip ia">IA</span> capsule avec un exercice à prompt métier · Vidéo : ' + nCaps + ' capsules × 8 min = ' + (nCaps * 8) + ' min (≈ ' + Math.floor(nCaps * 8 / 60) + ' h ' + ('0' + (nCaps * 8) % 60).slice(-2) + ').</p></div>';
    return h;
  };
  function bindGo() { [].forEach.call(main.querySelectorAll('[data-go]'), function (b) { b.onclick = function () { go(JSON.parse(b.getAttribute('data-go'))); }; }); }
  B.home = bindGo;

  V.start = function () {
    crumbs([['Parcours', ['home']], ['Début']]);
    var s = G.start || {};
    return '<div class="narrow"><div class="eyebrow">Début du parcours</div><h1 style="font-size:30px;font-weight:900;margin:6px 0 12px">Bienvenue dans Éco-Consultant</h1>' +
      '<div class="card" style="display:grid;grid-template-columns:auto minmax(0,1fr);gap:16px;align-items:start"><img src="assets/seb.png" alt="Seb, ton formateur" style="width:90px;border-radius:50%;background:var(--o-s)"><div>' + nl(s.welcome) + '</div></div>' +
      '<h2 style="margin:22px 0 8px">Accès à la plateforme</h2><ol class="st">' + (s.platform_steps || []).map(function (x) { return '<li><span>' + nl(x) + '</span></li>'; }).join('') + '</ol>' +
      '<h2 style="margin:22px 0 8px">Comment ça marche</h2><p>' + nl(s.how_it_works) + '</p>' +
      '<h2 style="margin:22px 0 8px">Le dossier fil rouge</h2><p>' + nl(s.dossier_intro) + '</p>' +
      '<div class="row" style="margin-top:16px"><button class="btn p" data-go=\'["test","pos"]\'>Passer le test de positionnement →</button><button class="btn s" data-go=\'["dossier"]\'>Ouvrir le dossier fil rouge</button></div></div>';
  };
  B.start = bindGo;

  V.module = function (r) {
    var m = modById(r[1]); setMod(m);
    crumbs([['Parcours', ['home']], ['Module ' + m.id]]);
    var h = '<div class="wrap ' + MCOL[m.id] + '"><div class="mhead"><div><span class="mtag">Module ' + m.id + ' · ' + m.capsules.length + ' capsules</span><h1 style="font-size:clamp(24px,3vw,34px);font-weight:900;margin:8px 0">' + esc(m.title) + '</h1>' +
      '<p style="margin:0"><b>Entrée :</b> ' + esc(m.entry) + ' · <b>Sortie :</b> ' + esc(m.exit) + '</p></div><div class="row"><button class="btn p" data-go=\'["cap","' + firstOpen(m) + '",0]\'>' + (m.capsules.some(function (c) { return stepsDone(c.id); }) ? 'Reprendre' : 'Commencer') + ' →</button></div></div>' +
      '<div style="display:flex;flex-direction:column;gap:8px;margin-top:16px">' +
      m.capsules.map(function (c) { var d = stepsDone(c.id); return '<button class="capcard" data-go=\'["cap","' + c.id + '",0]\'><span class="num">' + c.id + '</span><span><b>' + esc(c.title) + '</b> ' + (c.ia ? '<span class="chip ia">IA</span>' : '') + '<small>' + esc(c.objective) + '</small><small>EX · ' + esc(c.exercise.title) + ' — RES · ' + esc(c.resource.title) + '</small></span><span class="five" aria-label="' + d + ' étapes sur 5">' + [1, 2, 3, 4, 5].map(function (i) { return '<i class="' + (i <= d ? 'on' : '') + '">' + i + '</i>'; }).join('') + '</span></button>'; }).join('') +
      '</div><div class="grid2" style="margin-top:16px"><button class="card" style="text-align:left;background:var(--g-d);color:#fff;border:0" data-go=\'["case",' + m.id + ']\'><span class="eyebrow" style="color:#cfe8d9">Cas pratique · ' + m.case.duration_min + ' min</span><h3 style="margin-top:4px">' + esc(m.case.title) + '</h3>' + (S.k[m.id] ? '<span class="chip ok" style="margin-top:6px">Déposé</span>' : '') + '</button>' +
      '<button class="card" style="text-align:left;background:var(--neuro-s);border-color:transparent" data-go=\'["rem",' + m.id + ']\'><span class="eyebrow" style="color:var(--neuro)">Neurosciences · répétition espacée</span><h3 style="margin-top:4px;color:var(--neuro)">Rappels J+1 · J+7 · J+30</h3></button></div></div>';
    return h;
  };
  function firstOpen(m) { for (var i = 0; i < m.capsules.length; i++) if (!capDone(m.capsules[i].id)) return m.capsules[i].id; return m.capsules[0].id; }
  B.module = bindGo;

  /* Capsule */
  V.cap = function (r) {
    var x = capById(r[1]), m = x.m, c = x.c, st = +r[2] || 0; setMod(m);
    crumbs([['Parcours', ['home']], ['Module ' + m.id, ['module', m.id]], ['Capsule ' + c.id]]);
    var s = S.c[c.id] || {};
    var h = '<div class="wrap ' + MCOL[m.id] + '"><div class="chead"><div><span class="mtag">Module ' + m.id + ' · Capsule ' + c.id + '</span> ' + (c.ia ? '<span class="chip ia">IA</span>' : '') +
      '<h1>' + esc(c.title) + '</h1><div class="obj"><b>Objectif</b>À la fin de cette capsule, tu sauras ' + esc(c.objective.charAt(0).toLowerCase() + c.objective.slice(1)) + '.</div></div>' +
      '<div class="note">' + stepsDone(c.id) + ' / 5 étapes</div></div>' +
      '<div class="tabs" role="tablist">' + STEPS.map(function (t, i) { return '<button class="tab' + (s[t.k] ? ' done' : '') + '" role="tab" aria-selected="' + (i === st) + '" data-st="' + i + '"><span class="k">' + (s[t.k] ? '✓' : i + 1) + '</span><span class="tl">' + t.n + '</span></button>'; }).join('') + '</div>' +
      '<div class="panel" id="panel">' + P[st](c, m) + '</div>' +
      '<div class="navb"><button class="btn s" id="prevS">' + (st === 0 ? '← Module ' + m.id : '← ' + STEPS[st - 1].n) + '</button><button class="btn p" id="nextS">' + (st < 4 ? STEPS[st + 1].n + ' →' : nextCapLabel(m, x.i)) + '</button></div></div>';
    return h;
  };
  function nextCapLabel(m, i) { return m.capsules[i + 1] ? 'Capsule ' + m.capsules[i + 1].id + ' →' : 'Cas pratique du module →'; }
  B.cap = function (r) {
    var x = capById(r[1]), m = x.m, c = x.c, st = +r[2] || 0;
    [].forEach.call(main.querySelectorAll('.tab'), function (b) { b.onclick = function () { go(['cap', c.id, +b.getAttribute('data-st')]); }; });
    $('prevS').onclick = function () { go(st === 0 ? ['module', m.id] : ['cap', c.id, st - 1]); };
    $('nextS').onclick = function () { if (st < 4) go(['cap', c.id, st + 1]); else go(m.capsules[x.i + 1] ? ['cap', m.capsules[x.i + 1].id, 0] : ['case', m.id]); };
    PB[st](c, m);
  };
  function mark(c, k, v) { cs(c.id)[k] = v == null ? 1 : v; save(); var t = main.querySelectorAll('.tab')[STEPS.map(function (s) { return s.k; }).indexOf(k)]; if (t) { t.classList.add('done'); t.querySelector('.k').textContent = '✓'; } }

  var P = [], PB = [];
  P[0] = function (c) {
    var v = c.video, last = v.segments[v.segments.length - 1];
    var media = v.src ? '<video controls preload="metadata" src="' + esc(v.src) + '"></video>' :
      '<img class="seb" src="assets/seb.png" alt=""><button class="pl" id="playBtn" aria-label="Lire la transcription"></button><span class="tag">Seb · 8 min · vidéo en production</span><span class="hook">« ' + esc(v.hook) + ' »</span>';
    return '<div class="video"><div><div class="poster">' + media + '</div>' + (v.src ? '' : '<p class="note" style="margin-top:8px">La vidéo de Seb (avatar HeyGen) est en cours de production. En attendant, la transcription complète est à droite.</p>') +
      '<div class="row" style="margin-top:8px"><button class="btn p" id="watched">' + ((S.c[c.id] || {}).v ? 'Vidéo vue ✓' : 'J’ai regardé la vidéo') + '</button>' + (C.showProd ? '<label class="note"><input type="checkbox" id="prodT"> Afficher les consignes de montage</label>' : '') + '</div></div>' +
      '<div><div class="eyebrow" style="margin-bottom:6px">Transcription</div><div class="tr noprod" id="tr" tabindex="0">' + v.segments.map(function (s) { return '<div class="seg"><span class="tc">' + esc(s.tc) + '</span><span>' + esc(s.voice) + (s.onscreen ? '<b class="sc" style="font-style:normal;color:var(--g-d)">À l’écran : ' + esc(s.onscreen) + '</b>' : '') + '<span class="sc">Plan : ' + esc(s.screen) + '</span></span></div>'; }).join('') + '</div></div></div>';
  };
  PB[0] = function (c) {
    var w = $('watched'); w.onclick = function () { mark(c, 'v'); w.textContent = 'Vidéo vue ✓'; announce('Étape 1 terminée'); };
    var p = $('playBtn'); if (p) p.onclick = function () { $('tr').focus(); $('tr').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); };
    var pt = $('prodT'); if (pt) pt.onchange = function () { $('tr').classList.toggle('noprod', !pt.checked); };
    var vid = main.querySelector('video'); if (vid) vid.addEventListener('ended', function () { mark(c, 'v'); });
  };
  P[1] = function (c) {
    var qs = c.quiz.questions, s = S.c[c.id] || {};
    return '<p class="lead">Récupération active : réponds juste après la vidéo, sans la revoir. Chaque réponse est expliquée.</p>' +
      qs.map(function (q, i) { return mcqHtml(q, c.id + ':' + i, i, { num: 'Question ' + (i + 1) + '/' + qs.length }); }).join('') +
      '<div id="qres">' + (s.q != null ? resultHtml(s.q) : '') + '</div>';
  };
  function resultHtml(p) { return '<div class="card"><div class="score"><span class="big">' + p + ' %</span><span>' + (p >= 75 ? 'Solide. Passe à la ressource.' : 'Revois la vidéo sur les points ratés, puis refais le quiz.') + '</span></div><div class="bar' + (p < 75 ? ' low' : '') + '"><i style="width:' + p + '%"></i></div><button class="btn s" id="redo">Refaire le quiz</button></div>'; }
  PB[1] = function (c) {
    var qs = c.quiz.questions, ans = cs(c.id).qa || (cs(c.id).qa = {});
    [].forEach.call(main.querySelectorAll('.q'), function (el, i) {
      var show = bindMcq(el, qs[i], function (sel, ok) { ans[i] = [sel, ok ? 1 : 0]; check(); });
      if (ans[i]) show(ans[i][0], true);
    });
    function check() {
      if (Object.keys(ans).length === qs.length) {
        var p = Math.round(100 * Object.keys(ans).reduce(function (a, k) { return a + ans[k][1]; }, 0) / qs.length);
        cs(c.id).q = p; mark(c, 'q', p); $('qres').innerHTML = resultHtml(p); bindRedo();
      } else save();
    }
    function bindRedo() { var r = $('redo'); if (r) r.onclick = function () { delete cs(c.id).q; cs(c.id).qa = {}; save(); go(['cap', c.id, 1]); }; }
    bindRedo();
  };
  P[2] = function (c, m) {
    return '<div class="row" style="margin-bottom:12px">' + pdfLink('RES_' + c.id.replace('.', '-') + '.pdf', 'Télécharger la fiche (PDF)') + '<button class="btn p" id="gotR">' + ((S.c[c.id] || {}).r ? 'Ressource récupérée ✓' : 'J’ai récupéré la ressource') + '</button></div>' +
      docHtml({ title: c.resource.title, intro: c.resource.intro, sections: c.resource.sections, footer: c.resource.footer }, 'Ressource · capsule ' + c.id);
  };
  PB[2] = function (c) { $('gotR').onclick = function () { mark(c, 'r'); $('gotR').textContent = 'Ressource récupérée ✓'; }; };
  P[3] = function (c) {
    var x = c.exercise, p = x.ia_prompt;
    return '<div class="eyebrow">Exercice · ≈ ' + x.duration_min + ' min</div><h2 style="margin:4px 0 10px">' + esc(x.title) + '</h2><div class="ctx">' + docRefs(x.context) + '</div>' +
      (x.materials && x.materials.length ? '<p><b>Documents du dossier :</b> ' + x.materials.map(function (d) { return docRefs(d); }).join(' · ') + '</p>' : '') +
      '<ol class="st">' + x.steps.map(function (s) { return '<li><span>' + docRefs(s) + '</span></li>'; }).join('') + '</ol>' +
      (p && p.prompt ? '<div class="iab"><div class="row" style="justify-content:space-between"><b>Prompt métier prêt à l’emploi</b><button class="btn o" id="cpy">Copier le prompt</button></div><div class="prompt" style="margin-top:8px">' + esc(p.prompt) + '</div><p style="margin:10px 0 4px"><b>Garde-fous</b></p><ul>' + (p.guardrails || []).map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ul></div>' : '') +
      '<div class="row" style="margin-top:14px"><button class="btn p" id="didP">' + ((S.c[c.id] || {}).p ? 'Exercice fait ✓' : 'J’ai fait l’exercice') + '</button><button class="btn s" id="corr" ' + ((S.c[c.id] || {}).p ? '' : 'disabled') + '>Voir le corrigé</button></div><div id="corrBox"></div>';
  };
  PB[3] = function (c) {
    var p = c.exercise.ia_prompt, cp = $('cpy'); if (cp) cp.onclick = function () { copy(p.prompt, cp); };
    $('didP').onclick = function () { mark(c, 'p'); $('didP').textContent = 'Exercice fait ✓'; $('corr').disabled = false; };
    $('corr').onclick = function () { $('corrBox').innerHTML = '<div class="reveal"><b>Corrigé / réponse attendue</b>\n' + docRefs(c.exercise.expected) + '</div>'; bindDocLinks(); };
  };
  P[4] = function (c) {
    var d = c.deliverable, key = c.id, dep = DEP[key] || {};
    return depositHtml(d.title, d.format, d.criteria, d.example, dep, (S.c[c.id] || {}).d);
  };
  function depositHtml(title, format, criteria, example, dep, done) {
    return '<div class="eyebrow">Livrable à déposer</div><h2 style="margin:4px 0 6px">' + esc(title) + '</h2><p><b>Format :</b> ' + esc(format) + '</p>' +
      '<h3 style="margin:12px 0 6px">Grille de validation — coche avant de déposer</h3><ul class="crit">' + (criteria || []).map(function (k, i) { var lab = typeof k === 'string' ? k : (k.label + (k.points ? ' (' + k.points + ' pts)' : '') + (k.expected ? ' — ' + k.expected : '')); return '<li><label><input type="checkbox" data-c="' + i + '"' + ((dep.ck || {})[i] ? ' checked' : '') + '><span>' + esc(lab) + '</span></label></li>'; }).join('') + '</ul>' +
      (example ? '<details style="margin-top:10px"><summary><b>Voir un exemple de livrable réussi</b></summary><div class="reveal">' + esc(example) + '</div></details>' : '') +
      '<h3 style="margin:14px 0 6px">Ton dépôt</h3><textarea id="depT" placeholder="Colle ici ton livrable ou un lien vers ton document (Drive, OneDrive…).">' + esc(dep.t || '') + '</textarea>' +
      '<div class="row" style="margin-top:8px"><input type="file" id="depF" aria-label="Joindre un fichier"><span class="note" id="depFn">' + (dep.f ? 'Fichier joint : ' + esc(dep.f) : '') + '</span></div>' +
      '<div class="row" style="margin-top:12px"><button class="btn p" id="depB">' + (done ? 'Mettre à jour le dépôt' : 'Déposer mon livrable') + '</button>' + (done ? '<span class="chip wait">Déposé · en attente de validation par le formateur</span>' : '') + '</div>' +
      '<p class="note" style="margin-top:8px">' + (LMS.mode === 'local' ? 'Dans cet aperçu, ton dépôt reste dans ton navigateur. Sur la plateforme, il est transmis au formateur qui le valide avec cette grille.' : 'Ton dépôt est transmis au formateur, qui le valide avec cette grille.') + '</p>';
  }
  function bindDeposit(key, onDone) {
    var dep = DEP[key] || (DEP[key] = {});
    [].forEach.call(main.querySelectorAll('.crit input'), function (i) { i.onchange = function () { dep.ck = dep.ck || {}; dep.ck[i.getAttribute('data-c')] = i.checked; saveDep(); }; });
    $('depT').oninput = function () { dep.t = $('depT').value; saveDep(); };
    $('depF').onchange = function () { var f = $('depF').files[0]; if (f) { dep.f = f.name; $('depFn').textContent = 'Fichier joint : ' + f.name; saveDep(); } };
    $('depB').onclick = function () {
      if (!($('depT').value.trim() || dep.f)) { announce('Ajoute ton livrable (texte, lien ou fichier) avant de déposer.'); $('depT').focus(); $('depT').placeholder = 'Ajoute ton livrable (texte, lien ou fichier) avant de déposer.'; return; }
      dep.at = new Date().toISOString(); saveDep(); onDone(); };
  }
  PB[4] = function (c) { bindDeposit(c.id, function () { mark(c, 'd'); announce('Livrable déposé'); go(['cap', c.id, 4]); }); };

  /* Cas pratique */
  V.case = function (r) {
    var m = modById(r[1]), k = m.case; setMod(m);
    crumbs([['Parcours', ['home']], ['Module ' + m.id, ['module', m.id]], ['Cas pratique']]);
    var dep = DEP['case' + m.id] || {};
    return '<div class="narrow ' + MCOL[m.id] + '"><span class="mtag">Module ' + m.id + ' · Cas pratique · ' + k.duration_min + ' min</span><h1 style="font-size:30px;font-weight:900;margin:8px 0 12px">' + esc(k.title) + '</h1>' +
      '<div class="ctx">' + docRefs(k.brief) + '</div>' + pdfLink('CAS_M' + m.id + '.pdf', 'Énoncé en PDF') +
      '<h3 style="margin:14px 0 6px">Documents</h3><p>' + (k.documents || []).map(docRefs).join(' · ') + '</p>' +
      '<h3 style="margin:14px 0 6px">Ce que tu dois faire</h3><ol class="st">' + (k.tasks || []).map(function (t) { return '<li><span>' + docRefs(t) + '</span></li>'; }).join('') + '</ol>' +
      (k.variants ? '<h3 style="margin:14px 0 6px">Variantes</h3><ul>' + k.variants.map(function (v) { return '<li>' + esc(typeof v === 'string' ? v : (v.title || '') + ' — ' + (v.text || v.description || '')) + '</li>'; }).join('') + '</ul>' : '') +
      '<div class="card" style="margin-top:16px">' + depositHtml(k.deliverable, 'Selon la consigne ci-dessus', k.criteria, null, dep, S.k[m.id]) + '</div>' +
      '<div class="navb"><button class="btn s" data-go=\'["module",' + m.id + ']\'>← Module ' + m.id + '</button><button class="btn p" data-go=\'["rem",' + m.id + ']\'>Rappels espacés →</button></div></div>';
  };
  B.case = function (r) { var m = modById(r[1]); bindGo(); bindDeposit('case' + m.id, function () { S.k[m.id] = 1; save(); go(['case', m.id]); }); };

  /* Rappels */
  V.rem = function (r) {
    var m = modById(r[1]); setMod(m);
    crumbs([['Parcours', ['home']], ['Module ' + m.id, ['module', m.id]], ['Rappels']]);
    var tabs = ['J1', 'J7', 'J30'], lab = { J1: 'J+1', J7: 'J+7', J30: 'J+30' };
    return '<div class="narrow ' + MCOL[m.id] + '"><span class="mtag">Module ' + m.id + ' · Répétition espacée</span><h1 style="font-size:30px;font-weight:900;margin:8px 0 6px">Rappels J+1 · J+7 · J+30</h1><p class="lead">Ces questions arrivent par e-mail et SMS 1, 7 et 30 jours après la fin du module. Se rappeler, c’est ce qui fait retenir.</p>' +
      tabs.map(function (t) { var x = m.reminders[t]; return '<section class="card" style="margin-top:14px"><div class="row" style="justify-content:space-between"><h2 style="font-size:20px">' + lab[t] + ' · ' + esc(String(x.subject).replace(/^J\+\d+\s*[·:–-]\s*/, '')) + '</h2>' + (S.r[m.id + t] != null ? '<span class="chip ok">' + S.r[m.id + t] + ' %</span>' : '') + '</div>' +
        '<details style="margin:8px 0"><summary class="note">Voir le message envoyé (e-mail et SMS)</summary><div class="reveal">' + esc(x.message) + '\n\nSMS : ' + esc(x.sms) + '</div></details>' +
        x.questions.map(function (q, i) { return mcqHtml(q, m.id + t + i, i, { num: 'Q' + (i + 1) }); }).join('') + '</section>'; }).join('') +
      '<div class="navb"><button class="btn s" data-go=\'["module",' + m.id + ']\'>← Module ' + m.id + '</button>' + (modById(m.id + 1) && SCOPE.modules.indexOf(m.id + 1) >= 0 ? '<button class="btn p" data-go=\'["module",' + (m.id + 1) + ']\'>Module ' + (m.id + 1) + ' →</button>' : '<button class="btn p" data-go=\'["home"]\'>Parcours →</button>') + '</div></div>';
  };
  B.rem = function (r) {
    var m = modById(r[1]); bindGo();
    ['J1', 'J7', 'J30'].forEach(function (t) {
      var qs = m.reminders[t].questions, got = {};
      [].forEach.call(main.querySelectorAll('[data-key^="' + m.id + t + '"]'), function (el, i) {
        bindMcq(el, qs[i], function (sel, ok) { got[i] = ok ? 1 : 0; if (Object.keys(got).length === qs.length) { S.r[m.id + t] = Math.round(100 * Object.keys(got).reduce(function (a, k) { return a + got[k]; }, 0) / qs.length); save(); } });
      });
    });
  };

  /* Tests : positionnement et quiz final */
  V.test = function (r) {
    var fin = r[1] === 'fin', T = fin ? G.final : G.positioning, qs = T.questions;
    crumbs([['Parcours', ['home']], [fin ? 'Quiz final' : 'Test de positionnement']]);
    var prev = fin ? S.t.fin : S.t.pos;
    return '<div class="narrow"><div class="eyebrow">' + (fin ? 'Fin du parcours' : 'Début du parcours') + '</div><h1 style="font-size:30px;font-weight:900;margin:6px 0">' + (fin ? 'Quiz final' : 'Test de positionnement') + '</h1><p class="lead">' + esc(T.intro) + '</p>' +
      (prev != null ? '<p><span class="chip ok">Dernier résultat : ' + prev + ' %</span></p>' : '') +
      qs.map(function (q, i) { return mcqHtml(q, 't' + i, i, { num: (i + 1) + '/' + qs.length + ' · M' + q.module }); }).join('') +
      '<div id="tres"></div></div>';
  };
  B.test = function (r) {
    var fin = r[1] === 'fin', T = fin ? G.final : G.positioning, qs = T.questions, got = {};
    [].forEach.call(main.querySelectorAll('.q'), function (el, i) {
      bindMcq(el, qs[i], function (sel, ok) { got[i] = ok ? 1 : 0; interaction((fin ? 'FINAL_Q' : 'POS_Q') + (i + 1) + '_M' + qs[i].module, String.fromCharCode(97 + sel), ok, String.fromCharCode(97 + qs[i].answer));
        if (Object.keys(got).length === qs.length) done(); });
    });
    function done() {
      var p = Math.round(100 * Object.keys(got).reduce(function (a, k) { return a + got[k]; }, 0) / qs.length), by = {};
      qs.forEach(function (q, i) { by[q.module] = by[q.module] || [0, 0]; by[q.module][1]++; by[q.module][0] += got[i]; });
      if (fin) { S.t.fin = Math.max(S.t.fin || 0, p); } else S.t.pos = p; save();
      var th = fin ? (G.final.threshold || 70) : null;
      $('tres').innerHTML = '<div class="card"><div class="score"><span class="big">' + p + ' %</span><span>' + (fin ? (p >= th ? 'Seuil de ' + th + ' % atteint : ton attestation est disponible.' : 'Sous le seuil de ' + th + ' % : revois les modules signalés puis repasse le quiz.') : 'C’est ton point de départ. Tu compareras avec le quiz final.') + '</span></div>' +
        '<table class="res"><thead><tr><th>Module</th><th>Bonnes réponses</th><th>Réussite</th></tr></thead><tbody>' + Object.keys(by).map(function (k) { var v = by[k], pp = Math.round(100 * v[0] / v[1]); return '<tr><td>Module ' + k + ' · ' + esc(modById(k).title) + '</td><td>' + v[0] + ' / ' + v[1] + '</td><td style="width:35%"><div class="bar' + (pp < 70 ? ' low' : '') + '"><i style="width:' + pp + '%"></i></div></td></tr>'; }).join('') + '</tbody></table>' +
        (fin && S.t.pos != null ? '<p style="margin-top:10px">Progression depuis le test de positionnement : <b>' + (p - S.t.pos >= 0 ? '+' : '') + (p - S.t.pos) + ' points</b>.</p>' : '') +
        '<div class="row" style="margin-top:10px"><button class="btn p" data-go=\'["home"]\'>Retour au parcours</button>' + (fin ? '<button class="btn s" data-go=\'["test","fin"]\'>Refaire le quiz</button>' : '') + '</div></div>';
      bindGo(); $('tres').scrollIntoView({ behavior: 'smooth' });
    }
  };

  /* Fin */
  V.end = function () {
    crumbs([['Parcours', ['home']], ['Dossier fil rouge complet']]);
    var e = G.end || {}, dep = DEP.dossier || {};
    return '<div class="narrow"><div class="eyebrow">Fin du parcours</div><h1 style="font-size:30px;font-weight:900;margin:6px 0 10px">Dossier fil rouge complet</h1><div class="ctx">' + docRefs(e.dossier_complet) + '</div>' +
      '<div class="card" style="margin-top:14px">' + depositHtml('Dossier fil rouge complet', 'Un seul document (PDF) ou un dossier partagé', e.criteria, null, dep, S.t.dos) + '</div>' +
      (e.message ? '<div class="card" style="margin-top:14px;display:grid;grid-template-columns:auto minmax(0,1fr);gap:14px"><img src="assets/seb.png" alt="" style="width:70px;border-radius:50%;background:var(--o-s)"><p style="margin:0">' + nl(e.message) + '</p></div>' : '') +
      '<div class="navb"><button class="btn s" data-go=\'["home"]\'>← Parcours</button><button class="btn p" data-go=\'["test","fin"]\'>Quiz final →</button></div></div>';
  };
  B.end = function () { bindGo(); bindDeposit('dossier', function () { S.t.dos = 1; save(); go(['end']); }); };

  V.sat = function () {
    crumbs([['Parcours', ['home']], ['Satisfaction']]);
    var s = G.satisfaction || {}, a = DEP.sat || {};
    return '<div class="narrow"><div class="eyebrow">Fin du parcours</div><h1 style="font-size:30px;font-weight:900;margin:6px 0 10px">Questionnaire de satisfaction</h1><p class="lead">' + esc(s.intro) + '</p>' +
      (s.questions || []).map(function (q, i) {
        var inner = q.type === 'scale' ? '<div class="scale" role="group">' + (q.options || [1, 2, 3, 4, 5]).map(function (o) { return '<button aria-pressed="' + (String(a[i]) === String(o)) + '" data-q="' + i + '" data-v="' + esc(o) + '">' + esc(o) + '</button>'; }).join('') + '</div>' :
          q.type === 'choice' ? '<div class="scale" role="group">' + (q.options || []).map(function (o) { return '<button aria-pressed="' + (a[i] === o) + '" data-q="' + i + '" data-v="' + esc(o) + '">' + esc(o) + '</button>'; }).join('') + '</div>' :
          '<textarea data-q="' + i + '" style="min-height:80px">' + esc(a[i] || '') + '</textarea>';
        return '<div class="card" style="margin-top:10px"><b>' + (i + 1) + '. ' + esc(q.question) + '</b>' + (q.labels ? '<div class="note">' + esc(q.labels) + '</div>' : '') + '<div style="margin-top:8px">' + inner + '</div></div>';
      }).join('') +
      '<div class="row" style="margin-top:14px"><button class="btn p" id="satB">Envoyer mes réponses</button><span id="satM" class="note"></span></div></div>';
  };
  B.sat = function () {
    var a = DEP.sat || (DEP.sat = {});
    [].forEach.call(main.querySelectorAll('.scale button'), function (b) { b.onclick = function () { var q = b.getAttribute('data-q'); a[q] = b.getAttribute('data-v'); [].forEach.call(b.parentNode.children, function (x) { x.setAttribute('aria-pressed', String(x === b)); }); saveDep(); }; });
    [].forEach.call(main.querySelectorAll('textarea[data-q]'), function (t) { t.oninput = function () { a[t.getAttribute('data-q')] = t.value; saveDep(); }; });
    $('satB').onclick = function () { S.t.sat = 1; save(); $('satM').textContent = 'Merci, tes réponses sont enregistrées.'; announce('Réponses enregistrées'); };
  };

  V.att = function () {
    crumbs([['Parcours', ['home']], ['Attestation']]);
    var a = G.attestation || {}, th = (G.final || {}).threshold || 70, ok = S.t.fin != null && S.t.fin >= th;
    var name = LMS.learner() || 'Prénom Nom';
    var txt = (a.text || '').replace(/\{nom\}/g, name).replace(/\{date_debut\}/g, '…').replace(/\{date_fin\}/g, new Date().toLocaleDateString('fr-FR')).replace(/\{duree\}/g, C.meta.duration || '…').replace(/\{resultat_quiz_final\}/g, S.t.fin != null ? S.t.fin + ' %' : '…');
    return '<div class="narrow">' + (ok || PREVIEW ? '' : '<p class="chip wait" style="margin-bottom:10px">Disponible après le quiz final réussi (' + th + ' %) — aperçu ci-dessous</p>') +
      '<div class="att"><img src="assets/logo-dark.png" alt="Éco-Consultant" style="height:34px"><h1 style="font-size:28px;font-weight:900;margin:14px 0">' + esc(a.title || 'Attestation de fin de formation') + '</h1><p style="white-space:pre-line;text-align:left">' + esc(txt) + '</p></div></div>';
  };

  V.dossier = function () {
    crumbs([['Parcours', ['home']], ['Dossier fil rouge']]);
    var docs = (G.dossier || {}).documents || [];
    return '<div class="wrap"><div class="eyebrow">Fil rouge</div><h1 style="font-size:30px;font-weight:900;margin:6px 0">Le dossier de M. Bernard</h1><p class="lead">' + esc((G.start || {}).dossier_intro || '') + '</p>' + pdfLink('DOSSIER_fil-rouge.pdf', 'Dossier complet en PDF') +
      '<div class="grid3" style="margin-top:14px">' + docs.map(function (d) { return '<button class="card" style="text-align:left" data-doc="' + d.id + '"><span class="eyebrow">' + d.id + ' · ' + esc(d.kind || '') + '</span><h3 style="margin-top:4px;font-size:16px">' + esc(d.title) + '</h3></button>'; }).join('') + '</div></div>';
  };

  if (PREVIEW) { var pb = document.createElement('div'); pb.className = 'preview'; pb.textContent = 'Aperçu · tout est ouvert'; document.body.appendChild(pb); }
  window.__eco = { S: S, go: go };
  var start = S.cur || ['home'];
  if (/^#c\d+-\d+$/.test(location.hash)) { var id = location.hash.slice(2).replace('-', '.'); if (capById(id)) start = ['cap', id, 0]; }
  S.cur = start; render(); save();
})();

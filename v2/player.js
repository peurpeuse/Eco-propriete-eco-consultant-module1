/* Éco-Consultant — player de module (nouvelle approche dérivée de la formation Audit énergétique).
   Données : window.COURSE = {module:{...}, seqs:[...], evals:[...]} */
(function () {
  'use strict';
  var C = window.COURSE, M = C.module;
  var $ = function (id) { return document.getElementById(id); };
  var main = $('main'), nextBtn = $('nextBtn'), prevBtn = $('prevBtn');
  var PREVIEW = /[?&#]preview/.test(location.href) || (C.preview === true && LMS.mode === 'local');
  document.documentElement.style.setProperty('--mod', M.color || '#E2231A');
  document.documentElement.style.setProperty('--mod-s', M.colorSoft || '#FDE4E1');

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function lc1(s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
  function announce(t) { $('live').textContent = ''; setTimeout(function () { $('live').textContent = t; }, 30); }

  /* ---------- État & persistance ---------- */
  LMS.init();
  var S = { d: {}, a: {}, ev: {}, cur: null };
  try { var raw = LMS.get('cmi.suspend_data'); if (raw) { var o = JSON.parse(raw); if (o && o.v === 2) S = o; } } catch (e) {}
  S.v = 2; S.d = S.d || {}; S.a = S.a || {}; S.ev = S.ev || {};
  function save() {
    var j = JSON.stringify(S);
    if (j.length > 4000) { // limite SCORM 1.2 : on allège les réponses
      var keys = Object.keys(S.a); while (j.length > 4000 && keys.length) { delete S.a[keys.shift()]; j = JSON.stringify(S); }
    }
    LMS.set('cmi.suspend_data', j);
    if (S.cur) LMS.set('cmi.core.lesson_location', S.cur.k + ':' + S.cur.i);
    LMS.commit();
  }

  /* ---------- Modèle de navigation ---------- */
  var seqs = C.seqs, ev = C.evals[0];
  function seqIdx(id) { for (var i = 0; i < seqs.length; i++) if (seqs[i].id === id) return i; return -1; }
  function unlocked(i) { return PREVIEW || i === 0 || !!S.d[seqs[i - 1].id]; }
  function allDone() { return seqs.every(function (s) { return S.d[s.id]; }); }
  function evUnlocked() { return PREVIEW || allDone(); }

  // Une "piste" = liste d'écrans à jouer : hub | séquence (cover + écrans + fin) | évaluation (intro + questions + résultats)
  var track = [], tKey = 'hub', pos = 0;
  function buildSeqTrack(s) {
    var t = [{ type: '_cover', seq: s }];
    s.screens.forEach(function (x, i) { x._i = i; t.push(x); });
    t.push({ type: '_end', seq: s });
    return t;
  }
  function buildEvalTrack() {
    var t = [{ type: '_evintro' }];
    ev.questions.forEach(function (q, i) { q._i = i; q._ev = true; t.push(q); });
    t.push({ type: '_evres' });
    return t;
  }
  function open(key, at) {
    tKey = key;
    if (key === 'hub') track = [{ type: '_hub' }];
    else if (key === 'EF') { track = buildEvalTrack(); S.evRun = {}; }
    else track = buildSeqTrack(seqs[seqIdx(key)]);
    pos = Math.max(0, Math.min(at || 0, track.length - 1));
    render();
  }

  /* ---------- Gating des interactions ---------- */
  var gate = false; // true = l'écran demande une action avant "Suivant"
  function setGate(on, hint) { gate = on; $('hint').textContent = on ? (hint || '') : ''; updateNav(); }
  function updateNav() {
    var last = pos >= track.length - 1;
    prevBtn.disabled = pos === 0 && tKey === 'hub';
    prevBtn.style.visibility = (tKey === 'hub') ? 'hidden' : 'visible';
    nextBtn.style.visibility = (tKey === 'hub' || last) ? 'hidden' : 'visible';
    nextBtn.disabled = gate;
  }
  function next() { if (gate) return; if (pos < track.length - 1) { pos++; render(); } }
  function prev() { if (pos > 0) { pos--; render(); } else if (tKey !== 'hub') open('hub'); }
  nextBtn.onclick = next; prevBtn.onclick = prev;
  $('menuBtn').onclick = function () { open('hub'); };
  document.addEventListener('keydown', function (e) {
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight' && !nextBtn.disabled && nextBtn.style.visibility !== 'hidden') next();
    if (e.key === 'ArrowLeft' && tKey !== 'hub') prev();
  });

  /* ---------- Rendu ---------- */
  function chrome() {
    var s = tKey !== 'hub' && tKey !== 'EF' ? seqs[seqIdx(tKey)] : null;
    $('crumb').innerHTML = '<b>' + esc(M.label) + '</b> · ' + (s ? 'Séquence ' + esc(s.id) + ' — ' + esc(s.short) : (tKey === 'EF' ? esc(ev.title) : esc(M.title)));
    var n = track.length;
    $('count').textContent = tKey === 'hub' ? '' : (pos + 1) + ' / ' + n;
    var done = seqs.filter(function (x) { return S.d[x.id]; }).length + (S.ev.best != null ? 1 : 0);
    $('progbar').style.width = Math.round(100 * done / (seqs.length + 1)) + '%';
  }
  function render() {
    var x = track[pos];
    gate = false; $('hint').textContent = '';
    if (tKey !== 'hub') { S.cur = { k: tKey, i: pos }; }
    var fn = R[x.type] || R._unknown;
    main.innerHTML = '<div class="fade">' + fn.html(x) + '</div>';
    main.scrollTop = 0;
    chrome(); updateNav();
    if (fn.bind) fn.bind(x);
    if (x.type === '_end') finishSeq(x.seq);
    save();
    try { main.focus({ preventScroll: true }); } catch (e) {}
  }
  function tab(t) { return '<h2 class="tab">' + esc(t) + '</h2>'; }
  function blocksHtml(b) { return b.map(function (k) { return '<div class="card s">' + (k.label ? '<span class="lab">' + esc(k.label) + '</span>' : '') + '<p style="margin:0">' + esc(k.text) + '</p></div>'; }).join(''); }
  function callout(c) {
    if (!c) return '';
    var lab = { info: 'À savoir', warning: 'Vigilance', source: 'Source' }[c.kind] || 'À savoir';
    return '<div class="callout ' + esc(c.kind || 'info') + '"><b>' + lab + ' :</b><span>' + esc(c.text) + '</span></div>';
  }
  function key(x) { return (x._ev ? 'EF' : tKey) + ':' + x._i; }

  var R = {
    _unknown: { html: function (x) { return '<p>Écran « ' + esc(x.type) + ' » non pris en charge.</p>'; } },

    _hub: {
      html: function () {
        var nDone = seqs.filter(function (x) { return S.d[x.id]; }).length;
        var li = seqs.map(function (s, i) {
          var u = unlocked(i), d = S.d[s.id];
          var st = d ? '<span class="st done">Terminée' + (d.s != null ? ' · ' + d.s + ' %' : '') + '</span>' : (u ? '<span class="st open">' + s.duration_min + ' min</span>' : '<span class="st lock">🔒 Verrouillée</span>');
          return '<li><button class="seqbtn" data-k="' + esc(s.id) + '"' + (u ? '' : ' disabled aria-disabled="true"') + '><span class="n">' + esc(s.id) + '</span><span class="t">' + esc(s.title) + '<small>' + esc(s.objective) + '</small></span>' + st + '</button></li>';
        }).join('');
        var eu = evUnlocked();
        li += '<li><button class="seqbtn ev" data-k="EF"' + (eu ? '' : ' disabled aria-disabled="true"') + '><span class="n">EF</span><span class="t">' + esc(ev.title) + '<small>' + ev.questions.length + ' questions en situation · seuil indicatif ' + ev.threshold + ' % · tentatives illimitées</small></span>' +
          (S.ev.best != null ? '<span class="st ' + (S.ev.best >= ev.threshold ? 'done' : 'open') + '">Meilleur : ' + S.ev.best + ' %</span>' : (eu ? '<span class="st open">≈ 20 min</span>' : '<span class="st lock">🔒 Après 1.' + seqs.length + '</span>')) + '</button></li>';
        var resume = S.cur && S.cur.k !== 'hub' ? '<button class="btn prim" id="resume">Reprendre ' + (S.cur.k === 'EF' ? 'l’évaluation' : 'la séquence ' + esc(S.cur.k)) + ' →</button>' : '<button class="btn prim" id="start">Commencer →</button>';
        var name = LMS.learner();
        return '<div class="hubgrid"><div><div class="kick">' + esc(M.label) + ' · ' + esc(M.program) + '</div><h1 style="font-size:1.9em;font-weight:900;margin:.1em 0 .5em">' + esc(M.title) + '</h1>' +
          '<div class="obj"><b>Objectif du module</b>À la fin de ce module, tu seras capable de ' + esc(M.objective) + '</div>' +
          '<ul class="seqlist" style="margin-top:.8em">' + li + '</ul></div>' +
          '<aside class="side"><div class="card s"><span class="lab">Ta progression</span><div class="big">' + nDone + ' / ' + seqs.length + '</div><div class="bar"><i style="width:' + Math.round(100 * nDone / seqs.length) + '%"></i></div><p style="font-size:.85em;color:var(--muted);margin:0">séquences terminées' + (name ? ' · ' + esc(name) : '') + '</p></div>' +
          '<div class="card"><span class="lab">Comment ça marche</span><p style="font-size:.88em;margin:0">Chaque séquence se débloque quand la précédente est terminée. Des pauses quiz vérifient ta compréhension. L’évaluation formative clôt le module et t’indique quoi revoir.</p></div>' +
          '<div class="row">' + resume + '</div></aside></div>';
      },
      bind: function () {
        [].forEach.call(main.querySelectorAll('.seqbtn'), function (b) { b.onclick = function () { open(b.getAttribute('data-k'), 0); }; });
        var r = $('resume'); if (r) r.onclick = function () { open(S.cur.k, S.cur.k === 'EF' ? 0 : S.cur.i); };
        var st = $('start'); if (st) st.onclick = function () { open(seqs[0].id, 0); };
      }
    },

    _cover: {
      html: function (x) {
        var s = x.seq, t = s.screens.map(function (y) { return y.type; });
        var chips = ['Cours'];
        if (t.indexOf('video') >= 0) chips.push('Vidéo');
        if (t.indexOf('mcq') >= 0) chips.push('Quiz');
        if (t.indexOf('scenario') >= 0) chips.push('Mise en situation');
        if (t.indexOf('sort') >= 0) chips.push('Exercice');
        return '<div class="cover"><div><div class="kick">' + esc(M.label) + ' · Séquence ' + esc(s.id) + '</div><h1>' + esc(s.title) + '</h1>' +
          '<div class="obj"><b>Objectif pédagogique</b>À la fin de cette séquence, tu seras capable de ' + esc(lc1(s.objective)) + '.</div>' +
          '<div class="chips"><span class="chip m">⏱ ' + s.duration_min + ' min</span>' + chips.map(function (c) { return '<span class="chip">' + c + '</span>'; }).join('') + '<span class="chip">' + s.screens.length + ' écrans</span></div>' +
          '<button class="btn prim" id="go">Commencer →</button></div><div class="art"><img src="assets/illus-team.png" alt=""></div></div>';
      },
      bind: function () { $('go').onclick = next; }
    },

    attend: {
      html: function (x) {
        return tab('Ce qui t’attend dans cette séquence') + '<div class="grid g3 attend">' + x.items.map(function (it, i) {
          return '<div class="card"><span class="lab">' + (i + 1) + '</span><b>' + esc(it.title) + '</b>' + esc(it.text) + '</div>'; }).join('') + '</div>';
      }
    },

    poll: {
      html: function (x) {
        return tab('Et toi ?') + '<p class="q">' + esc(x.question) + '</p><div class="row" role="group" aria-label="Ta réponse">' +
          x.choices.map(function (c, i) { return '<button class="pill" aria-pressed="false" data-i="' + i + '">' + esc(c) + '</button>'; }).join('') +
          '</div><div id="rev"></div>';
      },
      bind: function (x) {
        var k = key(x), prevAns = S.a[k];
        function show(i) {
          [].forEach.call(main.querySelectorAll('.pill'), function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-i') === i)); });
          $('rev').innerHTML = '<div class="reveal fade"><b>' + esc(x.reveal_title) + '</b>' + esc(x.reveal_text) + '</div>';
          setGate(false); S.a[k] = [i]; save();
        }
        [].forEach.call(main.querySelectorAll('.pill'), function (b) { b.onclick = function () { show(+b.getAttribute('data-i')); }; });
        if (prevAns) show(prevAns[0]); else setGate(true, 'Réponds pour continuer');
      }
    },

    content: {
      html: function (x) {
        var inner = '<div class="grid ' + (x.blocks.length >= 3 ? 'g2' : '') + '">' + blocksHtml(x.blocks) + '</div>' + callout(x.callout);
        return tab(x.title) + (x.seb ? '<div class="withseb"><div>' + inner + '</div><img class="seb" src="assets/seb.png" alt="Seb, ton formateur"></div>' : inner);
      }
    },

    fiche: {
      html: function (x) {
        return tab(x.title) + '<div class="grid g3 fiche">' +
          '<div class="col c1"><h3>1 · Comprendre</h3><p style="margin:0">' + esc(x.comprendre) + '</p></div>' +
          '<div class="col c2"><h3>2 · Faire</h3><p style="margin:0">' + esc(x.faire) + '</p></div>' +
          '<div class="col c3"><h3>3 · Retenir</h3><dl><div><dt>Argument vendeur</dt><dd>' + esc(x.argument) + '</dd></div><div><dt>Impact sur la valeur</dt><dd>' + esc(x.valeur) + '</dd></div><div><dt>Vigilance</dt><dd>' + esc(x.vigilance) + '</dd></div></dl></div></div>';
      }
    },

    steps: {
      html: function (x) {
        return tab(x.title) + (x.intro ? '<p class="lead">' + esc(x.intro) + '</p>' : '') + '<ol class="steps">' + x.steps.map(function (s, i) {
          return '<li><span class="k">' + (i + 1) + '</span><div><b>' + esc(String(s.title).replace(/^\s*\d+[.)]\s*/, '')) + '</b><br>' + esc(s.text) + '</div></li>'; }).join('') + '</ol>';
      }
    },

    compare: {
      html: function (x) {
        var li = function (a) { return '<ul>' + a.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'; };
        return tab(x.title) + '<div class="grid g2 cmp ' + (x.tone === 'neutral' ? 'neutral' : '') + '"><div class="card l"><h3>' + (x.tone === 'neutral' ? '' : '✗ ') + esc(x.left_title) + '</h3>' + li(x.left) + '</div><div class="card r"><h3>' + (x.tone === 'neutral' ? '' : '✓ ') + esc(x.right_title) + '</h3>' + li(x.right) + '</div></div>';
      }
    },

    stats: {
      html: function (x) {
        return tab(x.title) + '<div class="grid g' + Math.min(4, x.cards.length) + '">' + x.cards.map(function (c) {
          return '<div class="card stat"><div class="v">' + esc(c.value) + '</div><div>' + esc(c.label) + '</div></div>'; }).join('') + '</div>' + (x.source ? callout({ kind: 'source', text: x.source }) : '');
      }
    },

    video: {
      html: function (x) {
        var d = Math.floor(x.duration_s / 60) + ' min ' + ('0' + x.duration_s % 60).slice(-2);
        var media = x.src ? '<video controls preload="metadata" src="' + esc(x.src) + '"></video>' :
          '<img src="assets/seb.png" alt=""><button class="play" id="play" aria-label="Lire le script de la capsule"></button><span class="tag">Capsule Seb · ' + d + '</span>';
        return tab(x.title) + '<div class="video"><div><div class="poster">' + media + '</div>' + (x.caption ? '<p class="lead" style="margin-top:.5em;font-size:.88em">' + esc(x.caption) + '</p>' : '') +
          (x.src ? '' : '<p style="font-size:.8em;color:var(--muted)">Vidéo en production (avatar HeyGen de Seb). En attendant, lis le script ci-contre.</p>') +
          '</div><div><span class="lab">Transcription</span><div class="script" id="script">' + esc(x.script) + '</div></div></div>';
      },
      bind: function () { var p = $('play'); if (p) p.onclick = function () { $('script').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); $('script').focus && $('script').setAttribute('tabindex', '-1'); $('script').focus(); }; }
    },

    quizbreak: {
      html: function () { return '<div class="qb"><div><span class="burst">QUIZ !</span><p>Voyons ce que tu as compris et retenu.</p></div></div>'; }
    },

    mcq: {
      html: function (x) {
        var head = x._ev ? 'Question ' + (x._i + 1) + ' / ' + ev.questions.length + ' · séquence ' + esc(x.seq) : 'Question';
        return (x._ev ? '' : tab('Vérifie ta compréhension')) + '<div class="qhead">' + head + '</div><p class="q">' + esc(x.question) + '</p>' +
          '<div class="opts" role="radiogroup" aria-label="Options">' + x.options.map(function (o, i) {
            return '<button class="opt" role="radio" aria-checked="false" data-i="' + i + '"><span class="dot" aria-hidden="true"></span><span>' + esc(o) + '<span class="why" hidden></span></span></button>'; }).join('') +
          '</div><div class="row"><button class="btn prim" id="val" disabled>Valider</button></div><div id="fb"></div>';
      },
      bind: function (x) {
        var k = key(x), sel = null, opts = main.querySelectorAll('.opt');
        function pick(i) { sel = i; [].forEach.call(opts, function (b) { b.setAttribute('aria-checked', String(+b.getAttribute('data-i') === i)); }); $('val').disabled = false; }
        function done(i, silent) {
          var ok = i === x.answer;
          [].forEach.call(opts, function (b) {
            var j = +b.getAttribute('data-i'); b.disabled = true;
            if (j === x.answer) b.classList.add('ok'); else if (j === i) b.classList.add('ko');
            var w = b.querySelector('.why'); if (j === x.answer || j === i) { w.hidden = false; w.textContent = x.whys[j]; }
            b.setAttribute('aria-checked', String(j === i));
          });
          $('val').style.display = 'none';
          $('fb').innerHTML = '<div class="fb ' + (ok ? 'ok' : 'ko') + ' fade"><span class="ic" aria-hidden="true">' + (ok ? '✓' : '✗') + '</span><div><b>' + (ok ? 'Bonne réponse — ' : 'Pas tout à fait — ') + esc(x.fb_title) + '</b>' + esc(x.fb_text) + '</div></div>';
          if (!silent) announce(ok ? 'Bonne réponse' : 'Réponse incorrecte');
          setGate(false);
          return ok;
        }
        [].forEach.call(opts, function (b) {
          b.onclick = function () { pick(+b.getAttribute('data-i')); };
          b.onkeydown = function (e) { var i = +b.getAttribute('data-i'), n = x.options.length;
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); var t = opts[(i + 1) % n]; t.focus(); pick((i + 1) % n); }
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); var u = opts[(i - 1 + n) % n]; u.focus(); pick((i - 1 + n) % n); } };
        });
        var store = x._ev ? S.evRun : S.a;
        $('val').onclick = function () {
          var ok = done(sel);
          store[k] = [sel, ok ? 1 : 0];
          if (x._ev) interaction(x, String.fromCharCode(97 + sel), ok, 'choice', String.fromCharCode(97 + x.answer));
          save();
        };
        if (store[k]) done(store[k][0], true); else setGate(true, 'Valide ta réponse pour continuer');
      }
    },

    scenario: {
      html: function (x) {
        return (x._ev ? '<div class="qhead">Question ' + (x._i + 1) + ' / ' + ev.questions.length + ' · séquence ' + esc(x.seq) + '</div>' : '') + tab(x.title) +
          '<div class="sit">' + esc(x.situation) + '</div><p class="q">' + esc(x.question) + '</p>' +
          x.choices.map(function (c, i) { return '<button class="choice" data-i="' + i + '">' + esc(c.text) + '<span class="cons" hidden></span></button>'; }).join('') + '<div id="fb"></div>';
      },
      bind: function (x) {
        var k = key(x), store = x._ev ? S.evRun : S.a, ch = main.querySelectorAll('.choice');
        var LAB = ['À éviter', 'Acceptable', 'Meilleure réponse'];
        function done(i, silent) {
          var best = Math.max.apply(null, x.choices.map(function (c) { return c.score; }));
          [].forEach.call(ch, function (b) {
            var j = +b.getAttribute('data-i'), c = x.choices[j], cons = b.querySelector('.cons'); b.disabled = true;
            if (j === i) b.classList.add('sel');
            cons.hidden = false; cons.innerHTML = '<span class="sc sc' + c.score + '">' + LAB[c.score] + '</span>' + esc(c.consequence);
            if (j !== i) b.style.opacity = '.72';
          });
          var sc = x.choices[i].score;
          $('fb').innerHTML = '<div class="fb ' + (sc === best ? 'ok' : 'ko') + ' fade"><span class="ic">' + (sc === best ? '✓' : '!') + '</span><div><b>' + (sc === best ? 'Excellent choix.' : (sc === 1 ? 'Acceptable, mais il y a mieux.' : 'Ce choix te dessert.')) + '</b>Lis les conséquences de chaque option ci-dessus : c’est là que se trouve l’apprentissage.</div></div>';
          if (!silent) announce(LAB[sc]);
          setGate(false);
          return sc === best;
        }
        [].forEach.call(ch, function (b) { b.onclick = function () {
          var i = +b.getAttribute('data-i'), ok = done(i);
          store[k] = [i, ok ? 1 : (x.choices[i].score === 1 ? 0.5 : 0)];
          if (x._ev) interaction(x, String.fromCharCode(97 + i), ok, 'choice', '');
          save(); }; });
        if (store[k]) done(store[k][0], true); else setGate(true, 'Choisis une option pour continuer');
      }
    },

    sort: {
      html: function (x) {
        return (x._ev ? '<div class="qhead">Question ' + (x._i + 1) + ' / ' + ev.questions.length + ' · séquence ' + esc(x.seq) + '</div>' : '') + tab(x.title) + '<p class="lead">' + esc(x.instruction) + '</p>' +
          x.items.map(function (it, i) {
            return '<div class="sortrow" data-i="' + i + '"><div>' + esc(it.text) + '<span class="why" hidden></span></div><div class="seg" role="group" aria-label="Classer : ' + esc(it.text) + '">' +
              x.categories.map(function (c, j) { return '<button aria-pressed="false" data-c="' + j + '">' + esc(c) + '</button>'; }).join('') + '</div></div>';
          }).join('') + '<div class="row"><button class="btn prim" id="val" disabled>Valider</button></div><div id="fb"></div>';
      },
      bind: function (x) {
        var k = key(x), store = x._ev ? S.evRun : S.a, ans = x.items.map(function () { return -1; });
        var rows = main.querySelectorAll('.sortrow');
        function setA(i, c) { ans[i] = c; [].forEach.call(rows[i].querySelectorAll('button'), function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-c') === c)); });
          $('val').disabled = ans.indexOf(-1) >= 0; }
        function done(silent) {
          var good = 0;
          x.items.forEach(function (it, i) {
            var ok = ans[i] === it.cat; if (ok) good++;
            rows[i].classList.add(ok ? 'ok' : 'ko');
            var w = rows[i].querySelector('.why'); w.hidden = false; w.textContent = (ok ? '✓ ' : '✗ Réponse : ' + x.categories[it.cat] + '. ') + it.why;
            [].forEach.call(rows[i].querySelectorAll('button'), function (b) { b.disabled = true; });
          });
          $('val').style.display = 'none';
          var all = good === x.items.length;
          $('fb').innerHTML = '<div class="fb ' + (all ? 'ok' : 'ko') + ' fade"><span class="ic">' + (all ? '✓' : '!') + '</span><div><b>' + good + ' / ' + x.items.length + ' bien classés.</b>' + (all ? 'Parfait, tu as le bon réflexe.' : 'Relis les explications sous chaque ligne.') + '</div></div>';
          if (!silent) announce(good + ' sur ' + x.items.length);
          setGate(false); return good / x.items.length;
        }
        [].forEach.call(rows, function (r, i) { [].forEach.call(r.querySelectorAll('button'), function (b) { b.onclick = function () { setA(i, +b.getAttribute('data-c')); }; }); });
        $('val').onclick = function () { var sc = done(); store[k] = [ans.join(''), sc === 1 ? 1 : Math.round(sc * 100) / 100];
          if (x._ev) interaction(x, ans.join(','), sc === 1, 'matching', x.items.map(function (it) { return it.cat; }).join(','));
          save(); };
        if (store[k]) { String(store[k][0]).split('').forEach(function (c, i) { setA(i, +c); }); done(true); } else setGate(true, 'Classe chaque élément puis valide');
      }
    },

    recap: {
      html: function (x) {
        return tab('À retenir') + '<div class="grid g3 recap">' + x.points.map(function (p, i) { return '<div class="card"><div class="k">' + (i + 1) + '</div><p style="margin:.3em 0 0">' + esc(p) + '</p></div>'; }).join('') + '</div>';
      }
    },

    _end: {
      html: function (x) {
        var s = x.seq, sc = seqScore(s), i = seqIdx(s.id), nx = seqs[i + 1];
        return '<div class="end"><div><div class="kick">Séquence ' + esc(s.id) + ' terminée</div><h1 style="font-size:1.9em;font-weight:900;margin:.1em 0 .5em">Bravo, une étape de plus !</h1>' +
          (sc != null ? '<div class="card s"><span class="lab">Tes quiz de la séquence</span><div class="score"><span class="big">' + sc + ' %</span><span>de bonnes réponses</span></div><div class="bar' + (sc < 70 ? ' low' : '') + '"><i style="width:' + sc + '%"></i></div>' +
            (sc < 70 ? '<p style="font-size:.88em;margin:0">Conseil : refais les quiz de cette séquence avant de continuer (bouton « Revoir la séquence »).</p>' : '<p style="font-size:.88em;margin:0">Solide. Tu peux continuer.</p>') + '</div>' : '') +
          '<div class="row" style="margin-top:1em">' + (nx ? '<button class="btn prim" id="nx">Séquence ' + esc(nx.id) + ' →</button>' : '<button class="btn prim" id="nx">Évaluation formative →</button>') +
          '<button class="btn ghost" id="again">Revoir la séquence</button><button class="btn ghost" id="hub">Sommaire</button></div></div>' +
          '<div class="res"><span class="lab">Ressource à télécharger</span><h3 style="margin:.1em 0 .2em">' + esc(s.resource.title) + '</h3><ul>' + s.resource.items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
          (PREVIEW ? '<p style="font-size:.8em;color:var(--muted);margin:0">Dans le LMS, cette fiche se télécharge en un clic.</p>' : '<button class="btn ghost" id="dl">⬇ Télécharger la fiche</button>') + '</div></div>';
      },
      bind: function (x) {
        var s = x.seq, i = seqIdx(s.id), nx = seqs[i + 1];
        $('nx').onclick = function () { open(nx ? nx.id : 'EF', 0); };
        $('again').onclick = function () { s.screens.forEach(function (y, j) { delete S.a[s.id + ':' + j]; }); open(s.id, 1); };
        $('hub').onclick = function () { open('hub'); };
        if ($('dl')) $('dl').onclick = function () { download(s); };
      }
    },

    _evintro: {
      html: function () {
        return '<div class="cover"><div><div class="kick">' + esc(M.label) + ' · Évaluation formative</div><h1>' + esc(ev.title) + '</h1><div class="sit">' + esc(ev.intro) + '</div>' +
          '<div class="chips"><span class="chip m">≈ 20 min</span><span class="chip">' + ev.questions.length + ' questions</span><span class="chip">Feedback à chaque réponse</span><span class="chip">Tentatives illimitées</span><span class="chip">Seuil indicatif ' + ev.threshold + ' %</span></div>' +
          (S.ev.best != null ? '<p>Ton meilleur score : <b>' + S.ev.best + ' %</b> (' + (S.ev.tries || 1) + ' tentative' + ((S.ev.tries || 1) > 1 ? 's' : '') + ').</p>' : '') +
          '<button class="btn prim" id="go">Commencer l’évaluation →</button></div><div class="art"><img src="assets/illus-team.png" alt=""></div></div>';
      },
      bind: function () { S.evRun = {}; $('go').onclick = next; }
    },

    _evres: {
      html: function () {
        var r = evalScore();
        if (!S.evRun._r) { S.evRun._r = 1; S.ev.last = r.pct; S.ev.tries = (S.ev.tries || 0) + 1;
          if (S.ev.best == null || r.pct > S.ev.best) S.ev.best = r.pct;
          reportScore(); }
        var ok = r.pct >= ev.threshold;
        var rows = Object.keys(r.by).sort().map(function (sid) {
          var b = r.by[sid], p = Math.round(100 * b.g / b.n);
          return '<tr><td><b>' + esc(sid) + '</b> ' + esc((seqs[seqIdx(sid)] || {}).short || '') + '</td><td>' + String(Math.round(b.g * 10) / 10).replace('.', ',') + ' / ' + b.n + '</td><td style="width:40%"><div class="bar' + (p < 70 ? ' low' : '') + '"><i style="width:' + p + '%"></i></div></td><td>' + (p < 70 ? '<button class="btn ghost" data-go="' + esc(sid) + '" style="min-height:30px;padding:.2em .8em;font-size:.8em">Revoir</button>' : '✓') + '</td></tr>';
        }).join('');
        return '<div class="kick">Résultats de l’évaluation formative</div><div class="score"><span class="big" style="font-size:3em">' + r.pct + ' %</span><span>' + (ok ? 'Objectif atteint 🎉' : 'Sous le seuil de ' + ev.threshold + ' % : revois les séquences signalées.') + '</span></div>' +
          '<div class="bar' + (ok ? '' : ' low') + '"><i style="width:' + r.pct + '%"></i></div>' +
          '<table class="br" style="margin-top:.8em"><thead><tr><th>Séquence</th><th>Points</th><th>Réussite</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>' +
          '<div class="row" style="margin-top:1em"><button class="btn prim" id="retry">Refaire l’évaluation</button><button class="btn ghost" id="hub">Sommaire</button></div>';
      },
      bind: function () {
        $('retry').onclick = function () { open('EF', 1); };
        $('hub').onclick = function () { open('hub'); };
        [].forEach.call(main.querySelectorAll('[data-go]'), function (b) { b.onclick = function () { open(b.getAttribute('data-go'), 0); }; });
      }
    }
  };

  /* ---------- Scores & suivi ---------- */
  function seqScore(s) {
    var n = 0, g = 0;
    s.screens.forEach(function (y, j) { if (y.type === 'mcq' || y.type === 'scenario' || y.type === 'sort') { n++; var a = S.a[s.id + ':' + j]; if (a) g += a[1]; } });
    return n ? Math.round(100 * g / n) : null;
  }
  function finishSeq(s) {
    S.d[s.id] = { s: seqScore(s) };
    reportScore();
  }
  function evalScore() {
    var by = {}, g = 0, n = 0;
    ev.questions.forEach(function (q, i) { var a = S.evRun['EF:' + i]; var v = a ? a[1] : 0; n++; g += v; by[q.seq] = by[q.seq] || { g: 0, n: 0 }; by[q.seq].g += v; by[q.seq].n++; });
    return { pct: Math.round(100 * g / n), by: by };
  }
  var nInter = null;
  function interaction(q, resp, ok, type, correct) {
    try {
      if (nInter == null) nInter = parseInt(LMS.get('cmi.interactions._count'), 10) || 0;
      var p = 'cmi.interactions.' + nInter + '.';
      LMS.set(p + 'id', 'EF1_Q' + (q._i + 1) + '_S' + String(q.seq).replace('.', '-'));
      LMS.set(p + 'type', type);
      if (correct !== '') LMS.set(p + 'correct_responses.0.pattern', correct);
      LMS.set(p + 'student_response', resp);
      LMS.set(p + 'result', ok ? 'correct' : 'wrong');
      LMS.set(p + 'weighting', '1');
      nInter++;
    } catch (e) {}
  }
  function reportScore() {
    // Score remonté : meilleur score de l'évaluation formative ; à défaut, moyenne des quiz de séquence.
    var raw = S.ev.best;
    if (raw == null) { var t = 0, c = 0; seqs.forEach(function (s) { if (S.d[s.id] && S.d[s.id].s != null) { t += S.d[s.id].s; c++; } }); raw = c ? Math.round(t / c) : null; }
    if (raw != null) LMS.set('cmi.core.score.raw', raw);
    var complete = allDone() && S.ev.best != null;
    if (complete) LMS.set('cmi.core.lesson_status', (C.passMode === 'strict') ? (S.ev.best >= ev.threshold ? 'passed' : 'failed') : 'completed');
    save();
  }
  function download(s) {
    var html = '<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>' + esc(s.resource.title) + '</title><style>body{font-family:Lato,Arial,sans-serif;max-width:760px;margin:40px auto;padding:0 20px;color:#1a1a1a;line-height:1.5}h1{font-size:26px;border-left:8px solid #FF8D16;padding-left:12px}li{margin:.5em 0}.f{color:#666;font-size:12px;margin-top:40px;border-top:1px solid #ddd;padding-top:10px}</style></head><body>' +
      '<p style="color:#E06F00;font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:12px">Éco-Consultant · ' + esc(M.label) + ' · Séquence ' + esc(s.id) + '</p><h1>' + esc(s.resource.title) + '</h1><ul>' + s.resource.items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
      (s.sources && s.sources.length ? '<h3>Sources</h3><ul>' + s.sources.map(function (r) { return '<li>' + esc(r.label) + (r.url ? ' — ' + esc(r.url) : '') + '</li>'; }).join('') + '</ul>' : '') +
      '<p class="f">© Éco-Propriété — Formation Éco-Consultant. Document pédagogique : vérifie toujours la réglementation en vigueur avant usage.</p></body></html>';
    try {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
      a.download = 'Eco-Consultant_' + s.id.replace('.', '-') + '_' + s.resource.title.replace(/[^\wÀ-ÿ]+/g, '-').replace(/-+$/, '') + '.html';
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    } catch (e) { announce('Téléchargement impossible dans ce navigateur.'); }
  }

  if (PREVIEW) { var b = document.createElement('div'); b.className = 'preview'; b.textContent = 'Aperçu · tout est déverrouillé'; $('frame').appendChild(b); }
  window.__eco = { S: S, open: open, track: function () { return track; }, pos: function () { return pos; } };
  open('hub');
})();

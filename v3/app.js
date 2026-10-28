/* Éco-Consultant — interface « cours en ligne » : page de présentation + lecteur avec plan latéral.
   Chaque capsule = 5 éléments (vidéo, quiz flash, lecture, exercice, devoir). Suivi SCORM 1.2/2004 via scorm.js. */
(function () {
  'use strict';
  var C = window.COURSE, G = C.global || {}, M = C.meta || {}, $ = function (id) { return document.getElementById(id); };
  var app = $('app');
  var PREVIEW = C.preview === true && LMS.mode === 'local';
  var SCOPE = C.scope || { modules: [1, 2, 3, 4, 5], start: true, end: true };
  var MODS = C.modules.filter(function (m) { return SCOPE.modules.indexOf(m.id) >= 0; });
  var TITLE = M.courseTitle || 'Éco-Consultant';
  var TH = (G.final || {}).threshold || 70;

  /* ---------- Icônes ---------- */
  var IC = {
    video: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
    quiz: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17.3" r="1.2" fill="currentColor"/>',
    reading: '<path d="M6 3h9l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 12h7M9 16h7M9 8h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    practice: '<path d="M4 20l4-1 11-11-3-3L5 16z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 7l3 3" stroke="currentColor" stroke-width="2"/>',
    assignment: '<path d="M12 16V4M7 9l5-5 5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 16v4h16v-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    case: '<rect x="3" y="7" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 7V5h6v2M3 12h18" fill="none" stroke="currentColor" stroke-width="2"/>',
    reminder: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M10 20a2 2 0 0 0 4 0" fill="none" stroke="currentColor" stroke-width="2"/>',
    welcome: '<path d="M4 11l8-7 8 7v9H4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    dossier: '<path d="M3 6h7l2 2h9v11H3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    test: '<path d="M5 4h14v16H5z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 9l2 2 4-4M8 15h8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    survey: '<path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    cert: '<circle cx="12" cy="9" r="5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 13l-2 8 5-3 5 3-2-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    check: '<path d="M5 12l5 5L20 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    chev: '<path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  };
  IC.chapter = IC.video;
  function ic(k) { return '<svg class="i" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' + (IC[k] || IC.reading) + '</svg>'; }
  var KIND = { chapter: 'Chapitre interactif', video: 'Vidéo', quiz: 'Quiz flash', reading: 'Lecture', practice: 'Exercice pratique', assignment: 'Devoir', case: 'Cas pratique évalué', reminder: 'Rappels espacés', welcome: 'Lecture', dossier: 'Ressources', test: 'Évaluation', survey: 'Questionnaire', cert: 'Attestation' };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function nl(s) { return esc(s).replace(/\n/g, '<br>'); }
  function announce(t) { $('live').textContent = ''; setTimeout(function () { $('live').textContent = t; }, 30); }
  function modById(id) { for (var i = 0; i < C.modules.length; i++) if (C.modules[i].id === +id) return C.modules[i]; return null; }
  function modLabel(m) { return m && m.id === 0 ? 'Prérequis' : 'Module ' + (m ? m.id : ''); }
  function visCaps(m) { return m.capsules.filter(function (c) { return !c.parcours || c.parcours === PARC(); }); }
  function PARC() { return S.parcours === 'maison' ? 'maison' : 'appartement'; }
  function lc(s) { s = String(s || ''); return s.charAt(0).toLowerCase() + s.slice(1); }

  /* ---------- État ---------- */
  LMS.init();
  var S = { v: 4, c: {}, k: {}, r: {}, t: {}, cur: null };
  try { var raw = LMS.get('cmi.suspend_data'); if (raw) { var o = JSON.parse(raw); if (o && (o.v === 4 || o.v === 3)) { S = o; S.v = 4; if (S.cur && S.cur[0] !== 'learn') S.cur = null; } } } catch (e) {}
  S.c = S.c || {}; S.k = S.k || {}; S.r = S.r || {}; S.t = S.t || {};
  var DKEY = 'eco-v3-depots-' + (M.key || 'all');
  var DEP = {}; try { DEP = JSON.parse(localStorage.getItem(DKEY) || '{}') || {}; } catch (e) { DEP = {}; }
  function saveDep() { try { localStorage.setItem(DKEY, JSON.stringify(DEP)); } catch (e) {} }
  function cs(id) { return S.c[id] || (S.c[id] = {}); }

  /* ---------- Plan du cours ---------- */
  var SECS = [], FLAT = [], BYKEY = {}, STEPK = ['v', 'q', 'r', 'p', 'd'];
  function buildPlan() {
    SECS.length = 0; FLAT.length = 0; Object.keys(BYKEY).forEach(function (k) { delete BYKEY[k]; });
    function add(sec, g, it) { it.sec = sec; FLAT.push(it); BYKEY[it.key] = it; g.items.push(it); }
    if (SCOPE.start) {
      var s = { id: 'start', title: 'Bienvenue', color: 'var(--g)', groups: [{ label: null, items: [] }] };
      add(s, s.groups[0], { key: 'welcome', kind: 'welcome', title: 'Bienvenue et mode d’emploi', dur: 'Lecture · 5 min' });
      add(s, s.groups[0], { key: 'pos', kind: 'test', title: 'Test de positionnement', dur: 'Quiz · ' + ((G.positioning || {}).questions || []).length + ' questions' });
      add(s, s.groups[0], { key: 'dossier', kind: 'dossier', title: 'Le dossier fil rouge (appartement de M. Bernard)', dur: 'Ressources · ' + ((G.dossier || {}).documents || []).length + ' documents' });
      SECS.push(s);
    }
    MODS.forEach(function (m) {
      var s = { id: 'm' + m.id, mod: m, title: m.title, color: 'var(--m' + m.id + ')', groups: [] }, lastSec = null;
      m.capsules.forEach(function (c) {
        if (c.parcours && c.parcours !== PARC()) return; // parcours maison ou appartement : on ne garde que celui choisi
        if (c.section && c.section !== lastSec) { lastSec = c.section; s.groups.push({ label: c.section, head: 1, items: [] }); }
        var g = { label: c.id + ' · ' + c.title, items: [] }; s.groups.push(g);
        if (c.v4) {
          if (c.chapter) add(s, g, { key: 'c:' + c.id + ':0', kind: 'chapter', cap: c, step: 0, title: 'Chapitre ' + c.id + ' · ' + c.chapter.title, dur: 'Vidéo interactive · 4 min 30 max' });
          else add(s, g, { key: 'c:' + c.id + ':0', kind: 'video', cap: c, step: 0, title: c.title, dur: 'Vidéo · 4 min 30 max' });
          add(s, g, { key: 'c:' + c.id + ':1', kind: 'quiz', cap: c, step: 1, title: 'Quiz flash', dur: 'Je me teste · ' + c.quiz.questions.length + ' questions' });
          add(s, g, { key: 'c:' + c.id + ':2', kind: 'reading', cap: c, step: 2, title: c.resource.title, dur: 'Je télécharge la ressource · fiche PDF' });
          add(s, g, { key: 'c:' + c.id + ':3', kind: 'practice', cap: c, step: 3, title: c.exercise.title, dur: 'Je pratique · ' + c.exercise.duration_min + ' min' + (c.ia ? ' · IA' : ''), ia: c.ia });
          add(s, g, { key: 'c:' + c.id + ':4', kind: 'assignment', cap: c, step: 4, title: c.deliverable.title, dur: 'Je dépose mon livrable' });
          return;
        }
        if (c.chapter) {
          g.label = c.id + ' · ' + c.chapter.title;
          add(s, g, { key: 'c:' + c.id + ':0', kind: 'chapter', cap: c, step: 0, title: 'Chapitre ' + c.id + ' · ' + c.chapter.title, dur: 'Chapitre interactif · ' + (c.chapter.duration || '4:30') });
          add(s, g, { key: 'c:' + c.id + ':2', kind: 'reading', cap: c, step: 2, title: c.resource.title, dur: 'Pour aller plus loin · fiche PDF', opt: 1 });
          add(s, g, { key: 'c:' + c.id + ':3', kind: 'practice', cap: c, step: 3, title: c.exercise.title, dur: 'Pour aller plus loin · ' + c.exercise.duration_min + ' min' + (c.ia ? ' · IA' : ''), ia: c.ia, opt: 1 });
          add(s, g, { key: 'c:' + c.id + ':4', kind: 'assignment', cap: c, step: 4, title: c.deliverable.title, dur: 'Pour aller plus loin · devoir', opt: 1 });
        } else {
        add(s, g, { key: 'c:' + c.id + ':0', kind: 'video', cap: c, step: 0, title: c.title, dur: 'Vidéo · 8 min' });
        add(s, g, { key: 'c:' + c.id + ':1', kind: 'quiz', cap: c, step: 1, title: 'Quiz flash', dur: 'Quiz · ' + c.quiz.questions.length + ' questions' });
        add(s, g, { key: 'c:' + c.id + ':2', kind: 'reading', cap: c, step: 2, title: c.resource.title, dur: 'Lecture · fiche PDF' });
        add(s, g, { key: 'c:' + c.id + ':3', kind: 'practice', cap: c, step: 3, title: c.exercise.title, dur: 'Exercice · ' + c.exercise.duration_min + ' min' + (c.ia ? ' · IA' : ''), ia: c.ia });
        add(s, g, { key: 'c:' + c.id + ':4', kind: 'assignment', cap: c, step: 4, title: c.deliverable.title, dur: 'Devoir · à déposer' });
        }
      });
      var g2 = { label: m.id === 0 ? 'Fin du prérequis' : 'Fin du module ' + m.id, items: [] }; s.groups.push(g2);
      add(s, g2, { key: 'case:' + m.id, kind: 'case', mod: m, title: m.case.title, dur: 'Cas pratique · ' + m.case.duration_min + ' min' });
      add(s, g2, { key: 'rem:' + m.id, kind: 'reminder', mod: m, title: 'Rappels J+1 · J+7 · J+30', dur: 'Quiz de rappel' });
      SECS.push(s);
    });
    if (SCOPE.end) {
      var e = { id: 'end', title: 'Clôture et attestation', color: 'var(--g-d)', groups: [{ label: null, items: [] }] };
      add(e, e.groups[0], { key: 'end', kind: 'assignment', title: 'Dossier fil rouge complet', dur: 'Devoir final · à déposer' });
      add(e, e.groups[0], { key: 'fin', kind: 'test', title: 'Quiz final', dur: 'Quiz · ' + ((G.final || {}).questions || []).length + ' questions · seuil ' + TH + ' %' });
      add(e, e.groups[0], { key: 'sat', kind: 'survey', title: 'Questionnaire de satisfaction', dur: 'Questionnaire · 5 min' });
      add(e, e.groups[0], { key: 'att', kind: 'cert', title: 'Attestation de fin de formation', dur: 'Après le quiz final' });
      SECS.push(e);
    }
  }
  buildPlan();
  function secItems(s) { return [].concat.apply([], s.groups.map(function (g) { return g.items; })); }
  function isDone(it) {
    var k = it.key;
    if (it.cap) { var v = (S.c[it.cap.id] || {})[STEPK[it.step]]; return v != null && v !== false; }
    if (it.kind === 'case') return !!S.k[it.mod.id];
    if (it.kind === 'reminder') return ['J1', 'J7', 'J30'].every(function (t) { return S.r[it.mod.id + t] != null; });
    if (k === 'welcome') return !!S.t.w; if (k === 'dossier') return !!S.t.dv; if (k === 'pos') return S.t.pos != null;
    if (k === 'end') return !!S.t.dos; if (k === 'fin') return S.t.fin != null; if (k === 'sat') return !!S.t.sat;
    if (k === 'att') return S.t.fin != null && S.t.fin >= TH;
    return false;
  }
  function pct() { return Math.round(100 * FLAT.filter(isDone).length / FLAT.length); }
  function save() {
    var j = JSON.stringify(S);
    if (j.length > 4000) { Object.keys(S.c).forEach(function (k) { delete S.c[k].qa; }); j = JSON.stringify(S); }
    if (j.length > 4000) { Object.keys(S.c).forEach(function (k) { var h = S.c[k].ch; if (h) { delete h.ret; delete h.guess; delete h.g; delete h.vote; } }); j = JSON.stringify(S); }
    if (j.length > 4000) { Object.keys(S.c).forEach(function (k) { var h = S.c[k].ch; if (h) S.c[k].ch = { i: h.i, done: h.done }; }); j = JSON.stringify(S); }
    LMS.set('cmi.suspend_data', j);
    if (S.cur) LMS.set('cmi.core.lesson_location', S.cur.join('|').slice(0, 250));
    report(); LMS.commit();
    var p = pct(); $('ringv').setAttribute('stroke-dasharray', p + ' 100'); $('pct').textContent = p + ' % terminé';
  }
  function report() {
    var raw = null;
    if (SCOPE.end && S.t.fin != null) raw = S.t.fin;
    else { var t = 0, n = 0; MODS.forEach(function (m) { m.capsules.forEach(function (c) { var q = (S.c[c.id] || {}).q; if (q != null) { t += q; n++; } }); }); if (n) raw = Math.round(t / n); }
    if (raw != null) LMS.set('cmi.core.score.raw', raw);
    var need = FLAT.filter(function (it) { return !it.opt && ['cert', 'survey', 'welcome', 'dossier', 'reminder'].indexOf(it.kind) < 0; });
    if (need.every(isDone)) LMS.set('cmi.core.lesson_status', 'completed');
  }
  var nInter = null;
  function interaction(id, resp, ok, correct) {
    try {
      if (nInter == null) nInter = parseInt(LMS.get('cmi.interactions._count'), 10) || 0;
      var p = 'cmi.interactions.' + nInter + '.';
      LMS.set(p + 'id', id); LMS.set(p + 'type', 'choice'); if (correct) LMS.set(p + 'correct_responses.0.pattern', correct);
      LMS.set(p + 'student_response', resp); LMS.set(p + 'result', ok ? 'correct' : 'wrong'); LMS.set(p + 'weighting', '1'); nInter++;
    } catch (e) {}
  }

  /* ---------- Navigation ---------- */
  var openSecs = {};
  function go(route) {
    S.cur = route; render(); save(); window.scrollTo(0, 0);
    var m = document.querySelector('.main'); if (m) try { m.focus({ preventScroll: true }); } catch (e) {}
  }
  var logo = $('logo'); logo.tabIndex = 0; logo.setAttribute('role', 'button'); logo.style.cursor = 'pointer';
  logo.onclick = function () { go(['home']); }; logo.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(['home']); } };
  $('ctitle').textContent = TITLE;
  $('navBtn').onclick = function () { var lv = document.querySelector('.lv'); if (!lv) return; var o = lv.classList.toggle('open'); $('navBtn').setAttribute('aria-expanded', String(o)); };
  function nextKey() { for (var i = 0; i < FLAT.length; i++) if (!isDone(FLAT[i]) && FLAT[i].kind !== 'cert') return FLAT[i].key; return FLAT[0].key; }
  function render() {
    if (CH) { CH.destroy(); CH = null; } // arrêter le son et la lecture du chapitre qu'on quitte
    var r = S.cur || ['home'];
    if (r[0] === 'learn' && BYKEY[r[1]]) renderLearn(BYKEY[r[1]]); else renderHome();
    bindDocLinks();
  }

  /* ---------- Page de présentation du cours ---------- */
  function renderHome() {
    $('navBtn').style.display = 'none';
    var started = FLAT.some(isDone), nCaps = MODS.reduce(function (a, m) { return a + visCaps(m).length; }, 0), nIA = 0, nCh = 0;
    MODS.forEach(function (m) { visCaps(m).forEach(function (c) { if (c.ia) nIA++; if (c.chapter) nCh++; }); });
    var cta = '<button class="btn p big" data-learn="' + esc(nextKey()) + '">' + (started ? 'Reprendre la formation' : 'Commencer la formation') + '</button>';
    var single = MODS.length === 1;
    var h = '<section class="hero"><div class="wrap"><div><div class="crumb">' + esc(M.program || 'Formation') + ' › Immobilier › Transaction</div><h1>' + esc(single ? 'Module ' + MODS[0].id + ' · ' + MODS[0].title : TITLE) + '</h1>' +
      '<p class="lead">' + esc(single ? (M.objectives || {})[MODS[0].id] || M.pitch : M.pitch) + '</p><div class="inst"><img src="assets/seb.png" alt=""><span>Formateur : <b>Sébastien Paumier</b>, Éco-Propriété</span></div>' +
      '<div class="row">' + cta + (started ? '<span class="muted">' + pct() + ' % terminé</span>' : '') + '</div></div>' +
      '<div class="side"><div class="card"><b>Ce qui est inclus</b><ul class="incl">' +
      [[nCaps + ' capsules : vidéo de 4 min 30 maximum, quiz flash, fiche, exercice, livrable', 'video'], [nCh + ' vidéos interactives avec Sébastien Paumier et Mozi', 'video'], [nCaps + ' quiz flash de 3 questions', 'quiz'], [nCaps + ' fiches pratiques en PDF', 'reading'], [nCaps + ' exercices sur un bien fil rouge (appartement ou maison)', 'practice'], [MODS.length + ' cas pratique' + (MODS.length > 1 ? 's' : '') + ' évalué' + (MODS.length > 1 ? 's' : ''), 'case'], ['Rappels J+1, J+7, J+30', 'reminder'], ['Attestation de fin de formation', 'cert']].map(function (x) { return '<li>' + ic(x[1]) + '<span>' + esc(x[0]) + '</span></li>'; }).join('') + '</ul></div></div></div>' +
      '<div class="wrap"><div class="facts"><div><b>' + MODS.length + ' module' + (single ? '' : 's') + '</b><span>' + nCaps + ' capsules de 4 min 30 maximum</span></div><div><b>Niveau intermédiaire</b><span>Agents, mandataires, négociateurs</span></div><div><b>' + esc(single ? '≈ ' + Math.round(MODS[0].capsules.length * 1.1 + 1) + ' heures' : M.hours || '≈ 40 heures') + '</b><span>À ton rythme, 100 % en ligne</span></div><div><b>Attestation</b><span>De fin de formation</span></div></div></div></section>' +
      '<nav class="tabsbar" aria-label="Sections de la page"><div class="wrap"><a href="#apropos" class="on">À propos</a><a href="#modules">Modules</a><a href="#formateur">Formateur</a><a href="#evaluation">Évaluation</a>' + (M.downloads ? '<a href="#lms">Pour ton LMS</a>' : '') + '</div></nav>' +
      '<div class="wrap"><section class="sec" id="apropos"><h2>Ce que tu vas apprendre</h2><div class="learn">' + MODS.map(function (m) { return '<div>' + ic('check') + '<span>' + esc((M.objectives || {})[m.id] || m.title) + '</span></div>'; }).join('') + '</div>' +
      '<h2 class="mt">Compétences travaillées</h2><div class="skills">' + (M.skills || []).map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('') + '</div>' +
      '<h2 class="mt">Détails</h2><div class="details"><div><b>Format</b><span class="muted">Chaque capsule : je regarde (4 min 30 maximum), je me teste (quiz flash de 3 questions), je télécharge la ressource, je pratique, je dépose mon livrable</span></div><div><b>Langue</b><span class="muted">Français</span></div><div><b>Fil rouge au choix</b><span class="muted">L’appartement de M. Bernard à Melun, classé F, ou la maison de Mme Garnier, classée G, de l’estimation à l’acte</span></div><div><b>Intelligence artificielle</b><span class="muted">' + nIA + ' exercices avec prompts métier</span></div></div></section>' +
      '<section class="sec" id="modules"><h2>' + (single ? 'Contenu du module' : 'Il y a ' + MODS.length + ' modules dans cette formation') + '</h2><p class="muted">Code couleur DPE : tu progresses du rouge vers le vert, comme un logement qu’on rénove.</p>' + parcSwitch() + '<div class="mods">' +
      SECS.map(function (s) { return modCard(s); }).join('') + '</div></section>' +
      '<section class="sec" id="formateur"><h2>Formateur</h2><div class="inst2"><img src="assets/seb.png" alt=""><div><h3>Sébastien Paumier</h3><p class="muted" style="margin:2px 0 8px">Formateur Éco-Propriété · spécialiste transaction et performance énergétique</p><p>' + esc(cut((G.start || {}).welcome, 420)) + '</p></div></div></section>' +
      '<section class="sec" id="evaluation"><h2>Comment tu es évalué</h2><div class="details"><div><b>Quiz flash</b><span class="muted">3 questions après chaque capsule, retour expliqué immédiat</span></div><div><b>Devoirs</b><span class="muted">' + nCaps + ' livrables avec grille de validation</span></div><div><b>Cas pratiques</b><span class="muted">Un par module, évalué par le formateur</span></div>' + (SCOPE.end ? '<div><b>Quiz final</b><span class="muted">' + ((G.final || {}).questions || []).length + ' questions, seuil ' + TH + ' %</span></div>' : '<div><b>Score SCORM</b><span class="muted">Moyenne des quiz flash</span></div>') + '</div><div class="row" style="margin-top:22px">' + cta + '</div></section></div>';
    if (M.downloads) {
      // Paquets SCORM 1.2 à importer dans le LMS (site uniquement, pas dans les paquets eux-mêmes)
      var dl = '<section class="sec" id="lms"><h2>Pour ton LMS : les paquets SCORM</h2><p class="muted">Télécharge le paquet et importe-le tel quel dans ton LMS (format SCORM 1.2, version ' + esc(M.version || '') + '). Le suivi (progression, score, statut « terminé ») remonte dans le LMS. Les vidéos sont lues en streaming : l’apprenant doit avoir accès à Internet.</p><div class="dl">' +
        M.downloads.map(function (d) { return '<a class="btn ' + (d.full ? 'p' : 's') + '" href="' + esc(d.file) + '" download>' + ic('reading') + ' ' + esc(d.label) + '</a>'; }).join('') + '</div></section>';
      h = h.replace(/<\/div>$/, '') + dl + '</div>';
    }
    // idées marquées « À revoir » en fin de chapitre
    var rvl = []; MODS.forEach(function (m) { m.capsules.forEach(function (c) { var ch = c.chapter, sf = ((S.c[c.id] || {}).ch || {}).self; if (!ch || !sf) return; var stp = (ch.screens.filter(function (x) { return x.kind === 'steps'; })[0] || {}).steps || []; Object.keys(sf).forEach(function (j) { if (sf[j] === 'rv' && stp[j]) rvl.push({ c: c, j: +j, label: stp[j].label, detail: stp[j].detail }); }); }); });
    if (rvl.length) h = h.replace('<nav class="tabsbar"', '<div class="wrap"><section class="sec revoir" id="revoir"><h2>À revoir (' + rvl.length + ')</h2><p class="muted">Les idées que tu as marquées « À revoir » en fin de chapitre. Touche-en une pour revoir le cours au bon endroit, puis remets les étapes dans l’ordre.</p><ul class="rvl">' +
      rvl.map(function (x) { return '<li><button class="rvb" data-revoir="' + esc(x.c.id) + '"><span class="chip ia">' + esc(x.c.id) + '</span> <b>' + esc(x.label) + '</b><span class="muted"> · ' + esc(cut(x.detail, 90)) + '</span></button><button class="rvx" data-revu="' + esc(x.c.id) + ':' + x.j + '" aria-label="Retirer de la liste">C’est revu</button></li>'; }).join('') + '</ul></section></div><nav class="tabsbar"');
    app.innerHTML = h;
    [].forEach.call(app.querySelectorAll('[data-revoir]'), function (b) { b.onclick = function () { var id = b.getAttribute('data-revoir'), c0 = cs(id), ch0 = c0.ch || (c0.ch = {}), k7 = 6; ch0.i = k7; ch0.g = 0; if (ch0.gt) delete ch0.gt.s; save(); go(['learn', 'c:' + id + ':0']); }; });
    [].forEach.call(app.querySelectorAll('[data-revu]'), function (b) { b.onclick = function () { var p = b.getAttribute('data-revu').split(':'), sf = ((S.c[p[0]] || {}).ch || {}).self; if (sf) sf[p[1]] = 'ok'; save(); render(); }; });
    [].forEach.call(app.querySelectorAll('[data-learn]'), function (b) { b.onclick = function () { go(['learn', b.getAttribute('data-learn')]); }; });
    bindParc();
    var tabs = app.querySelectorAll('.tabsbar a');
    [].forEach.call(tabs, function (a) { a.onclick = function (e) { e.preventDefault(); var t = $(a.getAttribute('href').slice(1)); if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' }); [].forEach.call(tabs, function (x) { x.classList.toggle('on', x === a); }); }; });
  }
  function cut(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, s.lastIndexOf(' ', n)) + '…' : s; }
  function modCard(s) {
    var items = secItems(s), nd = items.filter(isDone).length, m = s.mod;
    var first = items.filter(function (it) { return !isDone(it); })[0] || items[0];
    var vc = m ? visCaps(m) : [], nch = vc.filter(function (c) { return c.chapter; }).length;
    var meta = m ? vc.length + ' capsules' + (nch ? ' dont ' + nch + ' vidéos interactives' : '') + ' · ' + vc.length + ' fiches · ' + vc.length + ' exercices' + (m.case ? ' · 1 cas pratique' : '') : items.length + ' éléments';
    var body = m ? '<div class="io"><div><b>Point de départ</b><br>' + esc(m.entry) + '</div><div><b>Ce que tu produis</b><br>' + esc(m.exit) + '</div></div>' +
      '<ul class="ilist">' + vc.map(function (c) { var mz = c.chapter && c.chapter.mozi && c.chapter.mozi.line; return '<li>' + ic('video') + '<span><b>' + c.id + ' · ' + esc(c.chapter ? c.chapter.title : c.title) + '</b>' + (c.ia ? ' <span class="chip ia">IA</span>' : '') + '<br><span class="muted sm">' + esc(mz ? 'Mozi : « ' + mz + ' »' : c.objective) + '</span></span><span class="k">' + (c.v4 ? (c.chapter ? 'Vidéo interactive' : '4 min 30 max') + ' · 5 étapes' : c.chapter ? '4 min 30' : '5 éléments') + '</span></li>'; }).join('') +
      '<li>' + ic('case') + '<span><b>Cas pratique</b> · ' + esc(m.case.title) + '</span><span class="k">' + m.case.duration_min + ' min</span></li><li>' + ic('reminder') + '<span>Rappels J+1 · J+7 · J+30</span><span class="k">Quiz</span></li></ul>' :
      '<ul class="ilist">' + items.map(function (it) { return '<li>' + ic(it.kind) + '<span>' + esc(it.title) + '</span><span class="k">' + esc(it.dur) + '</span></li>'; }).join('') + '</ul>';
    return '<details class="mod" style="--mc:' + s.color + '"' + (m && m.id === MODS[0].id ? ' open' : '') + '><summary><span class="bar6"></span><span>' + (m ? '<span class="mk">' + esc(modLabel(m).toUpperCase()) + '</span>' : '') + '<h3>' + esc(s.title) + '</h3><div class="meta">' + esc(meta) + (nd ? ' · ' + nd + '/' + items.length + ' terminés' : '') + '</div></span><span class="chev">' + ic('chev') + '</span></summary><div class="body">' + body +
      '<div class="row" style="margin-top:14px"><button class="btn s" data-learn="' + esc(first.key) + '">' + (nd ? 'Continuer' : 'Commencer') + (m ? (m.id === 0 ? ' le prérequis' : ' le module ' + m.id) : '') + '</button></div></div></details>';
  }

  /* ---------- Lecteur : plan latéral + élément ---------- */
  function navHtml(it) {
    return '<nav class="nav" id="courseNav" aria-label="Plan du cours"><div class="nh"><b>' + esc(TITLE) + '</b>' + pct() + ' % terminé' + parcSwitch() + '</div>' +
      SECS.map(function (s) {
        var open = !!openSecs[s.id], all = secItems(s), nd = all.filter(isDone).length;
        return '<div class="ng" style="--mc:' + s.color + '"><button aria-expanded="' + open + '" data-sec="' + s.id + '"><span class="mbar"></span><span>' + esc(s.mod ? modLabel(s.mod) + ' · ' + s.title : s.title) + '<span class="msub">' + nd + ' / ' + all.length + ' terminés</span></span>' + ic('chev') + '</button>' +
          (open ? '<ul>' + s.groups.map(function (g) { return (g.label ? '<li class="' + (g.head ? 'sech' : 'cap') + '">' + esc(g.label) + '</li>' : '') + g.items.map(function (x) { var d = isDone(x); return '<li><button class="it' + (x === it ? ' on' : '') + (d ? ' done' : '') + '" data-key="' + esc(x.key) + '"' + (x === it ? ' aria-current="page"' : '') + '><span class="st"></span><span>' + esc(x.title) + '<span class="sr"> (' + (d ? 'terminé' : 'à faire') + ')</span><small>' + ic(x.kind) + esc(x.dur) + '</small></span></button></li>'; }).join(''); }).join('') + '</ul>' : '') + '</div>';
      }).join('') + '</nav>';
  }
  function parcSwitch() {
    if (!MODS.some(function (m) { return m.capsules.some(function (c) { return c.parcours; }); })) return '';
    return '<div class="parc" role="group" aria-label="Mon bien fil rouge"><span>Mon bien fil rouge :</span>' + [['appartement', 'Appartement'], ['maison', 'Maison']].map(function (x) { return '<button data-parc="' + x[0] + '" aria-pressed="' + (PARC() === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</div>';
  }
  function bindParc() {
    [].forEach.call(app.querySelectorAll('[data-parc]'), function (b) { b.onclick = function () {
      var v = b.getAttribute('data-parc'); if (PARC() === v) return; S.parcours = v; buildPlan();
      if (S.cur && S.cur[0] === 'learn' && !BYKEY[S.cur[1]]) S.cur = ['home'];
      save(); render(); announce(v === 'maison' ? 'Parcours maison : la maison de Mme Garnier' : 'Parcours appartement : l’appartement de M. Bernard');
    }; });
  }
  function renderLearn(it) {
    $('navBtn').style.display = '';
    var sec = it.sec; openSecs[sec.id] = true;
    var idx = FLAT.indexOf(it), prev = FLAT[idx - 1], next = FLAT[idx + 1];
    var bc = '<div class="bc"><button data-home>' + esc(MODS.length === 1 ? 'Module ' + MODS[0].id : 'Accueil du cours') + '</button> › ' + esc(sec.mod ? modLabel(sec.mod) : sec.title) + (it.cap ? ' › Capsule ' + esc(it.cap.id) : '') + '</div>';
    var head = '<h1 class="ititle">' + esc(it.kind === 'video' ? it.cap.id + ' · ' + it.cap.title : it.title) + '</h1><div class="itype">' + ic(it.kind) + '<span>' + esc(it.dur) + '</span>' + (it.ia ? '<span class="chip ia">IA</span>' : '') + (isDone(it) ? '<span class="chip ok">Terminé</span>' : '') + '</div>';
    var mk = MARK[it.kind];
    var foot = '<div class="foot"><span>' + (prev ? '<button class="btn ghost" data-key="' + esc(prev.key) + '">← Précédent</button>' : '') + '</span><span class="row">' +
      (mk ? '<button class="btn s" id="' + mk.id + '"' + (isDone(it) ? ' disabled' : '') + '>' + (isDone(it) ? mk.done : mk.label) + '</button>' : '') +
      (next ? '<button class="btn p" data-key="' + esc(next.key) + '" id="nextBtn">Élément suivant →</button>' : '<button class="btn p" data-home>Retour à l’accueil du cours</button>') + '</span></div>';
    app.innerHTML = '<div class="lv">' + navHtml(it) + '<main class="main" tabindex="-1"><div class="inner">' + bc + head + R[it.kind](it) + foot + '</div></main></div>';
    $('navBtn').setAttribute('aria-expanded', 'false');
    [].forEach.call(app.querySelectorAll('[data-sec]'), function (b) { b.onclick = function () { var id = b.getAttribute('data-sec'); openSecs[id] = !openSecs[id]; var n = $('courseNav'), st = n.scrollTop; n.outerHTML = navHtml(it); $('courseNav').scrollTop = st; bindNav(it); }; });
    bindNav(it); bindParc();
    attachHls();
    [].forEach.call(app.querySelectorAll('.main [data-key]'), function (b) { b.onclick = function () { go(['learn', b.getAttribute('data-key')]); }; });
    [].forEach.call(app.querySelectorAll('[data-home]'), function (b) { b.onclick = function () { go(['home']); }; });
    if (mk) $(mk.id).onclick = function () { mk.fn(it); refresh(it); announce('Élément terminé'); };
    var cur = app.querySelector('.it.on'), n = $('courseNav');
    if (cur && n && n.scrollHeight > n.clientHeight) n.scrollTop = Math.max(0, cur.offsetTop - n.clientHeight / 3);
    if (B[it.kind]) B[it.kind](it);
  }
  function bindNav(it) {
    [].forEach.call(app.querySelectorAll('.nav [data-key]'), function (b) { b.onclick = function () { go(['learn', b.getAttribute('data-key')]); }; });
        [].forEach.call(app.querySelectorAll('.nav [data-sec]'), function (b) { b.onclick = function () { var id = b.getAttribute('data-sec'); openSecs[id] = !openSecs[id]; var n = $('courseNav'), st = n.scrollTop; n.outerHTML = navHtml(it); $('courseNav').scrollTop = st; bindNav(it); }; });
  }
  function refresh(it) { var y = window.scrollY, n = $('courseNav'), ns = n ? n.scrollTop : 0; save(); renderLearn(it); bindDocLinks(); window.scrollTo(0, y); if ($('courseNav')) $('courseNav').scrollTop = ns; }
  var MARK = {
    video: { id: 'watched', label: 'J’ai regardé la vidéo', done: 'Vidéo vue ✓', fn: function (it) { cs(it.cap.id).v = 1; } },
    reading: { id: 'gotR', label: 'J’ai lu la fiche', done: 'Fiche lue ✓', fn: function (it) { cs(it.cap.id).r = 1; } },
    practice: { id: 'didP', label: 'J’ai fait l’exercice', done: 'Exercice fait ✓', fn: function (it) { cs(it.cap.id).p = 1; } },
    welcome: { id: 'didW', label: 'Marquer comme lu', done: 'Lu ✓', fn: function () { S.t.w = 1; } },
    dossier: { id: 'didD', label: 'J’ai parcouru le dossier', done: 'Dossier parcouru ✓', fn: function () { S.t.dv = 1; } }
  };

  /* ---------- Morceaux réutilisables ---------- */
  function mcqHtml(q, num) {
    return '<div class="q"><div class="qn">' + esc(num) + '</div><div class="qt">' + esc(q.question) + '</div><div class="opts" role="radiogroup">' +
      q.options.map(function (o, i) { return '<button class="opt" role="radio" aria-checked="false" data-i="' + i + '"><span class="dot" aria-hidden="true"></span><span>' + esc(o) + '<span class="why" hidden></span></span></button>'; }).join('') +
      '</div><div class="row" style="margin-top:10px"><button class="btn p val" disabled>Valider</button></div><div class="fbx"></div></div>';
  }
  function bindMcq(root, q, store) {
    var sel = null, opts = root.querySelectorAll('.opt'), val = root.querySelector('.val');
    function show(i, silent) {
      var ok = i === q.answer;
      [].forEach.call(opts, function (b) { var j = +b.getAttribute('data-i'); b.disabled = true; b.setAttribute('aria-checked', String(j === i));
        if (j === q.answer) b.classList.add('ok'); else if (j === i) b.classList.add('ko');
        if (j === q.answer || j === i) { var w = b.querySelector('.why'); w.hidden = false; w.textContent = (q.whys || [])[j] || ''; } });
      val.style.display = 'none';
      root.querySelector('.fbx').innerHTML = '<div class="fb ' + (ok ? 'ok' : 'ko') + '"><span class="ic">' + (ok ? '✓' : '✗') + '</span><div><b>' + (ok ? 'Correct — ' : 'Pas tout à fait — ') + esc(q.fb_title) + '</b><br>' + esc(q.fb_text) + '</div></div>';
      if (!silent) announce(ok ? 'Bonne réponse' : 'Réponse incorrecte');
      return ok;
    }
    [].forEach.call(opts, function (b) { b.onclick = function () { sel = +b.getAttribute('data-i'); [].forEach.call(opts, function (x) { x.setAttribute('aria-checked', String(x === b)); }); val.disabled = false; }; });
    val.onclick = function () { var ok = show(sel); store(sel, ok); };
    return show;
  }
  function sectionsHtml(secs) {
    var h = '';
    (secs || []).forEach(function (s) {
      var t = s.type || (s.rows ? 'table' : s.items ? 'list' : 'text');
      if (s.heading) h += '<h3>' + esc(s.heading) + '</h3>';
      if (t === 'table') h += '<div class="tw"><table><thead><tr>' + (s.headers || []).map(function (x) { return '<th>' + esc(x) + '</th>'; }).join('') + '</tr></thead><tbody>' + (s.rows || []).map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + nl(x) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
      else if (t === 'checklist') h += '<ul class="ck">' + (s.items || []).map(function (x) { return '<li><span>' + nl(x) + '</span></li>'; }).join('') + '</ul>';
      else if (t === 'steps') h += '<ol>' + (s.items || []).map(function (x) { return '<li>' + nl(x) + '</li>'; }).join('') + '</ol>';
      else if (t === 'list') h += '<ul>' + (s.items || []).map(function (x) { return '<li>' + nl(x) + '</li>'; }).join('') + '</ul>';
      else if (t === 'formula') h += '<div class="fx">' + esc(s.text) + '</div>';
      else h += '<p>' + nl(s.text) + '</p>';
      if (s.text && (t === 'list' || t === 'checklist' || t === 'steps' || t === 'table')) h += '<p>' + nl(s.text) + '</p>';
    });
    return h;
  }
  function docRefs(text) { return esc(text).replace(/\b(D(0[1-9]|1\d|20))\b/g, '<button class="doclink" data-doc="$1">$1</button>'); }
  function bindDocLinks() { [].forEach.call(app.querySelectorAll('[data-doc]'), function (b) { b.onclick = function () { openDoc(b.getAttribute('data-doc')); }; }); }
  function openDoc(id) {
    var d = ((G.dossier || {}).documents || []).filter(function (x) { return x.id === id; })[0]; if (!d) return;
    var back = document.activeElement, m = document.createElement('div'); m.className = 'modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', d.id + ' ' + d.title);
    m.innerHTML = '<div class="mbox"><button class="btn s x" type="button">Fermer ✕</button><div class="doc"><span class="fict">Document fictif à usage pédagogique</span><h2>' + esc(d.id + ' · ' + d.title) + '</h2>' + sectionsHtml(d.sections) + '</div></div>';
    document.body.appendChild(m);
    var k = function (e) { if (e.key === 'Escape') close(); };
    function close() { m.remove(); document.removeEventListener('keydown', k); if (back && back.focus) back.focus(); }
    m.querySelector('.x').onclick = close; m.onclick = function (e) { if (e.target === m) close(); };
    document.addEventListener('keydown', k); m.querySelector('.x').focus();
  }
  function copy(text, btn) {
    var done = function () { var o = btn.textContent; btn.textContent = 'Copié ✓'; setTimeout(function () { btn.textContent = o; }, 1600); };
    function fallback() { var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (e) {} t.remove(); }
    try { navigator.clipboard.writeText(text).then(done, fallback); } catch (e) { fallback(); }
  }
  function pdfBox(file, title, sub) {
    if (!C.pdf) return '';
    return '<div class="dl"><span class="ico">PDF</span><span class="dlt"><b>' + esc(title) + '</b><br><span class="muted sm">' + esc(sub || '') + '</span></span><a class="btn s" href="pdf/' + esc(file) + '" target="_blank" rel="noopener">Télécharger</a></div>';
  }

  /* ---------- Rendus par type ---------- */
  var R = {}, B = {}, CH = null;
  R.chapter = function (it) {
    var c = it.cap;
    return window.EcoChapter.render(c.chapter, { avatar: 'assets/seb.png' }) +
      '<div class="box" style="margin-top:18px"><h3>Pour aller plus loin</h3><p style="margin:0">La fiche « ' + esc(c.resource.title) + ' », l’exercice complet « ' + esc(c.exercise.title) + ' » et le devoir « ' + esc(c.deliverable.title) + ' » sont dans le plan, juste après ce chapitre.</p></div>';
  };
  B.chapter = function (it) {
    var c = it.cap, st = cs(c.id), k = 'proof:' + c.id;
    var ch = st.ch || (st.ch = {});
    if (CH) CH.destroy();
    CH = window.EcoChapter.mount(app.querySelector('.ch'), c.chapter, {
      state: ch, proof: DEP[k], save: save,
      next: (function () { var ix = FLAT.indexOf(it); for (var j = ix + 1; j < FLAT.length; j++) if (FLAT[j].kind === 'chapter') { var nt = FLAT[j]; return { label: nt.cap.id + ' · ' + nt.cap.chapter.title, go: function () { go(['learn', nt.key]); } }; } return null; })(),
      onDone: function () { if (!st.v) { st.v = 1; save(); var n = $('courseNav'); if (n) { var y = n.scrollTop; n.outerHTML = navHtml(it); $('courseNav').scrollTop = y; bindNav(it); } } },
      onQuiz: function (ok, sel) { st.q = ok ? 100 : 0; interaction('ch' + c.id + '-q1', String.fromCharCode(97 + sel), ok, String.fromCharCode(97 + c.chapter.screens[8].card1.answer)); },
      onProof: function (u) { DEP[k] = u; saveDep(); },
      onSelf: function () { save(); },
      onExercise: function () { go(['learn', 'c:' + c.id + ':3']); }
    });
  };
  R.video = function (it) {
    var c = it.cap, v = c.video;
    if (c.v4 && !v.src && !v.segments) return '<div class="player"><img class="seb" src="assets/seb.png" alt=""><span class="tag">Vidéo en production · 4 min 30 maximum · Sébastien Paumier</span><span class="hook">' + esc(v.pitch || '') + '</span></div>' +
      '<div class="box" style="margin-top:14px"><h3>Objectif de la capsule</h3><p style="margin:0">À la fin de cette capsule, tu sauras ' + esc(lc(c.objective)) + '.</p></div>' +
      '<div class="box"><h3>Le parcours de la capsule</h3><ol style="margin:0;padding-left:20px"><li>Je regarde la vidéo (4 min 30 maximum)</li><li>Je me teste : quiz flash de ' + c.quiz.questions.length + ' questions</li><li>Je télécharge la ressource : « ' + esc(c.resource.title) + ' »</li><li>Je pratique : « ' + esc(c.exercise.title) + ' »</li><li>Je dépose mon livrable : « ' + esc(c.deliverable.title) + ' »</li></ol></div>';
    var isHls = v.src && /\.m3u8($|\?)/.test(v.src);
    var media = v.src ? '<video controls preload="metadata" playsinline' + (v.poster ? ' poster="' + esc(v.poster) + '"' : '') + (isHls ? ' data-hls="' : ' src="') + esc(v.src) + '"></video>' :
      '<img class="seb" src="assets/seb.png" alt=""><button class="pl" id="playBtn" aria-label="Lire la transcription"></button><span class="tag">Vidéo en production · avatar de Sébastien Paumier</span><span class="hook">« ' + esc(v.hook) + ' »</span>';
    return '<div class="player">' + media + '</div>' + (v.src ? (v.note ? '<p class="muted sm" style="margin-top:8px">' + esc(v.note) + '</p>' : '') : '<p class="muted sm" style="margin-top:8px">La vidéo de Sébastien Paumier est en cours de production. En attendant, la transcription complète est disponible ci-dessous.</p>') +
      '<div class="ptabs" role="tablist"><button role="tab" aria-selected="true" data-pt="tr">Transcription</button><button role="tab" aria-selected="false" data-pt="ob">Objectif</button>' + (C.showProd ? '<button role="tab" aria-selected="false" data-pt="prod">Montage</button>' : '') + '</div>' +
      '<div id="ptr" class="tr noprod" tabindex="0">' + v.segments.map(function (s) { return '<div class="seg"><span class="tc">' + esc(s.tc) + '</span><span>' + esc(s.voice) + '<span class="sc">Plan : ' + esc(s.screen) + (s.onscreen ? ' · À l’écran : ' + esc(s.onscreen) : '') + '</span></span></div>'; }).join('') + '</div>' +
      '<div id="pob" hidden><div class="box"><h3>Objectif de la capsule</h3><p style="margin:0">À la fin de cette capsule, tu sauras ' + esc(lc(c.objective)) + '.</p></div><div class="box"><h3>Ensuite</h3><p style="margin:0">Quiz flash (' + c.quiz.questions.length + ' questions), la fiche « ' + esc(c.resource.title) + ' », l’exercice « ' + esc(c.exercise.title) + ' », puis le devoir à déposer.</p></div></div>';
  };
  B.video = function (it) {
    if (!$('ptr')) return;
    var p = $('playBtn'); if (p) p.onclick = function () { $('ptr').scrollIntoView({ behavior: 'smooth' }); $('ptr').focus({ preventScroll: true }); };
    [].forEach.call(app.querySelectorAll('[data-pt]'), function (b) { b.onclick = function () {
      [].forEach.call(app.querySelectorAll('[data-pt]'), function (x) { x.setAttribute('aria-selected', String(x === b)); });
      var t = b.getAttribute('data-pt'); $('ptr').hidden = t === 'ob'; $('pob').hidden = t !== 'ob'; $('ptr').classList.toggle('noprod', t !== 'prod'); }; });
    var vid = app.querySelector('video'); if (vid) vid.addEventListener('ended', function () { cs(it.cap.id).v = 1; refresh(it); });
  };
  R.quiz = function (it) {
    var c = it.cap, qs = c.quiz.questions, s = S.c[c.id] || {};
    return '<div class="qintro"><div><b>' + qs.length + ' questions</b>Réponds sans revoir la vidéo</div><div><b>Corrigé immédiat</b>Chaque réponse est expliquée</div><div><b>Note pour réussir</b>75 % ou plus</div></div>' +
      qs.map(function (q, i) { return mcqHtml(q, 'Question ' + (i + 1) + ' sur ' + qs.length); }).join('') + '<div id="qres">' + (s.q != null ? resultHtml(s.q, 75, 'Passe à la lecture.', 'Revois la vidéo sur les points ratés, puis refais le quiz.', true) : '') + '</div>';
  };
  function resultHtml(p, th, okT, koT, redo) { return '<div class="result"><span class="big">' + p + ' %</span><div><b>' + (p >= th ? 'Réussi.' : 'À retravailler.') + '</b> ' + esc(p >= th ? okT : koT) + '<div class="pbar' + (p < th ? ' low' : '') + '"><i style="width:' + p + '%"></i></div>' + (redo ? '<button class="btn s" id="redo">Refaire le quiz</button>' : '') + '</div></div>'; }
  B.quiz = function (it) {
    var c = it.cap, qs = c.quiz.questions, ans = cs(c.id).qa || (cs(c.id).qa = {});
    [].forEach.call(app.querySelectorAll('.q'), function (el, i) {
      var show = bindMcq(el, qs[i], function (sel, ok) { ans[i] = [sel, ok ? 1 : 0]; check(); });
      if (ans[i]) show(ans[i][0], true);
    });
    function check() {
      if (Object.keys(ans).length === qs.length) { cs(c.id).q = Math.round(100 * Object.keys(ans).reduce(function (a, k) { return a + ans[k][1]; }, 0) / qs.length); refresh(it); $('qres').scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      else save();
    }
    var r = $('redo'); if (r) r.onclick = function () { delete cs(c.id).q; cs(c.id).qa = {}; refresh(it); window.scrollTo(0, 0); };
  };
  R.reading = function (it) {
    var c = it.cap, r = c.resource;
    return pdfBox('RES_' + c.id.replace('.', '-') + '.pdf', r.title, 'Fiche PDF · capsule ' + c.id + ' · à garder pour tes rendez-vous') +
      '<article class="doc">' + (r.intro ? '<p class="intro">' + nl(r.intro) + '</p>' : '') + sectionsHtml(r.sections) + (r.footer ? '<div class="dfoot">' + nl(r.footer) + '</div>' : '') + '</article>';
  };
  R.practice = function (it) {
    var x = it.cap.exercise, p = x.ia_prompt, done = isDone(it);
    return '<div class="ctx">' + docRefs(x.context) + '</div>' +
      (x.materials && x.materials.length ? '<div class="box"><h3>Documents du dossier fil rouge</h3><p style="margin:0">' + x.materials.map(docRefs).join(' · ') + '</p></div>' : '') +
      '<div class="box"><h3>Consigne</h3><ol class="st">' + x.steps.map(function (s) { return '<li><span>' + docRefs(s) + '</span></li>'; }).join('') + '</ol></div>' +
      (p && p.prompt ? '<div class="iab"><div class="row" style="justify-content:space-between"><b>Prompt métier prêt à l’emploi</b><button class="btn o" id="cpy">Copier le prompt</button></div><div class="prompt">' + esc(p.prompt) + '</div><p style="margin:12px 0 4px"><b>Garde-fous</b></p><ul style="margin:0">' + (p.guardrails || []).map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ul></div>' : '') +
      '<div class="box"><h3>Corrigé</h3>' + (done ? '<button class="btn s" id="corr">Voir le corrigé</button>' : '<p class="muted sm" style="margin:0">Fais l’exercice, puis clique sur « J’ai fait l’exercice » en bas de page : le corrigé s’ouvrira ici.</p><button class="btn s" id="corr" disabled hidden>Voir le corrigé</button>') + '<div id="corrBox"></div></div>';
  };
  B.practice = function (it) {
    var p = it.cap.exercise.ia_prompt, cp = $('cpy'); if (cp) cp.onclick = function () { copy(p.prompt, cp); };
    $('corr').onclick = function () { $('corrBox').innerHTML = '<div class="reveal"><b>Réponse attendue</b>\n' + docRefs(it.cap.exercise.expected) + '</div>'; bindDocLinks(); };
  };
  function depositHtml(key, title, format, criteria, example, done, info) {
    var dep = DEP[key] || {};
    return '<div class="asg"><div>' + (title ? '<p class="asgt"><b>' + esc(title) + '</b></p>' : '') + '<p><b>Format attendu :</b> ' + esc(format) + '</p>' +
      '<h3>Grille de validation</h3><p class="muted sm">Coche chaque critère avant de déposer.</p><ul class="crit">' + (criteria || []).map(function (k, i) { var lab = typeof k === 'string' ? k : (k.label + (k.points ? ' (' + k.points + ' pts)' : '') + (k.expected ? ' — ' + k.expected : '')); return '<li><label><input type="checkbox" data-c="' + i + '"' + ((dep.ck || {})[i] ? ' checked' : '') + '><span>' + esc(lab) + '</span></label></li>'; }).join('') + '</ul>' +
      (example ? '<details class="ex"><summary><b>Voir un exemple de livrable réussi</b></summary><div class="reveal">' + esc(example) + '</div></details>' : '') +
      '<h3>Ton dépôt</h3><textarea id="depT" placeholder="Colle ton livrable ou le lien vers ton document (Drive, OneDrive…)">' + esc(dep.t || '') + '</textarea>' +
      '<div class="row" style="margin-top:8px"><input type="file" id="depF" aria-label="Joindre un fichier"><span class="muted sm" id="depFn">' + (dep.f ? 'Fichier joint : ' + esc(dep.f) : '') + '</span></div>' +
      '<div class="row" style="margin-top:14px"><button class="btn p" id="depB">' + (done ? 'Mettre à jour mon dépôt' : 'Déposer mon devoir') + '</button><span id="depM" class="muted sm" role="status"></span></div></div>' +
      '<aside><dl><dt>Statut</dt><dd>' + (done ? '<span class="chip wait">Déposé · en attente de validation</span>' : 'À rendre') + '</dd><dt>Évalué par</dt><dd>Le formateur, avec la grille</dd>' + (info || '') + (dep.at ? '<dt>Déposé le</dt><dd>' + new Date(dep.at).toLocaleDateString('fr-FR') + '</dd>' : '') + '</dl><p class="muted sm" style="margin:10px 0 0">' + (LMS.mode === 'local' ? 'Dans cette démonstration, ton dépôt reste dans ton navigateur.' : 'Ton dépôt est transmis au formateur.') + '</p></aside></div>';
  }
  function bindDeposit(key, onDone) {
    var dep = DEP[key] || (DEP[key] = {});
    [].forEach.call(app.querySelectorAll('.crit input'), function (i) { i.onchange = function () { dep.ck = dep.ck || {}; dep.ck[i.getAttribute('data-c')] = i.checked; saveDep(); }; });
    $('depT').oninput = function () { dep.t = $('depT').value; saveDep(); };
    $('depF').onchange = function () { var f = $('depF').files[0]; if (f) { dep.f = f.name; $('depFn').textContent = 'Fichier joint : ' + f.name; saveDep(); } };
    $('depB').onclick = function () {
      if (!($('depT').value.trim() || dep.f)) { $('depM').textContent = 'Ajoute ton livrable (texte, lien ou fichier) avant de déposer.'; $('depT').focus(); return; }
      dep.at = new Date().toISOString(); saveDep(); onDone(); announce('Devoir déposé'); };
  }
  function pts(cr) { return (cr || []).reduce(function (a, k) { return a + (k.points || 0); }, 0); }
  R.assignment = function (it) {
    if (it.key === 'end') { var e = G.end || {}; return '<div class="ctx">' + docRefs(e.dossier_complet) + '</div>' + depositHtml('dossier', 'Dossier fil rouge complet', 'Un seul PDF ou un dossier partagé', e.criteria, null, S.t.dos, pts(e.criteria) ? '<dt>Barème</dt><dd>' + pts(e.criteria) + ' points</dd>' : '') + (e.message ? '<div class="box seb"><img src="assets/seb.png" alt=""><p style="margin:0">' + nl(e.message) + '</p></div>' : ''); }
    var d = it.cap.deliverable;
    return depositHtml(it.cap.id, '', d.format, d.criteria, d.example, (S.c[it.cap.id] || {}).d, '<dt>Capsule</dt><dd>' + esc(it.cap.id + ' · ' + it.cap.title) + '</dd>');
  };
  B.assignment = function (it) {
    if (it.key === 'end') bindDeposit('dossier', function () { S.t.dos = 1; refresh(it); });
    else bindDeposit(it.cap.id, function () { cs(it.cap.id).d = 1; refresh(it); });
  };
  R.case = function (it) {
    var m = it.mod, k = m.case;
    return '<div class="ctx">' + docRefs(k.brief) + '</div>' + pdfBox('CAS_M' + m.id + '.pdf', 'Énoncé du cas pratique', 'PDF · module ' + m.id + ' · ' + k.duration_min + ' min') +
      '<div class="box"><h3>Documents</h3><p style="margin:0">' + (k.documents || []).map(docRefs).join(' · ') + '</p></div>' +
      '<div class="box"><h3>Ce que tu dois faire</h3><ol class="st">' + (k.tasks || []).map(function (t) { return '<li><span>' + docRefs(t) + '</span></li>'; }).join('') + '</ol></div>' +
      (k.variants ? '<div class="box"><h3>Variantes</h3><ul style="margin:0">' + k.variants.map(function (v) { return '<li>' + esc(typeof v === 'string' ? v : [v.title || v.profile, v.text || v.description || v.brief].filter(Boolean).join(' — ')) + '</li>'; }).join('') + '</ul></div>' : '') +
      '<h2 class="h2s">Ton rendu</h2>' + depositHtml('case' + m.id, k.deliverable, 'Selon la consigne ci-dessus', k.criteria, null, S.k[m.id], pts(k.criteria) ? '<dt>Barème</dt><dd>' + pts(k.criteria) + ' points</dd>' : '');
  };
  B.case = function (it) { bindDeposit('case' + it.mod.id, function () { S.k[it.mod.id] = 1; refresh(it); }); };
  R.reminder = function (it) {
    var m = it.mod, lab = { J1: 'J+1', J7: 'J+7', J30: 'J+30' };
    return '<p class="muted">Ces questions t’arrivent par e-mail et SMS 1, 7 et 30 jours après la fin du module. Se rappeler, c’est ce qui fait retenir.</p>' +
      ['J1', 'J7', 'J30'].map(function (t) { var x = m.reminders[t]; return '<section class="box"><div class="row" style="justify-content:space-between"><h3 style="margin:0">' + lab[t] + ' · ' + esc(String(x.subject).replace(/^J\+\d+\s*[·:–-]\s*/, '')) + '</h3>' + (S.r[m.id + t] != null ? '<span class="chip ok">' + S.r[m.id + t] + ' %</span>' : '') + '</div>' +
        '<details style="margin:8px 0 14px"><summary class="muted sm">Voir le message envoyé</summary><div class="reveal">' + esc(x.message) + '\n\nSMS : ' + esc(x.sms) + '</div></details>' +
        x.questions.map(function (q, i) { return '<div data-rq="' + t + '">' + mcqHtml(q, 'Question ' + (i + 1) + ' sur ' + x.questions.length) + '</div>'; }).join('') + '</section>'; }).join('');
  };
  B.reminder = function (it) {
    var m = it.mod;
    ['J1', 'J7', 'J30'].forEach(function (t) { var qs = m.reminders[t].questions, got = {};
      [].forEach.call(app.querySelectorAll('[data-rq="' + t + '"] .q'), function (el, i) { bindMcq(el, qs[i], function (sel, ok) { got[i] = ok ? 1 : 0; if (Object.keys(got).length === qs.length) { S.r[m.id + t] = Math.round(100 * Object.keys(got).reduce(function (a, k) { return a + got[k]; }, 0) / qs.length); save(); } }); });
    });
  };
  R.welcome = function () {
    var s = G.start || {};
    return '<div class="box seb"><img src="assets/seb.png" alt="Sébastien Paumier, ton formateur"><div>' + nl(s.welcome) + '</div></div>' +
      '<div class="box"><h3>Accès à la plateforme</h3><ol class="st">' + (s.platform_steps || []).map(function (x) { return '<li><span>' + nl(x) + '</span></li>'; }).join('') + '</ol></div>' +
      '<div class="box"><h3>Comment fonctionne une capsule</h3><p style="margin:0">' + nl(s.how_it_works) + '</p></div>';
  };
  R.dossier = function () {
    var docs = (G.dossier || {}).documents || [];
    return '<p>' + nl((G.start || {}).dossier_intro || '') + '</p>' + pdfBox('DOSSIER_fil-rouge.pdf', 'Dossier fil rouge complet', 'PDF · ' + docs.length + ' documents fictifs') +
      '<div class="grid3">' + docs.map(function (d) { return '<button class="dcard" data-doc="' + d.id + '"><span class="muted sm"><b>' + d.id + '</b> · ' + esc(d.kind || '') + '</span><br><b>' + esc(d.title) + '</b></button>'; }).join('') + '</div>';
  };
  R.test = function (it) {
    var fin = it.key === 'fin', T = fin ? G.final : G.positioning, prev = fin ? S.t.fin : S.t.pos;
    return '<p>' + esc(T.intro) + '</p>' + (prev != null ? '<p><span class="chip ok">Dernier résultat : ' + prev + ' %</span></p>' : '') +
      T.questions.map(function (q, i) { return mcqHtml(q, 'Question ' + (i + 1) + ' sur ' + T.questions.length + ' · module ' + q.module); }).join('') + '<div id="tres"></div>';
  };
  B.test = function (it) {
    var fin = it.key === 'fin', T = fin ? G.final : G.positioning, qs = T.questions, got = {};
    [].forEach.call(app.querySelectorAll('.q'), function (el, i) {
      bindMcq(el, qs[i], function (sel, ok) { got[i] = ok ? 1 : 0; interaction((fin ? 'FINAL_Q' : 'POS_Q') + (i + 1) + '_M' + qs[i].module, String.fromCharCode(97 + sel), ok, String.fromCharCode(97 + qs[i].answer)); if (Object.keys(got).length === qs.length) done(); });
    });
    function done() {
      var p = Math.round(100 * Object.keys(got).reduce(function (a, k) { return a + got[k]; }, 0) / qs.length), by = {};
      qs.forEach(function (q, i) { by[q.module] = by[q.module] || [0, 0]; by[q.module][1]++; by[q.module][0] += got[i]; });
      if (fin) S.t.fin = Math.max(S.t.fin || 0, p); else S.t.pos = p; save();
      $('tres').innerHTML = '<div class="result"><span class="big">' + p + ' %</span><div><b>' + (fin ? (p >= TH ? 'Seuil atteint : ton attestation est disponible.' : 'Sous le seuil de ' + TH + ' % : revois les modules signalés puis repasse le quiz.') : 'C’est ton point de départ. Tu compareras avec le quiz final.') + '</b>' +
        '<table class="res"><tbody>' + Object.keys(by).map(function (k) { var v = by[k], pp = Math.round(100 * v[0] / v[1]), mm = modById(k); return '<tr><td>Module ' + k + (mm ? ' · ' + esc(mm.title) : '') + '</td><td>' + v[0] + ' / ' + v[1] + '</td><td class="w"><div class="pbar' + (pp < 70 ? ' low' : '') + '"><i style="width:' + pp + '%"></i></div></td></tr>'; }).join('') + '</tbody></table>' +
        (fin && S.t.pos != null ? '<p style="margin:8px 0 0">Progression depuis le test de positionnement : <b>' + (p - S.t.pos >= 0 ? '+' : '') + (p - S.t.pos) + ' points</b>.</p>' : '') + '</div></div>';
      $('tres').scrollIntoView({ behavior: 'smooth' });
      var n = $('courseNav'); if (n) { var st = n.scrollTop; n.outerHTML = navHtml(it); $('courseNav').scrollTop = st; bindNav(it); }
    }
  };
  R.survey = function () {
    var s = G.satisfaction || {}, a = DEP.sat || {};
    return '<p>' + esc(s.intro) + '</p>' + (s.questions || []).map(function (q, i) {
      var inner = (q.type === 'scale' || q.type === 'choice') ? '<div class="scale" role="group">' + (q.options || ['1', '2', '3', '4', '5']).map(function (o) { return '<button aria-pressed="' + (String(a[i]) === String(o)) + '" data-q="' + i + '" data-v="' + esc(o) + '">' + esc(o) + '</button>'; }).join('') + '</div>' :
        '<textarea data-q="' + i + '" aria-label="' + esc(q.question) + '">' + esc(a[i] || '') + '</textarea>';
      return '<div class="box"><b>' + (i + 1) + '. ' + esc(q.question) + '</b>' + (q.labels ? '<div class="muted sm">' + esc(q.labels) + '</div>' : '') + '<div style="margin-top:8px">' + inner + '</div></div>';
    }).join('') + '<div class="row"><button class="btn p" id="satB">' + (S.t.sat ? 'Mettre à jour mes réponses' : 'Envoyer mes réponses') + '</button>' + (S.t.sat ? '<span class="chip ok">Merci, réponses enregistrées</span>' : '') + '</div>';
  };
  B.survey = function (it) {
    var a = DEP.sat || (DEP.sat = {});
    [].forEach.call(app.querySelectorAll('.scale button'), function (b) { b.onclick = function () { a[b.getAttribute('data-q')] = b.getAttribute('data-v'); [].forEach.call(b.parentNode.children, function (x) { x.setAttribute('aria-pressed', String(x === b)); }); saveDep(); }; });
    [].forEach.call(app.querySelectorAll('textarea[data-q]'), function (t) { t.oninput = function () { a[t.getAttribute('data-q')] = t.value; saveDep(); }; });
    $('satB').onclick = function () { S.t.sat = 1; refresh(it); announce('Réponses enregistrées'); };
  };
  R.cert = function () {
    var a = G.attestation || {}, ok = S.t.fin != null && S.t.fin >= TH, name = LMS.learner() || 'Prénom Nom';
    var txt = (a.text || '').replace(/\{nom\}/g, name).replace(/\{date_debut\}/g, '…').replace(/\{date_fin\}/g, new Date().toLocaleDateString('fr-FR')).replace(/\{duree\}/g, M.duration || '…').replace(/\{resultat_quiz_final\}/g, S.t.fin != null ? S.t.fin + ' %' : '…');
    return (ok ? '' : '<p><span class="chip wait">Disponible après le quiz final réussi (' + TH + ' %) · aperçu</span></p>') + '<div class="att"><img src="assets/logo-dark.png" alt="Éco-Consultant"><h2>' + esc(a.title || 'Attestation de fin de formation') + '</h2><p>' + esc(txt) + '</p></div>';
  };

  // Vidéos en streaming HLS (segments < 20 Mo, servis depuis GitHub) : hls.js partout où il fonctionne
  // (y compris Safari récent), lecture native seulement en secours (anciens iPhone)
  var hlsLoading = null;
  function attachHls() {
    var vids = app.querySelectorAll('video[data-hls]');
    if (!vids.length) return;
    [].forEach.call(vids, function (vd) {
      var url = vd.getAttribute('data-hls');
      var go = function () {
        if (window.Hls && window.Hls.isSupported()) { var h = new window.Hls(); h.loadSource(url); h.attachMedia(vd); }
        else if (vd.canPlayType('application/vnd.apple.mpegurl')) vd.src = url;
      };
      if (window.Hls) return go();
      if (!hlsLoading) {
        hlsLoading = new Promise(function (ok) { var sc = document.createElement('script'); sc.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js'; sc.onload = ok; sc.onerror = ok; document.head.appendChild(sc); });
      }
      hlsLoading.then(go);
    });
  }

  if (PREVIEW) { var pb = document.createElement('div'); pb.className = 'preview'; pb.textContent = 'Démonstration · tout est ouvert'; document.body.appendChild(pb); }
  window.__eco = { S: S, go: go, FLAT: FLAT };
  var start = S.cur && S.cur[0] === 'learn' && BYKEY[S.cur[1]] ? S.cur : ['home'];
  var rm = /^#(render|embed)-(\d+)-(\d+)(?:-(\d+))?$/.exec(location.hash);
  if (rm) { var rc = null; C.modules.forEach(function (m) { m.capsules.forEach(function (c) { if (c.id === rm[2] + '.' + rm[3]) rc = c; }); });
    if (rc && rc.chapter) {
      var emb = rm[1] === 'embed'; document.body.classList.add('rendering');
      app.innerHTML = emb ? '<div style="max-width:1280px;margin:0 auto;padding:12px">' + window.EcoChapter.render(rc.chapter, {}) + '</div>' : window.EcoChapter.render(rc.chapter, { render: true });
      window.EcoChapter.mount(app.querySelector('.ch'), rc.chapter, { render: !emb, state: { i: rm[4] ? +rm[4] - 1 : 0 } }); return; } }
  var hm = /^#c(\d+)-(\d+)$/.exec(location.hash); if (hm && BYKEY['c:' + hm[1] + '.' + hm[2] + ':0']) start = ['learn', 'c:' + hm[1] + '.' + hm[2] + ':0'];
  S.cur = start; render(); save();
})();

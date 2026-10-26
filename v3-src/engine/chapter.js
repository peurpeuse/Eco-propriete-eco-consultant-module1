/* Lecteur de chapitre · gabarit 15 écrans / 6 briques / 4 min 30 (storyboard validé par Sébastien Paumier).
   Un même rendu sert au site (mobile et 16/9) et à la fabrication de la vidéo (mode rendu : ?render). */
(function () {
  'use strict';
  var BRICKS = ['Ouverture et repères', 'Mozi et la croyance', 'Conséquence', 'Le cours et quiz', 'Méthode et démonstration', 'Preuve et feu d’artifice'];
  var GATE = { welcome: 1, goals: 1, retrieval: 1, quiz: 1, action: 1, proof: 1 };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function sec(t) { var p = String(t).split(':'); return (+p[0]) * 60 + (+p[1] || 0); }
  function fmt(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  // Mozi : personnage original, violet. Agent caricatural, lunettes noires, sourire trop large.
  function mozi(cls) {
    return '<svg class="mozi ' + (cls || '') + '" viewBox="0 0 200 240" role="img" aria-label="Mozi">' +
      '<path d="M40 240c0-52 26-86 60-86s60 34 60 86z" fill="#5B2BB5"/>' +
      '<path d="M86 160l14 30 14-30z" fill="#F4EFFF"/><path d="M96 168h8l4 46-8 10-8-10z" fill="#FF8D16"/>' +
      '<circle cx="100" cy="92" r="56" fill="#8A5CF0"/>' +
      '<path d="M46 80c4-40 34-56 62-52 26 3 46 20 46 44-18-14-40-20-64-18-18 1-32 9-44 26z" fill="#2B1060"/>' +
      '<rect x="58" y="80" width="36" height="20" rx="8" fill="#141414"/><rect x="106" y="80" width="36" height="20" rx="8" fill="#141414"/><path d="M94 88h12" stroke="#141414" stroke-width="5"/>' +
      '<path d="M66 118c18 22 50 22 68 0" fill="none" stroke="#2B1060" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M72 120c16 14 40 14 56 0z" fill="#fff"/></svg>';
  }

  var CSS = '' +
    '.ch{--ink:#141414;--bg:#F2F3EC;--card:#fff;--line:#D9DAD2;--mute:#5E5F58;--or:#FF8D16;--or2:#E56618;--vi:#7B3FE4;--vi2:#5B2BB5;--vis:#EFE9FB;font-family:Inter,"Segoe UI",Arial,sans-serif;color:var(--ink)}' +
    '.ch .stage{position:relative;width:100%;aspect-ratio:16/9;background:var(--bg);border-radius:14px;overflow:hidden;container-type:size;outline:none;border:2px solid var(--line)}' +
    '.ch .stage:focus-visible{outline:3px solid #1A73E8;outline-offset:2px}' +
    '@media (max-width:700px){.ch .stage{aspect-ratio:9/16;max-height:calc(100svh - 150px);margin:0 auto;border-radius:12px}}' +
    '.ch.render .stage{border:0;border-radius:0;position:fixed;inset:0;aspect-ratio:auto;width:100vw;height:100vh;max-height:none}' +
    '.ch .sc{position:absolute;inset:0;padding:6cqmin 6.5cqmin 16cqmin;display:flex;flex-direction:column;gap:3cqmin;opacity:0;visibility:hidden;transition:opacity .35s,visibility .35s}' +
    '.ch .sc.on{opacity:1;visibility:visible}' +
    '.ch .kick{align-self:flex-start;font-family:"IBM Plex Mono",ui-monospace,monospace;font-weight:600;font-size:2.4cqmin;letter-spacing:.3em;background:var(--or);color:var(--ink);padding:.5cqmin 1.4cqmin;border-radius:.8cqmin;text-transform:uppercase}' +
    '.ch .mono{font-family:"IBM Plex Mono",ui-monospace,monospace;letter-spacing:.18em;text-transform:uppercase;font-size:2.1cqmin;color:var(--mute)}' +
    '.ch h2.t{margin:0;font-weight:900;font-size:7.2cqmin;line-height:1.02;letter-spacing:-.04em;text-wrap:balance}' +
    '.ch .t em{font-style:normal;color:var(--or2)}' +
    '.ch .src{position:absolute;left:6.5cqmin;right:28cqmin;bottom:12.5cqmin;font-size:max(11px,1.9cqmin);color:var(--mute);line-height:1.35}' +
    '.ch .sc.dark{background:var(--ink);color:#fff}.ch .sc.dark .src{color:#BDBDB5}.ch .sc.dark .mono{color:#BDBDB5}' +
    '.ch .sc.vio{background:var(--vis)}' +
    /* animation d'entrée : chaque bloc .a apparaît avec un décalage --d */
    '.ch .sc .a{opacity:0;transform:translateY(3cqmin)}.ch .sc.on .a{animation:chIn .55s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:var(--d,0s)}' +
    '@keyframes chIn{to{opacity:1;transform:none}}' +
    '.ch .sc.on .pop{animation:chPop .5s cubic-bezier(.2,1.6,.4,1) forwards;animation-delay:var(--d,0s)}@keyframes chPop{0%{opacity:0;transform:scale(.6)}100%{opacity:1;transform:none}}' +
    '.ch .rv{opacity:.12;transform:translateY(2cqmin);transition:opacity .45s,transform .45s}.ch .rv.in{opacity:1;transform:none}' +
    /* Sébastien Paumier en bulle */
    '.ch .seb{position:absolute;right:4cqmin;bottom:12cqmin;display:flex;flex-direction:column;align-items:center;gap:.8cqmin;z-index:3;transition:opacity .3s}' +
    '.ch .seb img{width:15cqmin;height:15cqmin;border-radius:50%;object-fit:cover;background:#DCDDD5;border:.7cqmin solid var(--or)}' +
    '.ch .seb span{font-size:1.7cqmin;font-weight:700;background:#fff;border-radius:99px;padding:.3cqmin 1.2cqmin;white-space:nowrap}' +
    '.ch .seb.talk img{animation:chTalk 1.2s ease-in-out infinite}@keyframes chTalk{50%{transform:scale(1.04)}}' +
    '.ch .seb.off{opacity:0}' +
    /* sous-titres karaoké */
    '.ch .cc{position:absolute;left:4cqmin;right:22cqmin;bottom:2.8cqmin;min-height:7cqmin;display:flex;align-items:flex-end;z-index:4}' +
    '.ch .cc p{margin:0;background:rgba(20,20,20,.86);color:#fff;border-radius:1.2cqmin;padding:1cqmin 1.8cqmin;font-size:max(13px,2.7cqmin);line-height:1.35;font-weight:600}' +
    '.ch .cc b{font-weight:600;color:var(--or)}.ch .cc i{font-style:normal;opacity:.55}' +
    '.ch.nocc .cc{display:none}' +
    /* barre de progression par briques */
    '.ch .bricks{display:flex;gap:4px;margin-top:10px}.ch .bricks button{flex:var(--w) 1 0;min-width:0;border:0;background:none;padding:6px 0 0;text-align:left;font-size:11.5px;color:var(--mute);font-family:inherit;cursor:pointer}' +
    '.ch .bricks button i{display:block;height:6px;border-radius:3px;background:#D9DAD2;overflow:hidden;margin-bottom:5px}.ch .bricks button i b{display:block;height:100%;width:var(--p,0%);background:var(--or)}' +
    '.ch .bricks button span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ch .bricks button.cur span{color:var(--ink);font-weight:700}' +
    '@media (max-width:700px){.ch .bricks button span{display:none}}' +
    '.ch .ctl{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:8px}' +
    '.ch .ctl button{min-height:44px;min-width:44px;border:1px solid var(--line);background:#fff;border-radius:8px;font:inherit;font-weight:700;padding:0 12px;cursor:pointer;color:var(--ink)}' +
    '.ch .ctl button.pp{background:var(--or);border-color:var(--or)}.ch .ctl .tm{font-family:"IBM Plex Mono",monospace;font-size:13px;color:var(--mute);margin-left:auto}' +
    '.ch .ctl button[aria-pressed=false]{opacity:.6}' +
    '.ch.render .bricks,.ch.render .ctl,.ch.render .trs{display:none}' +
    /* boutons dans l’écran */
    '.ch .go{align-self:flex-start;border:0;border-radius:1.4cqmin;background:var(--or);color:var(--ink);font:inherit;font-weight:900;font-size:3.2cqmin;padding:1.6cqmin 4cqmin;min-height:44px;cursor:pointer}' +
    '.ch .go.ghost{background:transparent;border:2px solid currentColor;font-weight:700}' +
    '.ch .go:focus-visible{outline:3px solid #1A73E8;outline-offset:3px}' +
    /* écrans */
    '.ch .wl{justify-content:center}.ch .wl h2.t{font-size:9cqmin;max-width:80%}' +
    '.ch .goals{display:flex;flex-direction:column;gap:1.6cqmin;max-width:74%}' +
    '.ch .goals div{background:#fff;border-radius:1.4cqmin;padding:1.6cqmin 2.4cqmin;font-size:max(15px,3.1cqmin);border:2px solid var(--line)}.ch .goals b{font-family:"IBM Plex Mono",monospace;margin-right:1.4cqmin}.ch .goals strong{font-weight:900}' +
    '.ch .mz{flex-direction:row;align-items:center;gap:5cqmin;padding-bottom:12cqmin}.ch .mz .mozi{width:34cqmin;height:auto;flex:none}' +
    '.ch .bub{position:relative;background:#fff;border:.5cqmin solid var(--vi);border-radius:3cqmin;padding:3cqmin 3.6cqmin;font-weight:900;font-size:5.6cqmin;line-height:1.08;letter-spacing:-.02em;color:var(--vi2)}' +
    '.ch .bub:before{content:"";position:absolute;left:-3.4cqmin;top:40%;border:1.6cqmin solid transparent;border-right:2.4cqmin solid var(--vi)}' +
    '.ch .mz .kick{display:inline-block}.ch .scene{font-size:max(12px,2.2cqmin);color:var(--mute);margin-top:2cqmin}' +
    '.ch .beats{display:flex;gap:2.4cqmin;flex-wrap:wrap;align-items:baseline}.ch .beats span{font-weight:900;font-size:8.6cqmin;letter-spacing:-.04em;line-height:1}.ch .beats span:last-child{color:var(--vi)}' +
    '.ch .mini{position:absolute;right:5cqmin;top:4cqmin;width:15cqmin}' +
    '.ch .lines{display:flex;flex-direction:column;gap:1.6cqmin;margin-top:2cqmin}.ch .lines span{font-weight:900;font-size:8.4cqmin;letter-spacing:-.04em;line-height:1}.ch .lines span:nth-child(2){color:var(--or)}' +
    '.ch .big{font-weight:900;font-size:22cqmin;letter-spacing:-.06em;line-height:.9;color:var(--or2)}.ch .lab{font-size:4.2cqmin;font-weight:800;max-width:70%;line-height:1.15}' +
    '.ch .steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:2.4cqmin;margin-top:1cqmin}' +
    '.ch .steps>div{background:#fff;border:2px solid var(--line);border-radius:1.6cqmin;padding:2.2cqmin;display:flex;flex-direction:column;gap:1cqmin}' +
    '.ch .steps b{font-family:"IBM Plex Mono",monospace;font-size:2cqmin;color:var(--mute);letter-spacing:.15em}.ch .steps strong{font-size:5cqmin;font-weight:900;letter-spacing:-.02em}.ch .steps p{margin:0;font-size:max(13px,2.8cqmin);line-height:1.3}' +
    '@container (max-aspect-ratio:1/1){.ch .cards{flex-direction:column}.ch .card[data-card="2"]{display:none}.ch .cards.c1 .card[data-card="1"]{display:none}.ch .cards.c1 .card[data-card="2"]{display:block}.ch .steps{grid-template-columns:1fr}.ch .mz{flex-direction:column;align-items:flex-start}.ch .mz .mozi{width:30cqmin}.ch .goals{max-width:100%}.ch .lab{max-width:100%}.ch .src{right:6cqmin;bottom:24cqmin}.ch .seb span{display:none}.ch .seb img{width:18cqmin;height:18cqmin}.ch .seb{bottom:9cqmin}.ch .cc{right:4cqmin;bottom:2cqmin}.ch .sc{padding-bottom:30cqmin}}' +
    '.ch .ask{display:flex;flex-direction:column;gap:1.4cqmin;max-width:78%}.ch .ask p.ctx{margin:0;font-size:2.8cqmin;line-height:1.35}' +
    '.ch textarea{width:100%;min-height:13cqmin;border:2px solid var(--line);border-radius:1.4cqmin;padding:1.4cqmin;font:inherit;font-size:max(16px,2.6cqmin);resize:vertical;background:#fff}' +
    '.ch .row2{display:flex;gap:1.4cqmin;flex-wrap:wrap;align-items:center}.ch .row2 .go{font-size:2.6cqmin;padding:1.1cqmin 2.6cqmin}' +
    '.ch .fb{background:#fff;border-left:1cqmin solid var(--or);border-radius:1.2cqmin;padding:1.4cqmin 2cqmin;font-size:2.5cqmin;line-height:1.4}.ch .fb mark{background:#FFE3C2;border-radius:.4cqmin;padding:0 .4cqmin}' +
    '.ch .cards{display:flex;gap:2.4cqmin;flex:1;min-height:0}.ch .card{flex:1;perspective:1600px;min-width:0}' +
    '.ch .card .in{position:relative;height:100%;transition:transform .6s;transform-style:preserve-3d}.ch .card.flip .in{transform:rotateY(180deg)}' +
    '.ch .card .f,.ch .card .b{position:absolute;inset:0;backface-visibility:hidden;border-radius:2cqmin;padding:2.4cqmin;display:flex;flex-direction:column;gap:1.2cqmin;overflow:auto}' +
    '.ch .card .f{background:var(--ink);color:#fff}.ch .card .b{background:#fff;border:2px solid var(--line);transform:rotateY(180deg)}' +
    '.ch .card h3{margin:0;font-size:3.6cqmin;font-weight:900;line-height:1.1}.ch .card .opt{display:block;width:100%;text-align:left;border:2px solid #3A3A36;background:#1E1E1B;color:#fff;border-radius:1.2cqmin;padding:1.2cqmin 1.6cqmin;font:inherit;font-size:max(14px,2.4cqmin);cursor:pointer;min-height:44px}' +
    '.ch .card .opt:hover{border-color:var(--or)}.ch .card .b p{margin:0;font-size:max(14px,2.4cqmin);line-height:1.4}.ch .card .ok{color:#1F8A4C;font-weight:900}.ch .card .ko{color:#C62828;font-weight:900}' +
    '.ch .tools{display:flex;align-items:stretch;gap:2.4cqmin;margin-top:1cqmin}.ch .tools>div{flex:1;background:#fff;border:2px solid var(--line);border-radius:1.6cqmin;padding:2.4cqmin}.ch .tools strong{display:block;font-size:4.6cqmin;font-weight:900;letter-spacing:-.02em}.ch .tools p{margin:.8cqmin 0 0;font-size:2.6cqmin;line-height:1.3}' +
    '.ch .tools .plus{flex:none;align-self:center;font-weight:900;font-size:6cqmin;background:none;border:0;padding:0}.ch .goal{font-size:3.4cqmin;font-weight:800}.ch .goal span{background:var(--or);padding:0 1cqmin;border-radius:.6cqmin}' +
    '.ch .demo{display:flex;gap:4cqmin;align-items:flex-start}.ch .phone{flex:none;width:24cqmin;aspect-ratio:9/17;border-radius:3cqmin;background:var(--ink);padding:1.4cqmin;display:flex}.ch .phone div{flex:1;border-radius:2cqmin;background:#fff;display:flex;flex-direction:column;gap:1cqmin;padding:1.6cqmin;font-size:1.6cqmin;font-weight:800}.ch .phone i{display:block;height:1.4cqmin;border-radius:.7cqmin;background:#E6E7E0}.ch .phone i.on{background:var(--or)}' +
    '.ch .chk{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:1.4cqmin;flex:1}.ch .chk li{display:flex;gap:1.6cqmin;align-items:flex-start;font-size:max(15px,3.4cqmin);font-weight:700;line-height:1.2}.ch .chk li:before{content:"";flex:none;width:3.6cqmin;height:3.6cqmin;border-radius:50%;border:.5cqmin solid var(--line);margin-top:.2cqmin}.ch .chk li.in:before{background:var(--or);border-color:var(--or)}' +
    '@container (max-aspect-ratio:1/1){.ch .demo{flex-direction:column}.ch .phone{display:none}.ch .tools{flex-direction:column}.ch .tools .plus{display:none}}' +
    '.ch .drop{border:.4cqmin dashed var(--mute);border-radius:2cqmin;padding:3cqmin;display:flex;flex-direction:column;gap:1.6cqmin;align-items:flex-start;max-width:80%;background:#fff}.ch .drop img{max-height:24cqmin;border-radius:1cqmin;border:2px solid var(--line)}' +
    '.ch .drop label.go{display:inline-block}.ch .drop input{position:absolute;width:1px;height:1px;opacity:0}' +
    '.ch .stat2{display:flex;gap:3cqmin;align-items:flex-end;margin-top:2cqmin}.ch .stat2 div{display:flex;flex-direction:column;gap:1cqmin;align-items:center}.ch .stat2 i{display:block;width:16cqmin;border-radius:1cqmin 1cqmin 0 0;background:#CFCFC6}.ch .stat2 div:first-child i{background:var(--or)}.ch .stat2 b{font-size:4cqmin;font-weight:900}.ch .stat2 span{font-family:"IBM Plex Mono",monospace;font-size:1.8cqmin;color:#BDBDB5;text-transform:uppercase;letter-spacing:.15em}' +
    '.ch .fw{position:absolute;inset:0;pointer-events:none;overflow:hidden}.ch .fw i{position:absolute;width:2.6cqmin;height:2.6cqmin;border-radius:50%;opacity:0}.ch .sc.on .fw i{animation:chFw 1.6s ease-out infinite;animation-delay:var(--d)}' +
    '@keyframes chFw{0%{opacity:1;transform:translate(0,0) scale(.4)}100%{opacity:0;transform:translate(var(--x),var(--y)) scale(1)}}' +
    '@media (prefers-reduced-motion:reduce){.ch .sc .a,.ch .sc.on .pop{animation:none;opacity:1;transform:none}.ch .sc.on .fw i{animation:none}.ch .rv{transition:none}.ch .card .in{transition:none}.ch .seb.talk img{animation:none}}' +
    '.ch .trs{margin-top:14px}.ch .trs summary{cursor:pointer;font-weight:700;min-height:44px;display:flex;align-items:center}.ch .trs ol{margin:0;padding-left:22px}.ch .trs li{margin:0 0 8px}.ch .trs small{color:var(--mute)}';

  function injectCss() {
    if (document.getElementById('chCss')) return;
    var st = document.createElement('style'); st.id = 'chCss'; st.textContent = CSS; document.head.appendChild(st);
    if (!document.getElementById('chFont')) {
      var l = document.createElement('link'); l.id = 'chFont'; l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@500;700;800;900&display=swap';
      document.head.appendChild(l);
    }
  }

  function accent(t) { // met en orange la fin du titre (après « : » ou les deux derniers mots)
    t = esc(t); var i = t.lastIndexOf(' : ');
    if (i > 0) return t.slice(0, i + 3) + '<em>' + t.slice(i + 3) + '</em>';
    var w = t.split(' '); if (w.length < 4) return t;
    return w.slice(0, -2).join(' ') + ' <em>' + w.slice(-2).join(' ') + '</em>';
  }
  function kick(s) { return '<div class="kick a">' + esc(s.n + ' / 15 · ' + BRICKS[s.brick - 1]) + '</div>'; }
  function srcHtml(s) { return s.source ? '<div class="src a" style="--d:.9s">Source : ' + esc(s.source) + '</div>' : ''; }
  function counter(v) { var m = /^([^\d]*)([\d\s.,]+)(.*)$/.exec(String(v)); return m ? { pre: m[1], num: parseFloat(m[2].replace(/\s/g, '').replace(',', '.')), dec: (m[2].split(/[.,]/)[1] || '').length, post: m[3] } : null; }

  function screenHtml(s, ch) {
    var k = s.kind, h = '';
    if (k === 'welcome') {
      h = '<div class="sc dark wl" data-k="welcome"><div class="kick a">Chapitre ' + esc(ch.id) + ' · ' + esc(ch.duration || '4:30') + '</div>' +
        '<h2 class="t a" style="--d:.15s">' + accent(s.title) + '</h2><p class="a" style="--d:.3s;margin:0;font-size:max(14px,3cqmin);color:#BDBDB5;max-width:80%">' + esc(ch.objective || '') + '</p>' +
        '<button class="go a" style="--d:.45s" data-act="start">' + esc(s.cta || 'Commencer') + '</button></div>';
    } else if (k === 'goals') {
      h = '<div class="sc" data-k="goals">' + kick(s) + '<h2 class="t a" style="--d:.1s">' + esc(s.title) + '</h2><div class="goals">' +
        (s.items || []).map(function (x, i) { return '<div class="a" style="--d:' + (0.3 + i * 0.35) + 's"><b>0' + (i + 1) + '</b><strong>' + esc(x.verb) + '</strong> · ' + esc(x.text) + '</div>'; }).join('') +
        '</div><button class="go a" style="--d:1.4s" data-act="next">' + esc(s.cta || 'Suivant') + '</button></div>';
    } else if (k === 'mozi') {
      h = '<div class="sc vio mz" data-k="mozi"><div class="pop" style="--d:.05s">' + mozi() + '</div><div><div class="kick a" style="background:var(--vi);color:#fff">Mozi</div>' +
        '<div class="bub pop" style="--d:.35s;margin-top:2cqmin">« ' + esc(s.line || s.voice) + ' »</div><div class="scene a" style="--d:.8s">' + esc(s.scene || '') + '</div></div></div>';
    } else if (k === 'belief') {
      h = '<div class="sc vio" data-k="belief">' + kick(s).replace('class="kick a"', 'class="kick a" style="background:var(--vi);color:#fff"') + '<div class="mini">' + mozi() + '</div>' +
        '<div class="beats" style="margin-top:6cqmin">' + (s.beats || []).map(function (b, i) { return '<span class="pop" style="--d:' + (0.3 + i * 1.2) + 's">' + esc(b) + (i < 2 ? ',' : '') + '</span>'; }).join('') + '</div></div>';
    } else if (k === 'consequence') {
      h = '<div class="sc dark" data-k="consequence">' + kick(s) + '<div class="lines">' + (s.lines || [s.title]).map(function (l, i) { return '<span class="pop" style="--d:' + (0.4 + i * 1.4) + 's">' + esc(l) + '</span>'; }).join('') + '</div>' + srcHtml(s) + '</div>';
    } else if (k === 'stat') {
      var c = counter(s.value);
      h = '<div class="sc" data-k="stat">' + kick(s) + '<div class="big a" style="--d:.2s" data-count="' + (c ? esc(JSON.stringify(c)) : '') + '">' + esc(s.value) + '</div><div class="lab a" style="--d:.5s">' + esc(s.label || s.title) + '</div>' + srcHtml(s) + '</div>';
    } else if (k === 'steps') {
      h = '<div class="sc" data-k="steps">' + kick(s) + '<h2 class="t a" style="font-size:5.4cqmin">' + esc(s.title) + '</h2><div class="steps">' +
        (s.steps || []).map(function (x, i) { return '<div class="rv" data-rv="' + i + '"><b>0' + (i + 1) + ' / 0' + (s.steps.length) + '</b><strong>' + esc(x.label) + '</strong><p>' + esc(x.detail) + '</p></div>'; }).join('') + '</div>' + srcHtml(s) + '</div>';
    } else if (k === 'retrieval') {
      h = '<div class="sc" data-k="retrieval">' + kick(s) + '<div class="ask"><h2 class="t a" style="--d:.1s">' + esc(s.prompt || s.title) + '</h2>' + (s.context ? '<p class="ctx a" style="--d:.25s">' + esc(s.context) + '</p>' : '') +
        '<label class="a" style="--d:.35s"><span class="sr" style="position:absolute;left:-9999px">Ta réponse</span><textarea data-in="ret" placeholder="Écris ou dicte ta réponse…"></textarea></label>' +
        '<div class="row2 a" style="--d:.45s"><button class="go" data-act="ret-ok">Valider</button><button class="go ghost" data-act="dict" hidden>Dicter</button><button class="go ghost" data-act="ret-skip">Passer</button></div><div class="fb" data-out="ret" hidden></div></div></div>';
    } else if (k === 'quiz') {
      var q = s.card1 || {}, q2 = s.card2 || {};
      h = '<div class="sc" data-k="quiz">' + kick(s) + '<div class="cards">' +
        '<div class="card a" style="--d:.1s" data-card="1"><div class="in"><div class="f"><div class="mono" style="color:#BDBDB5">Carte 1 sur 2</div><h3>' + esc(q.question || s.title) + '</h3>' +
        (q.options || []).map(function (o, i) { return '<button class="opt" data-opt="' + i + '">' + esc(o) + '</button>'; }).join('') + '</div><div class="b" data-back="1"></div></div></div>' +
        '<div class="card a" style="--d:.3s" data-card="2"><div class="in"><div class="f"><div class="mono" style="color:#BDBDB5">Carte 2 sur 2</div><h3>' + esc(q2.question || '') + '</h3><p style="margin:0;font-size:2.4cqmin;color:#BDBDB5">Réfléchis, puis retourne la carte.</p><button class="go" data-act="flip2" style="margin-top:auto">Retourner la carte</button></div>' +
        '<div class="b"><div class="mono">Réponse</div><p>' + esc(q2.answer || '') + '</p><button class="go" data-act="next" style="margin-top:auto;font-size:2.6cqmin">Continuer</button></div></div></div></div></div>';
    } else if (k === 'tools') {
      var tl = s.tools || [];
      h = '<div class="sc" data-k="tools">' + kick(s) + '<h2 class="t a" style="--d:.1s">' + esc(s.title) + '</h2><div class="tools">' +
        (tl[0] ? '<div class="pop" style="--d:.4s"><strong>' + esc(tl[0].name) + '</strong><p>' + esc(tl[0].role) + '</p></div>' : '') + '<div class="plus pop" style="--d:.8s">+</div>' +
        (tl[1] ? '<div class="pop" style="--d:1.1s"><strong>' + esc(tl[1].name) + '</strong><p>' + esc(tl[1].role) + '</p></div>' : '') + '</div>' +
        '<div class="goal a" style="--d:1.6s">Un seul but : <span>' + esc(s.goal || '') + '</span></div>' + srcHtml(s) + '</div>';
    } else if (k === 'demo') {
      var st = s.steps || [];
      h = '<div class="sc" data-k="demo">' + kick(s) + '<h2 class="t a" style="font-size:5.4cqmin">' + esc(s.title) + '</h2><div class="demo">' +
        '<div class="phone a" style="--d:.2s" aria-hidden="true"><div>' + esc(s.tool || '') + st.map(function (x, i) { return '<i data-rv="' + i + '" class="rvp"></i>'; }).join('') + '</div></div>' +
        '<ol class="chk">' + st.map(function (x, i) { return '<li class="rv" data-rv="' + i + '">' + esc(x) + '</li>'; }).join('') + '</ol></div>' + srcHtml(s) + '</div>';
    } else if (k === 'action') {
      var ext = /^https?:/.test(s.url || '');
      h = '<div class="sc dark wl" data-k="action">' + kick(s) + '<h2 class="t pop" style="--d:.1s;font-size:11cqmin">' + esc(s.title) + '</h2><p class="a" style="--d:.3s;margin:0;font-size:3.4cqmin">' + esc(s.voice) + '</p>' +
        (ext ? '<a class="go a" style="--d:.5s;text-decoration:none" href="' + esc(s.url) + '" target="_blank" rel="noopener" data-act="ext">' + esc(s.cta) + ' ↗</a>' : '<button class="go a" style="--d:.5s" data-act="exo">' + esc(s.cta) + '</button>') +
        '<button class="go ghost a" style="--d:.7s;font-size:2.4cqmin" data-act="next">C’est fait, continuer</button></div>';
    } else if (k === 'proof') {
      h = '<div class="sc" data-k="proof">' + kick(s) + '<h2 class="t a" style="--d:.1s">' + esc(s.title) + '</h2><div class="drop a" style="--d:.3s"><p style="margin:0;font-size:2.8cqmin">' + esc(s.ask) + '</p><img data-out="proof" alt="Ta capture" hidden>' +
        '<div class="row2"><label class="go" style="font-size:2.6cqmin;padding:1.1cqmin 2.6cqmin">Déposer ma capture<input type="file" accept="image/*" data-in="proof"></label><button class="go ghost" data-act="later" style="font-size:2.4cqmin;padding:1.1cqmin 2.6cqmin">' + esc(s.later || 'Je le ferai plus tard') + '</button></div>' +
        '<div class="fb" data-out="later" hidden>' + esc(s.later_text || '') + '</div></div></div>';
    } else if (k === 'bravo') {
      var fw = ''; for (var i = 0; i < 28; i++) { var a = (i / 28) * Math.PI * 2, r = 18 + (i % 4) * 7; fw += '<i style="left:' + (30 + (i % 3) * 20) + '%;top:' + (35 + (i % 2) * 10) + '%;--x:' + Math.round(Math.cos(a) * r) + 'cqmin;--y:' + Math.round(Math.sin(a) * r) + 'cqmin;--d:' + ((i % 7) * 0.2).toFixed(1) + 's;background:' + ['#FF8D16', '#E56618', '#7B3FE4', '#141414'][i % 4] + '"></i>'; }
      h = '<div class="sc" data-k="bravo"><div class="fw" aria-hidden="true">' + fw + '</div>' + kick(s) + '<h2 class="t pop" style="--d:.1s;font-size:13cqmin">' + esc(s.title) + '</h2><div class="lab a" style="--d:.5s">' + esc(s.status || s.voice) + '</div>' + srcHtml(s) + '</div>';
    }
    return h;
  }

  function render(ch, o) {
    injectCss(); o = o || {};
    var total = sec(ch.screens[14].end);
    var w = [0, 0, 0, 0, 0, 0]; ch.screens.forEach(function (s) { w[s.brick - 1] += sec(s.end) - sec(s.tc); });
    return '<div class="ch' + (o.render ? ' render' : '') + '" data-ch="' + esc(ch.id) + '">' +
      '<div class="stage" tabindex="0" role="region" aria-label="Chapitre ' + esc(ch.id) + ' : ' + esc(ch.title) + '">' + ch.screens.map(function (s) { return screenHtml(s, ch); }).join('') +
      '<div class="seb talk"><img src="' + esc(o.avatar || 'assets/seb.png') + '" alt=""><span>Sébastien Paumier</span></div><div class="cc" aria-live="off"><p></p></div></div>' +
      '<div class="bricks">' + BRICKS.map(function (b, i) { return '<button data-brick="' + (i + 1) + '" style="--w:' + w[i] + '" aria-label="Brique ' + (i + 1) + ' : ' + esc(b) + '"><i><b></b></i><span>' + (i + 1) + '. ' + esc(b) + '</span></button>'; }).join('') + '</div>' +
      '<div class="ctl"><button data-c="prev" aria-label="Écran précédent">←</button><button class="pp" data-c="play" aria-label="Lecture">Lecture</button><button data-c="next" aria-label="Écran suivant">→</button>' +
      '<button data-c="cc" aria-pressed="true">Sous-titres</button><button data-c="snd" aria-pressed="true" hidden>Son</button><span class="tm"><span data-tm>0:00</span> / ' + fmt(total) + '</span></div>' +
      '<details class="trs"><summary>Transcription des 15 écrans</summary><ol>' + ch.screens.map(function (s) { return '<li><b>' + esc(s.title) + '</b> <small>(' + esc(s.tc) + ' – ' + esc(s.end) + ')</small><br>' + (s.kind === 'mozi' ? 'Mozi : ' : '') + esc(s.voice) + (s.source ? '<br><small>Source : ' + esc(s.source) + '</small>' : '') + '</li>'; }).join('') + '</ol></details></div>';
  }

  /* hooks : { state:{} (persistant), save(), onDone(), onQuiz(ok, sel), onProof(dataUrl), onExercise(), render:bool, media:{screens:[{audio}]} } */
  function mount(root, ch, hk) {
    hk = hk || {}; var st = hk.state || {};
    var stage = root.querySelector('.stage'), scs = stage.querySelectorAll('.sc'), cc = stage.querySelector('.cc p'), seb = stage.querySelector('.seb');
    var tm = root.querySelector('[data-tm]'), btnP = root.querySelector('[data-c=play]');
    var media = (ch.media && ch.media.screens) || [];
    var i = Math.min(14, st.i || 0), t0 = 0, el = 0, playing = false, raf = 0, au = null, sound = true, words = [], chunks = [], lastW = -1;
    var dur = ch.screens.map(function (s, k) { return (media[k] && media[k].dur) || Math.max(3, sec(s.end) - sec(s.tc)); });
    var starts = []; dur.reduce(function (a, d, k) { starts[k] = a; return a + d; }, 0);
    if (media.some(function (m) { return m && m.audio; })) root.querySelector('[data-c=snd]').hidden = false;

    function show(n, keep) {
      if (au) { au.pause(); au = null; }
      i = Math.max(0, Math.min(14, n)); el = 0; t0 = performance.now(); lastW = -1;
      [].forEach.call(scs, function (x, k) { x.classList.toggle('on', k === i); x.setAttribute('aria-hidden', String(k !== i)); if (k !== i) x.setAttribute('inert', ''); else x.removeAttribute('inert'); });
      var s = ch.screens[i]; words = String(s.voice || '').split(/\s+/).filter(Boolean); chunks = []; var cur = [];
      words.forEach(function (w, k) { cur.push(k); if (cur.length >= 14 || (cur.length >= 6 && /[.!?;:]$/.test(w))) { chunks.push(cur); cur = []; } }); if (cur.length) chunks.push(cur);
      seb.classList.toggle('off', s.kind === 'mozi' || s.kind === 'belief');
      [].forEach.call(scs[i].querySelectorAll('.rv'), function (r) { r.classList.remove('in'); });
      var bc = scs[i].querySelector('[data-count]'); if (bc && bc.getAttribute('data-count')) bc.textContent = JSON.parse(bc.getAttribute('data-count')).pre + '0';
      st.i = i; if (s.kind === 'bravo') { st.done = 1; hk.onDone && hk.onDone(); } hk.save && hk.save();
      if (playing && media[i] && media[i].audio && sound) { au = new Audio(media[i].audio); au.play().catch(function () {}); }
      paint(); restore(s);
    }
    function restore(s) {
      var sc = scs[i];
      if (s.kind === 'retrieval' && st.ret) { sc.querySelector('[data-in=ret]').value = st.ret; }
      if (s.kind === 'quiz' && st.qz != null) back(st.qz, true);
      if (s.kind === 'proof' && hk.proof) { var im = sc.querySelector('[data-out=proof]'); im.src = hk.proof; im.hidden = false; }
    }
    function paint() {
      var s = ch.screens[i], d = dur[i], p = Math.min(1, el / d);
      // karaoké : mots déjà dits en orange, mot courant en blanc, reste estompé
      var n = Math.floor(p * words.length + (p > 0 ? 1 : 0));
      if (n !== lastW) {
        lastW = n; var cur = chunks[0] || [];
        for (var q = 0; q < chunks.length; q++) { if (chunks[q][0] <= Math.max(0, n - 1)) cur = chunks[q]; }
        var said = cur.filter(function (k) { return k < n; }), rest = cur.filter(function (k) { return k >= n; });
        cc.innerHTML = (s.kind === 'mozi' ? '<b style="color:#C9B4FF">Mozi : </b>' : '') + '<b>' + esc(said.map(function (k) { return words[k]; }).join(' ')) + '</b> <i>' + esc(rest.map(function (k) { return words[k]; }).join(' ')) + '</i>';
        cc.parentNode.style.visibility = words.length ? 'visible' : 'hidden';
      }
      [].forEach.call(scs[i].querySelectorAll('[data-rv]'), function (r) { var k = +r.getAttribute('data-rv'), m = scs[i].querySelectorAll('.rv').length || 1; r.classList.toggle('in', el >= d * (k + 0.4) / (m + 0.6)); r.classList.toggle('on', r.classList.contains('in')); });
      var bc = scs[i].querySelector('[data-count]'); if (bc && bc.getAttribute('data-count')) { var c = JSON.parse(bc.getAttribute('data-count')), v = c.num * Math.min(1, el / 1.4); bc.textContent = c.pre + v.toFixed(c.dec).replace('.', ',') + c.post; }
      var g = starts[i] + Math.min(el, d); tm.textContent = fmt(g);
      [].forEach.call(root.querySelectorAll('[data-brick]'), function (b) {
        var bi = +b.getAttribute('data-brick'), a = 0, z = 0;
        ch.screens.forEach(function (x, k) { if (x.brick === bi) { z += dur[k]; if (k < i) a += dur[k]; else if (k === i) a += Math.min(el, d); } });
        b.querySelector('b').style.setProperty('--p', Math.round(100 * a / z) + '%'); b.classList.toggle('cur', bi === s.brick);
      });
    }
    function tick(now) {
      raf = 0; if (!playing) return;
      el = au && !isNaN(au.currentTime) && au.currentTime > 0 ? au.currentTime : (now - t0) / 1000;
      paint();
      var s = ch.screens[i];
      if (el >= dur[i]) {
        if (GATE[s.kind] || i === 14) { el = dur[i]; paint(); seb.classList.remove('talk'); return; }
        show(i + 1);
      }
      raf = requestAnimationFrame(tick);
    }
    function play(on) {
      playing = on; btnP.textContent = on ? 'Pause' : 'Lecture'; btnP.setAttribute('aria-label', on ? 'Pause' : 'Lecture');
      seb.classList.toggle('talk', on);
      if (on) { t0 = performance.now() - el * 1000; if (au) au.play().catch(function () {}); else if (media[i] && media[i].audio && sound && el < dur[i]) { au = new Audio(media[i].audio); au.currentTime = el; au.play().catch(function () {}); } if (!raf) raf = requestAnimationFrame(tick); }
      else { if (au) au.pause(); if (raf) cancelAnimationFrame(raf); raf = 0; }
    }
    function next() { if (i < 14) { show(i + 1); if (!playing) play(true); } }
    function back(sel, silent) {
      var q = ch.screens[i].card1 || {}, ok = sel === q.answer, b = scs[i].querySelector('[data-back="1"]');
      b.innerHTML = '<div class="mono">' + (ok ? 'Bonne réponse' : 'Pas tout à fait') + '</div><p class="' + (ok ? 'ok' : 'ko') + '">' + esc((q.whys || [])[sel] || '') + '</p>' + (ok ? '' : '<p><b>La bonne réponse :</b> ' + esc((q.options || [])[q.answer]) + '</p>') + '<p>' + esc(q.feedback || '') + '</p>';
      scs[i].querySelector('[data-card="1"]').classList.add('flip');
      var back2 = b.querySelector('[data-act=c2]'); if (!back2) { b.insertAdjacentHTML('beforeend', '<button class="go" data-act="c2" style="font-size:2.4cqmin;padding:.9cqmin 2.4cqmin;margin-top:auto">Carte 2</button>'); }
      if (!silent) { st.qz = sel; hk.onQuiz && hk.onQuiz(ok, sel); hk.save && hk.save(); }
    }

    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act],[data-c],[data-brick],[data-opt]'); if (!b) return;
      var a = b.getAttribute('data-act'), c = b.getAttribute('data-c');
      if (b.hasAttribute('data-brick')) { var bi = +b.getAttribute('data-brick'); for (var k = 0; k < 15; k++) if (ch.screens[k].brick === bi) { show(k); break; } return; }
      if (b.hasAttribute('data-opt')) { back(+b.getAttribute('data-opt')); return; }
      if (c === 'play') play(!playing); else if (c === 'prev') show(i - 1); else if (c === 'next') { show(i + 1); }
      else if (c === 'cc') { var on = root.classList.toggle('nocc'); b.setAttribute('aria-pressed', String(!on)); }
      else if (c === 'snd') { sound = !sound; b.setAttribute('aria-pressed', String(sound)); if (au) au.muted = !sound; }
      if (a === 'start' || a === 'next') next();
      else if (a === 'flip2') b.closest('.card').classList.add('flip');
      else if (a === 'c2') { scs[i].querySelector('.cards').classList.add('c1'); var c2 = scs[i].querySelector('[data-card="2"] .go'); if (c2) c2.focus(); }
      else if (a === 'exo') hk.onExercise && hk.onExercise();
      else if (a === 'later') { scs[i].querySelector('[data-out=later]').hidden = false; st.later = 1; st.done = 1; hk.onDone && hk.onDone(); hk.save && hk.save(); }
      else if (a === 'ret-skip') { var f0 = scs[i].querySelector('[data-out=ret]'); f0.hidden = false; f0.innerHTML = '<b>Une réponse possible :</b> ' + esc(ch.screens[i].model_answer); setTimeout(next, 2600); }
      else if (a === 'ret-ok') {
        var s = ch.screens[i], txt = scs[i].querySelector('[data-in=ret]').value.trim(), f = scs[i].querySelector('[data-out=ret]');
        st.ret = txt.slice(0, 300); hk.save && hk.save();
        var hit = (s.keywords || []).filter(function (kw) { return norm(txt).indexOf(norm(kw)) >= 0 || norm(kw).split(' ').some(function (w) { return w.length > 4 && norm(txt).indexOf(w.slice(0, 5)) >= 0; }); });
        f.hidden = false;
        f.innerHTML = (txt ? (hit.length ? '<b>Bien vu :</b> ' + hit.map(function (h) { return '<mark>' + esc(h) + '</mark>'; }).join(' ') + '. ' : '<b>Pas encore.</b> ') : '') +
          '<b>Ce qu’il fallait trouver :</b> ' + esc(s.model_answer) + '<br><button class="go" data-act="next" style="margin-top:1.2cqmin;font-size:2.4cqmin;padding:.9cqmin 2.4cqmin">Continuer</button>';
      } else if (a === 'dict') {
        var SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR) return;
        var r = new SR(); r.lang = 'fr-FR'; r.interimResults = false; var ta = scs[i].querySelector('[data-in=ret]');
        b.textContent = 'J’écoute…'; r.onresult = function (ev) { ta.value = (ta.value ? ta.value + ' ' : '') + ev.results[0][0].transcript; }; r.onend = function () { b.textContent = 'Dicter'; }; r.start();
      }
    });
    root.addEventListener('change', function (e) {
      var inp = e.target.closest('[data-in=proof]'); if (!inp || !inp.files[0]) return;
      var fr = new FileReader(); fr.onload = function () {
        var img = new Image(); img.onload = function () {
          var k = Math.min(1, 480 / Math.max(img.width, img.height)), cv = document.createElement('canvas'); cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
          cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height); var u = cv.toDataURL('image/jpeg', 0.7);
          var im = scs[i].querySelector('[data-out=proof]'); im.src = u; im.hidden = false; st.proof = 1; hk.onProof && hk.onProof(u); hk.save && hk.save(); setTimeout(next, 900);
        }; img.src = fr.result;
      }; fr.readAsDataURL(inp.files[0]);
    });
    stage.addEventListener('keydown', function (e) {
      if (e.target !== stage) return;
      if (e.key === ' ' || e.key === 'k') { e.preventDefault(); play(!playing); } else if (e.key === 'ArrowRight') show(i + 1); else if (e.key === 'ArrowLeft') show(i - 1);
    });
    if (window.SpeechRecognition || window.webkitSpeechRecognition) [].forEach.call(root.querySelectorAll('[data-act=dict]'), function (b) { b.hidden = false; });
    show(i);
    var api = {
      show: function (n) { show(n); }, play: play, durations: dur, total: starts[14] + dur[14],
      seek: function (n, t) { show(n); el = t || 0; t0 = performance.now() - el * 1000; paint(); },
      destroy: function () { play(false); }
    };
    if (hk.render) { window.__chapter = api; }
    return api;
  }

  window.EcoChapter = { render: render, mount: mount, mozi: mozi, BRICKS: BRICKS };
})();

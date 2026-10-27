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
    '.ch .src{position:relative;z-index:1;margin-top:auto;padding-right:16cqmin;font-size:max(11px,1.9cqmin);color:var(--mute);line-height:1.35}' +
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
    '@container (max-aspect-ratio:1/1){.ch .cards{flex-direction:column}.ch .card[data-card="2"]{display:none}.ch .cards.c1 .card[data-card="1"]{display:none}.ch .cards.c1 .card[data-card="2"]{display:block}.ch .steps{grid-template-columns:1fr}.ch .mz{flex-direction:column;align-items:flex-start}.ch .mz .mozi{width:30cqmin}.ch .goals{max-width:100%}.ch .lab{max-width:100%}.ch .seb span{display:none}.ch .seb img{width:18cqmin;height:18cqmin}.ch .seb{bottom:9cqmin}.ch .cc{right:4cqmin;bottom:2cqmin}.ch .sc{padding-bottom:30cqmin}}' +
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
    /* ---------- Motion design (planches « Formats vidéo ») ---------- */
    '.ch .sc{transform:translateX(4cqmin);transition:opacity .45s,visibility .45s,transform .55s cubic-bezier(.2,.8,.2,1)}.ch .sc.on{transform:none}' +
    '.ch .bgw{position:absolute;left:-2cqmin;bottom:12cqmin;font-weight:900;font-size:26cqmin;letter-spacing:-.06em;line-height:.8;color:currentColor;opacity:.045;white-space:nowrap;pointer-events:none;z-index:0}' +
    '.ch .sc.on .bgw{animation:chDrift 14s linear forwards}@keyframes chDrift{from{transform:translateX(0)}to{transform:translateX(-12cqmin)}}' +
    '.ch .sc>*:not(.bgw):not(.bcard):not(.fw):not(.pose):not(.src){position:relative;z-index:1}' +
    '.ch .bcard{position:absolute;inset:0;z-index:6;background:var(--ink);color:#fff;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:2cqmin;padding:0 8cqmin;pointer-events:none;opacity:0}' +
    '.ch .bcard span{font-family:"IBM Plex Mono",monospace;font-weight:600;font-size:2.6cqmin;letter-spacing:.3em;background:var(--or);color:var(--ink);padding:.6cqmin 1.6cqmin;border-radius:.8cqmin}.ch .bcard b{font-size:9cqmin;font-weight:900;letter-spacing:-.04em;line-height:1}' +
    '.ch .sc.on .bcard{animation:chCard 1.5s cubic-bezier(.7,0,.3,1) forwards}@keyframes chCard{0%{opacity:1;clip-path:inset(0 0 0 0)}55%{opacity:1;clip-path:inset(0 0 0 0)}100%{opacity:1;clip-path:inset(0 0 0 100%)}}' +
    '.ch .sc.on .mozi{animation:chBob 2.2s ease-in-out infinite}@keyframes chBob{50%{transform:translateY(-1.6cqmin) rotate(-2deg)}}' +
    '.ch .mzfx{position:absolute;inset:0;pointer-events:none;z-index:0}.ch .mzfx svg{position:absolute;width:5cqmin;height:5cqmin;opacity:0}.ch .sc.on .mzfx svg{animation:chFloat 2.6s ease-out infinite;animation-delay:var(--d)}' +
    '@keyframes chFloat{0%{opacity:0;transform:translateY(4cqmin) scale(.6)}25%{opacity:1}100%{opacity:0;transform:translateY(-18cqmin) scale(1.1) rotate(20deg)}}' +
    '.ch .sc.on .beats span{animation:chSlam .6s cubic-bezier(.2,1.8,.4,1) both;animation-delay:var(--d)}@keyframes chSlam{0%{opacity:0;transform:scale(2.2) rotate(-6deg)}70%{opacity:1;transform:scale(.95)}85%{transform:translateX(-.6cqmin)}100%{opacity:1;transform:none}}' +
    '.ch .beats .uline{display:block;height:1.2cqmin;width:0;background:var(--vi);border-radius:1cqmin;margin-top:2cqmin}.ch .sc.on .beats .uline{animation:chLine .8s ease-out forwards;animation-delay:var(--d)}@keyframes chLine{to{width:70%}}' +
    '.ch .sc.on .lines span{animation:chStamp .5s cubic-bezier(.3,1.6,.5,1) both;animation-delay:var(--d)}@keyframes chStamp{0%{opacity:0;transform:scale(1.8) rotate(-4deg)}100%{opacity:1;transform:rotate(-1.5deg)}}' +
    '.ch .sc[data-k=consequence].on{animation:chShake .4s 1.9s}@keyframes chShake{25%{transform:translateX(-.8cqmin)}75%{transform:translateX(.8cqmin)}}' +
    '.ch .sbar{width:70%;height:3.4cqmin;border-radius:2cqmin;background:#E6E7E0;overflow:hidden;margin-top:1cqmin}.ch .sbar i{display:block;height:100%;width:0;background:var(--or);border-radius:2cqmin}.ch .sc.on .sbar i{animation:chFill 1.4s .3s cubic-bezier(.2,.8,.2,1) forwards}@keyframes chFill{to{width:var(--w)}}' +
    '.ch .track{position:relative;height:.8cqmin;background:#E6E7E0;border-radius:1cqmin;margin-top:-1cqmin}.ch .track i{position:absolute;left:0;top:0;bottom:0;width:var(--t,0%);background:var(--or);border-radius:1cqmin;transition:width .6s}' +
    '.ch .steps>div.in{border-color:var(--or);box-shadow:0 1.2cqmin 3cqmin rgba(229,102,24,.15)}' +
    '.ch .sc.on .tools .fromL{animation:chFromL .7s .3s cubic-bezier(.2,.8,.2,1) both}.ch .sc.on .tools .fromR{animation:chFromR .7s .9s cubic-bezier(.2,.8,.2,1) both}.ch .sc.on .tools .plus{animation:chSpin .7s .6s both}' +
    '@keyframes chFromL{from{opacity:0;transform:translateX(-14cqmin)}}@keyframes chFromR{from{opacity:0;transform:translateX(14cqmin)}}@keyframes chSpin{from{opacity:0;transform:rotate(-180deg) scale(.3)}}' +
    '.ch .phone i{position:relative;transition:background .4s}.ch .phone .hot{display:none;position:absolute;right:-1cqmin;top:50%;transform:translate(100%,-50%);white-space:nowrap;border:0;border-radius:99px;background:var(--or);color:var(--ink);font:inherit;font-weight:900;font-size:max(12px,1.8cqmin);padding:.6cqmin 1.4cqmin;cursor:pointer;min-height:32px;z-index:2}' +
    '.ch .sc.try .phone .hot.cur{display:block;animation:chPulse 1.2s infinite}.ch .sc.try .phone{display:flex!important;width:30cqmin}.ch .sc.try .chk li:not(.in){opacity:.35}' +
    '@keyframes chPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,141,22,.7)}50%{box-shadow:0 0 0 1.4cqmin rgba(255,141,22,0)}}' +
    '.ch .sc.on .go.pulse{animation:chPulse 1.6s 1s infinite}' +
    '.ch .rings{display:flex;gap:5cqmin;align-items:center;margin-top:1cqmin}.ch .rg{display:flex;flex-direction:column;align-items:center;gap:1cqmin}.ch .rg svg{width:20cqmin;height:20cqmin;transform:rotate(-90deg)}.ch .rg circle{fill:none;stroke-width:10}.ch .rg .bg{stroke:#E6E7E0}' +
    '.ch .rg .fg{stroke:var(--or);stroke-linecap:round;stroke-dasharray:283;stroke-dashoffset:283}.ch .rg.them .fg{stroke:#9A9B93}.ch .sc.on .rg .fg{animation:chRing 1.6s .6s cubic-bezier(.2,.8,.2,1) forwards}@keyframes chRing{to{stroke-dashoffset:var(--o)}}' +
    '@property --v{syntax:"<number>";inherits:false;initial-value:0}' + '.ch .rg .dial{display:block;width:20cqmin;height:20cqmin;border-radius:50%;background:conic-gradient(var(--or) calc(var(--v) * 1%),#E6E7E0 0);-webkit-mask:radial-gradient(farthest-side,transparent 72%,#000 73%);mask:radial-gradient(farthest-side,transparent 72%,#000 73%)}.ch .rg.them .dial{background:conic-gradient(#9A9B93 calc(var(--v) * 1%),#E6E7E0 0)}.ch .sc.on .rg .dial{animation:chDial 1.6s .6s cubic-bezier(.2,.8,.2,1) forwards}@keyframes chDial{to{--v:var(--t)}}' +
    '.ch .rg b{font-size:4.4cqmin;font-weight:900}.ch .rg span{font-family:"IBM Plex Mono",monospace;font-size:max(11px,1.8cqmin);letter-spacing:.15em;text-transform:uppercase;color:var(--mute)}' +
    '.ch .tick svg{width:18cqmin;height:18cqmin}.ch .tick path{fill:none;stroke:var(--or);stroke-width:9;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:120;stroke-dashoffset:120}.ch .sc.on .tick path{animation:chDraw .9s .5s ease-out forwards}@keyframes chDraw{to{stroke-dashoffset:0}}' +
    '.ch .eq{display:flex;gap:.5cqmin;align-items:flex-end;height:2.6cqmin;opacity:0;transition:opacity .3s}.ch .seb.talk .eq{opacity:1}.ch .eq i{width:.7cqmin;background:var(--or);border-radius:.3cqmin;height:30%}.ch .seb.talk .eq i{animation:chEq .9s ease-in-out infinite;animation-delay:var(--d)}@keyframes chEq{50%{height:100%}}' +
    '@media (prefers-reduced-motion:reduce){.ch .sc,.ch .sc.on{transform:none;transition:opacity .2s}.ch .sc.on .bgw,.ch .sc.on .mozi,.ch .sc.on .mzfx svg,.ch .sc[data-k=consequence].on,.ch .seb.talk .eq i,.ch .sc.on .go.pulse{animation:none}.ch .sc.on .bcard{animation:none;opacity:0}}' +
    /* ---------- Sébastien Paumier en pied (poses illustrées) ---------- */
    '.ch .pose{position:absolute;right:3cqmin;bottom:0;height:90%;width:auto;max-width:none;max-height:none;z-index:2;pointer-events:none;transform-origin:50% 100%;filter:drop-shadow(0 1.4cqmin 1.6cqmin rgba(20,20,20,.18));opacity:0}' +
    '.ch .sc.on .pose{animation:chPoseIn .7s .15s cubic-bezier(.2,1.4,.4,1) forwards,chBreathe 3.2s 1s ease-in-out infinite}' +
    '@keyframes chPoseIn{0%{opacity:0;transform:translateY(8cqmin) scale(.96)}100%{opacity:1;transform:none}}@keyframes chBreathe{0%,100%{opacity:1;transform:none}50%{opacity:1;transform:scaleY(1.012) translateY(-.2cqmin)}}' +
    '.ch .sc.dark .pose{filter:drop-shadow(0 0 2.4cqmin rgba(255,141,22,.25))}' +
    '.ch .sc.hp{padding-right:calc(8cqmin + 46cqh)}.ch .stage.hp .cc{right:calc(4cqmin + 44cqh)}.ch .stage.hp .seb{opacity:0}' +
    '.ch .sc.hp .src{padding-right:0}' +
    '@container (max-aspect-ratio:1/1){.ch .pose{height:36%;right:2cqmin;bottom:9cqh}.ch .sc.hp{padding-right:6cqmin;padding-bottom:calc(30cqmin + 36cqh)}.ch .stage.hp .cc{right:4cqmin}.ch .sc.hp .src{padding-right:0}.ch .sc.hp:is([data-k=steps],[data-k=quiz],[data-k=retrieval],[data-k=demo],[data-k=proof],[data-k=tools]) .pose{display:none}.ch .sc.hp:is([data-k=steps],[data-k=quiz],[data-k=retrieval],[data-k=demo],[data-k=proof],[data-k=tools]){padding-bottom:30cqmin}}' +
    '@media (prefers-reduced-motion:reduce){.ch .sc.on .pose{animation:none;opacity:1}}' +
    /* ---------- Mode vidéo : un seul départ, lecture continue ---------- */
    '.ch .kick,.ch .bcard,.ch .sc [data-act=next],.ch .sc [data-act=try],.ch .sc [data-out=try],.ch .sc[data-k=goals] .go{display:none!important}' +
    '.ch .vbar{display:flex;align-items:center;gap:10px;margin-top:10px}.ch .vbar button{min-height:44px;min-width:44px;border:1px solid var(--line);background:#fff;border-radius:8px;font:inherit;font-weight:800;padding:0 10px;cursor:pointer;color:var(--ink)}' +
    '.ch .vbar .pp{background:var(--or);border-color:var(--or);display:grid;place-items:center}.ch .vbar .pp svg{width:20px;height:20px;fill:var(--ink)}.ch .vbar .pp .ic-pause{display:none}.ch.playing .vbar .pp .ic-pause{display:block}.ch.playing .vbar .pp .ic-play{display:none}' +
    '.ch .tl{flex:1;height:8px;border-radius:4px;background:#D9DAD2;cursor:pointer;position:relative;min-width:60px}.ch .tl i{position:absolute;left:0;top:0;bottom:0;width:var(--p,0%);background:var(--or);border-radius:4px}.ch .tl:focus-visible{outline:3px solid #1A73E8;outline-offset:3px}' +
    '.ch .vbar .tm{font-family:"IBM Plex Mono",monospace;font-size:13px;color:var(--mute);white-space:nowrap}.ch .vbar button[aria-pressed=false]{opacity:.5}' +
    '.ch .bigplay{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:15cqmin;height:15cqmin;min-width:56px;min-height:56px;border-radius:50%;border:0;background:var(--or);display:none;place-items:center;cursor:pointer;z-index:8;box-shadow:0 1cqmin 4cqmin rgba(0,0,0,.25)}.ch .bigplay svg{width:45%;height:45%;fill:var(--ink);margin-left:8%}' +
    '.ch.started:not(.playing) .bigplay{display:grid}.ch.render .bigplay{display:none!important}.ch .stage{cursor:pointer}.ch .stage :is(button,a,input,textarea,label,.card){cursor:auto}.ch .stage :is(button,a,label){cursor:pointer}' +
    '.ch .stage:fullscreen{width:100vw;height:100vh;aspect-ratio:auto;border:0;border-radius:0}' +
    '@media (max-width:700px){.ch .vbar{gap:6px}.ch .vbar .tm{display:none}}' +
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

  var STOP = /^(avec|dans|pour|sans|sous|chez|entre|depuis|avant|après|cette|votre|notre|leurs?|elles?|nous|vous|quelle|quel|comment|pourquoi)$/i;
  function bgword(t) { var w = String(t || '').replace(/[«»"!?.,:;()]/g, ' ').split(/\s+/).filter(function (x) { return x.length >= 5 && !STOP.test(x); }); w.sort(function (a, b) { return b.length - a.length; }); return w[0] ? w[0].toUpperCase() : ''; }
  function bgw(s) { var w = bgword(s.title); return w ? '<div class="bgw" aria-hidden="true">' + esc(w) + '</div>' : ''; }
  var FIRST = { 3: 1, 5: 1, 6: 1, 10: 1, 14: 1 };
  function bcard(s) { return FIRST[s.n] ? '<div class="bcard" aria-hidden="true"><span>Brique 0' + s.brick + '</span><b>' + esc(BRICKS[s.brick - 1]) + '</b></div>' : ''; }
  var STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z" fill="#8A5CF0"/></svg>';
  function pct(t) { var m = /(\d+(?:[.,]\d+)?)\s*%/.exec(String(t || '')); return m ? parseFloat(m[1].replace(',', '.')) : null; }
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
      h = '<div class="sc vio mz" data-k="mozi"><div class="mzfx" aria-hidden="true">' + [12, 22, 30, 18, 26].map(function (x, j) { return STAR.replace('<svg ', '<svg style="left:' + x + '%;top:' + (40 + (j % 2) * 12) + '%;--d:' + (j * 0.45).toFixed(2) + 's" '); }).join('') + '</div><div class="pop" style="--d:.05s">' + mozi() + '</div><div><div class="kick a" style="background:var(--vi);color:#fff">Mozi</div>' +
        '<div class="bub pop" style="--d:.35s;margin-top:2cqmin">« ' + esc(s.line || s.voice) + ' »</div><div class="scene a" style="--d:.8s">' + esc(s.scene || '') + '</div></div></div>';
    } else if (k === 'belief') {
      h = '<div class="sc vio" data-k="belief">' + kick(s).replace('class="kick a"', 'class="kick a" style="background:var(--vi);color:#fff"') + '<div class="mini">' + mozi() + '</div>' +
        '<div class="beats" style="margin-top:6cqmin">' + (s.beats || []).map(function (b, i) { return '<span style="--d:' + (0.3 + i * 1.2) + 's">' + esc(b) + (i < 2 ? ',' : '') + '</span>'; }).join('') + '<i class="uline" style="--d:' + (0.4 + (s.beats || []).length * 1.2) + 's"></i></div></div>';
    } else if (k === 'consequence') {
      h = '<div class="sc dark" data-k="consequence">' + kick(s) + '<div class="lines">' + (s.lines || [s.title]).map(function (l, i) { return '<span style="--d:' + (0.4 + i * 1.4) + 's">' + esc(l) + '</span>'; }).join('') + '</div>' + srcHtml(s) + '</div>';
    } else if (k === 'stat') {
      var c = counter(s.value);
      h = '<div class="sc" data-k="stat">' + kick(s) + '<div class="big a" style="--d:.2s" data-count="' + (c ? esc(JSON.stringify(c)) : '') + '">' + esc(s.value) + '</div><div class="lab a" style="--d:.5s">' + esc(s.label || s.title) + '</div>' + (pct(s.value) != null && pct(s.value) <= 100 ? '<div class="sbar a" style="--d:.3s" aria-hidden="true"><i style="--w:' + pct(s.value) + '%"></i></div>' : '') + srcHtml(s) + '</div>';
    } else if (k === 'steps') {
      h = '<div class="sc" data-k="steps">' + kick(s) + '<h2 class="t a" style="font-size:5.4cqmin">' + esc(s.title) + '</h2><div class="steps">' +
        (s.steps || []).map(function (x, i) { return '<div class="rv" data-rv="' + i + '"><b>0' + (i + 1) + ' / 0' + (s.steps.length) + '</b><strong>' + esc(x.label) + '</strong><p>' + esc(x.detail) + '</p></div>'; }).join('') + '</div><div class="track a" style="--d:.2s" aria-hidden="true"><i data-track></i></div>' + srcHtml(s) + '</div>';
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
        (tl[0] ? '<div class="fromL"><strong>' + esc(tl[0].name) + '</strong><p>' + esc(tl[0].role) + '</p></div>' : '') + '<div class="plus">+</div>' +
        (tl[1] ? '<div class="fromR"><strong>' + esc(tl[1].name) + '</strong><p>' + esc(tl[1].role) + '</p></div>' : '') + '</div>' +
        '<div class="goal a" style="--d:1.6s">Un seul but : <span>' + esc(s.goal || '') + '</span></div>' + srcHtml(s) + '</div>';
    } else if (k === 'demo') {
      var st = s.steps || [];
      h = '<div class="sc" data-k="demo">' + kick(s) + '<h2 class="t a" style="font-size:5.4cqmin">' + esc(s.title) + '</h2><div class="demo">' +
        '<div class="phone a" style="--d:.2s"><div>' + esc(s.tool || '') + st.map(function (x, i) { var lab = String(x).split(/\s*:\s*/)[0]; return '<i data-rv="' + i + '" class="rvp"><button class="hot" data-hot="' + i + '" tabindex="-1">' + esc(lab.length > 22 ? lab.slice(0, 20) + '…' : lab) + '</button></i>'; }).join('') + '</div></div>' +
        '<ol class="chk">' + st.map(function (x, i) { return '<li class="rv" data-rv="' + i + '">' + esc(x) + '</li>'; }).join('') + '</ol></div>' +
        '<div class="row2 a" style="--d:.6s"><button class="go ghost" data-act="try" style="font-size:max(13px,2.3cqmin);padding:.8cqmin 2.2cqmin">Essayer la démo</button><span class="fb" data-out="try" hidden></span></div>' + srcHtml(s) + '</div>';
    } else if (k === 'action') {
      var ext = /^https?:/.test(s.url || '');
      h = '<div class="sc dark wl" data-k="action">' + kick(s) + '<h2 class="t pop" style="--d:.1s;font-size:11cqmin">' + esc(s.title) + '</h2><p class="a" style="--d:.3s;margin:0;font-size:3.4cqmin">' + esc(s.voice) + '</p>' +
        (ext ? '<a class="go a pulse" style="--d:.5s;text-decoration:none" href="' + esc(s.url) + '" target="_blank" rel="noopener" data-act="ext">' + esc(s.cta) + ' ↗</a>' : '<button class="go a pulse" style="--d:.5s" data-act="exo">' + esc(s.cta) + '</button>') +
        '<button class="go ghost a" style="--d:.7s;font-size:2.4cqmin" data-act="next">C’est fait, continuer</button></div>';
    } else if (k === 'proof') {
      h = '<div class="sc" data-k="proof">' + kick(s) + '<h2 class="t a" style="--d:.1s">' + esc(s.title) + '</h2><div class="drop a" style="--d:.3s"><p style="margin:0;font-size:2.8cqmin">' + esc(s.ask) + '</p><img data-out="proof" alt="Ta capture" hidden>' +
        '<div class="row2"><label class="go" style="font-size:2.6cqmin;padding:1.1cqmin 2.6cqmin">Déposer ma capture<input type="file" accept="image/*" data-in="proof"></label><button class="go ghost" data-act="later" style="font-size:2.4cqmin;padding:1.1cqmin 2.6cqmin">' + esc(s.later || 'Je le ferai plus tard') + '</button></div>' +
        '<div class="fb" data-out="later" hidden>' + esc(s.later_text || '') + '</div></div></div>';
    } else if (k === 'bravo') {
      var fw = ''; for (var i = 0; i < 48; i++) { var a = (i / 48) * Math.PI * 2 * 3, r = 14 + (i % 5) * 7; fw += '<i style="left:' + (25 + (i % 3) * 25) + '%;top:' + (30 + (i % 3) * 12) + '%;--x:' + Math.round(Math.cos(a) * r) + 'cqmin;--y:' + Math.round(Math.sin(a) * r) + 'cqmin;--d:' + ((i % 7) * 0.2).toFixed(1) + 's;background:' + ['#FF8D16', '#E56618', '#7B3FE4', '#141414'][i % 4] + '"></i>'; }
      h = '<div class="sc" data-k="bravo"><div class="fw" aria-hidden="true">' + fw + '</div>' + kick(s) + '<h2 class="t pop" style="--d:.1s;font-size:13cqmin">' + esc(s.title) + '</h2><div class="lab a" style="--d:.5s">' + esc(s.status || s.voice) + '</div>' +
        (function () { var tx = (s.status || '') + ' ' + (s.voice || ''), p = /moyenne/i.test(tx) ? pct(tx) : null; if (p != null && p > 0 && p < 100) { var r = function (v, lab, cls) { return '<div class="rg ' + cls + '"><i class="dial" aria-hidden="true" style="--t:' + v + '"></i><b>' + String(v).replace('.', ',') + ' %</b><span>' + lab + '</span></div>'; }; return '<div class="rings a" style="--d:.4s">' + r(100, 'Toi', 'you') + r(p, 'La moyenne', 'them') + '</div>'; } return '<div class="tick a" style="--d:.3s" aria-hidden="true"><svg viewBox="0 0 100 100"><path d="M18 52 L42 74 L84 28"/></svg></div>'; })() +
        srcHtml(s) + '</div>';
    }
    if (k !== 'welcome') h = h.replace(/^(<div class="sc[^>]*>)/, function (m) { return m + (k === 'mozi' ? '' : bgw(s)) + bcard(s); });
    if (s.pose && k !== 'mozi') h = h.replace(/^<div class="sc/, '<div class="sc hp').replace(/<\/div>$/, '<img class="pose" src="' + esc((ch._assets || 'assets/') + 'seb/' + s.pose + '.webp') + '" alt="">' + '</div>');
    return h;
  }

  function render(ch, o) {
    injectCss(); o = o || {}; ch._assets = o.assets || 'assets/';
    var md = (ch.media && ch.media.screens) || [], total = md.length === 15 ? md.reduce(function (t, m) { return t + (m.dur || 0); }, 0) : sec(ch.screens[14].end);
    var w = [0, 0, 0, 0, 0, 0]; ch.screens.forEach(function (s) { w[s.brick - 1] += sec(s.end) - sec(s.tc); });
    return '<div class="ch' + (o.render ? ' render' : '') + '" data-ch="' + esc(ch.id) + '">' +
      '<div class="stage" tabindex="0" role="region" aria-label="Chapitre ' + esc(ch.id) + ' : ' + esc(ch.title) + '">' + ch.screens.map(function (s) { return screenHtml(s, ch); }).join('') +
      '<div class="seb talk"><img src="' + esc(o.avatar || 'assets/seb.png') + '" alt=""><div class="eq" aria-hidden="true"><i style="--d:0s"></i><i style="--d:.2s"></i><i style="--d:.4s"></i><i style="--d:.1s"></i><i style="--d:.3s"></i></div><span>Sébastien Paumier</span></div><div class="cc" aria-live="off"><p></p></div><button class="bigplay" data-c="play" aria-label="Lecture" tabindex="-1"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg></button></div>' +
      '<div class="vbar"><button class="pp" data-c="play" aria-label="Lecture"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="ic-play" d="M7 4.5v15l13-7.5z"/><path class="ic-pause" d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg></button>' +
      '<div class="tl" data-tl role="slider" tabindex="0" aria-label="Position dans le chapitre" aria-valuemin="0" aria-valuemax="' + Math.round(total) + '" aria-valuenow="0"><i></i></div>' +
      '<span class="tm"><span data-tm>0:00</span> / ' + fmt(total) + '</span><button data-c="snd" aria-pressed="true" hidden>Son</button><button data-c="cc" aria-pressed="true" aria-label="Sous-titres">CC</button><button data-c="fs" aria-label="Plein écran">⛶</button></div>' +
      '<details class="trs"><summary>Transcription des 15 écrans</summary><ol>' + ch.screens.map(function (s) { return '<li><b>' + esc(s.title) + '</b> <small>(' + esc(s.tc) + ' – ' + esc(s.end) + ')</small><br>' + (s.kind === 'mozi' ? 'Mozi : ' : '') + esc(s.voice) + (s.source ? '<br><small>Source : ' + esc(s.source) + '</small>' : '') + '</li>'; }).join('') + '</ol></details></div>';
  }

  /* hooks : { state:{} (persistant), save(), onDone(), onQuiz(ok, sel), onProof(dataUrl), onExercise(), render:bool, media:{screens:[{audio}]} } */
  function mount(root, ch, hk) {
    hk = hk || {}; var st = hk.state || {};
    var stage = root.querySelector('.stage'), scs = stage.querySelectorAll('.sc'), cc = stage.querySelector('.cc p'), seb = stage.querySelector('.seb');
    var tm = root.querySelector('[data-tm]'), btnP = root.querySelector('[data-c=play]');
    var media = (ch.media && ch.media.screens) || [];
    var i = Math.min(14, st.i || 0), t0 = 0, el = 0, playing = false, raf = 0, au = null, sound = true, words = [], chunks = [], lastW = -1, started = false, tryN = -1;
    var dur = ch.screens.map(function (s, k) { return (media[k] && media[k].dur) || Math.max(3, sec(s.end) - sec(s.tc)); });
    var starts = []; dur.reduce(function (a, d, k) { starts[k] = a; return a + d; }, 0);
    if (media.some(function (m) { return m && m.audio; })) root.querySelector('[data-c=snd]').hidden = false;
    var tl = root.querySelector('[data-tl]'), TOT = starts[14] + dur[14];
    function seekTo(g) { g = Math.max(0, Math.min(TOT - 0.05, g)); var k = 0; while (k < 14 && starts[k + 1] <= g) k++; var was = playing; if (was) play(false); started = true; root.classList.add('started'); show(k); el = g - starts[k]; t0 = performance.now() - el * 1000; paint(); if (was) play(true); }

    function show(n, keep) {
      if (au) { au.pause(); au = null; }
      i = Math.max(0, Math.min(14, n)); el = 0; t0 = performance.now(); lastW = -1;
      [].forEach.call(scs, function (x, k) { x.classList.toggle('on', k === i); x.setAttribute('aria-hidden', String(k !== i)); if (k !== i) x.setAttribute('inert', ''); else x.removeAttribute('inert'); });
      var s = ch.screens[i]; words = String(s.voice || '').split(/\s+/).filter(Boolean); chunks = []; var cur = [];
      words.forEach(function (w, k) { cur.push(k); if (cur.length >= 14 || (cur.length >= 6 && /[.!?;:]$/.test(w))) { chunks.push(cur); cur = []; } }); if (cur.length) chunks.push(cur);
      seb.classList.toggle('off', s.kind === 'mozi' || s.kind === 'belief'); stage.classList.toggle('hp', !!(s.pose && s.kind !== 'mozi'));
      [].forEach.call(scs[i].querySelectorAll('.rv'), function (r) { r.classList.remove('in'); }); scs[i].classList.remove('try'); tryN = -1;
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
      if (!scs[i].classList.contains('try')) [].forEach.call(scs[i].querySelectorAll('[data-rv]'), function (r) { var k = +r.getAttribute('data-rv'), m = scs[i].querySelectorAll('.rv').length || 1; r.classList.toggle('in', el >= d * (k + 0.4) / (m + 0.6)); r.classList.toggle('on', r.classList.contains('in')); });
      var tr = scs[i].querySelector('[data-track]'); if (tr) { var all = scs[i].querySelectorAll('.steps .rv'), nin = scs[i].querySelectorAll('.steps .rv.in').length; tr.style.setProperty('--t', Math.round(100 * nin / (all.length || 1)) + '%'); }
      // comme une vidéo : si l'apprenant n'a pas répondu, la réponse s'affiche d'elle-même en fin d'écran
      if (playing && s.kind === 'quiz' && el > d * 0.6) { var c1 = scs[i].querySelector('[data-card="1"]'); if (c1 && !c1.classList.contains('flip')) { back((s.card1 || {}).answer || 0, true); } var c2 = scs[i].querySelector('[data-card="2"]'); if (el > d * 0.8 && c2 && !c2.classList.contains('flip')) { c2.classList.add('flip'); scs[i].querySelector('.cards').classList.add('c1'); } }
      if (playing && s.kind === 'retrieval' && el > d * 0.6) { var fr = scs[i].querySelector('[data-out=ret]'); if (fr && fr.hidden) { fr.hidden = false; fr.innerHTML = '<b>Une réponse possible :</b> ' + esc(s.model_answer); } }
      var bc = scs[i].querySelector('[data-count]'); if (bc && bc.getAttribute('data-count')) { var c = JSON.parse(bc.getAttribute('data-count')), v = c.num * Math.min(1, el / 1.4); bc.textContent = c.pre + v.toFixed(c.dec).replace('.', ',') + c.post; }
      var g = starts[i] + Math.min(el, d); tm.textContent = fmt(g); if (tl) { tl.querySelector('i').style.setProperty('--p', (100 * g / TOT).toFixed(2) + '%'); tl.setAttribute('aria-valuenow', Math.round(g)); }
      [].forEach.call(root.querySelectorAll('[data-brick]'), function (b) {
        var bi = +b.getAttribute('data-brick'), a = 0, z = 0;
        ch.screens.forEach(function (x, k) { if (x.brick === bi) { z += dur[k]; if (k < i) a += dur[k]; else if (k === i) a += Math.min(el, d); } });
        b.querySelector('b').style.setProperty('--p', Math.round(100 * a / z) + '%'); b.classList.toggle('cur', bi === s.brick);
      });
    }
    function tick(now) {
      raf = 0; if (!playing) return;
      el = (now - t0) / 1000;
      paint();
      var s = ch.screens[i];
      if (el >= dur[i]) {
        if ((s.kind === 'welcome' && !started) || i === 14) { el = dur[i]; paint(); play(false); return; }
        show(i + 1);
      }
      raf = requestAnimationFrame(tick);
    }
    function play(on) {
      if (on && i === 14 && el >= dur[14]) { show(0); started = true; }
      if (on) { started = true; root.classList.add('started'); }
      playing = on; root.classList.toggle('playing', on); btnP.setAttribute('aria-label', on ? 'Pause' : 'Lecture');
      seb.classList.toggle('talk', on);
      if (on) { t0 = performance.now() - el * 1000; if (au) au.play().catch(function () {}); else if (media[i] && media[i].audio && sound && el < dur[i]) { au = new Audio(media[i].audio); au.currentTime = el; au.play().catch(function () {}); } if (!raf) raf = requestAnimationFrame(tick); }
      else { if (au) au.pause(); if (raf) cancelAnimationFrame(raf); raf = 0; }
    }
    function next() { if (i < 14) { show(i + 1); if (!playing) play(true); } }
    function back(sel, silent) {
      var q = ch.screens[i].card1 || {}, ok = sel === q.answer, b = scs[i].querySelector('[data-back="1"]');
      b.innerHTML = '<div class="mono">' + (silent && st.qz == null ? 'La réponse' : ok ? 'Bonne réponse' : 'Pas tout à fait') + '</div><p class="' + (ok ? 'ok' : 'ko') + '">' + esc((q.whys || [])[sel] || '') + '</p>' + (ok ? '' : '<p><b>La bonne réponse :</b> ' + esc((q.options || [])[q.answer]) + '</p>') + '<p>' + esc(q.feedback || '') + '</p>';
      scs[i].querySelector('[data-card="1"]').classList.add('flip');
      var back2 = b.querySelector('[data-act=c2]'); if (!back2) { b.insertAdjacentHTML('beforeend', '<button class="go" data-act="c2" style="font-size:2.4cqmin;padding:.9cqmin 2.4cqmin;margin-top:auto">Carte 2</button>'); }
      if (!silent) { st.qz = sel; hk.onQuiz && hk.onQuiz(ok, sel); hk.save && hk.save(); }
    }

    root.addEventListener('click', function (e) {
      if (e.target.closest('[data-tl]')) { var r = tl.getBoundingClientRect(); seekTo(TOT * (e.clientX - r.left) / r.width); return; }
      if (e.target.closest('textarea,input,label,.card,.drop')) { if (playing) play(false); }
      var b = e.target.closest('[data-act],[data-c],[data-brick],[data-opt],[data-hot]');
      if (!b) { if (e.target.closest('.stage') && !e.target.closest('a,button,textarea,input,label,.card,.drop') && (started || i > 0)) play(!playing); return; }
      if (b.getAttribute('data-c') === 'fs') { var fe = stage; if (document.fullscreenElement) document.exitFullscreen(); else if (fe.requestFullscreen) fe.requestFullscreen(); return; }
      if (b.hasAttribute('data-hot')) {
        var hn = +b.getAttribute('data-hot'), scT = scs[i]; if (hn !== tryN) return;
        [].forEach.call(scT.querySelectorAll('[data-rv="' + hn + '"]'), function (r) { r.classList.add('in', 'on'); }); b.classList.remove('cur'); b.tabIndex = -1;
        var hots = scT.querySelectorAll('.hot'); tryN++;
        if (tryN < hots.length) { hots[tryN].classList.add('cur'); hots[tryN].tabIndex = 0; hots[tryN].focus(); }
        else { var ft = scT.querySelector('[data-out=try]'); ft.hidden = false; ft.innerHTML = '<b>Démo réussie.</b> Tu as fait les ' + hots.length + ' étapes. <button class="go" data-act="next" style="font-size:max(13px,2.2cqmin);padding:.6cqmin 2cqmin;margin-left:1cqmin">Continuer</button>'; }
        return;
      }
      var a = b.getAttribute('data-act'), c = b.getAttribute('data-c');
      if (b.hasAttribute('data-brick')) { var bi = +b.getAttribute('data-brick'); for (var k = 0; k < 15; k++) if (ch.screens[k].brick === bi) { show(k); break; } return; }
      if (b.hasAttribute('data-opt')) { if (playing) play(false); back(+b.getAttribute('data-opt')); return; }
      if (c === 'play') play(!playing); else if (c === 'prev') show(i - 1); else if (c === 'next') { show(i + 1); }
      else if (c === 'cc') { var on = root.classList.toggle('nocc'); b.setAttribute('aria-pressed', String(!on)); }
      else if (c === 'snd') { sound = !sound; b.setAttribute('aria-pressed', String(sound)); if (au) au.muted = !sound; }
      if (a === 'start') { started = true; show(0); play(true); }
      else if (a === 'start' || a === 'next') next();
      else if (a === 'flip2') b.closest('.card').classList.add('flip');
      else if (a === 'try') { play(false); var scT = scs[i]; scT.classList.add('try'); [].forEach.call(scT.querySelectorAll('.rv,.rvp'), function (r) { r.classList.remove('in', 'on'); }); var hs = scT.querySelectorAll('.hot'); [].forEach.call(hs, function (h) { h.classList.remove('cur'); h.tabIndex = -1; }); tryN = 0; if (hs[0]) { hs[0].classList.add('cur'); hs[0].tabIndex = 0; hs[0].focus(); } scT.querySelector('[data-out=try]').hidden = false; scT.querySelector('[data-out=try]').textContent = 'Clique sur le bouton orange, étape par étape.'; }
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
      if (e.key === ' ' || e.key === 'k') { e.preventDefault(); play(!playing); } else if (e.key === 'ArrowRight') seekTo(starts[i] + el + 5); else if (e.key === 'ArrowLeft') seekTo(starts[i] + el - 5);
    });
    if (window.SpeechRecognition || window.webkitSpeechRecognition) [].forEach.call(root.querySelectorAll('[data-act=dict]'), function (b) { b.hidden = false; });
    show(i);
    tl.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); seekTo(starts[i] + el + (e.key === 'ArrowRight' ? 5 : -5)); } });
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

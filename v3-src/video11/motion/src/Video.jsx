import React from "react";
import { AbsoluteFill, useVideoConfig, interpolate } from "./remotion-lite.js";
import {
  C, FONT, TIMING as TM, useT, A, S, E, prog, springAt, clamp, ease, Panel, In, Card, Tag, Count, fr,
  SideArea, WideArea, Header, Underline, Strike, Icon, Bubble, LayerCtx,
} from "./ui.jsx";

const INTRO = TM.intro, END = TM.audioEnd, TOTAL = TM.total;

// ---------------------------------------------------------------- mise en page de Seb
// full : plein cadre · side : carte à droite · pip : médaillon en bas à droite · none : masqué
const LAYOUTS = [
  [0, "none"], [INTRO - 0.35, "full"],
  [A(0, "je te présente"), "side"], [A(0, "et c'est exactement"), "full"],
  [A(1, "avant de"), "side"],
  [S(2) - 0.2, "pip"],
  [S(3) - 0.2, "side"], [A(3, "le national donne") - 0.3, "pip"],
  [S(4) - 0.2, "pip"],
  [S(5) - 0.2, "side"],
  [S(6) - 0.2, "pip"], [A(6, "tu remarques"), "full"], [A(6, "et chaque technique"), "side"],
  [S(7) - 0.2, "side"], [A(7, "lui il a été"), "full"],
  [S(8) - 0.2, "side"], [A(8, "on se retrouve"), "full"],
  [END + 0.1, "none"],
];
const RECTS = {
  full: { x: 0, y: 0, w: 1920, h: 1080, r: 0, o: 1 },
  side: { x: 1196, y: 96, w: 640, h: 812, r: 34, o: 1 },
  pip: { x: 1604, y: 744, w: 256, h: 256, r: 128, o: 1 },
  none: { x: 0, y: 0, w: 1920, h: 1080, r: 0, o: 0 },
};
const layoutAt = (t) => {
  let i = 0;
  while (i + 1 < LAYOUTS.length && t >= LAYOUTS[i + 1][0]) i++;
  const [t0, cur] = LAYOUTS[i];
  const prev = i > 0 ? LAYOUTS[i - 1][1] : cur;
  const p = prog(t, t0, 0.75);
  const a = RECTS[prev], b = RECTS[cur];
  const m = (k) => a[k] + (b[k] - a[k]) * p;
  return { cur, prev, p, rect: { x: m("x"), y: m("y"), w: m("w"), h: m("h"), r: m("r"), o: m("o") } };
};

const Avatar = () => {
  const t = useT(); const { fps } = useVideoConfig();
  const { rect, cur } = layoutAt(t);
  if (rect.o <= 0.001) return null;
  const n = Math.max(1, Math.min(TM.avatarFrames || 1, Math.round((t - INTRO) * fps) + 1));
  const card = rect.w < 1900;
  return (
    <div style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.w, height: rect.h, borderRadius: rect.r,
      overflow: "hidden", opacity: rect.o, boxShadow: card ? "0 30px 60px rgba(15,90,49,0.25)" : "none",
      border: card ? `${Math.min(6, (1920 - rect.w) / 60)}px solid #fff` : "none", background: "#dfe7e2" }}>
      <img id="avatar" src={`frames/${String(n).padStart(5, "0")}.jpg`}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: TM.avatarFocus || "50% 30%",
          transform: `scale(${interpolate(rect.w, [256, 640], [1.9, 1], clamp)})`, transformOrigin: "62% 18%" }} />
    </div>
  );
};

// ---------------------------------------------------------------- décor
const Backdrop = () => {
  const t = useT();
  const d1 = Math.sin(t / 7) * 40, d2 = Math.cos(t / 9) * 50;
  return (
    <AbsoluteFill style={{ background: "#F6FAF7" }}>
      <div style={{ position: "absolute", width: 1100, height: 1100, borderRadius: 550, left: 1150 + d1, top: -520 + d2,
        background: `radial-gradient(circle, ${C.gs} 0%, rgba(227,242,233,0) 70%)` }} />
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: 450, left: -380 - d2, top: 560 + d1,
        background: `radial-gradient(circle, ${C.os} 0%, rgba(255,241,224,0) 70%)` }} />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
        <defs><pattern id="g" width="48" height="48" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill="#C9DCCF" /></pattern></defs>
        <rect width="1920" height="1080" fill="url(#g)" />
      </svg>
    </AbsoluteFill>
  );
};
const Chrome = () => {
  const t = useT();
  const { cur, prev, p } = layoutAt(t);
  const vis = (l) => (l === "side" || l === "pip" ? 1 : 0);
  const o = vis(prev) + (vis(cur) - vis(prev)) * p;
  const fullO = (cur === "full" ? p : prev === "full" ? 1 - p : 0) * (t > INTRO && t < END ? 1 : 0);
  const progress = Math.min(1, Math.max(0, (t - INTRO) / (END - INTRO)));
  return (
    <>
      <div style={{ position: "absolute", left: 96, top: 46, opacity: o }}>
        <img src="logo-dark.png" style={{ height: 52 }} />
      </div>
      <div style={{ position: "absolute", right: 96, top: 50, opacity: o * (layoutAt(t).cur === "side" ? 0 : 1) }}>
        <Tag>Module 1 · Capsule 1.1</Tag>
      </div>
      <div style={{ position: "absolute", left: 56, top: 44, opacity: fullO,
        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.35))" }}>
        <img src="logo-white.png" style={{ height: 46 }} />
      </div>
      {t > INTRO && t < END + 0.3 && (
        <div style={{ position: "absolute", left: 0, bottom: 0, height: 7, width: 1920, background: "rgba(15,90,49,0.12)" }}>
          <div style={{ height: 7, width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${C.dpe.G}, ${C.dpe.E}, ${C.dpe.C}, ${C.dpe.A})`,
            backgroundSize: "1920px 7px" }} />
        </div>
      )}
    </>
  );
};

// ---------------------------------------------------------------- sous-titres (calés au mot)
const CHUNKS = (() => {
  const out = [];
  TM.segs.forEach((sg) => {
    let cur = [];
    const flush = () => { if (cur.length) out.push(cur); cur = []; };
    sg.words.forEach((w, i) => {
      const len = cur.reduce((n, x) => n + x.t.length + 1, 0);
      if (cur.length && (len + w.t.length > 44 || w.s - cur[cur.length - 1].e > 0.55)) flush();
      cur.push(w);
      if (/[.?!:;]$/.test(w.t) && len > 14) flush();
    });
    flush();
  });
  return out.map((ws, i) => ({ ws, a: ws[0].s - 0.05, b: ws[ws.length - 1].e + 0.35 }));
})();
const Subtitles = () => {
  const t = useT();
  const c = CHUNKS.find((k, i) => t >= k.a && t < Math.min(k.b, CHUNKS[i + 1] ? CHUNKS[i + 1].a : k.b));
  if (!c) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "rgba(15,40,26,0.80)", borderRadius: 16, padding: "10px 26px", fontSize: 34,
        fontWeight: 600, color: "#fff", lineHeight: 1.25, maxWidth: 1300, textAlign: "center" }}>
        {c.ws.map((w, i) => (
          <span key={i} style={{ color: t >= w.s && t < w.e + 0.08 ? "#FFC27A" : "#fff" }}>{w.t}{" "}</span>
        ))}
      </div>
    </div>
  );
};

// Bandeau de mots-clés en plein cadre (au-dessus de Seb, jamais sur le visage : en bas à gauche)
const Chip = ({ a, b, kicker, children, color = C.o }) => {
  const t = useT();
  if (React.useContext(LayerCtx) !== "c") return null;
  if (t < a - 0.01 || t > b + 0.4) return null;
  const s = springAt(t, a), out = prog(t, b, 0.35);
  return (
    <div style={{ position: "absolute", left: 72, bottom: 150, opacity: Math.min(1, s * 1.4) * (1 - out),
      transform: `translateX(${(1 - s) * -60}px)` }}>
      <div style={{ display: "flex", alignItems: "stretch", borderRadius: 18, overflow: "hidden",
        boxShadow: "0 16px 40px rgba(0,0,0,0.25)" }}>
        <div style={{ width: 12, background: color }} />
        <div style={{ background: "rgba(255,255,255,0.96)", padding: "16px 28px" }}>
          {kicker && <div style={{ fontSize: 20, fontWeight: 600, color, textTransform: "uppercase", letterSpacing: 1.5 }}>{kicker}</div>}
          <div style={{ fontSize: 38, fontWeight: 700, color: C.gd }}>{children}</div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- INTRO
const Intro = () => {
  const t = useT();
  if (t > INTRO + 0.1) return null;
  const wipe = prog(t, INTRO - 0.55, 0.55, ease);
  const bars = Object.entries(C.dpe);
  const words = "Le marché 2026 et les nouvelles techniques".split(" ");
  return (
    <AbsoluteFill style={{ background: C.gd, transform: `translateY(${-wipe * 1080}px)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1920, display: "flex", opacity: 0.18 }}>
        {bars.map(([k, col], i) => (
          <div key={k} style={{ flex: 1, background: col, transform: `scaleY(${prog(t, 0.05 * i, 0.6)})`,
            transformOrigin: i % 2 ? "top" : "bottom" }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 150, top: 230 }}>
        <In t0={0.25} dy={30}><img src="logo-white.png" style={{ height: 92 }} /></In>
        <In t0={0.9} dy={20} style={{ marginTop: 70 }}>
          <span style={{ fontSize: 28, color: "#FFC27A", fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase" }}>
            Module 1 · Se différencier pour attirer les propriétaires</span>
        </In>
        <div style={{ marginTop: 18, width: 1500 }}>
          {words.map((w, i) => (
            <In key={i} t0={1.25 + i * 0.09} dy={40} block={false} style={{ marginRight: 22 }}>
              <span style={{ fontSize: 92, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>{w}</span>
            </In>
          ))}
        </div>
        <In t0={2.2} dy={20} style={{ marginTop: 40, display: "flex", gap: 16, alignItems: "center" }}>
          <Tag bg="rgba(255,255,255,0.14)" color="#fff" style={{ fontSize: 26 }}>Capsule 1.1</Tag>
          <Tag bg="rgba(255,255,255,0.14)" color="#fff" style={{ fontSize: 26 }}>≈ 7 min · avec Seb</Tag>
        </In>
      </div>
      <div style={{ position: "absolute", left: 150, bottom: 140, display: "flex", gap: 8 }}>
        {bars.map(([k, col], i) => (
          <In key={k} t0={2.5 + i * 0.07} dy={14} block={false}>
            <div style={{ width: 64, height: 40, borderRadius: 8, background: col, color: "#fff", fontWeight: 700,
              fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>{k}</div>
          </In>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- OUTRO
const Outro = () => {
  const t = useT();
  if (t < END - 0.05) return null;
  const s = prog(t, END, 0.7);
  const a = END + 0.5;
  return (
    <AbsoluteFill style={{ background: C.gd, clipPath: `circle(${s * 140}% at 85% 85%)` }}>
      <div style={{ position: "absolute", left: 150, top: 220 }}>
        <In t0={a}><img src="logo-white.png" style={{ height: 80 }} /></In>
        <In t0={a + 0.4} style={{ marginTop: 60 }}>
          <div style={{ fontSize: 30, color: "#FFC27A", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>Capsule 1.1 terminée</div>
          <div style={{ fontSize: 84, color: "#fff", fontWeight: 700, marginTop: 8 }}>À toi de jouer.</div>
        </In>
        <div style={{ display: "flex", gap: 18, marginTop: 50 }}>
          {[["quiz", "Quiz flash"], ["doc", "Fiche 2026"], ["pen", "Exercice"], ["upload", "Livrable"]].map(([ic, l], i) => (
            <In key={l} t0={a + 0.9 + i * 0.15} block={false}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.12)",
                borderRadius: 999, padding: "10px 24px 10px 12px" }}>
                <Bubble name={ic} bg="#fff" color={C.g} size={52} icon={30} />
                <span style={{ color: "#fff", fontSize: 28, fontWeight: 600 }}>{l}</span>
              </div>
            </In>
          ))}
        </div>
        <In t0={a + 1.8} style={{ marginTop: 70 }}>
          <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 28 }}>Prochaine capsule · </span>
          <span style={{ color: "#fff", fontSize: 28, fontWeight: 600 }}>1.2 Éco-consultant et valeur verte</span>
        </In>
      </div>
    </AbsoluteFill>
  );
};

// ================================================================ SCÈNES
const Row = ({ t0, icon, children, sub, bg, color }) => (
  <In t0={t0} dx={-30} dy={0} style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 30 }}>
    <Bubble name={icon} bg={bg} color={color} size={76} icon={42} />
    <div>
      <div style={{ fontSize: 40, fontWeight: 600, color: C.ink, lineHeight: 1.2 }}>{children}</div>
      {sub && <div style={{ fontSize: 27, color: C.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  </In>
);

// S1 — M. Bernard
const S1 = () => {
  const s = 0, t = useT();
  if (t < S(0) - 1 || t > E(0) + 1) return null;
  const agA = A(s, "deux agences"), q = A(s, "alors qui"), back = A(s, "et c'est exactement");
  return (
    <>
      <Chip a={S(0) + 0.3} b={A(s, "je te présente") - 0.2} kicker="Ton formateur">Seb · Éco-Consultant</Chip>
      <SideArea>
        <Panel a={A(s, "je te présente")} b={agA - 0.3}>
          <In t0={A(s, "je te présente")} style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 34 }}>
            <div style={{ width: 96, height: 96, borderRadius: 48, background: C.g, color: "#fff", fontSize: 38,
              fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>MB</div>
            <div>
              <div style={{ fontSize: 24, color: C.o, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2 }}>Le fil rouge</div>
              <div style={{ fontSize: 56, fontWeight: 700, color: C.gd }}>M. Bernard</div>
            </div>
          </In>
          <Row t0={A(s, "soixante-quatre")} icon="user">64 ans · retraité, vit seul</Row>
          <Row t0={A(s, "un t4")} icon="house" sub="4ᵉ étage">T4 · 76 m² · Melun</Row>
          <Row t0={A(s, "d'une résidence")} icon="calendar">Résidence de 1972</Row>
          <Row t0={A(s, "il veut vendre")} icon="arrow" bg={C.os} color={C.od} sub="pour se rapprocher de sa fille">Projet : vendre et partir à Nantes</Row>
        </Panel>
        <Panel a={agA} b={q - 0.3}>
          <In t0={agA}><div style={{ fontSize: 46, fontWeight: 700, color: C.gd, marginBottom: 26 }}>Deux agences sont passées</div></In>
          <div style={{ display: "flex", gap: 24 }}>
            {["Agence 1", "Agence 2"].map((n, i) => (
              <In key={n} t0={agA + 0.25 + i * 0.2} style={{ flex: 1 }}>
                <Card style={{ position: "relative", height: 230 }}>
                  <div style={{ fontSize: 26, color: C.muted, fontWeight: 600 }}>{n}</div>
                  <div style={{ fontSize: 64, fontWeight: 700, color: C.ink, marginTop: 30 }}>
                    <In t0={A(s, "cent soixante-douze") + i * 0.1} block={false}>172 000 €</In></div>
                  <In t0={A(s, "moins quinze") + i * 0.15} scale style={{ position: "absolute", right: 22, top: 20,
                    transform: "rotate(-6deg)" }}>
                    <div style={{ border: `4px solid ${C.ko}`, color: C.ko, borderRadius: 12, padding: "4px 14px",
                      fontSize: 28, fontWeight: 700, transform: "rotate(-6deg)" }}>−15 % · DPE</div>
                  </In>
                </Card>
              </In>
            ))}
          </div>
          <In t0={A(s, "lui espérait")} style={{ marginTop: 28 }}>
            <Card style={{ display: "flex", alignItems: "center", gap: 22, background: C.gt }}>
              <Bubble name="user" bg="#fff" />
              <div style={{ fontSize: 34, color: C.ink }}>M. Bernard espérait <b style={{ color: C.g }}>205 000 €</b></div>
            </Card>
          </In>
          <In t0={A(s, "depuis il ne")} style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 18 }}>
            <Bubble name="phone" bg={C.kos} color={C.ko} />
            <div style={{ fontSize: 32, color: C.ko, fontWeight: 600 }}>Il ne décroche plus aux numéros inconnus</div>
          </In>
        </Panel>
        <Panel a={q} b={back - 0.3}>
          <div style={{ height: 760, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <In t0={q} scale><div style={{ fontSize: 110, fontWeight: 700, color: C.gd, lineHeight: 1 }}>Qui a raison ?</div></In>
            <In t0={A(s, "pour l'instant")} style={{ marginTop: 30 }}>
              <div style={{ fontSize: 50, fontWeight: 600, color: C.o }}>Pour l'instant… personne.</div>
            </In>
          </div>
        </Panel>
      </SideArea>
      <Chip a={A(s, "faire la différence") - 0.4} b={E(0) - 0.1} kicker="Ton rôle">C'est là que tu fais la différence</Chip>
    </>
  );
};

// S2 — le vendeur 2026
const Estimator = ({ t0, v, w }) => (
  <In t0={t0} style={{ flex: 1 }}>
    <Card style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: C.line }} />)}
      </div>
      <div style={{ height: 14, width: "70%", background: C.line, borderRadius: 7, marginBottom: 10 }} />
      <div style={{ height: 14, width: "45%", background: C.line, borderRadius: 7, marginBottom: 20 }} />
      <div style={{ fontSize: 20, color: C.muted }}>Estimation en ligne</div>
      <div style={{ fontSize: 40, fontWeight: 700, color: C.ink, filter: "blur(1.5px)" }}>{v}</div>
      <div style={{ height: 10, width: w, background: C.o, borderRadius: 5, marginTop: 10, opacity: 0.7 }} />
    </Card>
  </In>
);
const S2 = () => {
  const s = 1, t = useT();
  if (t < S(1) - 1 || t > E(1) + 1) return null;
  const est = A(s, "avant de"), enq = A(s, "une enquête"), donc = A(s, "donc si");
  return (
    <>
      <Chip a={S(1) + 0.2} b={est - 0.2} kicker="Ce qui a changé">Le vendeur de 2026</Chip>
      <SideArea>
        <Panel a={est} b={enq - 0.3}>
          <Header kicker="Avant ton rendez-vous" title="Il s'est déjà fait un avis" t0={est} />
          <In t0={A(s, "trois estimateurs")} style={{ marginTop: 30 }}>
            <div style={{ display: "flex", gap: 20 }}>
              <Estimator t0={A(s, "trois estimateurs")} v="198 000 €" w="60%" />
              <Estimator t0={A(s, "trois estimateurs") + 0.2} v="176 500 €" w="45%" />
              <Estimator t0={A(s, "trois estimateurs") + 0.4} v="211 000 €" w="75%" />
            </div>
          </In>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 30 }}>
            <In t0={A(s, "les prix baissaient")} block={false}><Tag bg={C.kos} color={C.ko} style={{ fontSize: 28, padding: "10px 22px" }}>« Les prix baissent »</Tag></In>
            <In t0={A(s, "son dpe allait")} block={false}><Tag bg={C.kos} color={C.ko} style={{ fontSize: 28, padding: "10px 22px" }}>« Mon DPE va faire chuter ma valeur »</Tag></In>
            <In t0={A(s, "deux ou trois")} block={false}><Tag bg={C.os} color={C.od} style={{ fontSize: 28, padding: "10px 22px" }}>2 ou 3 agences reçues avant toi</Tag></In>
          </div>
        </Panel>
        <Panel a={enq} b={donc - 0.3}>
          <div style={{ height: 700, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <In t0={A(s, "la moitié")} scale>
              <div style={{ fontSize: 210, fontWeight: 700, color: C.o, lineHeight: 1 }}>
                <Count t0={A(s, "la moitié")} to={51} fmt={(v) => `${Math.round(v)} %`} /></div>
            </In>
            <In t0={A(s, "la moitié") + 0.3}>
              <div style={{ fontSize: 42, fontWeight: 600, color: C.gd, marginTop: 14, maxWidth: 960 }}>
                des vendeurs croient que mettre les agences <Underline t0={A(s, "en concurrence")}>en concurrence</Underline> augmente leurs chances</div>
            </In>
            <In t0={A(s, "même si")} style={{ marginTop: 26 }}>
              <Tag>Enquête leboncoin Immo · déclaratif · 2025</Tag>
            </In>
          </div>
        </Panel>
        <Panel a={donc} b={E(1) - 0.2}>
          <div style={{ display: "flex", flexDirection: "column", gap: 30, marginTop: 40 }}>
            <In t0={donc}>
              <Card style={{ display: "flex", alignItems: "center", gap: 26, background: "#F3F4F4" }}>
                <Bubble name="doc" bg="#fff" color={C.muted} size={84} icon={46} />
                <div>
                  <div style={{ fontSize: 34, color: C.muted }}>Un prix + une plaquette</div>
                  <div style={{ fontSize: 60, fontWeight: 700, color: C.muted }}>
                    <In t0={A(s, "la quatrième")} block={false}>= la 4ᵉ agence</In></div>
                </div>
              </Card>
            </In>
            <In t0={A(s, "si tu arrives avec des")}>
              <Card style={{ display: "flex", alignItems: "center", gap: 26, border: `3px solid ${C.gl}`, background: C.gt }}>
                <Bubble name="check" bg={C.g} color="#fff" size={84} icon={46} />
                <div>
                  <div style={{ fontSize: 34, color: C.g }}>Des preuves</div>
                  <div style={{ fontSize: 60, fontWeight: 700, color: C.gd }}>
                    <In t0={A(s, "la première")} block={false}>= la 1ʳᵉ agence</In></div>
                </div>
              </Card>
            </In>
          </div>
        </Panel>
      </SideArea>
    </>
  );
};

// S3 — le marché en vrai (médaillon)
const Stat = ({ t0, big, label, color = C.gd, children }) => (
  <In t0={t0} style={{ flex: 1 }}>
    <Card style={{ height: 250 }}>
      <div style={{ fontSize: 66, fontWeight: 700, color, lineHeight: 1.05 }}>{big}</div>
      <div style={{ fontSize: 24, color: C.muted, marginTop: 12, lineHeight: 1.3 }}>{label}</div>
      {children}
    </Card>
  </In>
);
const S3 = () => {
  const s = 2, t = useT();
  if (t < S(2) - 1 || t > E(2) + 1) return null;
  const m = A(s, "les maisons"), ap = A(s, "les appartements de");
  const bar = (t0, v, max, col) => (
    <div style={{ height: 34, borderRadius: 8, background: col, width: `${prog(t, t0, 0.8) * (v / max) * 100}%`, minWidth: 6 }} />
  );
  return (
    <WideArea>
      <Panel a={S(2)} b={E(2) - 0.2}>
        <Header kicker="Idée clé 1" title="Le marché 2026, en vrai" t0={S(2)} />
        <div style={{ display: "flex", gap: 22, marginTop: 34 }}>
          <Stat t0={A(s, "neuf cent cinquante-huit")} label="logements anciens vendus sur 12 mois (fin juin 2026)"
            big={<Count t0={A(s, "neuf cent cinquante-huit")} to={958000} fmt={(v) => fr(Math.round(v / 1000) * 1000)} />} />
          <Stat t0={A(s, "moins zéro virgule huit")} color={C.od} label="prix des logements anciens sur un an (T2 2026)"
            big={<Count t0={A(s, "moins zéro virgule huit")} to={-0.8} fmt={(v) => `${v < -0.001 ? "−" : ""}${fr(Math.abs(v), 1)} %`} />} />
          <Stat t0={A(s, "trois et demi")} label="taux moyen d'un crédit sur 20 ans" big="≈ 3,5 %" />
          <Stat t0={A(s, "cinq virgule quarante")} label="taux d'usure · prêts de 20 ans et plus, jusqu'à fin décembre"
            big={<Count t0={A(s, "cinq virgule quarante")} to={5.4} fmt={(v) => `${fr(v, 2)} %`} />} />
        </div>
        <div style={{ display: "flex", gap: 22, marginTop: 24 }}>
          <In t0={m} style={{ flex: 2 }}>
            <Card>
              <div style={{ fontSize: 26, fontWeight: 600, color: C.gd, marginBottom: 14 }}>Le détail des prix sur un an</div>
              {[["Maisons", m, 1.3, "−1,3 %", C.F], ["Appartements", ap, 0.1, "−0,1 %", C.gl]].map(([l, t0, v, txt, col]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 12, opacity: prog(t, t0, 0.3) }}>
                  <div style={{ width: 200, fontSize: 26, color: C.ink }}>{l}</div>
                  <div style={{ flex: 1 }}>{bar(t0, v, 1.4, col || C.dpe.F)}</div>
                  <div style={{ width: 110, fontSize: 30, fontWeight: 700, color: C.ink, textAlign: "right" }}>{txt}</div>
                </div>
              ))}
            </Card>
          </In>
          <In t0={A(s, "presque stable")} style={{ flex: 1 }}>
            <Card style={{ background: C.gt, border: `2px solid ${C.gl}`, height: "100%", boxSizing: "border-box" }}>
              <div style={{ fontSize: 24, color: C.g, fontWeight: 600 }}>Pour l'appartement de M. Bernard</div>
              <div style={{ fontSize: 40, fontWeight: 700, color: C.gd, marginTop: 6 }}>Tendance presque stable</div>
              <In t0={A(s, "les acheteurs peuvent")} style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center" }}>
                <Icon name="check" color={C.ok} size={34} /><span style={{ fontSize: 28, fontWeight: 600, color: C.ok }}>Les acheteurs peuvent emprunter</span>
              </In>
            </Card>
          </In>
        </div>
        <In t0={A(s, "neuf cent cinquante-huit") + 1} style={{ marginTop: 18 }}>
          <span style={{ fontSize: 20, color: C.muted }}>Sources : Insee (T2 2026) · Meilleurtaux (oct. 2026) · Banque de France (taux d'usure)</span>
        </In>
      </Panel>
    </WideArea>
  );
};
C.F = C.dpe.F;

// S4 — national vs local
const S4 = () => {
  const s = 3, t = useT();
  if (t < S(3) - 1 || t > E(3) + 1) return null;
  const pb = A(s, "pour m bernard"), nat = A(s, "le national donne");
  const rows = [["C1", "T4 78 m² · 1972", "E", "2 620"], ["C2", "T3 68 m² · 1968", "D", "2 700"], ["C3", "T4 80 m² · 1975", "E", "2 650"],
    ["C4", "T4 74 m² · 1970", "E", "2 600"], ["C5", "T3 70 m² · 1978", "D", "2 690"]];
  const hl = A(s, "deux mille six cent");
  return (
    <>
      <SideArea>
        <Panel a={S(3)} b={pb - 0.3}>
          <Header kicker="Attention" title="Un chiffre national ne fixe jamais le prix d'un bien" t0={S(3)} />
          <In t0={A(s, "moins zéro virgule huit")} style={{ marginTop: 50 }}>
            <Card style={{ display: "flex", alignItems: "center", gap: 30 }}>
              <div style={{ fontSize: 110, fontWeight: 700, color: C.od }}>−0,8 %</div>
              <div style={{ fontSize: 32, color: C.ink, lineHeight: 1.35 }}>
                <In t0={A(s, "c'est une moyenne")}>= une <b>moyenne</b></In>
                <In t0={A(s, "tous logements")}>tous logements anciens</In>
                <In t0={A(s, "toute la france")}>toute la France</In>
              </div>
            </Card>
          </In>
        </Panel>
        <Panel a={pb} b={nat - 0.3}>
          <In t0={pb} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Tag bg={C.os} color={C.od}>D12</Tag>
            <span style={{ fontSize: 40, fontWeight: 700, color: C.gd }}>Les ventes comparables du secteur</span>
          </In>
          <In t0={A(s, "dans notre dossier")} style={{ marginTop: 24 }}>
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ display: "flex", background: C.gd, color: "#fff", fontSize: 24, fontWeight: 600, padding: "14px 24px" }}>
                <div style={{ width: 90 }}>Réf.</div><div style={{ flex: 1 }}>Bien · immeuble</div><div style={{ width: 100 }}>DPE</div>
                <div style={{ width: 170, textAlign: "right" }}>€/m²</div>
              </div>
              {rows.map(([r, b, d, p], i) => (
                <In key={r} t0={A(s, "dans notre dossier") + 0.3 + i * 0.25} dy={10}>
                  <div style={{ display: "flex", fontSize: 28, padding: "14px 24px", borderTop: `1px solid ${C.line}`, alignItems: "center" }}>
                    <div style={{ width: 90, color: C.muted }}>{r}</div><div style={{ flex: 1 }}>{b} · Melun</div>
                    <div style={{ width: 100 }}><span style={{ background: C.dpe[d], color: "#fff", fontWeight: 700, borderRadius: 6, padding: "2px 12px" }}>{d}</span></div>
                    <div style={{ width: 170, textAlign: "right", fontWeight: 700,
                      background: `rgba(255,141,22,${0.22 * prog(t, hl + i * 0.08, 0.4)})`, borderRadius: 8, padding: "2px 8px" }}>{p}</div>
                  </div>
                </In>
              ))}
            </Card>
          </In>
          <div style={{ display: "flex", gap: 20, alignItems: "center", marginTop: 26 }}>
            <In t0={hl} scale block={false}>
              <div style={{ background: C.o, color: "#fff", borderRadius: 18, padding: "12px 28px", fontSize: 50, fontWeight: 700 }}>≈ 2 650 €/m²</div>
            </In>
            <In t0={A(s, "c'est un exemple")} block={false}><Tag bg="#F3F4F4" color={C.muted} style={{ fontSize: 24 }}>Exemple fictif · D12</Tag></In>
          </div>
        </Panel>
      </SideArea>
      <WideArea>
        <Panel a={nat} b={E(3) - 0.2}>
          <div style={{ display: "flex", gap: 30, marginTop: 110 }}>
            {[[nat, "National", "donne la tendance", C.gd, C.gt], [A(s, "le local donne"), "Local", "donne la valeur", "#fff", C.g]].map(([t0, a, b, col, bg], i) => (
              <In key={a} t0={t0} scale style={{ flex: 1 }}>
                <div style={{ background: bg, borderRadius: 30, padding: "70px 56px", height: 380, boxSizing: "border-box",
                  border: i ? "none" : `2px solid ${C.gl}` }}>
                  <div style={{ fontSize: 96, fontWeight: 700, color: col }}>{a}</div>
                  <div style={{ fontSize: 50, fontWeight: 600, color: i ? "#fff" : C.g, marginTop: 10 }}>= {b.replace("donne la ", "")}</div>
                </div>
              </In>
            ))}
          </div>
          <In t0={A(s, "retiens cette phrase")} style={{ marginTop: 34 }}>
            <Tag bg={C.os} color={C.od} style={{ fontSize: 30, padding: "10px 26px" }}>Retiens cette phrase : tu vas la répéter souvent</Tag>
          </In>
        </Panel>
      </WideArea>
    </>
  );
};

// S5 — le DPE a changé de règle
const DpeScale = ({ marker }) => {
  const t = useT();
  const cls = [["A", "≤ 70"], ["B", "71-110"], ["C", "111-180"], ["D", "181-250"], ["E", "251-330"], ["F", "331-420"], ["G", "> 420"]];
  const y = (k) => cls.findIndex((c) => c[0] === k) * 78;
  let my = null, mo = 0, lab = "";
  if (marker) {
    const [tF, tE] = marker;
    if (t >= tF) { my = y("F"); mo = prog(t, tF, 0.4); lab = "345"; }
    if (t >= tE) { my = y("F") + (y("E") - y("F")) * prog(t, tE, 0.8); lab = "285"; }
  }
  return (
    <div style={{ position: "relative", width: 560 }}>
      {cls.map(([k, r], i) => (
        <div key={k} style={{ height: 64, marginBottom: 14, width: 200 + i * 52, background: C.dpe[k], borderRadius: "10px 34px 34px 10px",
          display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", boxSizing: "border-box", color: "#fff" }}>
          <span style={{ fontSize: 38, fontWeight: 700 }}>{k}</span><span style={{ fontSize: 20, fontWeight: 600 }}>{r}</span>
        </div>
      ))}
      {my !== null && (
        <div style={{ position: "absolute", right: -40, top: my - 4, opacity: mo, display: "flex", alignItems: "center" }}>
          <div style={{ width: 0, height: 0, borderTop: "36px solid transparent", borderBottom: "36px solid transparent", borderRight: `30px solid ${C.ink}` }} />
          <div style={{ background: C.ink, color: "#fff", height: 72, borderRadius: 12, padding: "0 20px", display: "flex", alignItems: "center", fontSize: 34, fontWeight: 700 }}>{lab}</div>
        </div>
      )}
    </div>
  );
};
const Eq = ({ parts, dim }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 14, fontSize: 52, fontWeight: 700, opacity: dim ? 0.35 : 1 }}>
    {parts.map(([t0, txt, col], i) => <In key={i} t0={t0} block={false}><span style={{ color: col || C.ink }}>{txt}</span></In>)}
  </div>
);
const S5 = () => {
  const s = 4, t = useT();
  if (t < S(4) - 1 || t > E(4) + 1) return null;
  const tF = A(s, "classe f"), tE = A(s, "classe e"), dep = A(s, "depuis le premier"), att = A(s, "une attestation");
  return (
    <>
    <WideArea>
      <Panel a={S(4)} b={E(4) - 0.2}>
        <Header kicker="Idée clé 2" title="Le DPE a changé de règle" t0={S(4)} />
        <div style={{ display: "flex", gap: 40, marginTop: 30 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 14, marginBottom: 30 }}>
              <In t0={A(s, "date de mars")} block={false}><Tag style={{ fontSize: 26 }}>DPE de mars 2023 · D02</Tag></In>
              <In t0={A(s, "chauffé à")} block={false}><Tag bg={C.os} color={C.od} style={{ fontSize: 26 }}>Chauffage électrique</Tag></In>
            </div>
            <In t0={A(s, "à l'époque")}>
              <div style={{ fontSize: 26, color: C.muted, marginBottom: 6 }}>Avant 2026 : coefficient électricité 2,3</div>
            </In>
            <Eq dim={t > dep + 0.3} parts={[[A(s, "cent cinquante kilowattheures"), "150"], [A(s, "fois deux virgule trois"), "× 2,3"],
              [A(s, "trois cent quarante-cinq"), "= 345"], [tF, "→ F", C.dpe.F]]} />
            <In t0={dep} style={{ marginTop: 36 }}>
              <Card style={{ background: C.gt, border: `2px solid ${C.gl}`, padding: "18px 26px" }}>
                <div style={{ fontSize: 26, color: C.g, fontWeight: 600 }}>Depuis le 1ᵉʳ janvier 2026</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: C.gd }}>Coefficient électricité : <Underline t0={A(s, "un virgule neuf")}>1,9</Underline></div>
              </Card>
            </In>
            <div style={{ marginTop: 30 }}>
              <Eq parts={[[A(s, "cent cinquante fois"), "150"], [A(s, "cent cinquante fois") + 0.5, "× 1,9"],
                [A(s, "deux cent quatre-vingt-cinq"), "= 285"], [tE, "→ E", C.dpe.E]]} />
              <In t0={A(s, "deux cent quatre-vingt-cinq") + 0.3}><div style={{ fontSize: 22, color: C.muted, marginTop: 4 }}>kWhEP/m²/an · sans travaux</div></In>
            </div>
          </div>
          <In t0={A(s, "à l'époque")} style={{ width: 600 }}><DpeScale marker={[tF, tE]} /></In>
        </div>
        <In t0={att} style={{ position: "absolute", left: 0, top: 650 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Bubble name="doc" bg={C.g} color="#fff" size={58} icon={32} />
            <span style={{ fontSize: 30, fontWeight: 600, color: C.gd }}>Attestation actualisée <b style={{ color: C.o }}>gratuite</b> · observatoire DPE de l'ADEME · D03</span>
          </div>
        </In>
      </Panel>
    </WideArea>
    <Chip a={A(s, "les deux agences")} b={E(4) - 0.1} kicker="Ton avantage">Les deux agences ne l'ont pas regardé</Chip>
    </>
  );
};

// S6 — démarchage
const S6 = () => {
  const s = 5, t = useT();
  if (t < S(5) - 1 || t > E(5) + 1) return null;
  const cons = A(s, "le consentement doit"), bn = A(s, "bonne nouvelle"), coch = A(s, "a coché");
  const items = [["nominatif", "Nominatif"], ["à ton agence", "À ton agence"], ["pour un objet", "Pour un objet précis"],
    ["une durée", "1 an maximum"], ["tu dois pouvoir", "Preuve conservée 3 ans"]];
  return (
    <SideArea>
      <Panel a={S(5)} b={cons - 0.3}>
        <Header kicker="Idée clé 3" title="Plus d'appel sans consentement" t0={S(5)} />
        <In t0={A(s, "depuis le onze")} scale style={{ marginTop: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <Bubble name="calendar" bg={C.o} color="#fff" size={110} icon={60} />
            <div style={{ fontSize: 96, fontWeight: 700, color: C.gd }}>11 août 2026</div>
          </div>
        </In>
        <In t0={A(s, "sans son consentement")} style={{ marginTop: 34 }}>
          <Card style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <Bubble name="phone" bg={C.kos} color={C.ko} />
            <div style={{ fontSize: 32, color: C.ink }}>Démarchage téléphonique d'un particulier : <b>consentement préalable obligatoire</b></div>
          </Card>
        </In>
        <In t0={A(s, "bloctel")} style={{ marginTop: 26 }}>
          <span style={{ fontSize: 46, fontWeight: 700, color: C.muted }}><Strike t0={A(s, "a disparu")}>Bloctel</Strike></span>
          <span style={{ fontSize: 30, color: C.ko, fontWeight: 600, marginLeft: 20 }}>supprimé</span>
        </In>
      </Panel>
      <Panel a={cons} b={bn - 0.3}>
        <In t0={cons}><div style={{ fontSize: 44, fontWeight: 700, color: C.gd, marginBottom: 24 }}>Un consentement valable, c'est :</div></In>
        {items.map(([k, l]) => (
          <In key={k} t0={A(s, k)} dx={-30} dy={0} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 14 }}>
            <Bubble name="check" bg={C.g} color="#fff" size={52} icon={30} />
            <span style={{ fontSize: 34, fontWeight: 600 }}>{l}</span>
          </In>
        ))}
        <div style={{ display: "flex", gap: 18, marginTop: 24 }}>
          <In t0={A(s, "les sanctions")} style={{ flex: 1 }}>
            <Card style={{ background: C.kos, border: "none", padding: "18px 24px" }}>
              <div style={{ fontSize: 22, color: C.ko, fontWeight: 600 }}>Sanction (personne physique)</div>
              <div style={{ fontSize: 44, fontWeight: 700, color: C.ko }}>jusqu'à 75 000 €</div>
            </Card>
          </In>
          <In t0={A(s, "et un contrat")} style={{ flex: 1 }}>
            <Card style={{ background: C.kos, border: "none", padding: "18px 24px" }}>
              <div style={{ fontSize: 22, color: C.ko, fontWeight: 600 }}>Contrat après démarchage illicite</div>
              <div style={{ fontSize: 44, fontWeight: 700, color: C.ko }}>= nul</div>
            </Card>
          </In>
        </div>
      </Panel>
      <Panel a={bn} b={E(5) - 0.2}>
        <In t0={bn}><div style={{ fontSize: 30, fontWeight: 600, color: C.ok, textTransform: "uppercase", letterSpacing: 2 }}>Bonne nouvelle</div></In>
        <In t0={bn + 0.4} style={{ marginTop: 16 }}>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ background: C.gt, padding: "14px 26px", fontSize: 24, color: C.g, fontWeight: 600, borderBottom: `1px solid ${C.line}` }}>
              Site de ton agence · Demande d'estimation</div>
            <div style={{ padding: "22px 26px" }}>
              {[["Nom", "M. Bernard"], ["Bien", "T4 · 76 m² · Melun"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12 }}>
                  <div style={{ width: 90, fontSize: 22, color: C.muted }}>{k}</div>
                  <div style={{ flex: 1, border: `1px solid ${C.line}`, borderRadius: 10, padding: "8px 14px", fontSize: 26 }}>{v}</div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginTop: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, border: `3px solid ${C.g}`, flex: "none", display: "flex",
                  alignItems: "center", justifyContent: "center", background: t >= coch ? C.g : "#fff",
                  transform: `scale(${1 + 0.25 * Math.max(0, 1 - Math.abs(t - coch - 0.15) * 4)})` }}>
                  {t >= coch && <Icon name="check" color="#fff" size={34} stroke={5} />}
                </div>
                <div style={{ fontSize: 27, lineHeight: 1.35 }}>J'accepte d'être recontacté par <b>[ton agence]</b> au sujet de <Underline t0={A(s, "de son dpe")}>mon DPE</Underline> et de <Underline t0={A(s, "l'estimation de")}>l'estimation de mon bien</Underline></div>
              </div>
            </div>
          </Card>
        </In>
        <In t0={A(s, "tu as donc")} scale style={{ marginTop: 26 }}>
          <div style={{ display: "inline-flex", gap: 14, alignItems: "center", background: C.g, color: "#fff", borderRadius: 999, padding: "12px 30px" }}>
            <Icon name="check" color="#fff" size={36} /><span style={{ fontSize: 34, fontWeight: 700 }}>Tu peux l'appeler · sur cet objet-là</span>
          </div>
        </In>
      </Panel>
    </SideArea>
  );
};

// S7 — les 5 techniques
const S7 = () => {
  const s = 6, t = useT();
  if (t < S(6) - 1 || t > E(6) + 1) return null;
  const rem = A(s, "tu remarques"), ch = A(s, "et chaque technique");
  const steps = [
    [A(s, "un le contact"), "Contact consenti", "Formulaire", A(s, "tu lui écris"), "Message + créneau"],
    [A(s, "deux la vérification"), "DPE vérifié", "D02 · D03", A(s, "tu relèves"), "N° ADEME → E"],
    [A(s, "trois l'avis"), "Avis de valeur", "D12", A(s, "sur les ventes"), "Ventes réelles, pas un %"],
    [A(s, "quatre un plan"), "Plan de vente", "Écrit", A(s, "écrit et daté"), "Écrit et daté"],
    [A(s, "cinq l'exclusivité"), "Exclusivité", "D18", A(s, "contre des services"), "Contre des services écrits"],
  ];
  const fill = (() => { let k = 0; steps.forEach(([t0], i) => { if (t >= t0) k = i + prog(t, t0, 0.6); }); return k; })();
  return (
    <>
      <WideArea>
        <Panel a={S(6)} b={rem - 0.3}>
          <Header kicker="La démonstration" title="3 changements → 5 nouvelles techniques de prise de mandat" t0={S(6)} />
          <div style={{ position: "relative", marginTop: 80 }}>
            <div style={{ position: "absolute", left: 140, right: 140, top: 58, height: 8, borderRadius: 4, background: C.line }} />
            <div style={{ position: "absolute", left: 140, top: 58, height: 8, borderRadius: 4, background: C.gl,
              width: `${Math.max(0, Math.min(4, fill - 1)) / 4 * 1180}px` }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {steps.map(([t0, l, tag, t1, sub], i) => {
                const on = t >= t0;
                return (
                  <div key={l} style={{ width: 280, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                    <div style={{ width: 124, height: 124, borderRadius: 62, background: on ? C.g : "#fff", border: `4px solid ${on ? C.g : C.line}`,
                      color: on ? "#fff" : C.muted, fontSize: 56, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
                      transform: `scale(${0.85 + 0.15 * springAt(t, t0)})`, position: "relative", zIndex: 2 }}>{i + 1}</div>
                    <In t0={t0 + 0.1}><div style={{ fontSize: 32, fontWeight: 700, color: C.gd, marginTop: 20 }}>{l}</div></In>
                    <In t0={t0 + 0.3}><Tag bg={C.os} color={C.od} style={{ marginTop: 10 }}>{tag}</Tag></In>
                    <In t0={t1}><div style={{ fontSize: 24, color: C.muted, marginTop: 12 }}>{sub}</div></In>
                  </div>
                );
              })}
            </div>
          </div>
        </Panel>
      </WideArea>
      <Chip a={rem} b={A(s, "tu parles de lui") - 0.15} kicker="Tu remarques ?">Jamais un mot sur ton agence</Chip>
      <Chip a={A(s, "tu parles de lui")} b={ch - 0.2} kicker="Tu parles de">Lui · son bien · ses pièces</Chip>
      <SideArea>
        <Panel a={ch} b={E(6) - 0.2}>
          <Header kicker="Chaque technique répond à un changement" title="Le marché bouge, tu t'adaptes" t0={ch} />
          <div style={{ marginTop: 36 }}>
            {[["le vendeur compare", "Le vendeur compare", "tu prouves"], ["le dpe a changé", "Le DPE a changé", "tu vérifies"],
              ["l'appel à froid", "L'appel à froid est interdit", "tu travailles avec ceux qui t'ont dit oui"]].map(([k, a, b]) => {
              const t0 = A(s, k);
              return (
                <In key={k} t0={t0} dx={-30} dy={0} style={{ marginBottom: 22 }}>
                  <Card style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 26px" }}>
                    <div style={{ flex: 1, fontSize: 30, color: C.muted, fontWeight: 600 }}>{a}</div>
                    <Icon name="arrow" color={C.o} size={44} />
                    <div style={{ flex: 1.2, fontSize: 32, color: C.gd, fontWeight: 700 }}><In t0={t0 + 0.9} block={false}>{b}</In></div>
                  </Card>
                </In>
              );
            })}
          </div>
          <In t0={A(s, "c'est le fil")} style={{ marginTop: 10 }}><Tag style={{ fontSize: 28, padding: "10px 24px" }}>Le fil de tout ce module</Tag></In>
        </Panel>
      </SideArea>
    </>
  );
};

// S8 — erreurs
const S8 = () => {
  const s = 7, t = useT();
  if (t < S(7) - 1 || t > E(7) + 1) return null;
  const last = A(s, "il y a une"), ing = A(s, "lui il a été");
  const errs = [[A(s, "reprendre le"), "Reprendre le −15 % sans région, sans année, sans source"],
    [A(s, "appliquer la"), "Appliquer la baisse nationale à un bien précis"],
    [A(s, "appeler un fichier"), "Appeler des numéros relevés sur des annonces", A(s, "c'est interdit"), "Interdit"],
    [A(s, "et promettre"), "Promettre le prix le plus haut", A(s, "ça finit"), "→ baisse de prix 3 mois plus tard"]];
  return (
    <>
      <SideArea>
        <Panel a={S(7)} b={last - 0.3}>
          <Header kicker="À éviter" title="Les erreurs les plus fréquentes" t0={S(7)} color={C.ko} />
          <div style={{ marginTop: 34 }}>
            {errs.map(([t0, l, t1, tag]) => (
              <In key={l} t0={t0} dx={-30} dy={0} style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 22 }}>
                <Bubble name="ban" bg={C.kos} color={C.ko} size={68} icon={40} />
                <div>
                  <div style={{ fontSize: 33, fontWeight: 600, color: C.ink, lineHeight: 1.2 }}>{l}</div>
                  {tag && <In t0={t1}><span style={{ fontSize: 26, fontWeight: 700, color: C.ko }}>{tag}</span></In>}
                </div>
              </In>
            ))}
          </div>
        </Panel>
        <Panel a={last} b={ing - 0.3}>
          <Header kicker="La plus discrète" title="Parler du DPE sans l'avoir lu" t0={last} color={C.ko} />
          <div style={{ display: "flex", gap: 24, marginTop: 50 }}>
            <In t0={A(s, "si tu dis")} style={{ flex: 1 }}>
              <Card style={{ background: C.kos, border: "none", height: 260 }}>
                <div style={{ fontSize: 26, color: C.ko, fontWeight: 600 }}>Ce que tu dis</div>
                <div style={{ fontSize: 58, fontWeight: 700, color: C.ko, marginTop: 20 }}><Strike t0={A(s, "alors que")}>« Passoire »</Strike></div>
              </Card>
            </In>
            <In t0={A(s, "alors que")} style={{ flex: 1 }}>
              <Card style={{ background: C.gt, border: `2px solid ${C.gl}`, height: 260 }}>
                <div style={{ fontSize: 26, color: C.g, fontWeight: 600 }}>Ce que dit l'attestation</div>
                <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 20 }}>
                  <div style={{ background: C.dpe.E, color: "#fff", fontSize: 64, fontWeight: 700, borderRadius: 16, padding: "0 30px" }}>E</div>
                  <span style={{ fontSize: 30, color: C.gd, fontWeight: 600 }}>D03</span>
                </div>
              </Card>
            </In>
          </div>
          <In t0={A(s, "tu viens de perdre")} style={{ marginTop: 30 }}>
            <span style={{ fontSize: 34, fontWeight: 600, color: C.ko }}>→ un vendeur prudent perdu</span>
          </In>
        </Panel>
      </SideArea>
      <Chip a={A(s, "il relira")} b={E(7) - 0.1} kicker="M. Bernard, ancien ingénieur">Il relira chaque chiffre</Chip>
    </>
  );
};

// S9 — ce que tu fais maintenant
const S9 = () => {
  const s = 8, t = useT();
  if (t < S(8) - 1 || t > E(8) + 1) return null;
  const steps = [[A(s, "d'abord le quiz"), "quiz", "Quiz flash", "tout de suite, pendant que c'est frais"],
    [A(s, "ensuite tu"), "doc", "Fiche Réglementation et tendances 2026", "chiffres sourcés et datés"],
    [A(s, "puis l'exercice"), "pen", "Exercice", "3 changements chez tes clients + ta réponse"],
    [A(s, "tu le déposes"), "upload", "Livrable", "tu le déposes, Seb le relit"]];
  return (
    <SideArea>
      <Panel a={S(8)} b={A(s, "on se retrouve") - 0.3}>
        <Header kicker="À toi" title="Ce que tu fais maintenant" t0={S(8)} />
        <div style={{ marginTop: 34 }}>
          {steps.map(([t0, ic, l, sub], i) => {
            const on = t >= t0;
            return (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 22, opacity: 0.35 + 0.65 * prog(t, t0, 0.4) }}>
                <div style={{ transform: `scale(${0.9 + 0.1 * springAt(t, t0)})` }}>
                  <Bubble name={ic} bg={on ? C.g : C.line} color={on ? "#fff" : C.muted} size={84} icon={46} /></div>
                <div>
                  <div style={{ fontSize: 22, color: C.o, fontWeight: 600 }}>Étape {i + 1}</div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: C.gd }}>{l}</div>
                  <div style={{ fontSize: 24, color: C.muted }}>{sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </SideArea>
  );
};

// ================================================================ COMPOSITION
export const Video = () => (
  <AbsoluteFill style={{ fontFamily: FONT, color: C.ink, overflow: "hidden" }}>
    <Backdrop />
    <LayerCtx.Provider value="g"><Scenes /></LayerCtx.Provider>
    <Avatar />
    <Chrome />
    <LayerCtx.Provider value="c"><Scenes /></LayerCtx.Provider>
    <Subtitles />
    <Outro />
    <Intro />
  </AbsoluteFill>
);
// Les scènes sont rendues deux fois : calque "g" (panneaux, sous Seb) puis calque "c" (bandeaux, au-dessus de Seb)
const Scenes = () => (<><S1 /><S2 /><S3 /><S4 /><S5 /><S6 /><S7 /><S8 /><S9 /></>);

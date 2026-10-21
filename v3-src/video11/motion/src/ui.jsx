// Briques visuelles + calage sur la parole (anchors)
import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "./remotion-lite.js";
import TM from "./timing.json";

export const C = {
  gd: "#0F5A31", g: "#1A7A44", gl: "#2EA56E", gs: "#E3F2E9", gt: "#F3FAF6",
  o: "#FF8D16", od: "#B85A00", os: "#FFF1E0", ink: "#1F1F1F", muted: "#5B6560",
  line: "#E1E5E2", ko: "#C62828", kos: "#FCE6E4", ok: "#1F8A4C",
  dpe: { A: "#00965E", B: "#4BAA48", C: "#A6C83A", D: "#F2D300", E: "#F2A900", F: "#E8742A", G: "#D9231C" },
};
export const FONT = "Poppins, sans-serif";
export const TIMING = TM;

// ---------- temps ----------
export const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return f / fps; };
const norm = (s) => s.toLowerCase().replace(/’/g, "'").replace(/[«»"“”.,:;!?()…]/g, "").trim();
const missing = [];
export const anchorErrors = missing;
// A(seg, "mots prononcés") : instant global (s) où Seb commence la phrase ; end=true → fin du dernier mot
export function A(seg, phrase, end = false) {
  const toks = phrase.split(/\s+/).map(norm).filter(Boolean);
  const ws = TM.segs[seg].words.filter((w) => norm(w.t) !== "");
  for (let i = 0; i + toks.length <= ws.length; i++) {
    let ok = true;
    for (let j = 0; j < toks.length; j++) if (norm(ws[i + j].t) !== toks[j]) { ok = false; break; }
    if (ok) return end ? ws[i + toks.length - 1].e : ws[i].s;
  }
  missing.push(`S${seg + 1}: « ${phrase} »`);
  return TM.segs[seg].start;
}
export const S = (seg) => TM.segs[seg].start;
export const E = (seg) => TM.segs[seg].end;

export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
export const prog = (t, t0, d = 0.55, e = ease) => interpolate(t, [t0, t0 + d], [0, 1], { ...clamp, easing: e });
export const springAt = (t, t0, fps = 30, cfg = { damping: 13, stiffness: 150 }) =>
  t < t0 ? 0 : spring({ frame: (t - t0) * fps, fps, config: cfg });

// ---------- conteneurs ----------
// Panel visible de a à b, entrée + sortie douces
export const LayerCtx = React.createContext("g");
export const Panel = ({ a, b, children, style }) => {
  const t = useT();
  if (React.useContext(LayerCtx) !== "g") return null;
  if (t < a - 0.01 || t > b + 0.45) return null;
  const pin = prog(t, a, 0.5), pout = prog(t, b, 0.4);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: pin * (1 - pout),
      transform: `translateY(${(1 - pin) * 26 - pout * 18}px)`, ...style }}>{children}</div>
  );
};
// Élément qui apparaît à t0 (ressort)
export const In = ({ t0, children, style, dy = 28, dx = 0, scale = false, block = true }) => {
  const t = useT();
  const s = springAt(t, t0);
  const o = prog(t, t0, 0.35);
  const sc = scale ? 0.85 + 0.15 * s : 1;
  return (
    <div style={{ opacity: o, transform: `translate(${(1 - s) * dx}px, ${(1 - s) * dy}px) scale(${sc})`,
      display: block ? "block" : "inline-block", ...style }}>{children}</div>
  );
};
export const Card = ({ children, style }) => (
  <div style={{ background: "#fff", borderRadius: 26, border: `1px solid ${C.line}`,
    boxShadow: "0 18px 40px rgba(15,90,49,0.10)", padding: "26px 30px", ...style }}>{children}</div>
);
export const Tag = ({ children, color = C.g, bg = C.gs, style }) => (
  <span style={{ display: "inline-block", padding: "6px 16px", borderRadius: 999, background: bg, color,
    fontWeight: 600, fontSize: 22, letterSpacing: 0.2, ...style }}>{children}</span>
);
// Compteur animé (chiffre qui s'incrémente)
export const Count = ({ t0, d = 1.1, to, from = 0, fmt }) => {
  const t = useT();
  const v = from + (to - from) * prog(t, t0, d, Easing.bezier(0.16, 1, 0.3, 1));
  return <>{fmt(v)}</>;
};
export const fr = (n, dec = 0) => n.toFixed(dec).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// Zones de contenu selon la mise en page
export const SideArea = ({ children }) => (
  <div style={{ position: "absolute", left: 96, top: 150, width: 1030, height: 760 }}>{children}</div>
);
export const WideArea = ({ children }) => (
  <div style={{ position: "absolute", left: 96, top: 150, width: 1460, height: 640 }}>{children}</div>
);
export const Header = ({ kicker, title, t0, color = C.o }) => (
  <In t0={t0} dy={18}>
    <div style={{ fontSize: 24, fontWeight: 600, color, textTransform: "uppercase", letterSpacing: 2 }}>{kicker}</div>
    <div style={{ fontSize: 50, fontWeight: 700, color: C.gd, lineHeight: 1.12, marginTop: 6 }}>{title}</div>
  </In>
);
// Trait de surlignage qui se dessine sous un mot
export const Underline = ({ t0, color = C.o, children }) => {
  const t = useT(); const p = prog(t, t0, 0.5);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {children}
      <span style={{ position: "absolute", left: 0, bottom: -4, height: 8, borderRadius: 4, background: color,
        width: `${p * 100}%`, opacity: 0.85 }} />
    </span>
  );
};
// Barré qui se dessine
export const Strike = ({ t0, color = C.ko, children }) => {
  const t = useT(); const p = prog(t, t0, 0.4);
  return (
    <span style={{ position: "relative", display: "inline-block", opacity: 1 - 0.45 * p }}>
      {children}
      <span style={{ position: "absolute", left: -4, top: "52%", height: 5, borderRadius: 3, background: color,
        width: `calc(${p * 100}% + 8px)` }} />
    </span>
  );
};

// ---------- icônes (SVG, sans marque) ----------
export const Icon = ({ name, size = 40, color = C.g, stroke = 3 }) => {
  const p = { fill: "none", stroke: color, strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    check: <path {...p} d="M8 21l8 8 16-17" />,
    ban: <><circle {...p} cx="20" cy="20" r="15" /><path {...p} d="M9.5 30.5l21-21" /></>,
    phone: <path {...p} d="M13 6h-4a3 3 0 0 0-3 3c0 14 11 25 25 25a3 3 0 0 0 3-3v-4l-7-3-3 3c-4-2-7-5-9-9l3-3z" />,
    doc: <><path {...p} d="M11 5h13l7 7v23H11z" /><path {...p} d="M24 5v7h7M16 20h10M16 26h10" /></>,
    house: <><path {...p} d="M6 19L20 7l14 12" /><path {...p} d="M10 16v17h20V16" /><path {...p} d="M17 33v-8h6v8" /></>,
    arrow: <path {...p} d="M6 20h26M24 12l8 8-8 8" />,
    down: <path {...p} d="M20 6v26M12 24l8 8 8-8" />,
    quiz: <><circle {...p} cx="20" cy="20" r="15" /><path {...p} d="M15 16a5 5 0 1 1 7 4.5c-1.5.7-2 1.5-2 3M20 28v.5" /></>,
    pen: <><path {...p} d="M8 32l4-1 18-18-3-3L9 28z" /><path {...p} d="M24 9l3 3" /></>,
    upload: <><path {...p} d="M20 26V8M13 15l7-7 7 7" /><path {...p} d="M8 26v6h24v-6" /></>,
    bolt: <path {...p} d="M22 4L9 23h10l-2 13 14-20H21z" />,
    calendar: <><rect {...p} x="6" y="9" width="28" height="25" rx="3" /><path {...p} d="M6 16h28M13 5v7M27 5v7" /></>,
    euro: <path {...p} d="M29 10a11 11 0 1 0 0 20M7 17h16M7 23h16" />,
    user: <><circle {...p} cx="20" cy="14" r="7" /><path {...p} d="M7 34c2-7 7-10 13-10s11 3 13 10" /></>,
    search: <><circle {...p} cx="17" cy="17" r="10" /><path {...p} d="M25 25l9 9" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 40 40">{paths[name]}</svg>;
};
export const Bubble = ({ name, bg = C.gs, color = C.g, size = 64, icon = 36 }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: bg, display: "flex",
    alignItems: "center", justifyContent: "center", flex: "none" }}><Icon name={name} size={icon} color={color} /></div>
);

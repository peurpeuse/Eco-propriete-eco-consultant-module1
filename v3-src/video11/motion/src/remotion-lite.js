// Sous-ensemble compatible de l'API Remotion (useCurrentFrame, useVideoConfig, interpolate,
// spring, Easing, AbsoluteFill, Sequence). Le registre npm n'étant pas accessible dans
// l'environnement de rendu, ce module reproduit les mêmes signatures : pour passer sur
// Remotion, il suffit de remplacer l'import par `from "remotion"`.
import React, { createContext, useContext } from "react";

const FrameCtx = createContext(0);
const ConfigCtx = createContext({ fps: 30, width: 1920, height: 1080, durationInFrames: 1 });

export const FrameProvider = ({ frame, config, children }) =>
  React.createElement(ConfigCtx.Provider, { value: config },
    React.createElement(FrameCtx.Provider, { value: frame }, children));

export const useCurrentFrame = () => useContext(FrameCtx);
export const useVideoConfig = () => useContext(ConfigCtx);

export const Easing = {
  linear: (t) => t,
  quad: (t) => t * t,
  cubic: (t) => t * t * t,
  bezier: (x1, y1, x2, y2) => {
    // cubic-bezier, résolution de x par Newton
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = (t) => ((ax * t + bx) * t + cx) * t;
    const sy = (t) => ((ay * t + by) * t + cy) * t;
    const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
    return (x) => {
      let t = x;
      for (let i = 0; i < 8; i++) { const d = dx(t); if (Math.abs(d) < 1e-6) break; t -= (sx(t) - x) / d; }
      return sy(Math.min(1, Math.max(0, t)));
    };
  },
  in: (e) => e,
  out: (e) => (t) => 1 - e(1 - t),
  inOut: (e) => (t) => (t < 0.5 ? e(t * 2) / 2 : 1 - e((1 - t) * 2) / 2),
};

export function interpolate(input, inputRange, outputRange, opts = {}) {
  const { easing = (t) => t, extrapolateLeft = "extend", extrapolateRight = "extend" } = opts;
  let i = 1;
  while (i < inputRange.length - 1 && input > inputRange[i]) i++;
  const [a, b] = [inputRange[i - 1], inputRange[i]];
  const [c, d] = [outputRange[i - 1], outputRange[i]];
  let t = (input - a) / (b - a || 1);
  if (t < 0 && extrapolateLeft === "clamp") t = 0;
  if (t > 1 && extrapolateRight === "clamp") t = 1;
  if (t >= 0 && t <= 1) t = easing(t);
  return c + (d - c) * t;
}

// Ressort amorti (même modèle physique que Remotion : masse, raideur, amortissement)
export function spring({ frame, fps, config = {}, from = 0, to = 1, durationInFrames }) {
  const { damping = 12, mass = 1, stiffness = 120, overshootClamping = false } = config;
  if (frame <= 0) return from;
  const steps = Math.round(frame * 4), dt = 1 / (fps * 4);
  let x = 0, v = 0;
  for (let s = 0; s < steps; s++) {
    const a = (-stiffness * (x - 1) - damping * v) / mass;
    v += a * dt; x += v * dt;
  }
  if (overshootClamping && x > 1) x = 1;
  return from + (to - from) * x;
}

export const AbsoluteFill = ({ style, children, ...rest }) =>
  React.createElement("div", { ...rest, style: { position: "absolute", inset: 0, ...style } }, children);

// Sequence : décale le temps des enfants, les monte seulement entre from et from+duration
export const Sequence = ({ from = 0, durationInFrames = Infinity, children }) => {
  const frame = useCurrentFrame(); const config = useVideoConfig();
  if (frame < from || frame >= from + durationInFrames) return null;
  return React.createElement(FrameCtx.Provider, { value: frame - from }, children);
};

export const _config = ConfigCtx;

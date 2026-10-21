import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { FrameProvider } from "./remotion-lite.js";
import { Video } from "./Video.jsx";
import { anchorErrors, TIMING } from "./ui.jsx";

const config = { fps: TIMING.fps, width: 1920, height: 1080, durationInFrames: TIMING.frames };
const root = createRoot(document.getElementById("root"));
window.__config = config;
window.__setFrame = async (f) => {
  flushSync(() => root.render(<FrameProvider frame={f} config={config}><Video /></FrameProvider>));
  const img = document.getElementById("avatar");
  if (img) { try { await img.decode(); } catch (e) {} }
  await document.fonts.ready;
  return anchorErrors.length;
};
window.__anchorErrors = anchorErrors;

// État publié par Claude : corrections déjà reportées (applied) et mises en production (prod).
// Claude l'écrit dans le dépôt GitHub (v3-src/validation/state.json) ; on le relit ici sans cache.
const SRC = "https://raw.githubusercontent.com/peurpeuse/eco-propriete-eco-consultant-module1/main/v3-src/validation/state.json";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const r = await fetch(SRC + "?t=" + Date.now(), { cache: "no-store" });
    if (!r.ok) return res.status(200).json({ applied: {}, prod: {} });
    const s = await r.json();
    return res.status(200).json({ applied: s.applied || {}, prod: s.prod || {}, at: s.at || null });
  } catch (e) {
    return res.status(200).json({ applied: {}, prod: {} });
  }
}

// Récapitulatif des validations, en Markdown, pour le fichier Google Drive que Claude lit avant toute production.
// Accès réservé à la clé d'administration (ADMIN_KEY). GET /api/recap?k=…
import { list } from "@vercel/blob";
import { createHash } from "node:crypto";

const RAW = "https://raw.githubusercontent.com/peurpeuse/eco-propriete-eco-consultant-module1/main/";
const ROLES = { DIR: "Décideur", FORM: "Formateur", JUR: "Juriste / notaire", TECH: "Technique bâtiment", FIN: "Financement", VID: "Vidéo" };
const PARTS = { video: "Vidéo", quiz: "Quiz", fiche: "Fiche", exo: "Exercice", livrable: "Livrable", module: "Module" };
const REF = { obj: "Objectif", fiche: "Fiche PDF", entree: "Module · entrée → sortie", cas: "Cas pratique · énoncé", "ex:contexte": "Exercice · consigne" };

function refLabel(ref) {
  if (REF[ref]) return REF[ref];
  const [k, ...v] = ref.split(":"); const x = v.join(":");
  return ({ seg: "Script · " + x, q: "Quiz · question " + x, ex: "Exercice · étape " + x, liv: "Livrable · critère " + x })[k] || ref;
}
const fr = (iso) => iso ? new Date(iso).toLocaleString("fr-FR", { timeZone: "Africa/Casablanca", dateStyle: "short", timeStyle: "short" }) : "?";
const q = (t) => String(t || "").replace(/\s+/g, " ").trim();

async function getJson(url) { const r = await fetch(url + "?t=" + Date.now(), { cache: "no-store" }); if (!r.ok) throw new Error(url + " " + r.status); return r.json(); }

async function loadDocs() {
  const root = (process.env.BLOB_PREFIX || "validation") + "/avis/";
  const blobs = []; let cursor;
  do { const r = await list({ prefix: root, cursor, limit: 1000 }); blobs.push(...r.blobs); cursor = r.hasMore ? r.cursor : undefined; } while (cursor);
  const latest = {};
  for (const b of blobs) { const uid = b.pathname.slice(root.length).split("/")[0]; if (!latest[uid] || new Date(b.uploadedAt) > new Date(latest[uid].uploadedAt)) latest[uid] = b; }
  const docs = {};
  await Promise.all(Object.entries(latest).map(async ([uid, b]) => { const r = await fetch(b.url, { cache: "no-store" }); if (r.ok) docs[uid] = await r.json(); }));
  return docs;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const k = req.headers["x-key"] || (req.query && req.query.k) || "";
  if (!k || k !== process.env.ADMIN_KEY) return res.status(401).send("clé manquante ou invalide");
  try {
    const [docs, data, state] = await Promise.all([loadDocs(), getJson(RAW + "validation-site/data.json"), getJson(RAW + "v3-src/validation/state.json").catch(() => ({ applied: {}, prod: {} }))]);
    // on ne garde que les membres qui ont un rôle (les autres n'ont encore rien fait)
    const team = Object.fromEntries(Object.entries(docs).filter(([, d]) => d && d.role));
    const who = (u) => (q(team[u] && team[u].name) || "Quelqu'un") + " (" + (ROLES[team[u] && team[u].role] || "?") + ")";
    const items = data.items || [];
    const byId = Object.fromEntries(items.map((it) => [it.id, it]));
    const keyName = (key) => /\./.test(String(key)) ? "Capsule " + key + " · " + ((byId[key] || {}).title || "") : "Module " + key + " (toutes ses capsules)";

    const sig = createHash("sha1").update(JSON.stringify(team)).digest("hex").slice(0, 12);
    let last = null;
    for (const d of Object.values(team)) for (const r of Object.values(d.items || {})) for (const t of [r.at, ...Object.values(r.edits || {}).map((e) => e.at)]) if (t && (!last || t > last)) last = t;

    // demandes de mise en production pas encore traitées
    const pending = [];
    for (const [u, d] of Object.entries(team)) {
      if (d.role !== "DIR") continue;
      for (const [key, p] of Object.entries(d.prod || {})) {
        const done = (state.prod || {})[key];
        if (!done || done.at < p.at) pending.push({ key, at: p.at, by: u });
      }
    }

    const L = [];
    L.push("# Validations Éco-Consultant — état au " + fr(new Date().toISOString()));
    L.push("");
    L.push("Signature : " + sig + " · dernière modification : " + fr(last) + " · page : https://eco-consultant-validation.vercel.app");
    L.push("");
    L.push("> Fichier généré automatiquement depuis la page de validation en ligne. Claude le lit avant toute mise en production : il applique les corrections listées ici pour l'élément envoyé, puis produit (vidéo, fiches PDF, SCORM, publication). Tant qu'un élément n'est pas envoyé en production, rien n'est créé.");
    L.push("");
    L.push("## Équipe");
    if (!Object.keys(team).length) L.push("- Personne n'a encore donné d'avis.");
    for (const [u, d] of Object.entries(team)) {
      const its = Object.values(d.items || {});
      L.push("- " + who(u) + " : " + its.filter((r) => r.s === "ok").length + " validé(s), " + its.filter((r) => r.s === "fix").length + " avec corrections");
    }
    L.push("");
    L.push("## 🚀 Demandes de mise en production en attente");
    if (!pending.length) L.push("- Aucune.");
    for (const p of pending) L.push("- [" + p.key + "] " + keyName(p.key) + " — demandée par " + who(p.by) + " le " + fr(p.at));
    L.push("");
    L.push("## Détail par élément");
    let any = false;
    for (const it of items) {
      const lines = [];
      for (const [u, d] of Object.entries(team)) {
        const r = (d.items || {})[it.id]; if (!r) continue;
        const head = "- " + who(u) + " : " + (r.s === "ok" ? "✓ validé" : r.s === "fix" ? "✏️ corrections" : "en cours") + (r.at ? " (" + fr(r.at) + ")" : "");
        const sub = [];
        for (const [p, v] of Object.entries(r.parts || {})) if (v.s === "fix") sub.push("  - Partie à corriger : " + (PARTS[p] || p) + (v.note ? " — « " + q(v.note) + " »" : ""));
        if (r.note) sub.push("  - Remarque générale : « " + q(r.note) + " »");
        for (const [ref, e] of Object.entries(r.edits || {})) sub.push("  - Passage « " + refLabel(ref) + " » [" + ref + "]\n    - AVANT : " + q(e.before) + "\n    - APRÈS : " + q(e.after));
        for (const [ref, a] of Object.entries(r.asks || {})) sub.push("  - Question à " + (ROLES[a.role] || a.role) + " sur « " + refLabel(ref) + " » : « " + q(a.q) + " »");
        for (const [key, a] of Object.entries(r.answers || {})) sub.push("  - Réponse (question de " + who(key.split("|")[0]) + " sur « " + refLabel(key.split("|").slice(1).join("|")) + " ») : « " + q(a.text) + " »");
        for (const [ref, c] of Object.entries(r.choix || {})) sub.push("  - Choix du décideur pour « " + refLabel(ref) + " » : " + (c === "orig" ? "garder le texte d'origine" : "version de " + who(c)));
        for (const ref of Object.keys(r.revert || {})) sub.push("  - Retour à l'ancien texte demandé : « " + refLabel(ref) + " »");
        if (head || sub.length) lines.push(head, ...sub);
      }
      if (lines.length) { any = true; L.push("", "### " + (it.kind === "module" ? "Module " + it.mod + " · " + it.title : "Capsule " + it.id + " · " + it.title), ...lines); }
    }
    if (!any) L.push("- Aucun avis pour l'instant.");
    L.push("", "## Données brutes (pour Claude)", "", "```json", JSON.stringify({ signature: sig, pending, docs: team }), "```", "");
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    return res.status(200).send(L.join("\n"));
  } catch (e) {
    return res.status(500).send("Erreur : " + String(e && e.message || e).slice(0, 300));
  }
}

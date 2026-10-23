// Avis de l'équipe de validation, stockés dans Vercel Blob.
// Chaque enregistrement crée un nouveau fichier (avis/<uid>/<horodatage>-xxxx.json) : aucune lecture
// ne peut tomber sur une version en cache ; on garde les 3 dernières versions par personne.
// Accès : clé d'équipe (VALIDATION_KEY) pour la page, clé d'administration (ADMIN_KEY) pour Claude.
// Les clés vivent uniquement dans les variables d'environnement Vercel, jamais dans le code.
import { put, list, del } from "@vercel/blob";

const ROOT = () => (process.env.BLOB_PREFIX || "validation") + "/avis/";
const UID = /^[a-z0-9-]{8,64}$/;

function keyOk(req) {
  const k = req.headers["x-key"] || (req.query && req.query.k) || "";
  return !!k && (k === process.env.VALIDATION_KEY || k === process.env.ADMIN_KEY);
}

async function listAll(prefix) {
  const out = [];
  let cursor;
  do {
    const r = await list({ prefix, cursor, limit: 1000 });
    out.push(...r.blobs);
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return out;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (!keyOk(req)) return res.status(401).json({ error: "clé manquante ou invalide" });
  try {
    if (req.method === "GET") {
      const blobs = await listAll(ROOT());
      const latest = {};
      for (const b of blobs) {
        const uid = b.pathname.slice(ROOT().length).split("/")[0];
        if (!latest[uid] || new Date(b.uploadedAt) > new Date(latest[uid].uploadedAt)) latest[uid] = b;
      }
      const docs = {};
      await Promise.all(Object.entries(latest).map(async ([uid, b]) => {
        const r = await fetch(b.url, { cache: "no-store" });
        if (r.ok) docs[uid] = await r.json();
      }));
      return res.status(200).json({ docs, at: new Date().toISOString() });
    }
    if (req.method === "PUT" || req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const { uid, doc } = body;
      if (!UID.test(uid || "") || !doc || typeof doc !== "object") return res.status(400).json({ error: "requête invalide" });
      const text = JSON.stringify(doc);
      if (text.length > 400000) return res.status(413).json({ error: "avis trop volumineux" });
      const prefix = ROOT() + uid + "/";
      await put(prefix + Date.now() + ".json", text, { access: "public", contentType: "application/json", addRandomSuffix: true });
      // ménage : on ne garde que les 3 dernières versions de cette personne
      const mine = (await listAll(prefix)).sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
      if (mine.length > 3) await del(mine.slice(3).map((b) => b.url));
      return res.status(200).json({ ok: true });
    }
    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "méthode non autorisée" });
  } catch (e) {
    return res.status(500).json({ error: "stockage indisponible", detail: String(e && e.message || e).slice(0, 200) });
  }
}

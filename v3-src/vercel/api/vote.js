// Votes anonymes « As-tu déjà vu un agent faire comme Mozi ? » (écran 3 des chapitres).
// GET  /api/vote?chap=1.3            -> { oui, non }
// POST /api/vote  {"chap":"1.3","oui":true} -> { oui, non }
// Aucune donnée personnelle : seulement deux compteurs par chapitre (table Supabase mozi_votes, via RPC).
// SUPABASE_URL et SUPABASE_PUBLISHABLE_KEY sont dans les variables d'environnement Vercel du projet.
const CHAP = /^[1-9]\.[0-9]{1,2}$/;

async function rpc(fn, args) {
  const r = await fetch(process.env.SUPABASE_URL + '/rest/v1/rpc/' + fn, {
    method: 'POST',
    headers: { apikey: process.env.SUPABASE_PUBLISHABLE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(args)
  });
  if (!r.ok) throw new Error('supabase ' + r.status);
  const rows = await r.json();
  const row = (Array.isArray(rows) ? rows[0] : rows) || {};
  return { oui: row.oui || 0, non: row.non || 0 };
}

module.exports = async function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'GET') {
      const chap = String((req.query || {}).chap || '');
      if (!CHAP.test(chap)) return res.status(400).json({ error: 'chap' });
      return res.status(200).json(await rpc('mozi_results', { p_chap: chap }));
    }
    if (req.method === 'POST') {
      let b = req.body || {};
      if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
      const chap = String(b.chap || '');
      if (!CHAP.test(chap) || typeof b.oui !== 'boolean') return res.status(400).json({ error: 'requête' });
      return res.status(200).json(await rpc('mozi_vote', { p_chap: chap, p_oui: b.oui }));
    }
    return res.status(405).json({ error: 'méthode' });
  } catch (e) {
    return res.status(502).json({ error: 'indisponible' });
  }
};

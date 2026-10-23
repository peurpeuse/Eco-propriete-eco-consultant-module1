// Configuration publique de la page : adresse du projet Supabase et clé publique (publishable).
// Ces valeurs vivent dans les variables d'environnement Vercel, pas dans le code.
// La clé publique ne donne aucun droit sans connexion : les règles RLS de Supabase limitent tout aux personnes connectées.
export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ url: process.env.SUPABASE_URL || "", key: process.env.SUPABASE_PUBLISHABLE_KEY || "" });
}

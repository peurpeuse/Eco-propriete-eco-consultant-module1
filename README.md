# Éco-Consultant · Module 1 (version interactive)

Site statique : un seul fichier `index.html` (contenu, images et logique inclus).

## Déployer sur Vercel
- Glisser-déposer ce dossier sur https://vercel.com/new (onglet « Deploy » sans dépôt Git), ou
- en ligne de commande : `npx vercel deploy --prod` depuis ce dossier.

`vercel.json` ajoute un en-tête `noindex` (contenu en validation, non référencé).
Les réponses des apprenants restent dans leur navigateur (pas de serveur).

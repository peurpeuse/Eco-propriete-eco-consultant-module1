# Identifiants et accès

> **Aucun mot de passe ni aucune clé d'API dans ce fichier.** Les accès passent par les comptes Éco-Propriété connectés à Claude (connecteurs) ou par les comptes de l'équipe.

## Hébergement et code

| Service | Identifiant | Remarque |
|---|---|---|
| GitHub (dépôt) | `peurpeuse/Eco-propriete-eco-consultant-module1`, branche `main` | Sources `v3-src/`, site `v3/`, vidéos `media/` |
| Branches à supprimer | `media`, `media-job` | Restes d'une tentative d'automatisation abandonnée (21/10) |
| Vercel (projet) | `eco-consultant-parcours` · id `prj_kzprq5grDhK0uwtGwHJ3Q6V45Tak` · équipe `ecoproprietemkt-2010` | URL publique : https://eco-consultant-parcours.vercel.app |
| Dernier déploiement (23/10) | `dpl_M7zAXA7UVhQQLc3Sq6UMW9bATFRt` | Chargeur figé sur le commit `6aa9f9c8fd923a49ba4add002a5989a7329878a1` |
| jsDelivr | `https://cdn.jsdelivr.net/gh/peurpeuse/Eco-propriete-eco-consultant-module1@<commit>/v3/` | Fichiers ≤ 20 Mo ; toujours figer sur un commit |
| Vidéo 1.1 (HLS) | `https://cdn.jsdelivr.net/gh/peurpeuse/Eco-propriete-eco-consultant-module1@542a04d646b4f135850de633b28de01c4ea35ba1/media/capsule_1-1/index.m3u8` | Référencée dans `cap_1.1.json` → `video.src` |
| `vercel.json` (racine du dépôt) | En-tête `X-Robots-Tag: noindex` | Site non référencé par Google tant qu'il est en validation |

## Voix · ElevenLabs

| Élément | Valeur |
|---|---|
| Voix de Seb | **SEB** · `voice_id a7jfJz9qTvCsZibWTl5v` |
| Modèle | `eleven_multilingual_v2` |
| Flow de la capsule 1.1 | `OSE8S1VPlsvH7spd5kI2` (9 nœuds de synthèse + 9 transcriptions) |
| Coût observé 1.1 | ≈ 5 970 crédits pour 9 segments (1 076 mots), environ 1,08 $ |
| Limite | 5 000 caractères par génération → un segment par génération |
| Liens audio | URL signées valables 2 h : à régénérer (lecture du flow) juste avant de lancer HeyGen |

## Avatar · HeyGen

| Élément | Valeur |
|---|---|
| Groupe d'avatars SEB | `da13995f3af94156b005d0b8bf4a084c` |
| **Look de référence : SEB -- 5** (digital twin, 1920×1080, paysage) | `d1f37c55937a40fc9d1e008b963a9cc2` · moteurs `avatar_v`, `avatar_iv` |
| Autres looks | SEB -- 4 `31ce5f2c02ca43a7ad80aeff4d6c2d4a` · SEB -- 1 `f91a087969fe4b13941eefd6faea0f36` (v1) · « SEB illustré (Figma) » `b5e02f98b73df6c56669e7b20d9f08cc` |
| Vidéo 1.1 v2 (base avatar) | `9bd9154cfa11cee0f30e17d4a5ea9e0c` · 388,48 s · https://app.heygen.com/videos/9bd9154cfa11cee0f30e17d4a5ea9e0c |
| Vidéo 1.1 v1 (ancienne) | `56f7923d143647be49cf632b8c91dd98` |
| Assets v1 (intro / outro Jitter) | `5a915f8cb9b94ecdabf7be94de3e14e1` / `34c0c2cfd3304e77bd6dc3a25e037332` |

## Visuels

| Outil | Identifiant | Usage |
|---|---|---|
| Canva | design `DAHYoZbiDFc` | 4 slides de la vidéo 1.1 v1 |
| Jitter | fichier `LqcDtNrmXW1JGtqI46hGR8gk` | Intro et outro v1 (plan gratuit : 720p, filigrane) |
| Logo | `v3-src/engine/assets/logo-dark.png`, `logo-white.png` | Logo officiel « écoconsultant — Agent immobilier 3.0 » |
| Figma | Fichier « Éco Propriété » (logo, avatar de Seb, éléments de marque) | Référence de marque |

## Charte

| Jeton | Couleur |
|---|---|
| Vert foncé / vert / vert clair | `#0F5A31` / `#1A7A44` / `#2EA56E` |
| Orange / orange foncé | `#FF8D16` / `#B85A00` |
| Code couleur des modules | M1 `#E2231A` · M2 `#F08A00` · M3 `#E8B900` · M4 `#8CC63F` · M5 `#2FA84F` |
| Polices | Lato (site) · Poppins (vidéo) |

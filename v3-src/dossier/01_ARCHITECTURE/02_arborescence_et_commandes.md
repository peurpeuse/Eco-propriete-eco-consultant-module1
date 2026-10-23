# Arborescence du dépôt et commandes

Dépôt : **https://github.com/peurpeuse/Eco-propriete-eco-consultant-module1** (branche `main`).

```
/
├── v3/                         ← SITE COMPILÉ (servi par jsDelivr, lu par le chargeur Vercel)
│   ├── index.html  app.js  scorm.js  data.js
│   ├── assets/  fonts/  media/poster_1-1.jpg
│   ├── pdf/                    41 PDF apprenants (RES_x-y, CAS_Mn, DOSSIER_fil-rouge, SCRIPTS_videos) — jamais GUIDE_formateur
│   ├── heygen/scripts.csv
│   └── scorm/                  6 paquets SCORM 1.2 (téléchargeables depuis le site)
├── v3-src/                     ← SOURCES
│   ├── content/                BRIEF.md, BIBLE.md, check.py, global.json, M1..M5/{module.json, cap_x.y.json}
│   ├── engine/                 interface (index.html, app.js, scorm.js, assets, fonts, media)
│   ├── build.py                compilation
│   ├── qa/                     shots.py (captures), flow.py (test SCORM)
│   ├── kit/                    gen.py (kit de modification)
│   ├── vercel/index.html       chargeur Vercel
│   └── video11/                motion/ (moteur + composition 1.1), ids.json, ids_v2.json
├── media/capsule_1-1/          ← VIDÉO 1.1 en HLS (index.m3u8 + 48 segments .ts)
├── v2/  index.html  README.md  vercel.json   (versions antérieures du module 1)
```

## Commandes (à lancer dans `v3-src/`)

| Action | Commande | Résultat |
|---|---|---|
| Valider un ou plusieurs fichiers | `cd content && python3 check.py M1/cap_1.1.json M1/module.json global.json` | `OK` ou la liste des écarts |
| Tout compiler | `python3 build.py` | `build/site`, `build/scorm/*.zip`, `build/pdf`, `build/heygen`, `build/preview.html` |
| Compiler sans régénérer les PDF | `python3 build.py --no-pdf` | Plus rapide (les PDF existants sont gardés) |
| Contrôle visuel | `python3 qa/shots.py` | Captures desktop 1440 px et mobile 390 px ; erreurs JS et défilement horizontal |
| Test SCORM | `python3 qa/flow.py <index.html d'un paquet dézippé>` | Statut `completed`, score, 60 interactions sur le parcours complet |
| Régénérer le kit de modification | `python3 kit/gen.py` | `kit/out/Kit_modification_Eco-Consultant_v3/` |

**Prérequis :** Python 3 avec Playwright et Chromium (pour les PDF, les captures et la vidéo), ffmpeg (pour la vidéo), Node.js avec React, ReactDOM et esbuild (pour le motion design).

## Commandes vidéo (dans `v3-src/video11/motion/`)

| Étape | Commande |
|---|---|
| Recalculer la timeline et compiler la composition | `./build.sh` (lance `timing.py` puis esbuild) |
| Images de contrôle (une toutes les 10 s) | `python3 render.py 0 <nb_images> <dossier> 300` |
| Rendu complet en deux moitiés parallèles | `python3 render.py 0 <N/2> part1.mp4` et `python3 render.py <N/2> <N> part2.mp4` |
| Assemblage final + son | `./finish.sh` |

Les frames de l'avatar (`public/frames/*.jpg`) ne sont pas versionnées. On les recrée à partir du MP4 HeyGen :
`ffmpeg -i seb_heygen.mp4 -vf fps=30 -q:v 3 public/frames/%05d.jpg`

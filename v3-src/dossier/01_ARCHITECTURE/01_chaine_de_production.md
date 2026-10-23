# Chaîne de production · du contenu au site et au LMS

## Vue d'ensemble

```
 CONTENU (JSON)                 BUILD                         HÉBERGEMENT                       DIFFUSION
 ─────────────                  ─────                         ───────────                       ─────────
 content/M1..M5/cap_x.y.json ┐
 content/M*/module.json      ├─► check.py (validation) ─► build.py ─┬─► build/site/   ─► dépôt GitHub v3/ ─► jsDelivr (figé sur un commit) ─► Vercel (chargeur) ─► apprenants / vitrine
 content/global.json         ┘                                       ├─► build/scorm/*.zip (6 paquets) ─► v3/scorm/ ─► bouton « Pour ton LMS » ─► LMS de l'organisme
 engine/ (interface)  ──────────────────────────────────────────────►├─► build/pdf/ (42 PDF + scripts + guide formateur*)
                                                                     └─► build/heygen/ (scripts vidéo txt + csv)

 VIDÉO (par capsule) : script JSON ─► ElevenLabs (voix SEB) ─► HeyGen (avatar SEB -- 5) ─► transcription au mot ─► motion design (React + Chromium) ─► MP4 ─► HLS ─► dépôt GitHub media/ ─► jsDelivr ─► lecteur (site + SCORM)
```
\* `GUIDE_formateur.pdf` est généré dans `build/pdf/` mais n'est **jamais** copié dans le site ni dans les paquets.

## Les briques

| Brique | Rôle | Où |
|---|---|---|
| **Contenu** | Une capsule = un fichier JSON : vidéo, quiz, fiche, exercice, livrable, sources | `v3-src/content/M<n>/cap_<id>.json` |
| **Module** | Titre, entrée et sortie, liste des capsules, cas pratique, rappels J+1/J+7/J+30 | `v3-src/content/M<n>/module.json` |
| **Global** | Accueil, test de positionnement (20), dossier fil rouge (D01-D20), quiz final (40, seuil 70 %), satisfaction (15), attestation | `v3-src/content/global.json` |
| **Bible du fil rouge** | Tous les chiffres de M. Bernard (à ne jamais modifier sans tout propager) | `v3-src/content/BIBLE.md` |
| **Brief rédacteur** | Règles de rédaction et schéma JSON | `v3-src/content/BRIEF.md` |
| **Validateur** | Vérifie longueurs, nombre de mots, quiz, sections, critères | `v3-src/content/check.py` |
| **Moteur** | Interface façon Coursera, lecteur (HLS compris), quiz, suivi SCORM | `v3-src/engine/` (`index.html`, `app.js`, `scorm.js`, `assets/`, `fonts/`, `media/`) |
| **Build** | Produit le site, les 6 SCORM, les PDF, les scripts HeyGen et l'aperçu | `v3-src/build.py` |
| **Contrôle qualité** | Captures desktop/mobile sans erreur JS ; test du parcours SCORM | `v3-src/qa/shots.py`, `v3-src/qa/flow.py` |
| **Kit de modification** | Fichiers MD à zones ✏️ pour les experts | `v3-src/kit/gen.py` → `kit/out/` |
| **Motion design** | Moteur vidéo compatible Remotion + composition de la capsule 1.1 | `v3-src/video11/motion/` |
| **Chargeur Vercel** | `index.html` qui récupère `v3/` sur jsDelivr au commit indiqué dans `BASE` | `v3-src/vercel/index.html` |

## Pourquoi un « chargeur » sur Vercel
Le site complet est dans le dépôt GitHub (`v3/`). Vercel héberge seulement une page de 2 Ko qui :
1. télécharge `v3/index.html` depuis jsDelivr, **au commit précis** indiqué dans la constante `BASE` ;
2. ajoute une balise `<base>` pour que toutes les ressources (images, PDF, SCORM) pointent vers ce commit ;
3. injecte les scripts.

**Avantages :**
- publier une nouvelle version = changer le commit dans `BASE` et redéployer ;
- revenir en arrière = remettre l'ancien commit ;
- aucun build sur Vercel.

**Limite :** jsDelivr refuse les fichiers de plus de 20 Mo. C'est pour cette raison que les vidéos sont découpées en segments HLS.

## Pourquoi les vidéos ne sont pas dans les paquets SCORM
Dans le JSON, une vidéo est une URL absolue vers un flux HLS figé sur un commit. Résultat :
- les paquets restent légers (de 1,8 à 4,4 Mo) ;
- l'apprenant doit avoir accès à Internet pendant la lecture. Il faut l'annoncer à l'organisme.

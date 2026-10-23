# Chaîne vidéo de référence · capsule 1.1 (v2)

Cette chaîne a produit la vidéo finale de la 1.1 : 6 min 39, 1080p, Seb en avatar, sa voix et un motion design calé au mot près. Elle s'applique telle quelle aux 33 autres capsules.

**Ce qu'il faut avant de commencer :**
- un script validé, c'est-à-dire les segments `video.segments` du JSON de la capsule (fiche F3 remplie) ;
- le compte ElevenLabs avec la voix SEB et le compte HeyGen avec le look SEB -- 5, tous deux connectés à Claude ;
- **le PC avec l'app Claude ouverte, ou Chrome avec l'extension Claude.** L'espace de travail de Claude ne peut pas télécharger les fichiers HeyGen lui-même.

## Étape 1 · Voix (ElevenLabs)
- Un audio par segment du script. Une génération est limitée à 5 000 caractères, d'où le découpage.
- Voix **SEB** (`a7jfJz9qTvCsZibWTl5v`), modèle `eleven_multilingual_v2`. Le texte est envoyé tel quel (champ `voice`) : nombres en toutes lettres et sigles épelés comme à l'oral.
- Tous les segments d'une capsule vont dans **un seul flow** (la 1.1 utilise `OSE8S1VPlsvH7spd5kI2`).
- **Écouter avant de continuer**, en particulier les chiffres, les sigles (DPE, ADEME, Hoguet) et les noms propres. Si un mot sonne faux, corrige l'orthographe phonétique dans le script et régénère **ce segment seulement**.
- Coût observé : environ 5 970 crédits pour 1 076 mots.

## Étape 2 · Avatar (HeyGen)
- Outil : **vidéo en scènes** (`create_video_from_studio`), **une scène `avatar_video` par segment**, chacune avec l'URL de son audio ElevenLabs. Les URL signées sont valables 2 h : relire le flow juste avant.
- Réglages de chaque scène :
  - avatar `d1f37c55937a40fc9d1e008b963a9cc2` (**SEB -- 5**) ;
  - moteur `avatar_v` ;
  - consigne de gestuelle (`motion_prompt`) : « Natural, warm presenter talking to a colleague; calm hand gestures to emphasize key points, slight nods, steady eye contact with camera. »
- Sortie : 16:9, 1080p, fond d'origine (bureau, mur gris, liseré vert). Le détourage n'est pas utilisé.
- Durée de rendu observée : environ 11 min pour 6 min 28 de vidéo. La vidéo 1.1 porte l'ID `9bd9154cfa11cee0f30e17d4a5ea9e0c`.
- **Récupération du MP4** : télécharge-le depuis la page HeyGen et joins-le à la conversation, ou laisse Claude le récupérer par le PC.

## Étape 3 · Calage au mot (transcription)
- Transcription ElevenLabs **Scribe v1**, branchée sur chaque nœud audio du flow. Elle renvoie le début et la fin de chaque mot, en secondes.
- On obtient `words.json` (9 segments × mots horodatés). Les décalages réels des segments dans la vidéo HeyGen se mesurent par durée et par détection des silences, puis vont dans `offsets.json` : l'écart observé est inférieur à 0,2 s sur 6 min 28.
- Dans le code, chaque animation est ancrée sur **une phrase prononcée** : `A(segment, "mots exacts")`. Un ancrage introuvable bloque le rendu, ce qui évite toute animation décalée.

## Étape 4 · Motion design (moteur compatible Remotion)
- **Pourquoi pas Remotion directement** : le registre npm n'est pas accessible depuis l'espace de travail de Claude. Le moteur `src/remotion-lite.js` reprend la même API (`useCurrentFrame`, `interpolate`, `spring`, `Sequence`, `AbsoluteFill`). Pour passer à Remotion, il suffit de remplacer l'import par `from "remotion"`.
- **Composition** : `src/Video.jsx`, avec les briques de `src/ui.jsx`.
  - **Mises en page de Seb** : plein cadre, carte à droite (640 × 812) ou médaillon rond en bas à droite (256 px, avec un zoom sur le visage). Les transitions durent 0,75 s.
  - **Calques** : les panneaux passent **sous** Seb et les bandeaux de mots-clés **au-dessus**, en bas à gauche. Ils ne recouvrent jamais le visage.
  - **Éléments** :
    - intro de 4,5 s avec le vrai logo, le titre et l'échelle DPE ;
    - sous-titres qui surlignent le mot prononcé ;
    - barre de progression aux couleurs DPE ;
    - outro avec les 4 étapes et la capsule suivante.
  - **Charte** : vert `#0F5A31` / `#1A7A44`, orange `#FF8D16`, police Poppins, tutoiement à l'écran.
- **Contrôle avant rendu** : une image toutes les 10 s, avec planche contact. On vérifie l'absence de chevauchement, que le visage reste dégagé et que chaque chiffre est exact.
- **Rendu** : Chromium rend chaque image (11 969 images à 30 i/s), en 2 moitiés parallèles d'environ 13 min chacune. ffmpeg encode en H.264.

## Étape 5 · Assemblage, son, contrôle
- `finish.sh` : concatène les deux moitiés, ajoute la voix HeyGen décalée de la durée de l'intro et normalise le son (`loudnorm` −16 LUFS, crête −1,5 dB). Mesure obtenue sur la 1.1 : **−15,9 LUFS**.
- Contrôle final : une image toutes les 20 s, synchronisation des lèvres, cohérence des chiffres avec ce que dit Seb et avec la fiche.
- Résultat 1.1 : `Capsule_1-1_Seb_motion-design.mp4`, 78 Mo, 6 min 39.

## Étape 6 · Mise en ligne (HLS)
```
ffmpeg -i Capsule_x-y.mp4 -c copy -hls_time 6 -hls_playlist_type vod -hls_segment_filename "media/capsule_x-y/seg_%03d.ts" media/capsule_x-y/index.m3u8
```
1. Faire un commit et un push du dossier `media/capsule_x-y/` sur GitHub, puis noter le SHA du commit.
2. Dans `cap_x.y.json`, renseigner :
   - `video.src` = `https://cdn.jsdelivr.net/gh/peurpeuse/Eco-propriete-eco-consultant-module1@<SHA>/media/capsule_x-y/index.m3u8` ;
   - `video.poster` = une image de l'intro (`media/poster_x-y.jpg`, 1280 × 720, extraite à environ 3,2 s).
3. Recompiler et publier : voir `05_PUBLICATION`.

**Le lecteur** joue le flux en natif sur Safari et avec `hls.js@1.5.20` (jsDelivr) sur les autres navigateurs, sur le site comme dans le SCORM.

## Durées et ordre de grandeur par capsule
| Étape | Durée |
|---|---|
| Voix (9 segments) + écoute | 10-15 min |
| Rendu HeyGen | 10-15 min |
| Composition motion design (adaptation au script) | 1-2 h de travail de Claude |
| Rendu + assemblage + HLS | ≈ 20 min |
| Validation par le décideur (F4) | 15-30 min |

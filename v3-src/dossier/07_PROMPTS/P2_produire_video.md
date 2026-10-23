# P2 · Produire la vidéo d'une capsule à partir de la fiche F3

> **Mode d'emploi** : joins la fiche F3 remplie, colle le bloc ci-dessous et complète les ✏️. Garde le PC allumé avec l'app Claude (ou Chrome avec l'extension), ou prépare-toi à joindre le MP4 HeyGen à la conversation.

```text
Produis la vidéo de la capsule ✏️ x.y de la formation Éco-Consultant, en suivant exactement la chaîne de référence de la capsule 1.1 (dossier technique, 04_VIDEO/01_chaine_video_reference_1-1.md). Travaille de bout en bout en autonomie, et ne me sollicite que si tu es réellement bloqué.

✏️ Fiche jointe : F3_video_x-y_….md
✏️ Consignes particulières : …

Étapes :
1. Script : prends v3-src/content/M<n>/cap_<x.y>.json → video.segments et applique les corrections de la fiche F3 (zone F3-script). Applique aussi les prononciations de la zone F3-prononciation, par l'orthographe phonétique dans le texte envoyé à la voix.
2. Voix : ElevenLabs, voix SEB (a7jfJz9qTvCsZibWTl5v), modèle eleven_multilingual_v2, un audio par segment, tous dans un seul flow. Vérifie les durées.
3. Avatar : HeyGen create_video_from_studio, une scène avatar_video par segment avec l'audio ElevenLabs.
   - Avatar SEB -- 5 (d1f37c55937a40fc9d1e008b963a9cc2), moteur avatar_v.
   - Consigne de gestuelle de la 1.1, sauf indication contraire dans F3-avatar.
   - 16:9, 1080p.
   Récupère le MP4 par le PC ou par Chrome, ou demande-moi de le joindre.
4. Calage au mot : transcription ElevenLabs Scribe v1 de chaque segment → words.json, puis mesure des décalages réels dans le MP4 → offsets.json.
5. Motion design : copie le projet v3-src/video11/motion/ et adapte src/Video.jsx au nouveau script.
   - Utilise les moments forts de la zone F3-moments, ancrés avec A(segment, "mots exacts").
   - Applique les mises en page de F3-mise-en-page, ainsi que l'intro, l'outro et les sous-titres comme la 1.1.
   - Si npm est accessible, utilise le vrai Remotion (même API).
6. Contrôle : une image toutes les 10 s avec planche contact.
   - Vérifie : aucun ancrage introuvable, rien sur le visage, chiffres à l'écran = paroles de Seb = fiche.
   - Si F3-decision le demande, envoie-moi les images et attends mon accord.
7. Rendu, assemblage (−16 LUFS) et contrôle final (une image toutes les 20 s, synchronisation des lèvres).
8. Mise en ligne :
   - découpe HLS dans media/capsule_x-y/, puis commit et push ;
   - dans le JSON : video.src = URL jsDelivr figée sur le commit, plus video.poster ;
   - compile, publie le site (05_PUBLICATION) et vérifie en ligne.
9. Rends-moi :
   - le MP4 dans la conversation ;
   - l'ID de la vidéo HeyGen ;
   - le découpage plan par plan (minutage, mise en page de Seb, ce qui apparaît) ;
   - ce qui reste à améliorer ;
   - une fiche F4 pré-remplie (informations de la capsule) pour la validation.
```

# Récapitulatif du projet · Formation Éco-Consultant (e-learning v3)

> Mis à jour le 23/10/2026. Chaque information ci-dessous a été vérifiée sur les fichiers réels : dépôt GitHub, fichiers JSON, build et services en ligne.
> Les identifiants et liens détaillés sont dans `01_ARCHITECTURE/03_identifiants_et_acces.md`.

## 1. En une phrase

La formation e-learning Éco-Consultant compte **5 modules et 34 capsules de 8 minutes**, autour d'un fil rouge : l'appartement de M. Bernard à Melun. Elle est :
- en ligne sur **https://eco-consultant-parcours.vercel.app** ;
- téléchargeable en **6 paquets SCORM 1.2** pour le LMS ;
- illustrée pour l'instant par **une seule vidéo finale**, celle de la capsule 1.1 : Seb en avatar HeyGen, sa voix ElevenLabs et un motion design calé sur la parole.

## 2. Chronologie de ce qui a été livré

| Date | Étape | Ce qui a été produit | Commit |
|---|---|---|---|
| 20/10 | Module 1, version interactive | Premier aperçu du module 1 (fichier HTML unique) | `6c10a7a` |
| 20/10 | Module 1 v2 | Nouvelle approche + paquet SCORM ; charte **verte avec touches d'orange** | `338ae9a`, `10efb01` |
| 20/10 | **Parcours v3** | 5 modules, 34 capsules (vidéo, quiz, fiche, exercice, devoir), site, 6 SCORM, 42 PDF, scripts | `d84b9ce` |
| 20/10 | Interface « cours en ligne » | Page de présentation et lecteur avec plan latéral, façon Coursera | `929db2f` |
| 20-21/10 | Sources dans le dépôt | `v3-src/` : contenu JSON, moteur, build, contrôle qualité, générateur du kit | `2e42c8c` |
| 21/10 | **Kit de modification** | 11 fichiers MD avec zones ✏️ pour que les experts (FORM, JUR, TECH, FIN, VID, DIR) corrigent la formation | `v3-src/kit/` |
| 21/10 | Vidéo 1.1 · essai | Voix de Seb (ElevenLabs), partie 1 sur une image fixe | `df3d26e` |
| 21/10 | Vidéo 1.1 · v1 | HeyGen : avatar « SEB -- 1 » + 4 slides Canva + intro et outro Jitter, 6 min 38 | `b20be4a` |
| 21/10 | **Vidéo 1.1 · v2 (finale)** | Avatar **SEB -- 5** (moteur Avatar V) sur les 9 mêmes audios + motion design calé au mot près, 6 min 39, 1080p, en streaming HLS | `542a04d` → `4d1d562` |
| 23/10 | Téléchargement SCORM sur le site | Section « Pour ton LMS » avec les 6 paquets | `6aa9f9c` |

## 3. Le contenu de la formation (état actuel)

- **Les modules** :
  - M1 · Se différencier pour attirer les propriétaires : 7 capsules
  - M2 · Estimer et construire la stratégie de vente : 10 capsules
  - M3 · Gagner l'exclusivité par l'expertise : 7 capsules
  - M4 · Convertir le projet en compromis : 5 capsules
  - M5 · Sécuriser la vente : 5 capsules
- **Une capsule = 5 étapes** : ① Je regarde (vidéo de 8 min) · ② Je me teste (quiz flash) · ③ Je télécharge (fiche PDF) · ④ Je pratique (exercice sur le fil rouge, avec l'IA pour les capsules marquées IA) · ⑤ Je dépose (livrable).
- **Fin de module** : un cas pratique, puis des rappels J+1, J+7 et J+30 (e-mail, SMS et QCM).
- **Début et fin du parcours** :
  - test de positionnement : 20 questions ;
  - dossier fil rouge : 20 documents fictifs, D01 à D20 ;
  - quiz final : 40 questions, seuil de réussite à 70 % ;
  - satisfaction : 15 questions ;
  - attestation.
- **Volume** : 35 601 mots de voix, soit environ 254 minutes de vidéo à produire. Durée totale annoncée : environ 40 heures.
- **Les 3 fils conducteurs** :
  - l'IA : des prompts métier avec garde-fous ;
  - les neurosciences : capsules de 8 min, quiz juste après la vidéo, répétition espacée ;
  - le fil rouge : M. Bernard, un T4 de 76 m² dans un immeuble de 1972, DPE F qui devient E grâce au coefficient de 1,9.
- **Code couleur DPE** : M1 rouge, M2 orange, M3 jaune, M4 vert clair, M5 vert.

## 4. La vidéo de référence : capsule 1.1 (v2)

La chaîne complète est décrite pas à pas dans `04_VIDEO/01_chaine_video_reference_1-1.md`. En résumé :

1. **Script** : 9 segments, 1 076 mots, tirés de `content/M1/cap_1.1.json`.
2. **Voix** : ElevenLabs, voix SEB, modèle `eleven_multilingual_v2`. Un audio par segment, 388,7 s au total.
3. **Avatar** : HeyGen, look **SEB -- 5** (digital twin), moteur **Avatar V** avec consigne de gestuelle. Une scène par segment, synchronisée sur l'audio ElevenLabs. Rendu en environ 11 minutes.
4. **Calage au mot** : transcription ElevenLabs (Scribe v1) avec l'horodatage de chaque mot. Chaque animation est ancrée sur une phrase prononcée par Seb.
5. **Motion design** : composants React pilotés image par image (même API que Remotion), rendus par Chromium puis encodés par ffmpeg. Le package Remotion n'a pas pu être installé (registre npm bloqué). Pour passer sur Remotion, il suffit de remplacer l'import.
6. **Assemblage** : intro de 4,5 s, puis voix décalée d'autant. Son normalisé à −15,9 LUFS, 1080p 30 i/s, 78 Mo.
7. **Diffusion** : découpage HLS en 48 segments d’environ 8 s (moins de 4,2 Mo chacun), hébergés dans le dépôt GitHub et servis par jsDelivr. Pas de date d'expiration.

## 5. Décisions prises et pourquoi

| Décision | Raison |
|---|---|
| Format 34 capsules de 8 min, 5 étapes chacune | Format validé le 20/10 : attention de 8 min, récupération active, livrable vérifiable |
| Tutoiement partout | Seb parle à un collègue ; consigne de départ |
| Site Vercel = « chargeur » léger qui lit `v3/` sur jsDelivr, figé sur un commit | Déploiement instantané sans build Vercel ; retour arrière = changer le commit |
| Vidéos en HLS plutôt qu'en MP4 | jsDelivr refuse les fichiers de plus de 20 Mo ; les liens HeyGen signés expirent au bout de 7 jours |
| Vidéos lues en streaming depuis le SCORM (URL absolue) | Les paquets SCORM restent légers (2 à 4,4 Mo) ; il faut un accès Internet pour les vidéos |
| Avatar SEB -- 5 + motion design maison (v2) au lieu de Canva + Jitter (v1) | Jitter gratuit = 720p avec filigrane ; synchronisation au mot impossible avec des slides fixes |
| Guide formateur exclu de la version apprenant | Il contient les corrigés et consignes internes |
| Paquets SCORM téléchargeables sur le site | Choix du 23/10 : le site Vercel sert de vitrine, le LMS de l'organisme importe les paquets |

## 6. Problèmes rencontrés et contournements

| Problème | Contournement | Limite restante |
|---|---|---|
| L'espace de travail de Claude ne joint que GitHub (pas HeyGen, jsDelivr, ElevenLabs, ni npm) | Fichiers récupérés par le PC (app Claude), Chrome ou en pièce jointe | Une vidéo HeyGen terminée doit être téléchargée par toi ou par le PC |
| ElevenLabs limite à 5 000 caractères par génération | Découpage en 9 segments | Aucune |
| Envoi vers HeyGen bloqué par CORS | Envoi depuis une fenêtre Chrome | Fragile : préférer des URL publiques (audio ElevenLabs) |
| Jitter version gratuite (720p, filigrane, pas d'export groupé) | Abandonné en v2 au profit du motion design maison | Jitter Pro nécessaire si on y revient |
| Registre npm bloqué : Remotion impossible à installer | Moteur compatible écrit à partir de React, Chromium et ffmpeg déjà installés | Migration vers Remotion = changer un import, le jour où npm est accessible |
| Automatisation GitHub tentée pour récupérer la vidéo, refusée par la sécurité | Abandonnée | **Branches `media` et `media-job` restées sur GitHub, à supprimer à la main** |
| Lien avec le PC instable | Nouvelle tentative, ou fichier joint à la conversation | — |

## 7. Ce qui reste à faire (par priorité)

1. **Vérifier la lecture de la vidéo 1.1 en ligne** (Chrome, Safari, mobile) et dans le LMS après import du paquet M1.
2. **Faire relire et valider la capsule 1.1** (vidéo, quiz, fiche) avec la fiche `06_A-REMPLIR_DECIDEUR/F4_validation_capsule.md`. Elle servira de modèle pour les 33 autres.
3. **Faire remplir le kit de modification** par les experts (points 🔍 à trancher : juridique, technique, financement).
4. **Produire les 33 autres vidéos** avec la même chaîne : fiche F3, puis audio, avatar, motion design. Prévoir une durée de rendu d'environ 15 min par capsule.
5. **Tester l'import SCORM** dans le LMS de l'organisme (paquet M1 d'abord), avec la recette `02_LMS_SCORM/02_import_LMS_et_recette.md`.
6. Supprimer les branches GitHub `media` et `media-job`.
7. En option : musique de fond (connecteur ElevenLabs complet requis), migration vers Remotion, version 720p plus légère pour le mobile.

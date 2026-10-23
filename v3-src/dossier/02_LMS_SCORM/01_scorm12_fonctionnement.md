# SCORM 1.2 · comment la formation communique avec le LMS

## Les 6 paquets

Ils se téléchargent depuis la section **« Pour ton LMS »** du site (https://eco-consultant-parcours.vercel.app, en bas de la page d'accueil) ou dans le dépôt, dossier `v3/scorm/`.

| Paquet | Contenu | Taille |
|---|---|---|
| `ECO-CONSULTANT_Parcours-complet_SCORM12_v3.0.zip` | Accueil, positionnement, 5 modules, quiz final, satisfaction, attestation | 4,4 Mo |
| `ECO-CONSULTANT_M1_Se-differencier_SCORM12_v3.0.zip` | Module 1 seul (7 capsules + cas + rappels) | 2,0 Mo |
| `ECO-CONSULTANT_M2_Estimer_SCORM12_v3.0.zip` | Module 2 seul (10 capsules) | 2,2 Mo |
| `ECO-CONSULTANT_M3_Exclusivite_SCORM12_v3.0.zip` | Module 3 seul (7 capsules) | 2,0 Mo |
| `ECO-CONSULTANT_M4_Compromis_SCORM12_v3.0.zip` | Module 4 seul (5 capsules) | 1,8 Mo |
| `ECO-CONSULTANT_M5_Securiser_SCORM12_v3.0.zip` | Module 5 seul (5 capsules) | 1,8 Mo |

**Choisis l'un ou l'autre :**
- soit le **parcours complet**, un seul SCO avec le positionnement et le quiz final ;
- soit les **5 modules** séparés, sans positionnement ni quiz final.

Ne mélange pas les deux pour un même apprenant : sa progression serait comptée deux fois.

## Ce que contient un paquet
- `imsmanifest.xml` :
  - schéma ADL SCORM 1.2 ;
  - un seul item, de type `sco`, qui pointe vers `index.html` ;
  - `adlcp:masteryscore` = **70** ;
  - liste exhaustive des fichiers.
- `index.html`, `app.js`, `scorm.js`, `data.js` (tout le contenu du périmètre), `assets/`, `fonts/`, `media/` (affiches des vidéos), `pdf/` (fiches du périmètre + dossier fil rouge).
- **Les vidéos ne sont pas dans le paquet.** Elles sont lues en streaming HLS depuis jsDelivr, donc l'apprenant a besoin d'Internet.

## Les données échangées avec le LMS (`scorm.js` + `app.js`)

| Donnée SCORM 1.2 | Ce qui est envoyé |
|---|---|
| `cmi.core.lesson_status` | `incomplete` à l'ouverture, puis `completed` quand tous les éléments obligatoires sont faits. Ne comptent pas : bienvenue, dossier, rappels, satisfaction et attestation |
| `cmi.core.score.raw` (min 0, max 100) | Parcours complet : score du quiz final. Paquet module : moyenne des quiz flash réalisés |
| `cmi.suspend_data` | Progression complète (JSON compact, version 4). Si elle dépasse 4 000 caractères, le détail des réponses est retiré pour respecter la limite SCORM 1.2 de 4 096 |
| `cmi.core.lesson_location` | Dernier écran consulté, pour reprendre là où l'apprenant s'était arrêté |
| `cmi.interactions.n.*` | Chaque réponse de quiz : `id`, `type=choice`, `student_response`, `result` (correct/wrong), `weighting`, `correct_responses` |
| `cmi.core.session_time` | Durée de la session (HHHH:MM:SS) |
| `cmi.core.exit` | `suspend` si le parcours n'est pas terminé, vide sinon |

**Comportement de `scorm.js` :**
- il cherche l'API SCORM 1.2 (`API`) dans les fenêtres parentes, puis dans la fenêtre d'ouverture ;
- à défaut, il cherche l'API SCORM 2004 (`API_1484_11`) et traduit les champs ;
- s'il ne trouve aucun LMS, comme sur le site Vercel, la progression est gardée dans le navigateur (`localStorage`).

`LMSFinish` est appelé quand la page se ferme (événements `pagehide` et `beforeunload`).

## Réglages recommandés dans le LMS
- **Version SCORM** : 1.2.
- **Ouverture** : dans une nouvelle fenêtre ou en plein écran. L'interface est adaptée aux mobiles et aux écrans d'au moins 390 px.
- **Statut de réussite** : « terminé » (`completed`). Pour le parcours complet, la note du quiz final est remontée et le seuil de 70 % est déjà appliqué dans le contenu (attestation débloquée).
- **Nombre de tentatives** : illimité, avec reprise de la dernière tentative (`suspend_data`).
- **Réseau** : autoriser `cdn.jsdelivr.net` (vidéos HLS et bibliothèque `hls.js@1.5.20`) si le LMS ou le réseau de l'organisme filtre les domaines.

# Récapitulatif de nos échanges · Formation Éco-Consultant

> État au **23/10/2026, 19h45** (heure du Maroc). Centré sur la formation. Ce fichier ne contient **aucun mot de passe ni aucune clé d'accès** : les clés sont uniquement dans les réglages Vercel et Supabase.

---

## 1. La formation en bref

- **Formation e-learning « Éco-Consultant » v3** : 5 modules, **34 capsules de 8 min**, fil rouge **M. Bernard** (T4 de 76 m² à Melun, immeuble de 1972, DPE F qui passe en E grâce au coefficient 1,9).
  - M1 · Se différencier pour attirer les propriétaires (7 capsules)
  - M2 · Estimer et construire la stratégie de vente (10)
  - M3 · Gagner l'exclusivité par l'expertise (7)
  - M4 · Convertir le projet en compromis (5)
  - M5 · Sécuriser la vente (5)
- **Une capsule = 5 étapes** : ① vidéo de Seb · ② quiz flash · ③ fiche PDF · ④ exercice (avec l'IA pour certaines) · ⑤ livrable.
- **Fin de module** : cas pratique + rappels J+1, J+7, J+30. **Parcours** : test de positionnement (20 Q), dossier fil rouge (20 documents fictifs D01–D20), quiz final (40 Q, 70 %), satisfaction, attestation.
- **Règles** : tutoiement partout ; tout en français ; code couleur DPE par module (M1 rouge → M5 vert) ; charte verte avec touches d'orange ; `GUIDE_formateur.pdf` jamais donné aux apprenants ni publié.

## 2. Ce qui a été construit (chronologie)

| Étape | Résultat |
|---|---|
| Parcours v3 | Site + 6 paquets SCORM 1.2 + 42 PDF + scripts vidéo, interface type Coursera, couleurs vert/orange |
| Kit de modification | 11 fichiers MD pour que les experts (Décideur, Formateur, Juriste, Technique, Financement, Vidéo) corrigent |
| Vidéo 1.1 v1 | Avatar HeyGen « SEB -- 1 » + slides Canva + Jitter (abandonnée) |
| **Vidéo 1.1 v2 (finale)** | Avatar **SEB -- 5** (moteur Avatar V) + voix ElevenLabs de Seb + motion design calé au mot près (moteur compatible Remotion), 6 min 39, 1080p, servie en streaming HLS |
| Site public de la formation | **https://eco-consultant-parcours.vercel.app**, avec la section « Pour ton LMS » (téléchargement des 6 SCORM) |
| Dossier technique Drive | Dossier « Formation Éco-Consultant · Dossier technique » : architecture, LMS/SCORM, contenu, chaîne vidéo, publication, fiches à remplir par le décideur (F1 à F5), prompts |
| Pipeline des 5 modules | `08_PIPELINE` dans Drive : un dossier par module, fiches F1/F2/F3 pré-remplies, Google Sheet « Pipeline Éco-Consultant · suivi des 34 capsules », prompt P5 |
| **Page de validation guidée** | D'abord sur claude.ai, puis **en ligne sur Vercel** (voir §3) |

## 3. La page de validation (cœur des derniers échanges)

**Adresse : https://eco-consultant-validation.vercel.app**: fonctionne sur téléphone et ordinateur.

### Fonctions
- **Parcours guidé** : un élément à la fois (« je valide le premier, il m'emmène au deuxième »), sommaire, 39 graduations aux couleurs DPE.
- **Séances courtes** d'environ 20 min, temps restant, récapitulatif de fin de séance, reprise au même endroit.
- **Corriger directement dans le texte** : « ✏️ Modifier » sur chaque passage du script, question du quiz, étape d'exercice, critère du livrable ; l'ancien texte reste visible, barré.
- **Avis partie par partie** : ✓ OK / ✏️ À corriger pour Vidéo, Quiz, Fiche, Exercice, Livrable.
- **Prompteur** : lecture du script à voix haute, défilement automatique et chronomètre ; la durée lue est enregistrée.
- **Vidéo intégrée** (capsule 1.1) reliée au script : cliquer un temps lance la vidéo à ce passage ; la vidéo passe en petit quand on descend.
- **Travail d'équipe** : versions concurrentes d'un même passage tranchées par le **décideur** ; questions aux experts (« 🙋 Demander ») et réponses ; passages déjà corrigés marqués « ✓ Corrigé le … » et revalidation qui n'affiche **que ce qui a changé**.
- **Confort** : barre d'action sur une ligne, glisser gauche/droite sur téléphone, Entrée et ← → sur ordinateur, brouillons gardés au fil de la frappe.
- **Logos** Éco-propriété (depuis le Figma) × Éco-Consultant.
- **Réinitialiser** : un élément, ou tous ses avis ; « ↺ Revenir à l'ancien texte » sur un passage déjà corrigé.
- **🚀 Mise en production** : réservée au rôle **Décideur**, avec « Tu es sûr ? ». Elle ne concerne **que la page ouverte** (une capsule seule, ou le module si l'on est sur la fiche du module) et n'est possible que si l'élément est validé, sans version à trancher ni question en attente.
- **Connexion** par identifiant + mot de passe (Supabase) et **📜 Journal** : qui a modifié quoi, quand, avec AVANT/APRÈS ; filtres par personne et par élément ; historique en bas de chaque capsule ; journal impossible à modifier ou effacer. Bouton ⎋ pour se déconnecter.

### Règle de production (demandée par toi)
- **Élément non envoyé en production** → Claude prend seulement les modifications (récapitulées dans Drive), **rien n'est créé**.
- **Élément envoyé (🚀 + confirmation)** → Claude lit le dernier fichier de validations dans Drive, applique les corrections de cet élément seulement, produit la vidéo si besoin (ElevenLabs + HeyGen + motion design), régénère fiche PDF et SCORM, publie le site, puis dépose un compte rendu dans Drive.

## 4. Où sont les choses

| Quoi | Où |
|---|---|
| Site de la formation | https://eco-consultant-parcours.vercel.app (projet Vercel `eco-consultant-parcours`) |
| Page de validation | https://eco-consultant-validation.vercel.app (projet Vercel `eco-consultant-validation`) |
| Ancienne page de validation (claude.ai) | Toujours en ligne, mais **plus utilisée** : ses avis ne sont pas reliés à la version Vercel |
| Comptes et données de validation | Projet Supabase `eco-consultant-validation` (Paris, gratuit) : tables `avis` et `journal`, règles de sécurité actives |
| Sources | Dépôt GitHub `peurpeuse/eco-propriete-eco-consultant-module1` : `v3-src/` (contenu, moteur, build), `v3-src/validation` (page), `v3-src/validation-web` (version en ligne, chargeur, API), `validation-site/` (page compilée), `media/` (vidéos HLS) |
| Récapitulatifs de validation | Drive : `08_PIPELINE/09_VALIDATIONS_EN_LIGNE` (+ « 00_LISEZ-MOI ») |
| Suivi des 34 capsules | Google Sheet « Pipeline Éco-Consultant · suivi des 34 capsules » |
| Tâche de production | Tâche programmée « Production Éco-Consultant (validation en ligne) », lancée à la demande |

## 5. Ce qui reste à faire

1. **Créer les deux comptes dans Supabase (toi)** : projet `eco-consultant-validation` → Authentication → Users → Add user, avec « Auto Confirm User » :
   - `sebastien@validation.eco-propriete.pro` (identifiant sur la page : **Sebastien**)
   - `mohamed@validation.eco-propriete.pro` (identifiant : **Mohamed**)
   - puis **désactiver « Allow new users to sign up »**. Claude ne crée pas de comptes et ne saisit pas de mots de passe à ta place.
2. **Vérification automatique toutes les heures** (8h–21h) : à recréer sur la base Supabase (fichier Drive dès qu'il y a du nouveau + lancement de la production). La première tentative a été refusée par le contrôle de sécurité ; il suffit de dire « crée la vérification ».
3. **Produire les 33 autres vidéos**, au fil des mises en production.
4. Vérifier la lecture de la vidéo 1.1 en ligne et l'import SCORM dans le LMS (paquet M1 d'abord).
5. Supprimer à la main les branches GitHub `media` et `media-job`.

## 6. Préférences et limites à garder en tête

- Tu veux que je travaille **de bout en bout en autonomie** et ne te sollicite que si je suis vraiment bloqué ; réponses **en français**, tutoiement dans les contenus.
- **Jamais** de mot de passe ni de clé dans un fichier ; je ne me connecte pas, ne crée pas de comptes et ne saisis pas de mots de passe à ta place.
- L'environnement de Claude n'accède pas directement à HeyGen, jsDelivr, ElevenLabs ni npm : passer par les connecteurs, le PC ou Chrome ; ne pas contourner les blocages réseau.
- Les vidéos et crédits HeyGen/ElevenLabs ne sont dépensés **qu'après une mise en production confirmée par le décideur**.

## 7. Nouveau format chapitre (26/10/2026)

- D'après le storyboard « Chapitre 1 : attirer des clients » : **1 capsule = 1 chapitre de 15 écrans, 6 briques, 4 min 30** (gabarit : `v3-src/content/GABARIT_CHAPITRE.md`, fichiers `chap_x.y.json`, contrôle `check_chap.py`).
- Charte orange Éco-Consultant (planches « Formats vidéo »), **Mozi** = méchant récurrent violet, toujours « Sébastien Paumier » (jamais « Seb »). Six apprenants : Hugo, Sarah, Claire, Karim, Maxime, Élodie.
- Les 34 chapitres ont été écrits par des agents rédacteurs puis relus par des agents experts pédagogiques (rapports dans `v3-src/content/revues/`). Toutes les voix sont « proposition » sauf celles du storyboard 1.3.
- Lecteur interactif `v3-src/engine/chapter.js` (mobile 9/16 et 16/9, sous-titres, quiz en cartes, dépôt de preuve, mode rendu `#render-x-y-n` pour la vidéo).
- Page de validation mise au format chapitre (commit 8a035fb) et publiée. Site de la formation : prêt dans le dépôt, publication en attente d'accord.
- **Aucune vidéo produite** (consigne du 26/10) ; la tâche de production a été mise à jour pour le format chapitre et ne dépense des crédits qu'après une mise en production confirmée.

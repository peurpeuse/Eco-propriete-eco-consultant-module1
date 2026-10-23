# Guide de contenu · ce que doit respecter chaque modification

Ces règles sont vérifiées automatiquement quand Claude régénère la formation. Une demande qui les dépasse (ex. une vidéo de 12 minutes) sera adaptée, et l'écart signalé.

## L'esprit de la formation
- **Public** : agents immobiliers, mandataires, négociateurs, niveau intermédiaire.
- **Promesse** : devenir l'agent de référence sur la performance énergétique, de l'estimation à l'acte.
- **Ton** : Seb parle à un collègue. **Tutoiement partout**, phrases courtes, exemples concrets, pas de jargon non expliqué.
- **Trois fils conducteurs** :
  1. **IA** : prompts métier prêts à l'emploi, toujours avec des garde-fous ;
  2. **Neurosciences** : capsules de 8 min, quiz juste après la vidéo, rappels J+1/J+7/J+30 ;
  3. **Fil rouge** : l'appartement de M. Bernard à Melun avance de module en module.
- **Code couleur DPE** : module 1 rouge → 2 orange → 3 jaune → 4 vert clair → 5 vert.

## Une capsule = 5 éléments

| Élément | Règles |
|---|---|
| **Titre / objectif** | Titre ≤ 90 car. ; objectif ≤ 200 car., qui complète « À la fin, tu sauras… » |
| **① Vidéo (8 min)** | 980 à 1 300 mots de voix (≈ 1 100), 6 à 14 segments horodatés. Structure : accroche 20 s → pourquoi c'est important → 3 idées clés max → démonstration sur les documents D01-D20 → erreurs fréquentes → « ce que tu fais maintenant ». Pas d'URL à l'oral. Chaque segment : voix + ce qu'on voit (consigne de montage) + texte incrusté ≤ 140 car. |
| **② Quiz flash** | 4 à 5 QCM ; 3 ou 4 options (≤ 140 car.) ; une seule bonne réponse, position variée ; ≥ 2 questions en situation sur le fil rouge ; une explication par option (15-240 car.) ; feedback : titre ≤ 80 car. + texte 40-450 car. |
| **③ Fiche (PDF)** | ≥ 250 mots utiles, 3 à 9 sections (liste, check-list, étapes, tableau ≤ 6 colonnes et ≤ 16 lignes, texte, formule avec exemple chiffré). Utilisable telle quelle en rendez-vous. Sources et date en pied de page. |
| **④ Exercice** | Contexte sur le fil rouge, au moins un document D01-D20, 3 à 8 étapes, durée en minutes, corrigé chiffré (≥ 200 car.). Capsule IA 🤖 : prompt complet ≥ 300 car. (rôle, contexte, tâche, format, contraintes, données à coller) + au moins 2 garde-fous. |
| **⑤ Devoir** | Ce qui est déposé, format précis, 4 à 7 critères **vérifiables**. |

## Fin de module
- **Cas pratique** : énoncé ≥ 400 car., 4 à 10 tâches, 4 à 10 critères notés (libellé, points, attendu). Il produit la « sortie » du module.
- **Rappels J+1, J+7, J+30** : objet d'e-mail, message court, SMS ≤ 160 car., 2 à 3 QCM **différents** du quiz flash.

## Début et fin du parcours
- **Test de positionnement** : exactement 20 questions, 4 par module.
- **Quiz final** : exactement 40 questions, 8 par module ; seuil de réussite 70 % (modifiable).
- **Satisfaction** : 8 à 20 questions.
- **Attestation** : champs automatiques {nom}, {date_debut}, {date_fin}, {duree}, {resultat_quiz_final}.
- **Dossier fil rouge** : 20 documents D01 à D20, fictifs et cohérents avec `02_BIBLE_fil_rouge.md`.

## Faits, sources et prudence
- On distingue toujours **fait vérifié** (avec source officielle), **proposition pédagogique** et **exemple fictif** (le dire).
- Sources acceptées pour le réglementaire : Légifrance, service-public.fr, ANIL, ADEME, CNIL, Banque de France / HCSF, aide officielle Google / Meta / LinkedIn. Indique l'article exact.
- Juridique : précis mais prudent ; on renvoie au notaire quand c'est son rôle.
- Jamais de données personnelles réelles de clients (RGPD), ni dans la formation, ni dans les prompts IA.
- Marques : écrire « DISC » (générique), ne pas reproduire de questionnaire propriétaire.

## Durées de référence
- 34 capsules × 8 min = 4 h 32 de vidéo ; durée totale annoncée ≈ 40 h.
- Ajouter une capsule = +8 min de vidéo, +1 fiche, +1 exercice, +1 devoir à corriger : à décider par `DIR`.

## Effet d'une modification sur les vidéos
Si une vidéo est **déjà tournée**, chaque changement de script oblige à retourner ou à remonter. Dans la fiche F4 (zone `F4-video`), indique si la correction peut passer par un simple changement à l’écran (animation, texte incrusté) sans refaire la voix ni l’avatar.

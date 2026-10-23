# Fiches du décideur · mode d'emploi

Le décideur intervient deux fois :
- **avant** la production, pour **cadrer** ;
- **après**, pour **valider**.

Claude produit tout le reste à partir de ce qui est écrit dans les fiches.

| Fiche | Quand | Ce que tu décides | Ce que Claude produit ensuite |
|---|---|---|---|
| **F1** · Cadrage d'un module | Avant de créer un nouveau module (ou de refondre un module existant) | Objectif, public, entrée et sortie, liste des capsules, cas pratique, couleur | `module.json` + le plan des capsules + les fiches F2 pré-remplies |
| **F2** · Cadrage d'une capsule | Avant d'écrire une capsule | Titre, objectif, idées clés, chiffres et sources, exercice, livrable, capsule IA ou non | `cap_x.y.json` complet : script de 8 min, quiz, fiche PDF, exercice, livrable |
| **F3** · Vidéo | Après lecture du script, avant la voix et l'avatar | Script validé, prononciations, moments forts à animer, mises en page de Seb | Voix ElevenLabs, avatar HeyGen SEB -- 5, motion design, MP4, HLS |
| **F4** · Validation d'une capsule | Quand la capsule est en ligne | OK, à corriger ou à refaire, élément par élément, en comparant à la 1.1 | Corrections appliquées, nouvelle version en ligne, journal des modifications |
| **F5** · Publication et LMS | Avant de diffuser aux apprenants | Ce qui part dans le LMS, version, date, recette | Paquets SCORM à jour sur le site, notes de version |

## Règles de remplissage
1. **Écris après chaque ✏️.** Pour plusieurs lignes, commence chaque ligne par `>`.
2. **Coche** une case en remplaçant `[ ]` par `[x]`.
3. **Ne touche jamais** aux lignes `<!-- ✏️ ZONE … -->` : elles servent de repères à Claude.
4. **Une zone vide** veut dire : « Claude décide, en suivant `03_CONTENU` et le modèle 1.1 ».
5. **Sources obligatoires** pour tout chiffre, toute règle ou tout délai (Légifrance, service-public, ANIL, ADEME, Insee, Banque de France…). Sinon, écris « terrain » ou « à vérifier ».
6. **Une fiche par élément** : copie le fichier modèle, puis renomme-le avec le numéro et tes initiales, par exemple `F2_capsule_1-2_DIR-AB.md`.
7. Pour lancer la production, colle le prompt correspondant du dossier `07_PROMPTS` dans Claude, avec les fiches remplies.

## Modèle de référence
La capsule **1.1** est le standard de qualité. Avant de remplir une fiche, regarde la capsule 1.1 en ligne (https://eco-consultant-parcours.vercel.app) : sa vidéo, son quiz, sa fiche, son exercice et son livrable.

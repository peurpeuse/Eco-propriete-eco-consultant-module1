# Dossier technique · Formation Éco-Consultant (e-learning)

Ce dossier contient tout ce qu'il faut pour **produire, publier et faire évoluer** la formation e-learning Éco-Consultant :
- le site Vercel ;
- les paquets SCORM pour le LMS ;
- les vidéos de Seb ;
- les **fiches que le décideur remplit** avant et après chaque production.

## Le contenu du dossier

| Dossier / fichier | Pour qui | À quoi ça sert |
|---|---|---|
| `00_LISEZ-MOI.md` | Tout le monde | Ce mode d'emploi |
| `00_RECAP_projet.md` | Tout le monde | Ce qui a été fait, où c'est, ce qui reste |
| `01_ARCHITECTURE/` | Technique | Chaîne de production, arborescence, commandes, identifiants |
| `02_LMS_SCORM/` | Technique, administrateur LMS | Fonctionnement du SCORM 1.2, import dans le LMS, recette |
| `03_CONTENU/` | Formateur, experts, Claude | Format exact d'une capsule, règles de rédaction, fil rouge, sources |
| `04_VIDEO/` | Responsable vidéo | Chaîne vidéo de référence (capsule 1.1), réglages, pièges |
| `05_PUBLICATION/` | Technique | Mettre à jour le site et les SCORM, revenir en arrière |
| `06_A-REMPLIR_DECIDEUR/` | **Décideur final** | Fiches à remplir : **cadrer avant de créer**, puis **valider** |
| `07_PROMPTS/` | Coordinateur | Prompts prêts à coller pour que Claude produise à partir des fiches |

## Le circuit en 4 temps

```
1. CADRER        Le décideur remplit F1 (module) ou F2 (capsule), puis F3 (vidéo).
      ↓
2. PRODUIRE      Le coordinateur colle le prompt correspondant (07_PROMPTS) dans Claude, avec les fiches.
                 Claude écrit le contenu, génère la voix, l'avatar et le motion design, puis compile le site et les SCORM.
      ↓
3. VALIDER       Le décideur regarde le résultat en ligne et remplit F4 (validation de la capsule).
                 Les corrections repartent dans Claude avec le prompt P3.
      ↓
4. PUBLIER       Le décideur coche F5 (publication / LMS). Claude publie : site Vercel, puis paquets SCORM téléchargeables.
```

**Le modèle de référence est la capsule 1.1**, « Le marché 2026 et les nouvelles techniques ». Chaque nouvelle capsule doit atteindre le même niveau : script, quiz, fiche, exercice, livrable et vidéo avec motion design. Regarde-la avant de remplir une fiche : https://eco-consultant-parcours.vercel.app

## Comment remplir une fiche

- Écris seulement après les ✏️ et coche les cases `[ ]` en les remplaçant par `[x]`.
- Ne modifie jamais les lignes `<!-- ✏️ ZONE … -->` : c'est grâce à elles que Claude retrouve chaque réponse.
- Une zone laissée vide veut dire « Claude décide en suivant les règles du dossier `03_CONTENU` ».
- Pour tout chiffre, toute règle ou tout délai, donne une source : Légifrance, service-public, ANIL, ADEME, ou « terrain ».
- Renvoie la fiche remplie en ajoutant tes initiales au nom du fichier, par exemple `F2_capsule_1-2_DIR-AB.md`.

## Sécurité

- Ce dossier contient des **identifiants techniques** (dépôt, projets, ID d'avatar et de voix), mais **aucun mot de passe ni aucune clé d'API**. Ne les ajoute jamais.
- `GUIDE_formateur.pdf` est réservé au formateur : il ne doit jamais être donné aux apprenants ni publié sur le site.
- Les documents du fil rouge sont **fictifs**. Aucune donnée réelle de client ne doit entrer dans la formation ni dans les prompts IA.

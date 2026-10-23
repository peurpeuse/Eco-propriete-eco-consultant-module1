# Format d'une capsule · le modèle 1.1

Toute nouvelle capsule suit **exactement** le format de la capsule 1.1, « Le marché 2026 et les nouvelles techniques ».
- Les règles chiffrées sont dans `03_GUIDE_contenu_regles.md`. Le validateur `check.py` les contrôle automatiquement.
- Les chiffres du fil rouge sont dans `02_BIBLE_fil_rouge.md`.

## Les 5 étapes, illustrées par la 1.1

| Étape | Ce que voit l'apprenant | Dans la 1.1 | Règles |
|---|---|---|---|
| **Titre + objectif** | En-tête de la capsule | « Expliquer les évolutions du marché 2026 (volumes, prix, crédit, DPE, prospection) et en déduire de nouvelles façons de prendre un mandat » | Titre ≤ 90 car. ; objectif ≤ 200 car. |
| **① Je regarde** | Vidéo de Seb (≈ 8 min) | 9 segments (00:00 → 07:25), 1 076 mots ; accroche : « Deux agences ont dit à M. Bernard : −15 % à cause du DPE… » | 980-1 300 mots, 6-14 segments. Chaque segment : `voice` (texte exact), `screen` (ce qu'on voit), `onscreen` (texte incrusté ≤ 140 car.) |
| **② Je me teste** | Quiz flash juste après la vidéo | 5 QCM, dont des mises en situation (« M. Bernard te dit : l'Insee annonce −0,8 %… ») | 4-5 QCM ; 3-4 options ; une explication par option ; au moins 2 questions sur le fil rouge |
| **③ Je télécharge** | Fiche PDF | « Réglementation et tendances 2026 » : 6 sections (marché, DPE, prospection, vendeurs, 5 techniques, exemple rempli) | ≥ 250 mots, 3-9 sections ; sources et date en bas |
| **④ Je pratique** | Exercice | « Lister 3 changements chez ses clients », 25 min, avec D01, D02, D03, D12 | Contexte fil rouge, 3-8 étapes, corrigé chiffré ; prompt IA + garde-fous si capsule IA |
| **⑤ Je dépose** | Livrable remis au formateur | « Mes 3 changements clients 2026 » : 1 page, tableau à 4 colonnes, 6 critères vérifiables | Format précis ; 4-7 critères **vérifiables** |
| **Sources** | Bas de fiche | 10 sources officielles (Insee, Notaires, Banque de France, Légifrance, ADEME, DGCCRF…) | Article ou URL exacte ; date |
| **Notes de production** | Interne | Visuels, B-roll, points [À VALIDER] | Jamais montrées à l'apprenant |

## Structure de la vidéo (le script)

```
00:00  Accroche (20 s)          situation de M. Bernard ou chiffre fort
00:45  Pourquoi c'est important  pour l'agent, aujourd'hui
01:40  Idée clé 1                illustrée sur le fil rouge
02:35  (suite / nuance)
03:25  Idée clé 2
04:20  Idée clé 3                3 idées maximum
05:15  Démonstration             le geste métier sur les documents D01-D20
06:25  Erreurs fréquentes
07:25  Ce que tu fais maintenant quiz → fiche → exercice → livrable
```

**Le ton** : Seb parle à un collègue. On tutoie, on fait des phrases courtes, on donne des exemples concrets. On ne lit pas de liste et on ne cite aucune URL à l'oral.

## Le fichier technique
- Une capsule correspond à `v3-src/content/M<n>/cap_<id>.json`. Le schéma complet et commenté est dans `v3-src/content/BRIEF.md`.
- Une capsule est prête quand `python3 check.py M<n>/cap_<id>.json` répond `OK` **et** que la fiche F4 est validée par le décideur.

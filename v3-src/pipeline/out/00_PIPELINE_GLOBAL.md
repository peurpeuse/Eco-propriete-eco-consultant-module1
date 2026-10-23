# Pipeline de production · les 5 modules de la formation Éco-Consultant

Le pipeline fait avancer **chaque capsule** du cadrage jusqu'au LMS, sur le modèle de la **capsule 1.1**.

**Le suivi en temps réel** se fait dans le Google Sheet **« Pipeline Éco-Consultant · suivi des 34 capsules »** (dans ce dossier) :
- onglet **Capsules** : une ligne par capsule, avec l'étape, le responsable, la date, l'état de la vidéo, la validation et les blocages (listes déroulantes) ;
- onglet **Tableau de bord** : avancement calculé automatiquement par module ;
- onglet **Étapes et légende** : définitions et règles.

## Les 7 étapes d'une capsule

| # | Étape | Qui | Fiche / prompt |
|---|---|---|---|
| 1 | Cadrage du contenu | Décideur + experts | `capsules/x-y_F2_cadrage.md` → prompt **P1** si corrections |
| 2 | Script à valider | Décideur, formateur | `capsules/x-y_F3_video.md` |
| 3 | Voix (ElevenLabs, voix SEB) | Claude | prompt **P2** |
| 4 | Avatar (HeyGen, SEB -- 5) | Claude | prompt **P2** |
| 5 | Motion design, rendu, mise en ligne HLS | Claude | prompt **P2** |
| 6 | Validation en ligne | Décideur | F4 (modèle dans `06_A-REMPLIR_DECIDEUR`) → prompt **P3** |
| 7 | Publication SCORM / LMS | Décideur, admin LMS | `M<n>_F5_publication.md` → prompt **P3** |

Après chaque avancée, le prompt **P5** met à jour le Sheet et le journal du module.

## État de départ (23/10/2026)

| Module | Capsules | Vidéo à produire | Point de départ |
|---|---|---|---|
| M1 · Se différencier pour attirer les propriétaires (rouge) | 7 | ≈ 46 min | 1.1 publiée, en attente de F4 ; 1.2 à 1.7 : script à valider |
| M2 · Estimer et construire la stratégie de vente (orange) | 10 | ≈ 79 min | script à valider |
| M3 · Gagner l'exclusivité par l'expertise (jaune) | 7 | ≈ 51 min | script à valider |
| M4 · Convertir le projet en compromis (vert clair) | 5 | ≈ 37 min | script à valider |
| M5 · Sécuriser la vente (vert) | 5 | ≈ 37 min | script à valider |
| **Total** | **34** | **≈ 249 min (4 h 09)** | 1 vidéo faite sur 34 |

**Où en est le contenu :** toutes les capsules sont **écrites** (vidéo, quiz, fiche, exercice, livrable) et en ligne sur le site, sans vidéo pour l'instant. Les fiches F2 et F3 de chaque capsule sont **pré-remplies avec ce contenu**. Le décideur valide ou corrige, il n'a rien à écrire de zéro.

## Ordre de production recommandé

1. **Valider la 1.1** (F4). Elle fixe le standard ; tant qu'elle n'est pas validée, on ne lance pas de nouvelle vidéo.
2. **Module 1** (1.2 → 1.7) : le début du parcours, celui que les apprenants voient en premier.
3. **Module 2** : le plus long (10 capsules) et le plus technique. Prévoir les relectures TECH et JUR tôt.
4. **Modules 3, 4, 5** dans l'ordre du parcours. Les relectures JUR et FIN se font en parallèle de la production du module précédent.

Rythme conseillé :
- **un lot de 3 capsules à la fois**, validation F2/F3 → production → F4 ;
- publication du paquet SCORM d'un module dès que ses capsules sont validées (F5).

## Charge et coûts (ordre de grandeur, d'après la 1.1)

| Poste | Par capsule | 33 capsules restantes |
|---|---|---|
| Crédits ElevenLabs (voix) | ≈ 5 500-6 000 crédits | ≈ 190 000 crédits |
| Rendu HeyGen (avatar) | ≈ 10-15 min de calcul | ≈ 6-8 h de calcul (en parallèle possible) |
| Motion design + rendu + HLS | ≈ 1 h 30-2 h 30 | à étaler par lots |
| Relecture décideur (F2 + F3 + F4) | ≈ 45 min | ≈ 25 h au total |

Les crédits HeyGen dépendent de ton abonnement : vérifie le solde avant chaque lot.

## Dépendances et règles
- La **1.1 validée** sert de modèle pour toutes les autres.
- **Pas de voix sans F3 signée** : une correction après la voix oblige à tout refaire pour le segment concerné.
- Les points **JUR / FIN / TECH** listés dans chaque F2 (zone « Points à valider ») sont tranchés **avant** la validation du script.
- Un chiffre du fil rouge qui change se corrige d'abord dans la bible (`03_CONTENU/02_BIBLE_fil_rouge.md`), puis partout.
- **Le PC doit être allumé avec l'app Claude** (ou le MP4 HeyGen joint à la conversation) pour l'étape 4.

## Contenu de ce dossier

```
08_PIPELINE/
├── 00_PIPELINE_GLOBAL.md                 (ce fichier)
├── P5_faire_avancer_le_pipeline.md       (prompt de pilotage)
├── Pipeline Éco-Consultant · suivi des 34 capsules   (Google Sheet)
└── M1_Se-differencier/ … M5_Securiser/
    ├── M<n>_00_TABLEAU_DE_BORD.md        état, ordre de travail, journal du module
    ├── M<n>_F1_cadrage_module.md         fiche module pré-remplie
    ├── M<n>_F5_publication.md            publication du paquet SCORM du module
    └── capsules/
        ├── x-y_F2_cadrage.md             contenu actuel de la capsule, à valider
        └── x-y_F3_video.md               script actuel, segment par segment, à valider
```

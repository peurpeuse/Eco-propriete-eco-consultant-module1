# Revue du comité pédagogique · Module 2, chapitres 2.6 à 2.10

Relecture faite le 26/10/2026, sans avoir vu la rédaction, à partir de `GABARIT_CHAPITRE.md`, `BIBLE.md`, du pilote `M1/chap_1.3.json` et des capsules sources `M2/cap_2.6` à `cap_2.10`.
Les trois regards : **P** = ingénierie pédagogique et neurosciences · **E** = exactitude métier, juridique et sources · **G** = conformité au gabarit et ton.
Contrôle final : `python3 check_chap.py M2/chap_2.6.json … M2/chap_2.10.json` → 5 × OK, zéro ERREUR, zéro ALERTE. Toutes les voix restent en `"voice_status": "proposition"`.

## Synthèse

| Chapitre | P | E | G | Corrections | Bloquant restant |
|---|---|---|---|---|---|
| 2.6 Voir avant l'acheteur | 4 | 4 | 5 | 4 | non |
| 2.7 Lire l'immeuble | 4 | 4 | 5 | 6 | relecture juridique (déjà prévue) |
| 2.8 Huit familles de valeur | 4 | 4 | 5 | 2 | non |
| 2.9 Chiffrer les travaux | 4 | 4 | 5 | 3 | taux de TVA par poste, à ne pas afficher avant validation |
| 2.10 Estimer avant / après | 4 | 5 | 5 | 3 | non |

**Calculs refaits, tous justes** : 85 000 × 312 / 10 000 = 2 652 €/an (≈ 663 €/trimestre) ; 4 250 × 312 / 10 000 = 132,60 € ; 1 150 000 × 312 / 10 000 = 35 880 € = 4 × 8 970 € ; 3 × 8 970 = 26 910 € ; 5 600 + 2 900 + 4 800 + 3 200 = 16 500 € ; 16 500 / 76 ≈ 217 €/m² ; 4 800 / 6 = 800 € ; comparables C1 à C5 = 2 620 · 2 700 · 2 650 · 2 600 · 2 690 → médiane 2 650 ; R1 à R3 = 2 880 · 2 820 · 2 850 → médiane 2 850 ; 76 × 2 650 = 201 400 € ; − 8 500 = 192 900 € ; − 14 900 / − 6 900 = 178 000 / 186 000 € ; 76 × 2 850 = 216 600 € ; écart 30 600 à 38 600 € ; 16 500 + 35 880 = 52 380 € ; 201 400 × 0,85 = 171 190 €. Les chiffres du fil rouge sont identiques à la bible.

**Ton et gabarit, pour les cinq chapitres** : jamais « Seb », tutoiement partout, une réplique de Mozi sans morale, 3 temps à l'écran 4, 3 étapes à l'écran 7, durées à 4:30. Les six agents sont bien utilisés : Claire, Hugo, Maxime, Sarah, Élodie, et Karim en apprenant (directeur d'agence) dans le chapitre 2.10. Les chiffres fictifs sont annoncés comme tels (« exemple fictif D12 », « devis D13 fictif », « situation type »).

---

## 2.6 · Voir avant l'acheteur (audit 360° et pathologies)

**Notes** : P 4 · E 4 · G 5

- **P** : l'objectif est clair et atteint (ordre 360°, lecture en 4 temps, renvoi). Mozi qui repeint en pleine visite crée une bonne tension. La question ouverte (Claire, T3, traces noires, « ce n'est rien ») fait vraiment transférer. L'écran 15 est honnête (critères du livrable). Point faible avant correction : un distracteur de la carte 1 n'était pas plausible, et l'objectif « Comprendre » n'était pas enseigné.
- **E** : le dol (art. 1137) et la nullité relative (art. 1131) sont justes et prudemment formulés (« peut être annulée »). Le repère amiante « permis avant le 1er juillet 1997 » est confirmé. Le seuil « < 0,2 mm » est bien signalé comme fictif.
- **G** : conforme.

**Corrections**
1. Écran 2, « Comprendre » : « pourquoi le DPE ne voit ni taches, ni fissures, ni moisissures » (non traité dans le cours) → « pourquoi un défaut caché expose, et un défaut expliqué rassure » (traité aux écrans 5 et 9).
2. Écran 9, carte 1, option 2 : « Il faut attendre la fin de la visite pour repeindre » (personne ne le croit) → « Repeindre un plafond est interdit avant une vente » (idée reçue plausible).
3. Écran 9, `whys`[1] → « Faux : repeindre est permis, c'est même dans le plan Éco-staging. Ce qui pose problème, c'est de cacher sans informer ni prouver. » Ce `why` explique l'erreur et lève l'ambiguïté avec l'Éco-staging.
4. Écran 5, source : art. 1138 ajouté (dol émanant du représentant du contractant, donc de son mandataire), avec la date de vérification de Service-Public F10798. Ajouts aussi dans `sources` et `open_points`.

**Sources vérifiées**
- Code civil, art. 1137 : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000036829827 (texte confirmé : « dissimulation intentionnelle … information dont il sait le caractère déterminant »). Art. 1131 (nullité relative) et art. 1138 confirmés par des extraits de jurisprudence (simpliciter.ai) et par la section Légifrance art. 1130-1144.
- Service-Public F10798 (vérifié le 07/03/2025) : « permis de construire … délivré avant le 1er juillet 1997 » : https://www.service-public.gouv.fr/particuliers/vosdroits/F10798
- AQC, fiche E.09 (2024) : https://qualiteconstruction.com/wp-content/uploads/2024/01/fi-pathologie-batiment-e09-condensations-logements.pdf. La ventilation insuffisante y figure parmi plusieurs facteurs, ce qui justifie « cause probable ».

**À trancher**
- **Juriste** : peut-on dire à l'écran que l'agent mandataire peut lui-même être à l'origine du dol (art. 1138) ? Pour l'instant, la mention ne figure qu'en source.
- **Sébastien Paumier** : la réplique de Mozi et toutes les voix ; le choix du repère « 1997 » comme chiffre clé de l'écran 6 (ce n'est pas une statistique).
- **Production** : les photos P01 à P12 du reportage D05.

---

## 2.7 · Lire l'immeuble (audit de la copropriété)

**Notes** : P 4 · E 4 (après correction) · G 5

- **P** : le chapitre est très concret (calcul des tantièmes, qui paie quoi). La carte 2 (acte au 15/03/2027) fait un bon transfert de la règle de l'art. 6-2. La question ouverte (Maxime n'a que le dernier PV) déclenche bien la récupération en mémoire. Point faible : l'écran 6 porte deux idées (5 % et « reste au lot »), ce qui reste acceptable.
- **E** : **erreur juridique corrigée**. L'art. L. 721-2 vise les PV des AG « des trois dernières années », et non « des trois dernières AG ». L'art. 6-2 a été vérifié dans sa version issue du décret n° 2025-1292 du 22/12/2025 : le 2° (provisions hors budget = copropriétaire au moment de l'exigibilité) est exact. Le fonds de travaux (≥ 5 % du budget, 2,5 % du PPT s'il est adopté, aucun remboursement au vendeur) est exact.
- **G** : conforme.

**Corrections**
1. Écran 5, voix : « les PV des trois dernières assemblées » → « les PV d'assemblée des trois dernières années ».
2. Écran 5, `lines`[0] : « Les PV des 3 dernières AG… » → « Les PV d'AG des 3 dernières années sont remis à l'acheteur. » La source est précisée (L. 721-2, II, 1°, c).
3. Écran 8 : réponse modèle et mot-clé « trois dernières AG » → « trois dernières années ».
4. Écran 9 : `feedback` et `whys`[1] corrigés de la même façon.
5. Écran 15, voix : « n'ont jamais parlé » → « n'ont pas parlé ». La formulation n'affirme plus plus que ce que dit la capsule.
6. Sources des écrans 6 et 7 précisées : F34026 vérifié le 09/06/2026, art. 14-2-1, décret 2025-1292. Ajout de L. 721-2 et de F2604 dans `sources` ; ajout d'un `open_point`, car la capsule 2.7 (segment 05:20) dit encore « trois dernières AG ».

**Sources vérifiées**
- CCH, art. L. 721-2 : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043977384 (« c) Les procès-verbaux des assemblées générales des trois dernières années… »). Confirmé par Service-Public F2604 : https://www.service-public.gouv.fr/particuliers/vosdroits/F2604
- Décret du 17 mars 1967, art. 6-2 (en vigueur depuis le 25/12/2025) : https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000053191265
- Service-Public F34026 (vérifié le 09/06/2026) : https://www.service-public.gouv.fr/particuliers/vosdroits/F34026
- Non-remboursement du fonds de travaux (« définitivement acquises au syndicat ») : INC, https://www.inc-conso.fr/content/copropriete-le-fonds-de-travaux-en-6-questions
- Annuaire public du registre des copropriétés (adresse, nombre de lots, syndic) : la page existe (application JavaScript). Description reprise d'une source secondaire : https://blog.qoridor.fr/article/registre-national-copropriete

**À trancher**
- **Juriste** : relecture de l'art. 6-3 (convention contraire entre vendeur et acquéreur) et de la phrase de la carte 2.
- **Sébastien Paumier** : harmoniser la capsule 2.7 (« PV des trois dernières AG », segment 05:20).
- **Bible** : décompte des lots (48 lots principaux, plus caves et parkings) au regard des seuils PPPT et DPE collectif. Point déjà ouvert.

---

## 2.8 · Huit familles de valeur

**Notes** : P 4 · E 4 · G 5

- **P** : la règle « une famille par défaut, jamais deux » est bien amenée. La carte 2 (Claire, double compte des fenêtres) fait transférer. La question ouverte (Sarah, « salle de bains vieillotte », −10 000 €) est très réaliste. Le cours de l'écran 7 est dense (8 familles en 55 s), mais chaque famille tient en un mot avec sa question.
- **E** : le chiffre de l'écran 6 (≈ 15 % de ventes F-G début 2025) est confirmé sur notaires.fr, mis à jour le 7/01/2026. La mention « dynamiques territoriales contrastées » est confirmée. Un point de cohérence a été corrigé : le calcul 201 400 × 0,85 apparaissait avant que la base 201 400 € soit enseignée (elle ne l'est qu'en 2.10).
- **G** : conforme.

**Corrections**
1. Écran 5, `lines`[0] : « 201 400 × 0,85 = 171 190 € : un pourcentage, pas une preuve. » → « 172 000 € : un pourcentage, pas une preuve. » La source précise que les 172 000 € sont une situation fictive de la bible.
2. Écran 6, source : date de relecture ajoutée. Un `open_point` a été ajouté sur le retrait du calcul.

**Sources vérifiées**
- Notaires de France, « La valeur verte des logements en France sur les transactions 2024 », mis à jour le 7/01/2026 (« de 11 % à 17 » entre 2021 et 2023, puis « stabilisée début 2025 autour de 15 % ») : https://www.notaires.fr/fr/actualites/la-valeur-verte-des-logements-en-france-sur-les-transactions-2024

**À trancher**
- **Sébastien Paumier** : valider le nom des 8 familles (proposition pédagogique, sans source externe).
- **À vérifier** : le « 17 » sans symbole % sur notaires.fr. Les écarts régionaux de l'étude complète ne sont pas lus : ne pas en citer.
- **Cohérence** : garder les fenêtres en famille énergétique et la VMC en famille technique en 2.10 et dans le cas pratique.

---

## 2.9 · Chiffrer les travaux

**Notes** : P 4 · E 4 · G 5

- **P** : le contraste entre les 30 000 € « au flair » et les 16 500 € du devis est très efficace. La carte 2 (Élodie demande un prix à l'IA) fait un bon transfert vers l'usage de l'IA. La démo IA (garder la reprise d'enduit, barrer le prix inventé) est concrète et faisable. Avant correction, l'écran 5 présentait une situation type (« l'acheteur retire 30 000 € ») comme un fait.
- **E** : la TVA générale est confirmée (5,5 % pour la rénovation énergétique éligible, 10 % pour les autres travaux, logement achevé depuis plus de 2 ans, chaudières gaz et fioul à 20 % depuis le 1/03/2025). **Point sensible** : par poste, les radiateurs à inertie ne figurent pas dans la liste du 5,5 % (a priori 10 %). Les fenêtres exigent Uw ≤ 1,3 **et Sw ≥ 0,3**, et le Sw n'est pas dans la bible. Le chapitre dit « tu lis le taux sur le devis », ce qui reste exact.
- **G** : conforme.

**Corrections**
1. Écran 5, voix : « Et l'acheteur le croit. Il retire… » → « Et si l'acheteur le croit, il retire… ».
2. Écran 5, `lines`[0] : « L'acheteur retire 30 000 € de son offre. » → « S'il le croit, l'acheteur retire 30 000 € de son offre. » La source précise « situation type, pas un fait observé ».
3. `open_points` : détail des taux de TVA probables par poste, à faire valider. La fiche CAPEB (décembre 2025) est ajoutée dans `sources`.

**Sources vérifiées**
- economie.gouv.fr, « TVA à taux réduit : pour quels travaux ? », écrit le 11/12/2025 : https://www.economie.gouv.fr/particuliers/impots-et-fiscalite/gerer-mes-autres-impots-et-taxes/tva-taux-reduit-pour-quels-travaux
- CAPEB, fiche pratique TVA 5,5 % (décembre 2025) : VMC simple flux hygroréglable, chauffe-eau thermodynamique, fenêtres Uw ≤ 1,3 et Sw ≥ 0,3. Les émetteurs électriques n'y sont pas listés : https://www.capeb.fr/www/capeb/media//centrevaldeloire/document/fiche-pratique-tva-5.5-decembre-2025.pdf

**À trancher**
- **Expert-comptable ou artisan RGE** : le taux de TVA de chaque ligne du devis D13. Faut-il ajouter le Sw des fenêtres à la bible ?
- **Sébastien Paumier** : le prix moyen de 800 € par radiateur (moyenne dérivée, pas une ligne du devis) ; la capture d'un assistant IA générique sans marque.
- L'étude de prix ADEME de 2019 est ancienne : à actualiser ou à présenter comme datée.

---

## 2.10 · Estimer avant et après rénovation

**Notes** : P 4 · E 5 · G 5

- **P** : l'aboutissement du module est clair (deux valeurs, chacune prouvée). L'écran 5 oppose bien prix demandé et prix payé. La carte 2 (Hugo demande la valeur à l'IA) fait un bon transfert. L'écran 15 est honnête (fil rouge fictif). **Charge cognitive** : l'écran 7 enchaîne sept montants en 55 s, ce qui est compensé par l'affichage des étapes mais reste à tester sur un apprenant.
- **E** : tous les calculs sont justes. DVF est confirmé (5 dernières années, mise à jour semestrielle en avril et en octobre, hors Alsace, Moselle et Mayotte) et le lien de l'explorateur est confirmé. Une affirmation était inexacte : C5 à 2 700 €/m² × 76 = 205 200 €, donc une vente comparable « soutient » 205 000 € avant ajustements.
- **G** : conforme. Karim y figure en apprenant, dans son rôle de directeur d'agence.

**Corrections**
1. Écran 8, réponse modèle : « Aucune vente comparable en l'état ne soutient 205 000 €. » → « Même la vente en l'état la plus chère, 2 700 €/m², donne 205 200 € avant les retraits prouvés : 205 000 € ne tient pas. »
2. Écran 6, source : citations exactes de data.gouv.fr (période, fréquence, territoires exclus).
3. Écran 13, source : lien de l'explorateur rattaché à la page officielle data.gouv.fr. Deux `open_points` ajoutés (écran 8 corrigé, charge de l'écran 7).

**Sources vérifiées**
- data.gouv.fr, jeu DVF : https://www.data.gouv.fr/datasets/demandes-de-valeurs-foncieres (« cinq dernières années », « mise à jour semestrielle, en avril et en octobre », « à l'exception de l'Alsace, de la Moselle et de Mayotte »)
- Explorateur DVF : https://explore.data.gouv.fr/immobilier/ (lien donné par https://www.data.gouv.fr/pages/onboarding/dvf/)
- Art. 6-2 du décret de 1967 : voir le chapitre 2.7.

**À trancher**
- **Sébastien Paumier** : la décote copropriété de 6 900 à 14 900 € est un jugement pédagogique dérivé de la fourchette de la bible. Elle est présentée comme telle ; à valider.
- **Production** : créer le tableau D12 (C1-C5, R1-R3) avec exactement ces prix et surfaces, mention « exemple fictif ».
- **Diagnostiqueur** : les performances après travaux (D puis C) sont fictives et ne sont pas affichées dans ce chapitre.

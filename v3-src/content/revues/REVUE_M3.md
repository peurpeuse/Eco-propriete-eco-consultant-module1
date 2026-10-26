# Revue du module 3 : chapitres 3.1 à 3.7

Comité de relecture : ingénierie pédagogique, exactitude métier et juridique, conformité au gabarit et au ton. Relecture faite le 26/10/2026, sans avoir vu la rédaction. Les chapitres sont jugés tels qu'ils sont écrits.
Contrôle `python3 check_chap.py M3/chap_3.*.json` : **7/7 OK, 0 ERREUR, 0 ALERTE** (avant et après les corrections). Toutes les voix restent en `voice_status: "proposition"`.

## Synthèse des notes

| Chapitre | Pédagogie | Métier / juridique | Gabarit / ton | Corrections |
|---|---|---|---|---|
| 3.1 Maîtriser le dossier client | 4,5/5 | 4,5/5 | 5/5 | 4 |
| 3.2 Communiquer avec le DISC | 4,5/5 | 4/5 → 4,5 | 5/5 | 5 |
| 3.3 Travaux ou vente en l'état | 4,5/5 | 4/5 → 4,5 | 5/5 | 8 |
| 3.4 Le plan Éco-staging | 4,5/5 | 4,5/5 | 5/5 | 3 |
| 3.5 Présenter et défendre son prix | 4,5/5 | 4/5 → 4,5 | 4,5/5 → 5 | 6 |
| 3.6 Traiter les objections | 4,5/5 | 4,5/5 → 5 | 5/5 | 5 |
| 3.7 Obtenir le mandat exclusif | 5/5 | 4,5/5 | 5/5 | 3 |

Total : **34 modifications ciblées**, dont les sources et les points ouverts. Une flèche indique la note après correction.

Constats communs, tous positifs : une idée par écran ; Mozi montre sans faire la morale ; chaque carte 1 a deux distracteurs plausibles et des `whys` qui expliquent l'erreur ; chaque carte 2 fait transférer la règle vers un des six agents (Karim, Claire, Maxime, Sarah) ; les livrables de l'écran 14 tiennent en une capture ; les écrans 15 s'appuient sur un fait observable, sans statistique inventée. Les chiffres du fil rouge sont identiques à la bible, calculs refaits : 1 150 000 × 312/10 000 = 35 880 ; 4 × 8 970 = 35 880 ; (216 600 − 182 000) − 16 500 − 35 880 = −17 780 ; 70 + 150 + 70 + 160 = 450 ; 450/189 000 = 0,24 % ; 76 × 2 650 = 201 400 ; 201 400 × 0,85 = 171 190 ; 205 000/76 ≈ 2 697 ; 150 × 1,9 = 285 → E. Calendrier : le jeudi 29/10/2026 et le jeudi 5/11/2026 tombent bien un jeudi. « Sébastien Paumier » partout, jamais « Seb ». Tutoiement de l'apprenant ; seul Mozi vouvoie M. Bernard. Karim est traité en apprenant, directeur d'agence.

---

## 3.1 Maîtriser le dossier client

**Notes** : pédagogie 4,5 · métier 4,5 · gabarit 5.
- Pédagogie : objectif clair. Le cours suit trois temps : 4 blocs, puis source, date et statut, puis une phrase par pièce. La question ouverte (Maxime et les relevés bancaires) oblige à rappeler la minimisation. L'écran 6 n'est pas un chiffre du dossier : c'est une règle réelle (15 ans), illustrée par un détail du fil rouge, ce qui est honnête.
- Réserve : la réplique de Mozi enfreint deux règles (minimisation et PV d'AG caché). La carte 1 n'en teste qu'une. C'est acceptable, puisque le feedback cite aussi L. 721-2.

**Corrections**
1. Écran 5, source : « PV des AG… remis au plus tard à la promesse » → précision ajoutée « sauf si le vendeur n'a pas pu les obtenir du syndic », et renvoi au délai de l'art. L. 271-1 (texte exact de L. 721-2 et L. 721-3).
2. Écran 9, `whys[1]` : « prêt soldé, propriétaire seul… » → « tu vérifies son identité et son titre de propriété, pas ses relevés ». Le texte explique désormais l'erreur au lieu de répéter le cas.
3. Écran 6, source : ajout de la date de mise à jour de la fiche Service-Public (7/03/2025).
4. `open_points` : L. 721-2 et L. 721-3 marqués « vérifiés », avec mention de la simplification faite à l'oral.

**Sources vérifiées**
- CCH art. L. 721-2 (en vigueur depuis le 1/01/2024) : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043977384
- CCH art. L. 721-3 : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000031110572
- Service-Public F10798 (électricité si installation de plus de 15 ans) : https://www.service-public.gouv.fr/particuliers/vosdroits/F10798

**À trancher** : la formulation simplifiée de l'écran 5 (relecture juridique) ; les termites à Melun (héritage de la capsule) ; le lien de l'écran 13.

## 3.2 Communiquer avec le DISC

**Notes** : pédagogie 4,5 · métier 4 → 4,5 · gabarit 5.
- Pédagogie : la grille à deux axes (rapide ou posé, faits ou personnes) est simple et juste. « Hypothèse, pas étiquette » est bien martelé. La carte 2 (la fille de M. Bernard, une part de S) fait vraiment transférer.
- Métier : il manquait la mise en garde demandée (DISC non validé scientifiquement), et le `why` citait un « devoir de conseil » sans texte.

**Corrections**
1. Écran 6, voix : « pas un diagnostic » → « pas un test scientifique ni un diagnostic ».
2. Écran 6, `label` : ajout de « un outil de communication, pas une science validée ».
3. Écran 9, `whys[2]` : « contraire à ton devoir de conseil » → « Le DISC sert à traduire, pas à forcer » (plus aucune référence juridique non sourcée).
4. Écran 14, `ask` : « (hypothèse et indices) » → « (hypothèse et au moins 5 indices observés) », pour s'aligner sur l'exercice de la capsule et sur l'écran 15 (« cinq indices »).
5. `open_points` : le point « devoir de conseil » est mis à jour.

**Sources vérifiées**
- Everything DiSC, « Our story » (Marston, *Emotions of Normal People*, 1928) : https://www.everythingdisc.com/our-story

**À trancher** : l'usage du mot « DISC » face à la marque DiSC (relecture juridique, héritage de la capsule) ; écran 5 fondé sur le fil rouge et non sur une étude.

## 3.3 Travaux ou vente en l'état

**Notes** : pédagogie 4,5 · métier 4 → 4,5 · gabarit 5.
- Pédagogie : excellent contre-exemple chiffré. L'écran 6 isole « la ligne qui manque ». Le calcul de −17 780 € est juste.
- Métier : l'écran 5 et la réponse modèle annonçaient « vente après l'été 2027 ». Or la durée du chantier ITE n'est pas connue : seul le début, en avril 2027, figure dans la bible, et le point ouvert interdit de la chiffrer.

**Corrections**
1. Écran 5, `title` : « Vente après l'été 2027 » → « Vente repoussée après le chantier ».
2. Écran 5, voix : « Et une vente après l'été 2027 » → « …repoussée après le chantier, qui ne démarre qu'en avril 2027 ».
3. Écran 5, `lines[1]` : même correction, avec « (début avril 2027) ».
4. Écran 8, `model_answer` : même correction.
5. Écran 6, voix : ajout de « Dans notre dossier d'exemple » (chiffre fictif présenté comme tel).
6. Écran 6, `label` : ajout de « (dossier d'exemple fictif) ».
7. Écran 9, source : précision « art. 6-2, 2° », version en vigueur depuis le 25/12/2025, vérifiée.
8. Écran 9, `feedback` : « Art. 6-2 » → « Art. 6-2, 2° ».

**Sources vérifiées**
- Décret n° 67-223, art. 6-2 (modifié par le décret n° 2025-1292 du 22/12/2025, en vigueur depuis le 25/12/2025). Le 2° dit : les provisions hors budget sont à la charge de celui qui est copropriétaire à l'exigibilité. Lien : https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000053191265
- Service-Public F10864 (exonération de la résidence principale), déjà cité, non modifié.

**À trancher** : l'écran 7 parle de « deux scénarios » ; la grille (écrans 10 et 11) en compte trois. C'est cohérent, puisque le cours compare les deux extrêmes, mais Sébastien Paumier peut vouloir harmoniser. La relecture juridique de l'accord vendeur/acquéreur reste à faire.

## 3.4 Le plan Éco-staging

**Notes** : pédagogie 4,5 · métier 4,5 · gabarit 5.
- Pédagogie : le tri traiter / documenter / expliquer est clair et réutilisable. La question ouverte, posée à travers le réseau d'Élodie, porte bien sur « révéler la cause ».
- Métier : l'art. 1112-1 est fidèlement rendu. Il prévoit la responsabilité, et une annulation possible dans les conditions des art. 1130 et suivants.

**Corrections**
1. Écran 6, voix : « il suffit d'environ 450 euros » → « dans notre dossier d'exemple, … coûte environ 450 euros ».
2. Écran 6, `label` : ajout de « dans le dossier d'exemple (fictif) ».
3. Écran 5, source : ajout de « vérifié le 26/10/2026 ».

**Sources vérifiées**
- Code civil, art. 1112-1 (en vigueur depuis le 1/10/2016) : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032007138

**À trancher** : « vente annulable » (le devoir pèse sur le vendeur ; la responsabilité propre de l'agent reste à formuler par un juriste) ; les prix locaux des 450 € ; le débouchage déjà compris dans le devis VMC.

## 3.5 Présenter et défendre son prix

**Notes** : pédagogie 4,5 · métier 4 → 4,5 · gabarit 4,5 → 5.
- Pédagogie : « le prix en 5e position » est une idée forte. Le passage du net au FAI est montré. La question ouverte (Claire face aux 172 000 €) fait refaire le calcul de la décote.
- Métier : la carte 2 affichait 195 300 €. Ce montant suppose des honoraires à 5 % du net. Or la bible traite les honoraires comme fixes (9 000 €) : l'offre Martin est 175 000 + 9 000 = 184 000, et le prix plancher est décrit avec des « honoraires fixes 9 000 € ».

**Corrections**
1. Écran 6, voix : ajout de « Dans notre dossier d'exemple ».
2. Écran 6, `label` : ajout de « (exemple fictif) ».
3. Écran 9, carte 2 : « 195 300 € » → « 195 000 €, avec les mêmes 9 000 € d'honoraires ».
4. Écran 12, voix : « Les trois questions des acheteurs, déjà répondues » (tournure fautive à l'oral) → « Puis les réponses aux trois questions des acheteurs ».
5. `sources` : le lien générique vers le décret est remplacé par l'URL de l'art. 73.
6. `open_points` : ajout de la divergence 195 000 / 195 300.

**Sources vérifiées**
- Décret n° 72-678, art. 73 : https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000033261932
- SeLoger, L. Lapiana, 18/12/2023 (constat qualitatif, sans chiffre sur la surestimation, ce qui est conforme à l'écran 5) : https://edito.seloger.com/node/17809
- Explorateur DVF : la page ne s'affiche pas sans JavaScript, donc le parcours n'a pas pu être vérifié. La mention « à vérifier le jour du tournage » est maintenue.

**À trancher (bloquant léger)** : honoraires **fixes (9 000 €) ou à 5 %**. Sébastien Paumier doit choisir, puis harmoniser la capsule 3.5, qui indique 195 300 €.

## 3.6 Traiter les objections selon le profil

**Notes** : pédagogie 4,5 · métier 4,5 → 5 · gabarit 5.
- Pédagogie : ARFE est simple. La carte 2 (une règle inventée par l'IA) développe une vraie compétence de vérification. Le jeu de rôle avec l'IA comporte ses garde-fous (aucune donnée réelle, vérifier chaque règle).
- Métier : l'écran 6 laissait entendre que le DPE lui-même passe à E. En réalité, c'est l'attestation actualisée qui affiche E. L'URL de l'arrêté manquait.

**Corrections**
1. Écran 6, voix : ajout de « avec l'attestation actualisée ».
2. Écran 6, `label` : même ajout.
3. Écran 6, source : intitulé exact de l'arrêté, JORFTEXT, calcul 150 × 1,9 = 285 → E.
4. `sources` : l'URL de l'arrêté du 13/08/2025 est ajoutée.
5. `open_points` : le point « URL à ajouter » est mis à jour.

**Sources vérifiées**
- Arrêté du 13 août 2025 modifiant le facteur de conversion de l'énergie finale en énergie primaire de l'électricité relatif au DPE (2,3 → 1,9 au 1/01/2026) : https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052134589
- Code de la consommation, art. L. 221-18 (14 jours, contrat hors établissement ; en vigueur depuis le 1/07/2016) : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032226842
- Décret n° 67-223, art. 6-2 (voir 3.3).

**À trancher** : tester le prompt sur l'outil d'IA retenu. Petite incohérence de mise en scène : en 3.6, tu « appelles » M. Bernard le jeudi 5/11 ; en 3.7, il « vient à l'agence » ce jour-là. C'est hérité des capsules, et il suffit d'harmoniser un mot.

## 3.7 Obtenir le mandat exclusif

**Notes** : pédagogie 5 · métier 4,5 · gabarit 5.
- Pédagogie : l'exclusivité est présentée comme un échange d'engagements cochables, ce qui convient au profil C. Le chiffre leboncoin est présenté honnêtement comme déclaratif, et la question ouverte apprend à ne pas en faire une promesse.
- Métier : les art. 72, 73 et 78 sont fidèlement résumés. L'art. 72 prévoit le registre et le numéro reporté sur l'exemplaire du mandant. L'art. 78 exige une stipulation expresse, un exemplaire remis et des caractères très apparents, et permet de dénoncer le mandat après 3 mois avec 15 jours de préavis par LRAR.

**Corrections**
1. `sources` : le lien générique vers le décret est remplacé par trois URL d'articles (72, 73, 78).
2. Écran 9, carte 2 : « Le formulaire de rétractation » → « L'information sur le droit de rétractation, avec son formulaire ».
3. `open_points` : ajout d'un point à vérifier (C. consom. art. L. 221-5 pour le formulaire type).

**Sources vérifiées**
- Décret n° 72-678, art. 72 : https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000033202014
- Décret n° 72-678, art. 73 : https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000033261932
- Décret n° 72-678, art. 78 : https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000030782471
- Code de la consommation, art. L. 221-18 : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032226842
- MySweetImmo, 6/11/2025 (leboncoin Immo, 419 professionnels, enquête du 22/09 au 7/10/2025 : 91 j contre 142 j) : https://www.mysweetimmo.com/2025/11/06/immobilier-les-biens-vendus-en-exclusivite-partent-51-jours-plus-vite-quen-mandat-simple/

**À trancher** : la relecture juridique de l'écran 5. « Clause illisible : exclusivité inapplicable » est l'interprétation courante de l'art. 78, mais le texte lie l'inapplicabilité à la stipulation expresse et à l'exemplaire remis, la mention en caractères très apparents étant une exigence de forme. Restent aussi l'art. L. 221-5 et le numéro de registre fictif en démonstration.

---

## Points restants pour Sébastien Paumier ou un juriste

1. **Honoraires fixes ou à 5 %** (3.5) : le chapitre est aligné sur la bible (195 000 €), la capsule indique 195 300 €.
2. **Relecture juridique** des formulations simplifiées : 3.1 écran 5 (L. 721-2 et L. 721-3), 3.4 écran 5 (1112-1, « vente annulable »), 3.7 écran 5 (portée de la mention « caractères très apparents ») et le formulaire type de rétractation (L. 221-5, non vérifié).
3. **Marque DiSC** et mot « DISC » (3.2).
4. Validation de toutes les voix (`proposition`), des liens des écrans 13, des parcours ADEME et DVF le jour du tournage, et du prompt de jeu de rôle (3.6).

Aucun point bloquant pour le contrôle automatique.

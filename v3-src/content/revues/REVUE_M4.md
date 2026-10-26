# Revue du module 4 : chapitres 4.1 à 4.5

Revue du 26/10/2026. Trois relecteurs ont travaillé sans avoir vu la rédaction : ingénierie pédagogique, exactitude métier et juridique, conformité au gabarit.
Référentiel : `GABARIT_CHAPITRE.md`, `BIBLE.md`, chapitre pilote `M1/chap_1.3.json`, capsules `M4/cap_4.x.json`.
Contrôle final : `python3 check_chap.py M4/chap_4.*.json` → 5 × OK, **0 ERREUR, 0 ALERTE**. Toutes les voix restent en `voice_status: "proposition"`.

## Vue d'ensemble

| Chapitre | Pédagogie | Exactitude | Gabarit et ton | Corrections |
|---|---|---|---|---|
| 4.1 Écrire l'annonce | 4,5/5 | 4/5 → 4,5/5 après correction | 5/5 | 10 |
| 4.2 Mener la visite | 4,5/5 | 4/5 → 4,5/5 | 5/5 | 6 |
| 4.3 Chiffrer les défauts | 4/5 → 4,5/5 | 4/5 → 4,5/5 | 5/5 | 7 |
| 4.4 Qualifier l'acquéreur | 4,5/5 | 4,5/5 | 5/5 | 4 |
| 4.5 Négocier l'offre | 4/5 → 4,5/5 | 4,5/5 | 5/5 | 6 |

Total : **33 corrections ciblées**. Les notes « → » donnent l'état après correction.

Tous les calculs du fil rouge ont été refaits :
- quote-part ITE : 1 150 000 × 312 / 10 000 = 35 880 €, soit 4 × 8 970 € ;
- travaux privatifs : 5 600 + 2 900 + 4 800 + 3 200 = 16 500 €, et 16 500 + 35 880 = 52 380 € ;
- besoin de financement : 184 000 + 13 300 + 16 500 + 2 000 = 215 800 €, moins l'apport : prêt de 193 800 € ;
- mensualité à 3,55 % sur 300 mois = 975,41 €, plus 48,45 € d'assurance (0,30 %), soit 1 024 € → 22,26 % de taux d'effort (21,2 % hors assurance) ;
- tout dans un seul prêt (229 680 €) : 1 156 + 57 = 1 213 €/mois → 26,4 % ;
- honoraires : 9 000 / 180 000 = 5 % ;
- offres : 170 000 − 9 000 − 8 970 = 152 030 € ; 175 000 − 152 030 = 22 970 €.

Tous ces chiffres sont exacts et identiques à la bible. Le vouvoiement n'apparaît que dans des citations de clients, ce qui est conforme. « Seb » n'apparaît nulle part, les six agents sont cohérents avec leurs rôles, et il n'y a aucun émoji.

---

## Chapitre 4.1 : écrire l'annonce

**Notes** : pédagogie 4,5 · exactitude 4 → 4,5 · gabarit 5.

**Pédagogie.** L'objectif est clair et le cours en trois blocs (énergie, prix, copropriété) se retient bien. La réplique de Mozi est absurde, sans morale. La question ouverte (« entièrement rénové, faibles charges, classe D après travaux ») oblige vraiment à rappeler les règles. Dans la carte 1, la deuxième option (« 1 200 caractères ») ne tenait pas : elle renvoyait à la consigne du prompt, que l'apprenant ne découvre qu'à l'écran 11. Elle a été remplacée par une option crédible, qui enseigne une règle. Les démos sont faisables, la preuve en une image est réaliste et l'effet statut est honnête.

**Corrections faites**
- Écran 6 (chiffre clé) : « 62,5 % des agences, contrôles 2020 » → **« 65,1 % des professionnels contrôlés en 2023 »** (1 739 professionnels, 1 132 en anomalie). Une enquête DGCCRF plus récente, publiée le 19/12/2024, existait. Voix réécrite : « En 2023, la DGCCRF a contrôlé 1 739 professionnels… près de deux sur trois… ».
- Écran 5 : source mise à jour avec les suites de l'enquête 2023 (564 avertissements, 504 injonctions, 40 PV pénaux, 102 PV administratifs, notamment pour défaut d'affichage du DPE). Les manquements sur la copropriété restent sourcés par la page de 2022.
- Écran 7 : retrait de « en couleur » dans la voix. L'obligation d'afficher les étiquettes en couleur n'a pas été vérifiée.
- Écran 9, carte 1 : option 2 « Une annonce ne peut pas dépasser 1 200 caractères » → « Seuls la classe énergie et le prix sont obligatoires : la copropriété peut attendre la visite ». Le `why` correspondant cite désormais le CCH, art. L. 721-1. La source passe à « arrêté 2017, art. 3 ».
- Écran 12 : ajout de la **mention Géorisques** dans la voix et dans l'étape « Compléter ». Le cours annonçait une « annonce conforme » sans cette mention obligatoire.
- Écran 15 : « six agences sur dix (dernier grand contrôle) » → « près de deux professionnels sur trois avaient au moins une anomalie (dernier contrôle publié) ». La nouvelle formulation ne laisse plus croire que toutes les anomalies portent sur les annonces.
- Sources : ajout de la page DGCCRF 2024, de Service-Public F12239 et de la page INC ; URL de la page DGCCRF 2022 normalisée.
- Points ouverts : point DGCCRF mis à jour, point Géorisques reformulé.

**Sources vérifiées**
- Arrêté du 10/01/2017, art. 3 : prix honoraires inclus et exclus, le prix honoraires inclus en caractères plus grands. https://www.legifrance.gouv.fr/loda/id/JORFTEXT000033888549/
- CCH, art. R. 126-21 à R. 126-25, « Mention des informations dans les annonces immobilières ». https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006074096/LEGISCTA000043818607/
- CCH, art. L. 721-1, en vigueur depuis le 01/01/2022 : statut de copropriété, nombre de lots, charges moyennes annuelles, dépenses théoriques d'énergie, procédures. https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000039369572
- DGCCRF, enquête 2023 publiée le 19/12/2024. https://www.economie.gouv.fr/dgccrf/laction-de-la-dgccrf/les-enquetes/professions-de-limmobilier-beaucoup-de-manquements
- DGCCRF, enquête 2020 publiée le 08/12/2022. https://www.economie.gouv.fr/dgccrf/laction-de-la-dgccrf/les-enquetes/controle-des-professionnels-de-limmobilier
- INC, contenu minimal d'une annonce (01/09/2023). https://www.inc-conso.fr/content/vente-immobiliere-le-contenu-minimal-dune-annonce

**À trancher (Sébastien Paumier ou un juriste)**
- Nombre de lots à afficher : 48 lots principaux, ou le total avec caves et parkings (L. 721-1 dit « nombre de lots »).
- Confirmer que l'attestation actualisée reprend la fourchette de dépenses 2 330 – 3 190 € (prix 2021).
- Confirmer que le bien de Melun relève bien d'un état des risques (D17 le prévoit), sinon retirer la mention Géorisques.
- Relecture juridique des mentions obligatoires.

---

## Chapitre 4.2 : mener la visite

**Notes** : pédagogie 4,5 · exactitude 4 → 4,5 · gabarit 5.

**Pédagogie.** Le chapitre est très concret : pochette de 8 documents, parcours « l'histoire, pas le couloir ». La question ouverte de Julie sur la façade est excellente, elle fait transférer la règle de l'art. 6-2. La carte 2 (état des risques vieux de huit mois) fait bien transférer. L'écran 6 n'est pas une statistique mais un repère réglementaire (« 6 mois ») : c'est acceptable, et c'est sourcé.

**Corrections faites**
- Écran 5, voix et lignes : « Sinon, l'acheteur peut demander l'annulation… » → « **Absent ou inexact**, il permet à l'acheteur de demander l'annulation de la vente, ou une baisse du prix ». Service-Public rattache la sanction à l'absence ou à l'inexactitude du document, pas à la seule remise tardive. La source mentionne en plus l'effet sur le délai de rétractation.
- Écran 12, voix et étape : « la façade isolée en 2027 » → « l'isolation de la façade **dès avril 2027** ». Seul le démarrage est connu par la bible, pas la fin des travaux.
- Sources : ajout de l'article 6-2 du décret de 1967 sur Légifrance (version en vigueur depuis le 25/12/2025) ; libellé ANIL précisé (convention contraire sans effet envers le syndicat).
- Points ouverts : terme exact de L. 125-5 (« résolution » ?) et point de départ des six mois, ajoutés comme points à vérifier.

**Sources vérifiées**
- Service-Public F12239 (vérifié le 28/09/2026) : remise lors de la 1re visite ; document établi depuis moins de 6 mois ; annulation avec dommages et intérêts, ou réduction du prix ; délai de rétractation repoussé ; mention Géorisques ; service en ligne R58592. https://www.service-public.gouv.fr/particuliers/vosdroits/F12239
- Décret du 17/03/1967, art. 6-2, 2° : les dépenses hors budget sont payées par le copropriétaire au moment de l'exigibilité. https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053191265
- ANIL, décret du 27/05/2004 : une convention contraire n'a d'effet qu'entre les parties. https://www.anil.org/documentation-experte/analyses-juridiques-jurisprudence/analyses-juridiques/analyses-juridiques-2004/principales-dispositions-du-decret-27-mai-2004/

**À trancher**
- « Annulation » (Service-Public) ou « résolution » (texte de loi, à vérifier sur Légifrance, que la revue n'a pas pu consulter).
- Point de départ des six mois : la date de la visite, ou seulement celle de la promesse et de l'acte ? La carte 2 suppose la visite.
- Un exemplaire de l'état des risques par visiteur : choix pédagogique.
- Pertinence du lien R58592 pour un professionnel qui prépare le document de son vendeur.

---

## Chapitre 4.3 : chiffrer les défauts

**Notes** : pédagogie 4 → 4,5 · exactitude 4 → 4,5 · gabarit 5.

**Pédagogie.** La méthode en quatre temps est claire, et les calculs à l'écran sont justes et lisibles. La question de Thomas sur l'humidité déclenche bien la méthode. Défauts corrigés : l'écran 5 parlait de « défaut caché », ce qui renvoie à un autre régime (vices cachés) alors que le simple vitrage de Mozi est visible mais maquillé. L'écran 6 présentait un chiffre fictif comme un chiffre clé sans le dire.

**Corrections faites**
- Écran 5 : « Défaut caché. Vente annulable. » → **« Défaut maquillé. Vente annulable. »**. Voix : « Tue **ou maquillée** volontairement… ». Lignes : « Défaut maquillé, confiance perdue. / Dol prouvé : vente annulable. ». La source cite les art. 1137 (manœuvres, mensonges, dissimulation) et 1138.
- Écran 6 : titre « Dossier de M. Bernard : 52 380 € de travaux sourcés » ; voix « **Dans le dossier de M. Bernard**, tout est sur la table… ».
- Écran 8, réponse modèle : « moisissures, déjà traitées avant la mise en vente » → « nettoyées pour la vente **mais qui reviendront sans ventilation** ». Laisser croire que le défaut était réglé aurait été trompeur.
- Écran 9, retour de la carte 1 : ajout de l'art. 1138 (le dol peut venir du représentant du vendeur). Sans lui, la règle visait les « parties » alors que Mozi est l'agent.
- Sources : art. 1112-1 et section 1130-1144 du code civil sur Légifrance.
- Points ouverts : vérification Légifrance actée ; remarque sur 52 380 €, qui additionne des travaux facultatifs et une dépense votée.

**Sources vérifiées**
- Code civil, art. 1112-1. https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032007138
- Code civil, art. 1137 (version du 01/10/2018) et art. 1138. https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006070721/LEGISCTA000032007571/

**À trancher**
- Responsabilité propre de l'agent (devoir de conseil) : non traitée, relecture juridique souhaitée.
- Afficher à l'écran « devis fictifs, prix indicatifs à valider localement ».

---

## Chapitre 4.4 : qualifier l'acquéreur

**Notes** : pédagogie 4,5 · exactitude 4,5 · gabarit 5.

**Pédagogie.** C'est le meilleur des cinq. La carte 2 (Sarah oublie l'assurance : 21,2 % au lieu de 22,3 %) est un excellent transfert, avec l'idée « ici ça ne change rien, mais près de 35 % si ». Les distracteurs de la carte 1 sont plausibles, notamment le chèque avec l'offre. Le profil DISC des Martin est cohérent avec la bible.

**Corrections faites**
- Écran 8 : source enrichie avec le guide Tracfin de janvier 2026 (origine des fonds, identité vérifiée avant le compromis).
- Sources : ajout du guide Tracfin et d'une source datée pour le taux d'usure de 5,40 % au T4 2026.
- Points ouverts : « origine des fonds » est désormais confirmée (guide Tracfin, décision CNS du 27/05/2024) ; référence de la mention de non-recours au prêt précisée (C. consomm., art. L. 313-42).

**Sources vérifiées**
- DGCCRF, « Lutte contre le blanchiment » (28/09/2023) : la DGCCRF contrôle l'entremise immobilière ; obligations d'évaluation des risques, de vigilance adaptée, de gel des avoirs, de formation et de déclaration à Tracfin. https://www.economie.gouv.fr/dgccrf/actualites/lutte-contre-le-blanchiment
- Commission nationale des sanctions, décision du 27/05/2024 : agence immobilière sanctionnée, notamment pour des informations insuffisantes sur l'origine des fonds ; interdiction d'exercer six mois avec sursis et 1 500 € d'amende. https://www.economie.gouv.fr/files/files/directions_services/commission-nationale-sanctions/media-document/2023-10_DecisionCNS27052024_IMMO.pdf
- Tracfin, guide pour les professionnels de l'immobilier (janvier 2026), copie consultée. https://www.maformationimmo.fr/wp-content/uploads/2026/02/Plaquette-Immo_012026_def_0.pdf
- Taux d'usure de 5,40 % pour les prêts de 20 ans et plus, du 01/10 au 31/12/2026. https://ymanci.fr/credit-immobilier/actualites/taux-usure-quatrieme-trimestre-2026/
- Normes HCSF maintenues en 2026 (35 %, 25 ans) : article Cafpi déjà cité ; fait vérifié de la bible.
- Code civil, art. 1589-1. https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006441325
- Outil ANIL « Diagnostic de financement immobilier » : la page existe. https://www.anil.org/outils/outils-de-calcul/diagnostic-de-financement/
- Mention de non-recours au prêt (C. consomm., art. L. 313-42), jurisprudence relayée par l'ANIL. https://www.anil.org/jurisprudences-promesse-vente-renonciation-clause-suspensive-pret/

**À trancher**
- Assurance à 49 €/mois et TAEG à 4,2 % : valeurs calculées sur le dossier fictif, à valider.
- Test de résistance (26,4 %) : à harmoniser avec la capsule 5.4.
- Remplacer l'URL du guide Tracfin par le lien officiel tracfin.gouv.fr.
- L'outil ANIL ne précise pas qu'il calcule le taux d'effort : le tester le jour du tournage.

---

## Chapitre 4.5 : négocier l'offre

**Notes** : pédagogie 4 → 4,5 · exactitude 4,5 · gabarit 5.

**Pédagogie.** Le passage du prix affiché (14 000 €) à l'écart réel (22 970 €) crée une vraie surprise utile. La question ouverte est bonne (M. Bernard demande « laquelle je prends ? »). La carte 2 (chèque joint à l'offre) fait transférer. Deux points faibles : le chiffre clé fictif n'était pas présenté comme tel, et l'écran 15 constatait un fait sans effet statut.

**Corrections faites**
- Écran 6 : titre « **Dossier de M. Bernard** : 22 970 € d'écart réel, pas 14 000 € » ; voix « Dans le dossier de M. Bernard, les deux offres ont 14 000 euros d'écart en prix affiché. En net réel : 22 970 euros. »
- Écran 9, carte 1, troisième `why` : « peut faire tomber l'accord » → « un mensonge pour obtenir l'accord de l'acquéreur peut constituer un dol, même venant du représentant du vendeur (art. 1137 et 1138) ». La source de l'écran est complétée.
- Écran 15 : « M. Bernard a signé le 2 décembre. 184 000 euros, et 175 000 euros net réel. Direction le notaire. » → « Tableau en main, M. Bernard a accepté l'offre Martin le 2 décembre : 175 000 euros net réel, **22 970 de plus que l'offre comptant** ». Le statut est aligné sur cette voix.
- Sources : section du code civil 1130-1144 et article 6-2 du décret de 1967 sur Légifrance.
- Points ouverts : mise à jour sur le bluff, ajout d'une note sur le caractère fictif de l'écran 15.

**Sources vérifiées**
- Code civil, art. 1583 : la vente est parfaite dès l'accord sur la chose et le prix. https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006441308
- Code civil, art. 1589-1 (lien ci-dessus) ; art. 1137 et 1138 (lien ci-dessus).
- Décret de 1967, art. 6-2, et analyse ANIL (liens ci-dessus).

**À trancher**
- Prix plancher de 175 000 € et refus de M. Petit : choix pédagogiques à aligner avec les autres modules.
- Honoraires maintenus à 9 000 € quel que soit le prix.
- Portée d'une offre acceptée (art. 1583) face à la pratique du compromis : relecture juridique.
- Qualification du bluff en pratique commerciale trompeuse : non affirmée à l'écran.

---

## Points transverses pour Sébastien Paumier

1. **Toutes les voix sont des propositions**, y compris les cinq répliques de Mozi.
2. Trois chiffres clés de l'écran 6 viennent du dossier fictif : 4.3 (52 380 €), 4.5 (22 970 €), et 4.2 dans une moindre mesure (un repère réglementaire). Ils sont désormais annoncés « dans le dossier de M. Bernard ». Seuls 4.1 (DGCCRF) et 4.4 (HCSF) reposent sur une donnée publique.
3. Relecture juridique groupée conseillée : mentions d'annonce (4.1), état des risques (4.2), art. 1112-1, 1137 et 1138 (4.3), LCB-FT (4.4), art. 1583 et 6-2 (4.5).
4. Légifrance a été consulté le 26/10/2026 pour : CCH L. 721-1 et R. 126-21 à 25, arrêté du 10/01/2017 art. 3, code civil 1112-1, 1137, 1138, 1583, 1589-1, et décret de 1967 art. 6-2. L'article L. 125-5 du code de l'environnement n'a pas pu être lu.

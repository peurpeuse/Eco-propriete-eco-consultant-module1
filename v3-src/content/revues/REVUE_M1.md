# Revue du module 1 — chapitres 1.1 à 1.7

Revue faite le 26/10/2026 par un comité de trois regards (ingénierie pédagogique et neurosciences, exactitude métier et juridique, conformité au gabarit et ton). Les textes ont été jugés tels qu'ils sont, sans connaître leur rédaction.
Contrôle final : `python3 check_chap.py M1/chap_1.*.json` donne 7 × OK, 0 ERREUR, 0 ALERTE.
Toutes les voix modifiées gardent `voice_status: "proposition"`. Le chapitre 1.3 (pilote) n'a pas été modifié.

## Synthèse des notes (/5)

| Chapitre | Pédagogie | Exactitude | Gabarit et ton |
|---|---|---|---|
| 1.1 Lire le marché 2026 | 4 | 4 | 5 |
| 1.2 Vérifier avant de chiffrer | 4,5 | 4 | 5 |
| 1.3 Attirer des clients (pilote, relu seulement) | 4,5 | 4 | 4,5 |
| 1.4 Être présent sur Facebook | 4 | 4,5 | 4,5 |
| 1.5 Être recommandé sur LinkedIn | 4 | 3,5 | 4,5 |
| 1.6 Écrire avec l'IA | 4,5 | 4,5 | 5 |
| 1.7 Convaincre en une minute | 4,5 | 4 | 4,5 |

Ces notes sont celles des chapitres **après** correction. Il y a 29 remplacements ciblés dans 6 fichiers, et aucun dans chap_1.3.

Points communs à tous les chapitres :
- Les écrans 1 à 15 respectent les types, les briques et la durée (4:30). Les débits de voix restent sous 2,9 mots/s.
- Le chapitre dit toujours « Sébastien Paumier », jamais « Seb ». Il tutoie partout et n'utilise aucun émoji.
- Les chiffres du fil rouge sont identiques à la bible : 150 kWhEF, 345 → F, 285 → E, 2 650 et 2 850 €/m², 16 500 €, 5 % à la charge de l'acquéreur, classe E valable jusqu'au 13/03/2033.
- Mozi joue bien son rôle à l'écran 3 : une réplique absurde, sans morale. Les six agents sont réutilisés comme apprenants : Hugo (1.1), Claire (1.2), Sarah (1.4, 1.6), Karim (1.4, 1.7), Élodie et Maxime (1.5), Maxime (1.6).

---

## 1.1 Lire le marché 2026 (4 / 4 / 5)

**Pédagogie.** L'objectif est clair. Mozi (« J'appelle tout l'annuaire ») crée une vraie tension. L'écran 7 est le plus chargé du module, avec trois thèmes en 55 s (marché, DPE, prospection). C'est acceptable parce que chaque étape tient en une idée. La question ouverte de l'écran 8 (obtenir un rendez-vous avec M. Bernard) mobilise vraiment les trois idées. La carte 1 propose des distracteurs plausibles (Bloctel, « numéro publié = libre ») avec des « whys » qui expliquent l'erreur. La carte 2 (Hugo et la liste d'une autre agence) fait bien transférer. L'effet statut de l'écran 15 est honnête : il compare des réponses sourcées au « −15 % » sans source.

**Corrections.**
- Écran 5, source :
  - avant : la nullité du contrat était attribuée à la fiche DGCCRF ;
  - après : la nullité est rattachée à l'art. L. 223-1 du code de la consommation, avec la mention « à vérifier sur Légifrance ». La fiche DGCCRF du 27/07/2026 ne mentionne pas la nullité ; seules des analyses juridiques secondaires la mentionnent.
- Écran 11, source : ajout de « preuve accessible au consommateur » et de la date de la fiche DGCCRF.
- `sources` : ajout de la fiche DGCCRF du 27/07/2026, qui est accessible. L'ancienne URL de la fiche « mettez-vous en conformité » renvoie une erreur aux robots.

**Sources vérifiées.**
- Insee, IR n° 216 du 8/09/2026 : 958 000 ventes sur 12 mois à fin juin 2026, −0,8 % sur un an, maisons −1,3 %, appartements −0,1 %. https://insee.fr/fr/statistiques/9040119
- DGCCRF, « Les règles du démarchage téléphonique s'imposant aux entreprises » (27/07/2026) : loi n° 2025-594 du 30/06/2025, décret n° 2026-662 du 23/07/2026, application au 11/08/2026, consentement d'un an maximum incluant l'identité de l'appelant, preuve conservée au moins 3 ans, fin de Bloctel. https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/les-regles-du-demarchage-telephonique-simposant-aux-entreprises
- Nullité du contrat après un démarchage illicite, mentionnée par des sources secondaires :
  - LegalPlace : https://www.legalplace.fr/actualites/demarchage-telephonique/
  - un blog d'avocat : https://consultation.avocat.fr/blog/fabienne-menu/article-2981244-demarchage-telephonique-ce-qui-change-radicalement-le-11-aout-2026.html
  - Selectra la conteste (« sans nullité automatique ») : https://selectra.info/energie/actualites/renovation-energetique/demarchage-telephonique-travaux-11-aout-2026-deja-interdit-2020
- Coefficient de 1,7 au 1/01/2027 : confirmé par la FFB. https://www.ffbatiment.fr/actualites-batiment/actualite/evolution-du-dpe-au-1er-janvier-2027

**À trancher.**
- **Juriste, bloquant avant tournage** : l'écran 5 affiche « Contrat signé ensuite : nul ». Les sources divergent. Il faut lire l'art. L. 223-1 consolidé sur Légifrance, sinon remplacer par « contrat contestable ».
- Les chiffres Insee sont à rafraîchir chaque trimestre.

---

## 1.2 Vérifier avant de chiffrer (4,5 / 4 / 5)

**Pédagogie.** C'est un très bon chapitre. La progression Lire → Vérifier → Chiffrer est limpide. La carte 2 (Claire, une maison au gaz classée F par ses émissions) est un excellent transfert : elle oblige à réutiliser la règle du double seuil dans un cas où la baisse du coefficient électrique ne change rien. L'écran 6 (≈ 15 % des ventes sont des F ou G) est un vrai chiffre statistique et il sert l'argument.

**Corrections.**
- Écran 5 :
  - avant : « le moins quinze pour cent ne vient d'aucune étude » / « Le −15 % n'a aucune source » ;
  - après : « ce moins quinze pour cent n'a ni région, ni année, ni source » / « Le −15 % : ni région, ni année, ni source ».
  - Raison : les études des Notaires mesurent bien des décotes de cet ordre dans certaines régions. La formulation d'avant était fausse, la nouvelle reprend la règle des quatre repères du cours. Le titre devient « Le −15 % sort de nulle part ».
- Écran 12, voix et étape 3 : ajout de « hors façade de la copropriété » / « (hors ITE de la copropriété) ».
  - Raison : les 2 850 €/m² visent des biens rénovés dans un immeuble isolé (ITE comprise). Mettre l'écart de 15 200 € à côté des 16 500 € de travaux privatifs laissait croire à une équivalence travaux = plus-value.
- `open_points` : ajout de ce point.

**Sources vérifiées.**
- Notaires de France, « La valeur verte des logements en France sur les transactions 2024 » (mise à jour du 7/01/2026) : part des F-G de 11 % en 2021, pic en 2023, stabilisée autour de 15 % début 2025. https://www.notaires.fr/fr/actualites/la-valeur-verte-des-logements-en-france-sur-les-transactions-2024
- Seuils du DPE (E : 251-330 kWh ou 51-70 kg ; F : 331-420 kWh ou 71-100 kg) et classe retenue = la moins bonne des deux : la carte 2 (75 kgCO₂ → F) est juste. https://www.service-public.gouv.fr/particuliers/vosdroits/F16096

**À trancher.** La formulation de l'écran 5 et le parcours exact sur l'observatoire DPE-Audit restent à valider le jour du tournage.

---

## 1.3 Attirer des clients — pilote, relu sans modification (4,5 / 4 / 4,5)

Les voix marquées « validé » n'ont pas été touchées. Points signalés à Sébastien Paumier :
1. **Écran 15 (validé)** : la « moyenne des agences à 73 % » doit être précisée.
   - L'étude Geolid 2026 donne 71 % de taux de complétion moyen pour tous les secteurs, et 73 % pour le secteur « Immobilier ».
   - Le chiffre est donc juste pour les agences. En revanche, le tableau peut se lire comme une « part de fiches complètes » : il faut vérifier l'intitulé exact de la colonne.
   - https://geolid.com/wp-content/uploads/2026/01/Etude-Google-Business-Profile-2026-Geolid.pdf
2. **Écran 6 (validé)** : la source est confirmée (CB News, « 75 % des consommateurs consultent les avis en ligne avant l'achat »). https://www.cbnews.fr/etudes/75-consommateurs-consultent-les-avis-ligne-avant-achat
3. Dans `sources`, cinq entrées n'ont pas d'URL : CB News, Geolid, Journal du Geek, Assemblée nationale et L. 121-4. Il faudrait les compléter.
4. **Chevauchement** : l'écran 12 (créer une page Facebook) recoupe le chapitre 1.4 (Page → Groupes → Pub). Il faut choisir si 1.3 garde Facebook ou renvoie vers 1.4.
5. Le code de la consommation (art. L. 121-4) classe bien parmi les pratiques réputées trompeuses le fait de diffuser de faux avis de consommateurs. L'absence de peine chiffrée est correcte.

---

## 1.4 Être présent sur Facebook (4 / 4,5 / 4,5)

**Pédagogie.** Mozi (pub « 60 ans et plus, rue par rue ») illustre exactement la règle. La carte 2 met en scène Karim, qui fait la version conforme : c'est cohérent avec la règle « Karim est un apprenant ». La démo 12 (objectif, catégorie, zone, budget de 35 €, formulaire) est faisable sans lancer la campagne, et la preuve de l'écran 14 le précise bien. Le chiffre de l'écran 6 (29 jours) n'est pas une statistique. Il est désormais présenté comme une règle de produit dans la source. Il reste utile parce qu'il fonde le geste « ton mois prêt d'un coup ».

**Corrections.**
- Écran 6, voix :
  - avant : « dans Meta Business Suite, tu peux programmer… jusqu'à vingt-neuf jours » ;
  - après : « sur ta page Facebook… ».
  - Raison : la règle des 20 minutes à 29 jours est celle des Pages. L'aide du Planificateur de Business Suite ne donne aucune durée.
- Écran 6, source : citation exacte de l'aide Meta, mention « règle de produit, pas une statistique ».
- Écran 9, feedback :
  - avant : « Une offre d'estimation est un service lié au logement » ;
  - après : « Meta range les services d'estimation parmi les publicités Logement ». C'est vérifié : l'aide Meta cite « home equity or appraisal services ».
- Écran 11, source : la durée de programmation y est désormais présentée comme une règle des Pages, à confirmer dans le Planificateur.

**Sources vérifiées.**
- Meta, « About ads for housing » : la France figure dans la liste des pays où il faut choisir la catégorie Logement. Les services d'estimation y sont inclus, et une pub non classée « may be rejected ». https://www.facebook.com/business/help/837655677217892
- Meta, audiences des catégories spéciales : âge 18-65+, tous genres, pas de ciblage par code postal, rayon élargi, aucune exclusion. https://www.facebook.com/business/help/2220749868045706
- Meta, programmation sur une Page : « between 20 minutes and 29 days away ». https://www.facebook.com/help/389849807718635

**À trancher.**
- Karim est un contre-exemple dans la bible (§ 8) et un apprenant dans le gabarit. Ce chapitre suit le gabarit : il faut aligner la bible.
- Les dépenses d'énergie à afficher après l'attestation actualisée sont à confirmer par un diagnostiqueur.

---

## 1.5 Être recommandé sur LinkedIn (4 / 3,5 / 4,5)

**Pédagogie.** La distinction « prescripteurs, pas vendeurs » est bien posée. La question ouverte (Élodie et son réseau de mandataires) et la carte 2 (Maxime et « Expert DPE certifié ») sont de très bons transferts. Le point faible est l'écran 6 : « 1 semaine » est une règle de plateforme non vérifiable automatiquement, pas une statistique.

**Corrections.**
- `objective` :
  - avant : « … et publier sans automatisation, dans le respect du RGPD » ;
  - après : « … publier un premier post utile et développer son réseau sans automatisation ».
  - Raison : le volet RGPD (extraction de profils) a été retiré du chapitre faute de place, et l'objectif doit être atteint.
- Écran 6 :
  - la voix attribue désormais la durée à LinkedIn (« D'après l'aide de LinkedIn… ») ;
  - la source passe en « à vérifier : … », car la page d'aide est inaccessible aux robots (robots.txt) et seuls des blogs tiers parlent de « quelques jours à une semaine » ;
  - mention « règle de plateforme, pas une statistique ».
- Écran 15, voix et statut :
  - avant : « cinq zones remplies » (photo et bannière ne sont jamais enseignées dans le chapitre) ;
  - après : « Ton profil dit où, quoi et pour qui, preuves à l'appui, et zéro robot » / « titre, Infos, preuves. 0 robot ».
  - La source a été adaptée.
- `open_points` : mise à jour de l'écran 15, ajout du point « Licences et certifications ».

**Sources vérifiées.**
- L'interdiction des bots et des méthodes automatisées non autorisées est une règle constante des conditions d'utilisation de LinkedIn (art. 8.2) et de la page « Logiciels et extensions interdits ». Elle n'a pas pu être relue en direct (robots bloqués) : à contrôler à la main avant tournage.
- Chiffre de remplacement possible pour l'écran 6, s'il faut un vrai chiffre statistique : « plus de 37 millions de membres LinkedIn en France début 2026 » (Blog du Modérateur, d'après LinkedIn). https://blogdumoderateur.com/chiffres-linkedin/ Il n'a pas été intégré, car il fonde moins bien la règle « réseau à la main ».

**À trancher.**
- **Écran 6** : garder « 1 semaine » après vérification manuelle de l'aide LinkedIn, ou passer au chiffre de 37 millions.
- **Écran 7** : « Ta formation dans Licences et certifications » suppose que la formation Éco-Consultant délivre une attestation ou une certification réelle. Sinon, le risque est de laisser croire à une certification, ce qui serait trompeur.

---

## 1.6 Écrire avec l'IA (4,5 / 4,5 / 5)

**Pédagogie.** Mozi (« coefficient : 2,58 ») est le meilleur ressort du module : l'erreur est concrète, vérifiable et liée au fil rouge. La séquence Prompter → Vérifier → Protéger tient en une idée par étape. La carte 2 (Sarah et le home staging virtuel) fait transférer vers l'AI Act. L'écran 6 (1,9) est une valeur réglementaire et non une statistique ; elle est présentée honnêtement comme « le vrai chiffre ».

**Corrections.**
- Écran 5, voix et ligne :
  - avant : « une ancienne valeur, abandonnée depuis des années » ;
  - après : « l'ancienne valeur, abandonnée avec le nouveau DPE de juillet 2021 » / « abandonnée en 2021 ».
  - La source est remplacée par une source officielle (réponse ministérielle, AN).
- Écran 9, carte 2 :
  - avant : « l'AI Act impose de signaler une image réaliste générée ou modifiée par IA » ;
  - après : « oblige celui qui diffuse une image réaliste générée ou modifiée par IA, qui pourrait passer pour vraie, à le signaler ».
  - Raison : c'est plus fidèle à l'art. 50(4) (obligation du déployeur pour les « hypertrucages »).
- `sources` : ajout de Houthoff (1/09/2026) et de la réponse de l'Assemblée nationale (QE n° 2934).

**Sources vérifiées.**
- AI Act, art. 50 : applicable depuis le 2/08/2026. L'Omnibus est entré en vigueur le 27/07/2026. Le marquage technique (art. 50(2)) a un délai jusqu'au 2/12/2026 pour les systèmes déjà sur le marché. https://www.houthoff.com/insights/news/ai-act-transparency-obligations-and-the-ai-omnibus-regulation/
- Le coefficient 2,58 a été ramené à 2,3 avec le nouveau DPE du 1/07/2021. https://www.assemblee-nationale.fr/dyn/16/questions/QANR5L16QE2934.pdf
- Le coefficient 1,7 au 1/01/2027 est confirmé (FFB, voir 1.1).

**À trancher.** Le juriste doit valider si un home staging virtuel d'une pièce réelle relève bien d'un « hypertrucage » au sens de l'art. 3(60) de l'AI Act. La bonne pratique de signalement reste recommandée dans tous les cas.

---

## 1.7 Convaincre en une minute (4,5 / 4 / 4,5)

**Pédagogie.** Le chapitre est très bien relié au fil rouge : M. Bernard rappelle avec « J'ai une minute ». La question ouverte demande les deux premières phrases du pitch, ce qui est une vraie récupération : il faut réutiliser le −15 %, la vérification et l'écrit. La carte 2 (Karim et le mandat signé au salon) fait transférer vers le hors établissement et l'exclusivité. Karim y oublie une règle mais reste un apprenant (« s'il le faisait… »). L'écran 6 (51 %) est faible : c'est l'opinion de professionnels sur les vendeurs. Il est désormais présenté honnêtement.

**Corrections.**
- Écran 5, source :
  - avant : seulement la loi n° 70-9, art. 6 ;
  - après : ajout du décret n° 72-678, art. 72, car l'exigence d'un mandat écrit **préalable** se trouve dans le décret.
- Écran 6, voix et étiquette :
  - avant : « la moitié des vendeurs pensent… » ;
  - après : « Selon quatre cent dix-neuf professionnels interrogés par leboncoin Immo, la moitié des vendeurs pensent… » / « selon 419 professionnels interrogés (déclaratif) ».
- Écran 9, source : précision des articles (décret art. 72 et 78, code de la consommation art. L. 221-18).

**Sources vérifiées.**
- MySweetImmo (6/11/2025) : enquête leboncoin Immo auprès de 419 professionnels (22/09 au 7/10/2025), « 51 % des particuliers pensent qu'en mettant plusieurs agences en concurrence… ». https://www.mysweetimmo.com/2025/11/06/immobilier-les-biens-vendus-en-exclusivite-partent-51-jours-plus-vite-quen-mandat-simple/
- Loi Hoguet, art. 6 : https://www.legifrance.gouv.fr/loda/id/LEGITEXT000006068387
- Décret n° 72-678 du 20 juillet 1972, art. 72 (mandat écrit préalable, registre) et art. 78 (clause d'exclusivité en caractères très apparents, résiliable après 3 mois avec un préavis de 15 jours par LRAR) : https://www.legifrance.gouv.fr/loda/id/LEGITEXT000006061974/
- Code de la consommation, art. L. 221-18 (rétractation de 14 jours, contrat hors établissement) : règle connue, non relue en ligne pendant la revue.

**À trancher par un juriste.**
- Formulation de la carte 1, troisième « why » : « signé après, il ne fonde aucune rémunération pour la mission déjà faite ».
- Relecture de la carte 2 : rétractation de 14 jours et formulaire, exclusivité, préavis.

---

## Points bloquants restants (avant tournage)

1. **1.1, écran 5 (juriste)** : la nullité du contrat après un démarchage illicite est à confirmer sur l'art. L. 223-1 consolidé. Les sources secondaires divergent.
2. **1.5, écran 6** : la durée de blocage « en général une semaine » est à vérifier à la main sur l'aide LinkedIn, ou à remplacer par un chiffre vérifié.
3. **1.5, écran 7** : l'intitulé « Licences et certifications » pour la formation est à valider par Sébastien Paumier.
4. **1.7, cartes 1 et 2 (juriste)** : les mentions Hoguet et la rétractation sont à relire, comme la capsule le demandait déjà.
5. **Bible § 8** : Karim y est présenté comme un contre-exemple, alors que le gabarit en fait un apprenant. Il faut harmoniser la bible.
6. **1.3** : l'intitulé exact du « 73 % » de Geolid est à confirmer, les URL manquantes sont à compléter et le chevauchement Facebook avec 1.4 est à arbitrer (signalement seulement, aucune modification faite).

Toutes les voix des chapitres 1.1, 1.2 et 1.4 à 1.7 restent des propositions à valider par Sébastien Paumier.

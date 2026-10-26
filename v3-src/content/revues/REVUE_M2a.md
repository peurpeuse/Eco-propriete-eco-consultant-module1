# Revue M2a : chapitres 2.1 à 2.5

Comité de relecture : ingénierie pédagogique (P), exactitude métier et sources (E), gabarit et ton (G). Notes sur 5, après corrections.
Contrôle final : `python3 check_chap.py M2/chap_2.1.json … M2/chap_2.5.json` → 5 × OK, 0 erreur, 0 alerte. Toutes les voix restent en `"voice_status": "proposition"`.

## Synthèse

| Chapitre | P | E | G | Corrections |
|---|---|---|---|---|
| 2.1 Le projet du vendeur | 4,5 | 4,5 | 5 | 7 |
| 2.2 Lire par où part la chaleur | 4,5 | 4,5 | 4,5 | 6 |
| 2.3 Refaire les chiffres du dossier | 5 | 4,5 | 5 | 2 |
| 2.4 Lire un DPE en entier | 4,5 | 4,5 | 5 | 5 |
| 2.5 Faire le tour technique d'un logement | 4,5 | 4 | 5 | 2 |

Total : 22 corrections ciblées. Aucun point bloquant. Il reste des points à faire valider (voir chaque chapitre).

Calculs refaits (tous justes) : 205 000 − 172 000 = 33 000 ; 1 150 000 × 312 / 10 000 = 35 880 = 4 × 8 970 ; somme des pièces 24 + 11 + 10 + 9 + 9 + 5 + 1,5 + 6,5 = 76,0 ; 76 × 0,95 = 72,2 ; (90 − 76) / 90 = 15,6 % ; 3 / 76 = 3,9 % ; 150 × 76 = 11 400 ; 150 × 2,3 / 1,9 / 1,7 = 345 / 285 / 255 → F / E / E ; 112 + 26 + 4 + 8 = 150 ; 112 / 150 = 74,7 % ; 12 × 76 = 912 ; 2 330 / 12 = 194 et 3 190 / 12 = 266 ; R = 0,02 / 0,04 = 0,5 (3,7 / 0,5 = 7,4) ; 4 800 + 3 200 + 2 900 + 5 600 = 16 500 ; 110 × 1,9 = 209 → D, 85 × 1,9 = 161,5 → C. Tous les chiffres du fil rouge sont identiques à la bible.

## Sources vérifiées sur le web (26/10/2026)

- ADEME, « Tout savoir sur l'isolation » : maison d'avant 1974 (observatoire DPE 2025), murs 31 %, air 27 %, fenêtres 14 %, planchers bas 10 %, toit 9 %, ponts thermiques 9 % ; l'isolation doit être associée à une ventilation efficace. https://agirpourlatransition.ademe.fr/particuliers/amenager-maison/renover/tout-savoir-isolation
- Service-Public F16096 : DPE depuis le 1/07/2021 valables 10 ans ; coefficient de l'électricité 1,9 depuis le 1/01/2026, 1,7 au 1/01/2027 (arrêté du 19/08/2026) ; mise à jour gratuite sans nouvelle visite. https://www.service-public.gouv.fr/particuliers/vosdroits/F16096
- Service-Public R67366 : lien officiel de l'observatoire. https://observatoire-dpe-audit.ademe.fr/accueil
- Service-Public F32061 : la mention « logement à consommation énergétique excessive » vaut pour les classes F et G. https://www.service-public.gouv.fr/particuliers/vosdroits/F32061
- Fiche CEE BAR-EN-102 (version au 1/01/2025) : isolant des murs R ≥ 3,7 m².K/W. https://www.ecologie.gouv.fr/sites/default/files/documents/BAR-EN-102%20vA65-4%20%C3%A0%20compter%20du%2001-01-2025_1.pdf
- Décret du 17/03/1967, art. 6-2 (2° : les provisions hors budget sont payées par le copropriétaire à la date d'exigibilité) et art. 6-3 (une convention contraire n'engage pas le syndicat), d'après le texte cité par BJ Avocat. https://www.bjavocat.com/2025/09/29/qui-doit-payer-les-charges-lors-de-la-vente-dun-lot-de-copropriete/
- Cass. 3e civ., 20/05/2021, n° 20-15.633 : l'arrêt applique l'art. 6-2, mais lors d'une **adjudication**. https://www.lemondedudroit.fr/droit-civil/280-immobilier-construction/76903-adjudication-d-un-lot-de-copropriete-a-qui-incombe-le-paiement-de-la-provision.html
- Seuils des classes (arrêté du 31/03/2021 modifié) : D ≤ 250, E 251-330, F 331-420 ; climat C 12-30. Ce sont les valeurs de référence connues. Je n'ai pas pu les relire dans l'annexe 5 en ligne (voir les points ouverts).

## 2.1 Le projet du vendeur (P 4,5 · E 4,5 · G 5)

L'objectif est clair et atteint. Mozi est absurde sans moraliser. La question ouverte avec Maxime fait bien travailler la mémoire. Les distracteurs de la carte 1 sont plausibles et la carte 2 (Claire) fait transférer.

Corrections :
- Écran 5, source : « décret art. 6-2 (Cass. 20 mai 2021) » → « art. 6-2, 2° (provisions hors budget) + art. 6-3 (accord contraire inopposable au syndicat) ». Le bon alinéa est cité, et l'arrêt de 2021, qui porte sur une adjudication, n'est plus présenté comme la base de la règle.
- Écran 6 : le libellé et la source indiquent maintenant « calcul du dossier de M. Bernard, pas une statistique ».
- Écran 7, source : ajout de « 2° ».
- Écran 9, source : la mention RGPD, sans rapport avec la carte 1, est retirée.
- Écran 15 : « un chiffre, sans une question » (non établi par la bible) → « un chiffre, sans calcul montré ». Cette formulation est tirée de la transcription de l'exercice.
- Sources : ajout de l'art. 6-2 / 6-3 (avec URL) ; l'arrêt de 2021 est requalifié (adjudication, n° 20-15.633).
- Point ouvert sur l'appel de fonds mis à jour : règle vérifiée, relecture d'un juriste conseillée.

À trancher :
- Sébastien Paumier : garder le chiffre clé fictif (33 000 €) ou le remplacer par une vraie statistique.
- Juriste : relire l'art. 6-2 sur le texte consolidé de Légifrance, et l'exonération de plus-value si le vendeur quitte le logement avant la vente.

## 2.2 Lire par où part la chaleur (P 4,5 · E 4,5 · G 4,5)

Le chapitre est solide : la croyance de Mozi (« c'est le toit ») est une vraie idée reçue, et le distracteur « la chaleur monte » est excellent. L'écran 7 est dense (R, λ, condensation), mais il reste dans la durée prévue.

Corrections :
- Écran 7, voix : « Les aides visent 3,7 » → « Les aides exigent au moins 3,7 ».
- Écran 7, détail : il précisait mal que R = 0,5 porte sur les murs. Il dit maintenant « doublage de 2 cm : R = 0,02 / 0,04 = 0,5, contre 3,7 exigé par les aides ».
- Écran 7 et sources : le repère R ≥ 3,7 était attribué au « Guide pour les diagnostiqueurs », sans vérification. Il est maintenant sourcé par la fiche CEE BAR-EN-102, vérifiée.
- Écran 8 : la scène mélangeait les points de vue (« un acquéreur de Sarah… que lui réponds-tu ? »). Elle devient « Sarah fait visiter… À sa place, que réponds-tu ? ».

À trancher :
- Technicien : le D02 fictif doit contenir un schéma des déperditions cohérent. Vérifier aussi si le pont thermique du balcon est traité par l'ITE.
- Sébastien Paumier : la mention de source ADEME (maison d'avant 1974) doit rester visible à l'écran.

## 2.3 Refaire les chiffres du dossier (P 5 · E 4,5 · G 5)

C'est le meilleur des cinq. Le chiffre clé (1,9) est un vrai fait réglementaire. La carte 2 (73 m² → 3,9 %, sous le vingtième) est un vrai transfert. La règle Carrez de l'art. 46 est juste : un vingtième, et une action dans l'année qui suit l'acte authentique.

Corrections :
- Écran 7, source : F16096 ne donne pas les seuils des classes. Les seuils sont maintenant sourcés par l'arrêté du 31/03/2021 modifié, avec les valeurs.
- Sources : le libellé de F16096 est corrigé, et l'arrêté du 31/03/2021 est ajouté (URL).

À trancher :
- Juriste : relire la règle Carrez.
- Sébastien Paumier : afficher à l'écran « prix des énergies au 1/01/2021 » et « seuils ≥ 40 m² ».

## 2.4 Lire un DPE en entier (P 4,5 · E 4,5 · G 5)

Le chapitre fait bien le lien entre l'IA, le RGPD et la vérification. La faute de Mozi (« 255 = D ») est juste et mémorable.

Corrections :
- Écran 5, source : l'arrêté du 25/03/2024 (petites surfaces, sans rapport) → arrêté du 31/03/2021 modifié.
- Écran 13 : l'URL devient https://observatoire-dpe-audit.ademe.fr/accueil, lien officiel donné par Service-Public R67366. Sa source est mise à jour.
- Sources : l'observatoire (lien R67366) et l'arrêté de 2021 sont ajoutés ; le libellé de F32061 précise que la mention vaut pour F et G.

À trancher :
- Avant tournage : tester sur l'observatoire la saisie du numéro et le téléchargement de l'attestation.
- Juriste : la classe à afficher dans l'annonce après l'attestation, et le numéro ADEME comme donnée identifiante.
- Sébastien Paumier : la carte 2 suppose que Karim est l'une des deux agences de M. Bernard. C'est cohérent avec la bible (« −15 % à cause du DPE »), mais pas explicite.

## 2.5 Faire le tour technique d'un logement (P 4,5 · E 4 · G 5)

Le scotch sur les grilles est une très bonne scène. Les démonstrations sont concrètes, et les estimations de classe après travaux sont présentées honnêtement (« à confirmer par un diagnostiqueur »). La note E est plus basse à cause des tests de terrain non validés (voir ci-dessous).

Corrections :
- Écran 6 : le libellé et la source indiquent maintenant « calcul sur son DPE, pas une statistique ».
- Carte 2 : « l'acquéreur paierait deux fois » était inexact (l'isolation intérieure serait payée par le vendeur). Elle devient « on paierait deux fois pour isoler les mêmes murs : lui à l'intérieur, la copropriété à l'extérieur ».

À trancher :
- Technicien : le raccordement d'une VMC individuelle sur un conduit shunt, le test du reflet (simple ou double vitrage) et le test de la feuille de papier.
- Juriste : l'art. 25 b de la loi de 1965, et le statut des fenêtres (privatives ou communes) selon le règlement.
- Sébastien Paumier : chiffre clé fictif (75 %) ou vraie statistique.

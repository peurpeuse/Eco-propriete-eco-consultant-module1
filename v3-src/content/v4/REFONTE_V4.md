# Refonte v4 · cahier des charges des rédacteurs

Source : tableau « Formation Éco-Consultant · version revue » fourni par le client (Prérequis, M1, M2, M3 jusqu'à 3.27). Le plan structuré est dans `v4/PLAN.json` : il fait foi pour les numéros, titres, exercices, ressources, sections, étapes, parcours (maison / appartement), priorités et capsules IA. Les modules 4 et 5 actuels ne changent pas.

## Le nouveau format d'une capsule
1. **Je regarde** une vidéo de 4 min 30 maximum (une seule idée). Pour les capsules qui ont un chapitre interactif, la vidéo, c'est le chapitre (15 écrans, `GABARIT_CHAPITRE.md`).
2. **Je me teste** : quiz flash de **3 questions** juste après la vidéo.
3. **Je télécharge** la ressource (fiche PDF).
4. **Je pratique** : exercice, avec l'IA quand c'est utile.
5. **Je dépose** le livrable, corrigé et validé.
Ancrage : attention (une idée, 4 min 30), récupération active (quiz flash), répétition espacée (J+1, J+7, J+30), émotion et récit (Mozi, un bien fil rouge classé F ou G), double codage (schémas ; chaque chiffre a sa source et sa date).

## Les deux fils rouges (BIBLE.md)
- **Appartement** : M. Bernard, T4 de 76 m² à Melun (sections 1 à 10). Utilisé par les capsules marquées `"parcours": "appartement"` et par défaut ailleurs.
- **Maison** : Mme Garnier, maison de 1968 à Vaux-le-Pénil, classée G (section 11, codes M01 à M14). Utilisée **uniquement** par les capsules `"parcours": "maison"`, et possible en exemple dans les capsules communes (diagnostics, urbanisme, valeur verte, indicateurs, devis…), en le disant.
- Chiffres repris **à l'identique** de la bible. Un calcul manquant se dérive des données et s'écrit.

## Règles non négociables (comme pour les 34 chapitres)
- Toujours « Sébastien Paumier », jamais « Seb ». Tutoiement partout. Français, phrases courtes, pas d'émoji.
- **Mozi** est le contre-exemple : un agent qui fait exactement la mauvaise pratique ; c'est désormais un personnage humain (blazer violet), même rôle.
- **Sources** : chaque chiffre, règle ou date a sa source (nom + date + URL si possible). Priorité aux sources officielles (Légifrance, service-public.fr, ADEME, ANIL, notaires, Insee, DGCCRF, CNIL, Géorisques, Banque de France). Si tu n'as pas pu vérifier : écris `"à vérifier : …"`. Jamais d'invention, jamais de chiffre « de tête » présenté comme vérifié.
- Les mentions du tableau « à sourcer », « à actualiser », « à faire relire par un juriste », « à définir avec Sébastien », « à confirmer avec Éco-propriété » sont reprises dans `open_points` (et la ressource le signale), pas résolues au hasard.
- Limites du métier : l'éco-consultant ne vend pas de travaux, ne touche pas de commission, ne choisit pas l'entreprise à la place du vendeur, ne fait pas de conseil fiscal ni juridique (il renvoie au notaire, à l'expert-comptable, au diagnostiqueur, au courtier), ne promet ni gain ni prix, ne présente jamais une aide comme acquise ni une mensualité comme une offre de financement.
- Prospection : consentement et règles de démarchage (loi du 30 juin 2025 sur le démarchage téléphonique, consentement préalable au 11 août 2026 ; RGPD) à vérifier et sourcer.

## Fiche capsule v4 · `v4/<P|M1|M2|M3>/cap_<id>.json`
Validateur : `python3 check_cap4.py <fichier>` (doit afficher OK).
```json
{
  "id": "1.10", "module": 1,
  "section": "D · Je choisis une cible", "etape": "Avant l'étape 1", "parcours": null, "prio": true, "ia": false,
  "title": "(exactement le titre du PLAN.json)",
  "objective": "Verbe d'action observable + résultat (30-220 car.)",
  "video": { "duration": "4:30", "chapter": true, "pitch": "Ce que montre la vidéo, en 2-3 phrases (60-400 car.)" },
  "quiz": { "questions": [
    { "question": "…", "options": ["…", "…", "…"], "answer": 1,
      "whys": ["pourquoi cette option est juste/fausse (15-260 car.)", "…", "…"],
      "fb_title": "Titre court du retour", "fb_text": "Retour expliqué (40-450 car.)" } ] },
  "resource": { "title": "(titre de la ressource du PLAN.json)", "kind": "fiche", "intro": "…",
    "sections": [ { "type": "list|checklist|steps|table|text|formula", "heading": "…", "items": ["…"] } ],
    "footer": "Sources et date de mise à jour" },
  "exercise": { "title": "…", "duration_min": 25, "context": "…", "materials": ["codes du dossier : D04, M06…"],
    "steps": ["…"], "expected": "Corrigé ou exemple de réponse attendue (≥ 150 car.)",
    "ia_prompt": { "prompt": "(capsules IA seulement, ≥ 250 car.)", "guardrails": ["Aucune donnée personnelle du client dans l'outil", "Vérifier chaque chiffre"] } },
  "deliverable": { "title": "…", "format": "…", "criteria": ["3 à 6 critères vérifiables"] },
  "sources": [ { "label": "…", "url": "…" } ],
  "open_points": ["Ce qui reste à valider par Sébastien Paumier ou un expert"]
}
```
- Quiz flash : 3 questions de **mise en situation** (un vendeur, un agent, le bien fil rouge), une seule bonne réponse, distracteurs plausibles, bonne réponse à des positions variées ; au moins une question sur l'erreur de Mozi quand la capsule a un chapitre.
- Ressource : directement utilisable (≥ 180 mots), avec la phrase à dire au client quand c'est utile.
- Exercice : celui du PLAN.json, détaillé en étapes ; il s'appuie sur le dossier fil rouge (codes D01-D20 ou M01-M14) quand le sujet s'y prête, ou sur l'activité réelle de l'apprenant pour le module 1.
- Capsules qui reprennent une ancienne capsule (`old_v3` dans le PLAN) : repars de `../M<n>/cap_<old>.json` (garde ce qui est juste et sourcé, recadre sur le nouveau titre, l'exercice et la ressource, passe le quiz à 3 questions).

## Chapitre interactif · `v4/<module>/chap_<id>.json`
Format exact de `GABARIT_CHAPITRE.md` (15 écrans, 6 briques), validateur `python3 check_chap.py <fichier>`. En plus :
- écran 4 (`belief`) : `wrong` (indice 0-2 du temps fautif) et `why` (une phrase) ;
- écran 6 (`stat`) : `guess` = `{"q", "answer", "min", "max", "step", "unit"}` (question au curseur, réponse = la valeur affichée) ;
- écrans 13-14 : l'action et la preuve correspondent à **l'exercice et au livrable du PLAN.json** ;
- titre de l'écran 1 : « Chapitre X.Y : … » avec le **nouveau** numéro ; renvois à d'autres capsules avec les **nouveaux** numéros.
- `"chapter": "adapter"` : repars de `../M<n>/chap_<old_v3>.json` ; garde ce qui marche, recadre sur la nouvelle capsule (titre, objectifs, exercice, preuve), corrige les numéros.
- `"chapter": "nouveau"` : chapitre écrit de zéro.

## Livraison
Chaque agent écrit ses fichiers, lance les validateurs jusqu'à OK, et renvoie : la liste des fichiers, les points ouverts, les sources qu'il n'a pas pu vérifier.

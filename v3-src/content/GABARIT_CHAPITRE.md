# Gabarit d'un chapitre · Formation Éco-Consultant

> Référence : storyboard « Chapitre 1 : attirer des clients » (4 min 30, 15 écrans, 6 briques, mobile et 16/9), validé par Sébastien Paumier.
> **1 capsule = 1 chapitre.** Les 34 capsules deviennent 34 chapitres. Fichier : `content/M<m>/chap_<id>.json`.
> Le chapitre pilote est `content/M1/chap_1.3.json` (repris du storyboard) : c'est le modèle à imiter.

## Règles non négociables

1. **Toujours « Sébastien Paumier »**, jamais « Seb » (ni dans la voix, ni à l'écran, ni dans les notes). Il parle à la première personne (« je ») et tutoie l'apprenant.
2. **Tout en français, tutoiement partout.** Phrases courtes, une idée par écran.
3. **Mozi** = le méchant récurrent (couleur violette). Un agent immobilier caricatural qui fait exactement la mauvaise pratique du chapitre. Écran 3 : une seule réplique entre guillemets, absurde, **sans morale** (on ne commente pas, on montre). Mozi n'est jamais méchant envers une personne réelle ; il triche, bâcle, promet n'importe quoi.
4. **Fil rouge** : M. Bernard, T4 de 76 m² à Melun (voir `BIBLE.md`). Chiffres repris **à l'identique** de la bible et de la capsule d'origine.
5. **Les six agents** (avatars d'apprenants, réutilisés dans les questions et les exemples) :
   - **Hugo** · mandataire en réseau, travaille depuis chez lui
   - **Sarah** · mandataire, très présente sur Instagram et Facebook
   - **Claire** · négociatrice salariée d'agence
   - **Karim** · directeur d'agence indépendante (« Karim Immo »)
   - **Maxime** · nouvel entrant, collaborateur sans carte T
   - **Élodie** · coach et animatrice d'un réseau de mandataires
6. **Sources** : chaque chiffre, règle ou date affichée a une source (nom + date, et URL si possible). Priorité aux sources déjà présentes dans la capsule d'origine (`sources`) et aux faits marqués « vérifié » dans la bible. Une source nouvelle doit être vérifiée sur le web. Si tu n'as pas pu vérifier : écris `"à vérifier : <ce qu'il faut vérifier>"` dans `source` — jamais d'invention.
7. **Durée : 4 min 30 au total**, plages indicatives ci-dessous. Débit de voix ≈ 150 mots/min (10 s ≈ 25 mots). Les écrans interactifs (8, 9, 13, 14) mettent la vidéo en pause : leur durée est celle de la voix.
8. Les voix non encore validées par Sébastien Paumier portent `"voice_status": "proposition"`.
9. Pas d'émoji dans les textes. Pas de badge à l'écran 15 (effet statut seulement).

## Les 6 briques et 15 écrans

| Brique | Écrans | Plage |
|---|---|---|
| 1. Ouverture et repères | 1 à 2 | 0:00 – 0:20 |
| 2. Mozi et la croyance | 3 à 4 | 0:20 – 0:50 |
| 3. Conséquence | 5 | 0:50 – 1:05 |
| 4. Le cours et quiz | 6 à 9 | 1:05 – 3:10 |
| 5. Méthode et démonstration | 10 à 13 | 3:10 – 4:05 |
| 6. Preuve et feu d'artifice | 14 à 15 | 4:05 – 4:30 |

| N° | Type (`kind`) | Plage | Contenu attendu | Interaction |
|---|---|---|---|---|
| 1 | `welcome` | 0:00–0:10 | Titre « Chapitre X.Y : … » + phrase d'accueil | Bouton « Commencer » |
| 2 | `goals` | 0:10–0:20 | 3 verbes : comprendre / appliquer / prouver, chacun avec une ligne propre au chapitre | Bouton « Suivant » |
| 3 | `mozi` | 0:20–0:35 | La réplique absurde de Mozi + description de la scène | Aucune |
| 4 | `belief` | 0:35–0:50 | La croyance de Mozi résumée en **3 temps courts** (ex. « 20 avis · 5 étoiles · 1 seul auteur ») + `wrong` (indice 0-2 du temps fautif) + `why` (une phrase) | L'apprenant touche le temps fautif ; pause jusqu'à la réponse |
| 5 | `consequence` | 0:50–1:05 | Ce qui arrive vraiment (2 lignes chocs) + **source** | Aucune |
| 6 | `stat` | 1:05–1:20 | Un chiffre clé sourcé qui fonde le cours | Aucune |
| 7 | `steps` | 1:20–2:15 | Le cours : **3 étapes** (une idée par étape), chacune `label` + `detail` | Les étapes apparaissent une à une |
| 8 | `retrieval` | 2:15–2:40 | Question ouverte « Toi, que proposerais-tu ? » adaptée + réponse modèle + 2-4 mots-clés attendus | Champ libre, dictée, « Passer » ; retour explicatif immédiat |
| 9 | `quiz` | 2:40–3:10 | Carte 1 : QCM 3 options sur la règle que Mozi enfreint (avec `whys`) ; carte 2 : question de transfert « S'il … , que se passerait-il ? » + réponse | Retourner la carte ; retour explicatif immédiat |
| 10 | `tools` | 3:10–3:20 | « Deux outils, un seul but » : 2 outils/gestes + le but commun | Aucune |
| 11 | `demo` | 3:20–3:40 | Démonstration de l'outil A : 3 à 5 étapes courtes | Étapes qui s'enchaînent |
| 12 | `demo` | 3:40–4:00 | Démonstration de l'outil B : 3 à 5 étapes courtes | Étapes qui s'enchaînent |
| 13 | `action` | 4:00–4:05 | « À toi de jouer » + bouton vers l'outil réel (URL officielle) ou vers l'exercice | Le bouton ouvre le lien dans un nouvel onglet |
| 14 | `proof` | 4:05–4:20 | « Ta preuve en une image » : ce qu'il faut capturer (= le livrable) | Dépôt d'une capture ; « Je le ferai plus tard » → fin sobre |
| 15 | `bravo` | 4:20–4:30 | Félicitation + effet statut (comparaison sourcée ou fait observable) | Aucune, pas de badge |

Quand le chapitre n'a pas « deux outils » au sens logiciel (ex. physique du bâtiment), les écrans 10-12 présentent **deux gestes ou deux documents** au service d'un seul but, démontrés sur le dossier de M. Bernard.

## Format JSON

```json
{
  "id": "1.3",
  "module": 1,
  "title": "Attirer des clients avec ta fiche Google",
  "capsule_title": "Google Business Profile",
  "duration": "4:30",
  "objective": "…",
  "mozi": { "line": "Cinq étoiles pour moi, personne ne verra rien !", "scene": "Mozi écrit des avis sur son propre téléphone…" },
  "screens": [
    { "n": 1, "brick": 1, "kind": "welcome", "tc": "0:00", "end": "0:10", "title": "Chapitre 1.3 : attirer des clients", "voice": "…", "voice_status": "proposition", "interaction": "Bouton « Commencer »", "cta": "Commencer", "source": null },
    { "n": 2, "brick": 1, "kind": "goals", …, "items": [ {"verb": "Comprendre", "text": "…"}, {"verb": "Appliquer", "text": "…"}, {"verb": "Prouver", "text": "…"} ], "cta": "Suivant" },
    { "n": 3, "brick": 2, "kind": "mozi", …, "line": "…", "scene": "…" },
    { "n": 4, "brick": 2, "kind": "belief", …, "beats": ["20 avis", "5 étoiles", "1 seul auteur"], "wrong": 2, "why": "Des avis écrits par soi-même sont supprimés." },
    { "n": 5, "brick": 3, "kind": "consequence", …, "lines": ["Avis supprimés.", "Fiche signalée."], "source": "…" },
    { "n": 6, "brick": 4, "kind": "stat", …, "value": "75 %", "label": "lisent les avis avant d'acheter", "source": "…" },
    { "n": 7, "brick": 4, "kind": "steps", …, "steps": [ {"label": "Recherche", "detail": "…"}, {"label": "Fiche", "detail": "…"}, {"label": "Appel", "detail": "…"} ] },
    { "n": 8, "brick": 4, "kind": "retrieval", …, "prompt": "Toi, que proposerais-tu ?", "context": "…", "model_answer": "…", "keywords": ["…"] },
    { "n": 9, "brick": 4, "kind": "quiz", …,
      "card1": { "question": "Quelle règle Mozi enfreint-il ?", "options": ["…", "…", "…"], "answer": 0, "feedback": "…", "whys": ["…", "…", "…"] },
      "card2": { "question": "S'il n'enfreignait rien, que se passerait-il ?", "answer": "…" } },
    { "n": 10, "brick": 5, "kind": "tools", …, "goal": "…", "tools": [ {"name": "…", "role": "…"}, {"name": "…", "role": "…"} ] },
    { "n": 11, "brick": 5, "kind": "demo", …, "tool": "…", "steps": ["…", "…", "…"] },
    { "n": 12, "brick": 5, "kind": "demo", …, "tool": "…", "steps": ["…", "…", "…"] },
    { "n": 13, "brick": 5, "kind": "action", …, "cta": "…", "url": "https://…" },
    { "n": 14, "brick": 6, "kind": "proof", …, "ask": "…", "later": "Je le ferai plus tard", "later_text": "…" },
    { "n": 15, "brick": 6, "kind": "bravo", …, "status": "…", "source": "…" }
  ],
  "sources": [ {"label": "…", "url": "…"} ],
  "open_points": ["Ce qui reste à valider par Sébastien Paumier ou un expert"]
}
```

Chaque écran a toujours : `n`, `brick`, `kind`, `tc`, `end`, `title` (texte à l'écran, court), `voice` (ce que dit Sébastien Paumier ; pour l'écran 3, la réplique de Mozi), `voice_status`, `interaction`, `source` (texte ou `null`), plus les champs propres à son type.
La somme des durées va de 0:00 à 4:30, sans trou ni chevauchement.

## Poses de Sébastien Paumier (facultatif, par écran)

Champ `"pose"` sur un écran : Sébastien Paumier apparaît en pied, à droite (16/9) ou en bas (mobile), à la place de la bulle.
Poses disponibles (`engine/assets/seb/`) : `salut`, `trois`, `idee`, `choc`, `bras-ouverts`, `presente`, `reflechit`, `carte`, `dossier`, `telephone`, `montre`, `bravo`.
Pas de pose sur l'écran 3 (Mozi). Chapitre modèle : 1.1.

## Lecteur (mode vidéo)

- **Rythme** : la durée de chaque écran est calculée sur le texte de la voix (≈ 2,7 mots/s + 1,6 s de respiration, avec un minimum par type d'écran). Les `tc`/`end` du JSON restent indicatifs. Quand une voix enregistrée existe (`media.screens[k].dur`), c'est elle qui fixe la durée.
- **Poses** : sans champ `pose`, une pose par défaut est choisie selon le type d'écran (welcome → salut, goals/steps → trois, consequence → choc, stat → idee, retrieval → reflechit, quiz → carte, tools → presente, démo 11 → telephone, démo 12 → dossier, action → montre, proof → bras-ouverts, bravo → bravo). `"pose": "none"` retire la pose.
- **Fin** : carte « À retenir » (les 3 étapes de l'écran 7), puis chapitre suivant en 8 s (bouton « Rester ici »).
- **Barre de lecture** : repères des 6 briques, reprise « Reprendre à m:ss », vitesse ×1 / ×1,25 / ×1,5.
- **Export MP4** : route `#render-x-y` (plein écran, sans boutons d'interaction), enregistrée en 1280×720 et 720×1280.
- **Points d'arrêt** : en fin d'écran 4 (trouver l'erreur de Mozi), 8 (question ouverte) et 9 (quiz), le lecteur s'arrête et attend la réponse (bouton « Passer » toujours disponible). Une mauvaise réponse au quiz propose « Revoir l'explication » (retour à l'écran 7). En export MP4, les réponses s'affichent seules.

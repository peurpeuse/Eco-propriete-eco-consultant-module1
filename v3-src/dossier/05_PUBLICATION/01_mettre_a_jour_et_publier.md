# Mettre à jour et publier

## Publier une modification (contenu, vidéo, interface)
1. **Modifier les sources** dans `v3-src/` : `content/`, `engine/` ou `build.py`.
2. **Valider le contenu** : `cd content && python3 check.py M<n>/*.json global.json`, jusqu'à obtenir `OK`.
3. **Compiler** : `python3 build.py` (ou `--no-pdf` si aucune fiche n'a changé).
4. **Contrôler** :
   - `python3 qa/shots.py` : aucune erreur JS et pas de défilement horizontal ;
   - `python3 qa/flow.py` sur un paquet : statut `completed`.
5. **Copier dans le dépôt** :
   - `build/site/*` → `v3/`, en gardant `v3/scorm/` et `v3/heygen/` ;
   - `build/scorm/*.zip` → `v3/scorm/` ;
   - `build/pdf/SCRIPTS_videos.pdf` → `v3/pdf/` ;
   - les sources modifiées → `v3-src/`.
   - **Ne jamais copier `GUIDE_formateur.pdf` dans `v3/`.**
6. **Faire un commit et un push** sur `main`, puis noter le **SHA** du commit.
7. **Chargeur Vercel** : dans `v3-src/vercel/index.html`, remplacer le SHA dans la constante `BASE`. Faire un commit, puis **redéployer le projet Vercel `eco-consultant-parcours` en production** avec ce seul fichier `index.html`.
8. **Vérifier en ligne** sur https://eco-consultant-parcours.vercel.app :
   - la page d'accueil, une capsule et sa vidéo ;
   - la section « Pour ton LMS » et le téléchargement d'un paquet.

## Revenir en arrière
Remets dans `BASE` le SHA de la version précédente et redéploie. Aucune donnée n'est perdue : chaque commit reste servi par jsDelivr.

| Version | SHA du site (`v3/`) |
|---|---|
| Vidéo 1.1 v1 (HeyGen + Canva + Jitter) | `b20be4a037b719f286053b973c985360090b82ee` |
| Vidéo 1.1 v2 (motion design, HLS) | `4d1d562cb627a4fbc7aeddfb49e11898961f961d` |
| **Actuelle** : + téléchargement SCORM | `6aa9f9c8fd923a49ba4add002a5989a7329878a1` |

## Mettre à jour le LMS de l'organisme
1. Télécharger le nouveau paquet depuis « Pour ton LMS ».
2. Dans le LMS, **remplacer le fichier du paquet** dans l'activité existante. Ne pas créer une nouvelle activité : on garde ainsi l'historique des apprenants.
3. Pour une modification importante (nouvelles capsules, nouveaux éléments obligatoires), **monter la version** dans `build.py` (`VERSION = "3.1"`) : elle apparaît dans le nom du paquet et dans le manifeste.
4. Refaire la recette `02_LMS_SCORM/02_import_LMS_et_recette.md`, au moins les lignes 1, 2, 7, 8 et 9.

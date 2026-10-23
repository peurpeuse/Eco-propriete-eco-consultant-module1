# P3 · Appliquer les fiches de validation (F4) et publier (F5)

> **Mode d'emploi** : joins les fiches F4 et/ou F5 remplies (une ou plusieurs), puis colle le bloc ci-dessous.

```text
Applique les fiches de validation et de publication jointes à la formation Éco-Consultant (dépôt peurpeuse/Eco-propriete-eco-consultant-module1). Travaille de bout en bout en autonomie, et ne me sollicite que si tu es réellement bloqué.

✏️ Fiches jointes : …
✏️ Date de ce lot : …

1. Tableau des zones à traiter : code de zone, auteur, décision, résumé de la correction.
   - Zone vide = rien à changer.
   - « Validée » = retirer les [À VALIDER] correspondants de notes_prod.
2. Corrections de contenu (quiz, fiche, exercice, livrable, texte de la vidéo) :
   - applique-les dans les JSON ;
   - vérifie chaque fait sur une source officielle ;
   - lance check.py jusqu'à OK.
3. Corrections vidéo :
   - si seul l'affichage change (animation, texte à l'écran, sous-titre), corrige la composition et refais le rendu ;
   - si la parole change, régénère la voix et l'avatar des segments concernés seulement, puis refais le calage, le rendu et le HLS.
4. F5 :
   - monte la version si demandé (VERSION dans build.py) ;
   - compile, contrôle (qa/shots.py, qa/flow.py) et publie (05_PUBLICATION) ;
   - vérifie en ligne que les paquets de la section « Pour ton LMS » sont à jour.
   Ne publie que les capsules marquées « Validée » ou « Validée sous réserve ».
5. Si la 1.1 est validée comme modèle officiel, note-le dans 00_RECAP_projet.md.
6. Rends-moi :
   - un CHANGELOG (une ligne par zone : code, auteur, ce qui a changé, source) ;
   - les points restés ouverts ;
   - les liens de vérification.
   Mets aussi à jour 00_RECAP_projet.md dans le dossier Drive.
```

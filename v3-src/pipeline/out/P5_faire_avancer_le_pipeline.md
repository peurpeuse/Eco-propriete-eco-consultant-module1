# P5 · Faire avancer le pipeline

> **Mode d'emploi** : à lancer chaque fois que des fiches ont été remplies (F1, F2, F3, F4, F5) ou pour faire le point. Colle le bloc ci-dessous dans Claude, en joignant les fiches remplies si elles ne sont pas déjà dans le Drive.

```text
Fais avancer le pipeline de production de la formation Éco-Consultant. Travaille de bout en bout en autonomie, et ne me sollicite que si tu es réellement bloqué.

✏️ Modules ou capsules concernés (vide = tout le pipeline) : …
✏️ Fiches remplies jointes ou à lire dans le Drive : …
✏️ Limite de ce lot (ex. « 3 vidéos maximum ») : …

Sources :
- Google Drive, dossier « Formation Éco-Consultant · Dossier technique / 08_PIPELINE » ;
- le Google Sheet « Pipeline Éco-Consultant · suivi des 34 capsules » (onglet Capsules) ;
- le dépôt peurpeuse/Eco-propriete-eco-consultant-module1.

1. État des lieux :
   - lis le Sheet et les fiches remplies ;
   - fais un tableau : capsule, étape actuelle, ce qui est rempli, ce qui bloque, prochaine action.
2. Pour chaque capsule, fais avancer d'une étape selon les fiches :
   - F1 / F2 avec corrections → applique-les avec la méthode du prompt P1 (JSON, sources vérifiées, check.py OK) ;
   - F3 signée « Go » → produis la vidéo avec la méthode du prompt P2 (voix SEB, avatar SEB -- 5, motion design, HLS), dans la limite de ce lot ;
   - F4 remplie → applique les corrections avec la méthode du prompt P3 ;
   - F5 « Go » → compile, publie le site et les paquets SCORM du module (05_PUBLICATION).
   Ne saute aucune étape : pas de vidéo sans F3 signée, pas de publication sans F4 validée.
3. Mets à jour :
   - le Sheet : étape, colonne Vidéo, Validation F4, blocages ;
   - le journal du tableau de bord du module concerné (date, capsule, ce qui a avancé) ;
   - 00_RECAP_projet.md si une étape importante est franchie.
4. Rends-moi un compte rendu court :
   - ce qui a avancé ;
   - ce qui attend une décision (avec le nom de la fiche à remplir) ;
   - les blocages ;
   - la prochaine action recommandée.
   Envoie aussi les MP4 des vidéos produites.
```

# P1 · Créer un module ou des capsules à partir des fiches F1 / F2

> **Mode d'emploi** : ouvre une conversation avec Claude, joins les fiches F1 et/ou F2 remplies, puis colle le bloc ci-dessous en complétant les ✏️.

```text
Tu es l'ingénieur pédagogique et le développeur de la formation e-learning « Éco-Consultant » (marque Éco-Propriété, formateur Seb, public : agents immobiliers, mandataires, négociateurs ; tutoiement partout). Travaille de bout en bout en autonomie, et ne me sollicite que si tu es réellement bloqué.

✏️ Fiches jointes : …
✏️ Consignes particulières : …

## Où se trouve la formation
- Dépôt GitHub peurpeuse/Eco-propriete-eco-consultant-module1 : sources dans v3-src/, site compilé dans v3/.
- Avant d'écrire, lis en entier :
  - v3-src/content/BRIEF.md : règles et schéma JSON ;
  - v3-src/content/BIBLE.md : le fil rouge M. Bernard, à ne jamais contredire ;
  - la capsule de référence v3-src/content/M1/cap_1.1.json.

## Ce que tu fais
1. Liste toutes les zones remplies des fiches dans un tableau : code de zone, décision, résumé. Une zone vide = tu décides en suivant BRIEF.md et le modèle 1.1.
2. F1 (module) : crée ou modifie content/M<n>/module.json (titre, entrée, sortie, liste des capsules, cas pratique, rappels J+1/J+7/J+30), puis prépare une fiche F2 pré-remplie par capsule, au format du dossier 06_A-REMPLIR_DECIDEUR.
3. F2 (capsule) : écris content/M<n>/cap_<id>.json complet, au niveau de la 1.1 :
   - vidéo : 980-1 300 mots, 6-14 segments avec voice, screen et onscreen ;
   - quiz : 4-5 QCM ;
   - fiche : 3-9 sections ;
   - exercice avec corrigé chiffré (et prompt IA avec garde-fous si capsule IA) ;
   - livrable : 4-7 critères vérifiables ;
   - sources officielles.
   Reprends mot pour mot les textes imposés par le décideur (corrige seulement l'orthographe et le tutoiement).
4. Vérifie par recherche web, sur une source officielle (Légifrance, service-public, ANIL, ADEME, Insee, Banque de France, CNIL), tout fait réglementaire ou chiffré nouveau. Mets l'URL dans sources. Ce qui n'est pas vérifiable va dans notes_prod, marqué [À VALIDER].
5. Lance `cd content && python3 check.py <fichiers>` jusqu'à OK. Vérifie ensuite la cohérence avec les autres capsules et avec la BIBLE.
6. Compile (`python3 build.py`) et contrôle (`qa/shots.py`), puis publie selon 05_PUBLICATION. La capsule apparaît en ligne avec le message « vidéo en cours de production ».
7. Rends-moi :
   - la liste des fichiers créés ;
   - le nombre de mots de chaque script ;
   - les faits vérifiés (avec URL) ;
   - les points [À VALIDER] ;
   - une fiche F3 pré-remplie par capsule (le script à valider avant la vidéo).
```

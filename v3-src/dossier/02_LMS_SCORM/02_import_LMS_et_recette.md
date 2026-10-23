# Import dans le LMS et recette

## Importer un paquet
1. Sur le site, va dans **Pour ton LMS** et télécharge le paquet (commence par **Module 1** pour le premier test).
2. Dans le LMS, crée une activité ou un cours **SCORM 1.2** et dépose le fichier `.zip` **sans le décompresser**.
3. Applique les réglages de `01_scorm12_fonctionnement.md` : ouverture dans une nouvelle fenêtre, statut « terminé », tentatives illimitées avec reprise.
4. Inscris un compte de test et lance le module.

## Recette (à cocher par la personne qui teste)

| # | Vérification | OK |
|---|---|---|
| 1 | Le module s'ouvre ; la page d'accueil affiche le titre, les modules et le formateur | [ ] |
| 2 | La vidéo de la capsule 1.1 se lance, avec le son, sur ordinateur (Chrome ou Edge) | [ ] |
| 3 | La vidéo se lance sur iPhone (Safari) et sur Android | [ ] |
| 4 | Le quiz flash enregistre les réponses et affiche les explications | [ ] |
| 5 | La fiche PDF s'ouvre | [ ] |
| 6 | Les boutons « J’ai regardé la vidéo », « J’ai lu la fiche » et « J’ai fait l’exercice » cochent l'élément dans le plan | [ ] |
| 7 | Je ferme la fenêtre, je rouvre : je reprends au même endroit et ma progression est gardée | [ ] |
| 8 | Dans le LMS, le rapport montre le statut « incomplet », puis « terminé » une fois tout fait | [ ] |
| 9 | Le score (moyenne des quiz flash, ou quiz final pour le parcours complet) remonte dans le LMS | [ ] |
| 10 | Les réponses aux quiz apparaissent dans le détail des interactions (si le LMS les affiche) | [ ] |
| 11 | Parcours complet : l'attestation se débloque à partir de 70 % au quiz final | [ ] |
| 12 | Aucune page n'affiche « Document fictif » hors du dossier fil rouge, ni le guide formateur | [ ] |

**En cas de problème**, note dans la fiche F5 :
- le nom du LMS et sa version ;
- le navigateur ;
- le numéro de la ligne qui échoue ;
- une capture d'écran.

Puis transmets la fiche à Claude avec le prompt P3.

## Problèmes connus et solutions

| Symptôme | Cause probable | Solution |
|---|---|---|
| La vidéo reste noire, mais le reste fonctionne | Le réseau ou le LMS bloque `cdn.jsdelivr.net` | Faire autoriser `cdn.jsdelivr.net` par l'administrateur |
| La progression n'est pas gardée | Le LMS n'enregistre pas `suspend_data`, ou la fenêtre est fermée trop vite | Vérifier l'option de reprise des tentatives ; fermer avec le bouton de sortie du LMS |
| Le statut reste « incomplet » | Tous les éléments obligatoires ne sont pas faits (vidéo, quiz, lecture, exercice et devoir de chaque capsule, cas pratique) | C'est normal : le statut passe à « terminé » quand tout est fait |
| Le score affiché est différent de la note du quiz final | Paquet module : c'est la moyenne des quiz flash | C'est normal pour les paquets module |

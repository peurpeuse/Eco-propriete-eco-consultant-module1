# Historique des versions vidéo et pièges à éviter

## Les versions de la vidéo 1.1

| Version | Méthode | Résultat | Pourquoi on est passé à la suivante |
|---|---|---|---|
| Essai (21/10) | Voix ElevenLabs, partie 1 seule, sur une image fixe | Test du rendu de la voix | Pas de visage, pas d'animation |
| v1 (21/10) | HeyGen look SEB -- 1, slides Canva (`DAHYoZbiDFc`), intro et outro Jitter (`LqcDtNrmXW1JGtqI46hGR8gk`) | 6 min 38, assemblée dans HeyGen | Slides fixes non synchronisées ; Jitter gratuit en 720p avec filigrane ; lien HeyGen signé qui expirait au bout de 7 jours |
| **v2 (21/10), en service** | HeyGen look **SEB -- 5** (Avatar V) + motion design au mot près + HLS | 6 min 39, 1080p, hébergement permanent | — |

## Les pièges rencontrés

| Piège | Ce qui se passe | Comment l'éviter |
|---|---|---|
| Texte de plus de 5 000 caractères | ElevenLabs refuse la génération | Une génération par segment |
| URL audio expirée | HeyGen ne trouve plus l'audio (les URL signées durent 2 h) | Relire le flow ElevenLabs juste avant de lancer HeyGen |
| Envoi d'un fichier vers HeyGen bloqué (CORS) | Échec de l'envoi depuis le navigateur | Utiliser des URL publiques (audios ElevenLabs) plutôt que des fichiers |
| Lien vidéo HeyGen | Signé, il expire au bout de 7 jours | Ne jamais le mettre sur le site : toujours passer par le HLS dans le dépôt |
| Fichier de plus de 20 Mo | jsDelivr refuse de le servir | Découpage HLS en segments courts (≈ 8 s, moins de 4,2 Mo) |
| Ponctuation isolée dans la transcription (« : ») | Un ancrage ne correspond plus au texte | Ignorer les mots vides dans `A()` (déjà corrigé) |
| Médaillon trop large | Seb apparaît trop petit dans le rond | Zoom de 1,9 sur le visage dans le médaillon (déjà en place) |
| PC ou Chrome déconnecté | Claude ne peut pas récupérer le MP4 | Garder le PC allumé avec l'app Claude, ou joindre le fichier à la conversation |
| Jitter version gratuite | 720p avec filigrane, export une scène à la fois | Ne pas utiliser pour la production ; sinon, prendre Jitter Pro |
| Mélange de chiffres | Un chiffre à l'écran qui diffère de ce que dit Seb | Contrôle image par image ; ne jamais afficher un chiffre qui n'est ni dit ni dans la fiche |

## Pistes d'amélioration
- **Musique de fond discrète** : il faut le connecteur ElevenLabs complet (le connecteur actuel ne fait que la voix) ou une banque de sons libres de droits.
- **Vrai Remotion** : dès que npm est accessible, remplacer l'import ; les composants sont déjà compatibles.
- **Version 720p** plus légère pour les connexions mobiles (deuxième flux HLS).
- **B-roll réel** : plans de visite d'appartement, façade 1970, pour les segments « screen » qui en demandent.

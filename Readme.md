# Memozart-Front
## Le projet:

### L'apprentissage espacé ?
Basés sur les travaux des chercheurs Edgar Dale et Hermann Ebbinghaus​, ils prouvent à travers la pyramide d'apprentissage que la rétention d'informations diffère en fonction de la méthodologie employée et que la mémorisation sur le long terme dépend de la fréquence de répétition.

### C'est quoi Memozart ?
L'application Memozart est un site web basé sur cet apprentissage espacé. Elle permet à toute personne ou entreprise de créer des cartes de révision qui vont être représentées à des délais plus ou moins espacés.

Garantissant une assimilation fluide, adéquate et durable, l'application, grâce à son algorithme, va intensifier les révisions des leçons les moins retenues au profit des leçons déjà maîtrisées. Suivant un processus en 10 étapes, lors de l'arrivée à cette dernière, l'utilisateur pourra alors être certain que la révision sera profondément acquise et ancrée dans ses connaissances.

## Présentation du workflow
- En mode projet via Github et cette organisation publique.
- Étude de marché et cahier des charges minimales au kick off.
- Kanban => le travail est géré en fonction des priorités définies par l'équipe.
- Déploiement et livraison continue afin d'assurer des mises à jour perpétuelles et à chaud via Jenkins et IIS.
- Qualité de code avec SonarQube (très peu exploité).
- Discord canaux de discussion.
- Site en production et un site de développement.

## Stack
- MEAN stack (MongoDB, Express.js, Angular, Node.js).
- JWT pour la gestion de l'authentification et Redis pour son maintien (évite les déconnexions sur mobile).

## Implémentations
Nous avons souhaité nous concentrer sur les valeurs ajoutées du projet telles que les révisions, la création des cartes, le design et l’expérience utilisateur avant les éléments moins importants comme la connexion et l’inscription…

### Première étape
- Schéma de données complet.
- Définition du style et de la logique du concept.

### Phase de développement
- Connexion, inscription avec gestion du refresh token via Redis.
- L’implémentation du design Neumorphisme sur les champs de formulaire et les boutons.
- Algorithme de révision.
- CRUD des cartes.
- CRUD des révisions.
- Création des organisations.
- PWA qui représente notre version mobile.
- Tests unitaires sur quelques parties (5%).
- Tests d’intégrations actuellement commentés car il y a eu de nombreuses évolutions sur la dernière semaine.

---
L'ensemble de l'équipe de mémozart reste à votre disposition.

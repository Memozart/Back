# language: fr 

Fonctionnalité: Algorithme révision - jour représentation
  Je veux à la suite d'une révision que la réponse soit bonne ou mauvaise obtenir la suite logique de représentation de la carte

  
  Scénario: Un utilisateur va réviser une carte à l'étape 1 et va donner une bonne réponse
    Étant donné qu'un utilisateur à une carte à réviser à la premiere step 
    Quand il donne la bonne réponse à l'algorithme
    Alors la nouvelle présentation devrait avoir lieu dans 2 jours

  Scénario: Un utilisateur va réviser une carte à l'étape 2 et va donner une mauvaise réponse
    Étant donné qu'un utilisateur à une carte à réviser à la seconde step 
    Quand il donne une mauvaise réponse à l'algorithme
    Alors la nouvelle présentation devrait avoir lieu dans 1 jours
  
  Scénario: Un utilisateur va réviser une carte à l'étape 1 et va donner une mauvaise réponse
    Étant donné qu'un utilisateur à une carte à réviser à la premiere step 
    Quand il donne une mauvaise réponse à l'algorithme
    Alors la nouvelle présentation devrait avoir lieu dans 1 jours
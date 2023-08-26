# language: fr 

Fonctionnalité: Révision d'une carte
  Je veux pouvoir réviser une carte et donner la bonne et la mauvaise réponse

  Scénario: Un utilisateur va réviser une carte et donner une bonne réponse
    Étant donné qu'un utilisateur à une carte à réviser
    Quand il donne la bonne réponse
    Alors il recoit un statut réponse qui dit "true"

  Scénario: Un utilisateur va réviser une carte et donner une mauvaise réponse
    Étant donné qu'un utilisateur à une carte à réviser
    Quand il donne la mauvaise réponse
    Alors il recoit un statut réponse qui dit "false"
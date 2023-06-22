# language : fr 


Fonctionnalité: Connexion
  Je veux me connecte 

  Scénario: Un utilisateur tente de se connecter sans email
    Étant donné qu'un utilisateur ne renseigne pas son email
    Quand il tente de se connecter
    Alors il reçoit une réponse avec un code erreur 400

  Scénario: Un utilisateur tente de se connecter sans email
    Étant donné qu'un utilisateur ne renseigne pas son email
    Quand il tente de se connecter
    Alors il reçoit une réponse avec un message "\"email\" is not allowed to be empty"
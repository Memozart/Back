# language : fr 


Fonctionnalité: Utilisateur

  Scénario: Un utilisateur tente de se connecter sans email
    Étant donné qu'un utilisateur ne renseigne pas son email
    Quand il tente de se connecter
    Alors il reçoit une réponse avec un code 400

  Scénario: Un utilisateur tente de se connecter avec les bons credentials
    Étant donné qu'un utilisateur souhaite s'authentifier
    Quand il tente de se connecter avec les bons credentials
    Alors il reçoit une réponse avec un code 200

  Scénario: Un utilisateur supprime son compte avec seulement compte personnel => succès
    Quand il souhaite supprimer son compte et qu'il n'a qu'un compte personnel
    Alors il reçoit une réponse avec un code 200
    Et il n'existe plus aucune données en base sur lui

  Scénario: Un utilisateur supprime son compte avec des organisations avec plusieurs admin => succès
    Quand il souhaite supprimer son compte avec des organisations avec plusieurs admin
    Alors il reçoit une réponse avec un code 200
    Et il n'existe plus aucune données en base sur lui
  
  Scénario: Un utilisateur supprime son compte avec une organisations ou il est le seul admin => erreur
    Quand il souhaite supprimer son compte avec une organisations ou il est le seul admin 
    Alors il reçoit une réponse avec un code 500
    Et un message qui dit contient 'transférer les droits'
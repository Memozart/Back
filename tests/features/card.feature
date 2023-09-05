# language: fr 



Fonctionnalité: Gestion de card pour son espace personnel
  Je veux pouvoir créer, modifier, supprimer une carte

  Scénario: Un utilisateur va créer une carte avec des données valides
    Étant donné qu'un utilisateur créée une carte
    Quand il la valide et envoi la carte créée 
    Alors il recoit un code success 201 
    Et un message qui dit "Card created"

  Scénario: Un utilisateur va modifier une carte avec des données valides
    Étant donné qu'un utilisateur modifie une carte
    Quand il la valide et envoi la carte modifiée
    Alors il recoit un code success 200 
    Et un message qui dit "Card updated"

  Scénario: Un utilisateur supprime une carte 
    Étant donné qu'un utilisateur supprime une carte
    Quand il la valide et envoi la carte à supprimer
    Alors il recoit un code success 200 
    Et un message qui dit "Card deleted"

  Scénario: Un utilisateur mets à jour le thème de sa carte et toutes les révisions ont le thème qui changent
    Étant donné qu'un utilisateur modifie le theme d'une carte
    Quand il valide pour mettre à jour la carte 
    Alors toutes les révisions liées à la carte doivent avoir le nouveau thème
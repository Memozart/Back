# language: fr 



Fonctionnalité: Gestion de card pour son espace personnel
  Je veux pouvoir créer, modifier, supprimer une carte
  
  Scénario: Un utilisateur va créer une carte avec des données valides
    Étant donné qu'un utilisateur créée une carte
    Quand il la valide et l'envoi 
    Alors il recoit un code success 201 
    Et un message qui dit "Card created"
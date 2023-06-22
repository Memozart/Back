# language: fr

Fonctionnalité: Est on vendredi
  Tout le monde veut savoir si on est vendredi

  Plan du Scénario: Aujourd'hui est ou n'est pas vendredi
    Étant donné qu'aujourd'hui est "<jour>"
    Quand je demande si on est vendredi
    Alors je devrais avoir "<reponse>"

  Exemples:
    | jour              | reponse |
    | Monday            | Nope    |
    | Tuesday           | Nope    |
    | Wednesday         | Nope    |
    | Thursday          | Nope    |
    | Friday            | TGIF    |
    | Saturday          | Nope    |
    | Sunday            | Nope    |
    | another           | Nope    |
    | anything else!    | Nope    |

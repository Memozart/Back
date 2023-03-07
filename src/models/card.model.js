const STEPS = require('./steps.model');

/**
 * Classe représentant une carte de révision
 */
module.exports = class Card {
  /**
   *  Constructeur de la classe Card
   * @param {*} question  question de la carte
   * @param {*} reponse  réponse de la carte
   * @param {*} theme  thème de la carte
   * @param {*} aide  aide de la carte (facultatif)
   * @param {*} nextPresentation  prochaine étape de présentation de la carte (Step1 par défaut)
   */
  constructor(
    question,
    reponse,
    theme,
    aide = null,
    nextPresentation = STEPS.STEP1
  ) {
    this.question = question;
    this.reponse = reponse;
    this.theme = theme;
    this.nextPresentation = nextPresentation;
    this.aide = aide;
  }
};

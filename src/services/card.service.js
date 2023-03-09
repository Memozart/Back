const STEPS = require('../models/steps.model');

/**
 * Vérifie si la réponse de l'utilisateur est correcte
 * si oui, avance la date de représentation de la carte
 * sinon, recule la date de représentation de la carte
 * @param {*} card 
 * @returns 
 */
const checkUserAnswer = (card) => {
  return card;
};

/**
 * en cas de réponse juste, permets d'avancer la date de représentation de la carte
 * @param {*} card carte à modifier
 * @returns retourne la carte avec la date de représentation avancée
 */
const nextStep = (card) => {
  if (card == null || card.nextPresentation == null)
    throw new Error('La carte est vide ou le step est invalide');
  const currentStepIndex = Object.values(STEPS).findIndex(
    (step) => step.id === card.nextPresentation.id
  );
  const nextStep =
    currentStepIndex === Object.values(STEPS).length - 1
      ? STEPS.STEP10
      : Object.values(STEPS)[currentStepIndex + 1];
  card.nextPresentation = nextStep;
  return card;
};

/**
 * en cas de réponse fausse, permets de reculer la date de représentation de la carte
 * @param {*} card carte à modifier
 * @returns retourne la carte avec la date de représentation reculée
 */
const previousStep = (card) => {
  if (card == null || card.nextPresentation == null)
    throw new Error('La carte est vide ou le step est invalide');

  const currentStepIndex = Object.values(STEPS).findIndex(
    (step) => step.id === card.nextPresentation.id
  );
  const previousStep =
    currentStepIndex === 0
      ? STEPS.STEP1
      : Object.values(STEPS)[currentStepIndex - 1];
  card.nextPresentation = previousStep;
  return card;
};

module.exports = {
  checkUserAnswer,
  nextStep,
  previousStep,
};

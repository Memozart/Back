const { STEPS } = require('../utils/constants');
const Review =require('../models/review.model');
const moment = require('moment-timezone');
const mongoose = require('mongoose');

const createReview = (userId, organisationId, cardId, dateNextPresentation = null)=>{
  if(!dateNextPresentation)
    dateNextPresentation = moment.tz('Europe/Paris').startOf('day').add(1, 'day');
  else
    dateNextPresentation = moment.tz(dateNextPresentation, 'DD/MM/YYYY', 'Europe/Paris').startOf('day');

  return Review.create({
    card : new mongoose.Types.ObjectId(cardId),
    organisation : new mongoose.Types.ObjectId(organisationId),
    user : new mongoose.Types.ObjectId(userId),
    nextPresentation : dateNextPresentation
  });
};

/**
 * Vérifie si la réponse de l'utilisateur est correcte
 * si oui, avance la date de représentation de la carte
 * sinon, recule la date de représentation de la carte
 * @param {*} reviewCard 
 * @returns 
 */
const checkUserAnswer = (reviewCard) => {
  return reviewCard;
};

/**
 * en cas de réponse juste, permets d'avancer la date de représentation de la carte
 * @param {*} card carte à modifier
 * @returns retourne la carte avec la date de représentation avancée
 */
const nextStep = (reviewCard) => {
  if (reviewCard == null || reviewCard.nextPresentation == null)
    throw new Error('La carte est vide ou le step est invalide');
  const currentStepIndex = Object.values(STEPS).findIndex(
    (step) => step.id === reviewCard.nextPresentation.id
  );
  const nextStep =
    currentStepIndex === Object.values(STEPS).length - 1
      ? STEPS.STEP10
      : Object.values(STEPS)[currentStepIndex + 1];
  reviewCard.nextPresentation = nextStep;
  return reviewCard;
};

/**
 * en cas de réponse fausse, permets de reculer la date de représentation de la carte
 * @param {*} reviewCard carte à modifier
 * @returns retourne la carte avec la date de représentation reculée
 */
const previousStep = (reviewCard) => {
  if (reviewCard == null || reviewCard.nextPresentation == null)
    throw new Error('La carte est vide ou le step est invalide');

  const currentStepIndex = Object.values(STEPS).findIndex(
    (step) => step.id === reviewCard.nextPresentation.id
  );
  const previousStep =
    currentStepIndex === 0
      ? STEPS.STEP1
      : Object.values(STEPS)[currentStepIndex - 1];
  reviewCard.nextPresentation = previousStep;
  return reviewCard;
};

module.exports = {
  checkUserAnswer,
  nextStep,
  previousStep,
  createReview
};

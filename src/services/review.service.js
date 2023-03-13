const Review = require('../models/review.model');
const moment = require('moment-timezone');
const mongoose = require('mongoose');

/**
 * Methode qui créer une révision (dans la collection "review")
 * dès qu'une carte est créer
 * @param {*} userId l'utilisateur affecté à la révision
 * @param {*} organisationId l'organisation qui est affecté et qui gère la carte
 * @param {*} cardId la carte qui est affecté à la révision
 * @param {*} dateNextPresentation la date de la prochaine Présentation pour l'utilisateur
 * @returns la révision
 */
const createReview = (
  userId,
  organisationId,
  cardId,
  themeId,
  dateNextPresentation = null
) => {
  if (!dateNextPresentation)
    dateNextPresentation = moment
      .tz('Europe/Paris')
      .startOf('day')
      .add(1, 'day')
      .add(1, 'hours');
  else
    dateNextPresentation = moment
      .tz(dateNextPresentation, 'DD/MM/YYYY', 'Europe/Paris')
      .startOf('day')
      .add(1, 'hours');

  return Review.create({
    card: new mongoose.Types.ObjectId(cardId),
    organisation: new mongoose.Types.ObjectId(organisationId),
    user: new mongoose.Types.ObjectId(userId),
    nextPresentation: dateNextPresentation,
    theme: new mongoose.Types.ObjectId(themeId),
    step : new mongoose.Types.ObjectId('640f9ba0334e910d6ed41e67') // step one
  });
};

const getOldestReviewByTheme = async (
  userId,
  organisationId,
  themeId,
  page = 1
) => {
  const pageSize = 1;
  const dateMaxReview = moment().startOf('day').add(1, 'day');
  const query = {
    user: userId,
    organisation: organisationId,
    theme: themeId,
    nextPresentation: { $lte: dateMaxReview },
  };
  const count = await Review.countDocuments(query);
  const totalPages = Math.ceil(count / pageSize);

  const reviews = await Review.find(query)
    .populate(['theme', 'step'])
    .sort({ nextPresentation: 1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .populate({
      path: 'card',
      select: '-answer -theme' // exclut le champs 'réponse'
    })
    .populate({
      path: 'organisation',
      select: 'name' // inclus uniquement le champs 'name'
    })
    .lean();

  const hasNext = page < totalPages;
  const queryResult = reviews && reviews.length == 1 ? reviews[0] : null;
  if(!queryResult)
    return null;
  return { queryResult, hasNext, totalPages, currentPage: page };
};

/**
 * Vérifie si la réponse de l'utilisateur est correcte
 * si oui, avance la date de représentation de la carte
 * sinon, recule la date de représentation de la carte
 * @param {*} reviewCard
 * @returns le statut de la réponse avec la bonne réponse
 */
const checkUserAnswer = (reviewCard) => {
  return reviewCard;
};

// /**
//  * en cas de réponse juste, permets d'avancer la date de représentation de la carte
//  * @param {*} card carte à modifier
//  * @returns retourne la carte avec la date de représentation avancée
//  */
// const nextStep = (reviewCard) => {
//   if (reviewCard == null || reviewCard.nextPresentation == null)
//     throw new Error('La carte est vide ou le step est invalide');
//   const currentStepIndex = Object.values(STEPS).findIndex(
//     (step) => step.id === reviewCard.nextPresentation.id
//   );
//   const nextStep =
//     currentStepIndex === Object.values(STEPS).length - 1
//       ? STEPS.STEP10
//       : Object.values(STEPS)[currentStepIndex + 1];
//   reviewCard.nextPresentation = nextStep;
//   return reviewCard;
// };

// /**
//  * en cas de réponse fausse, permets de reculer la date de représentation de la carte
//  * @param {*} reviewCard carte à modifier
//  * @returns retourne la carte avec la date de représentation reculée
//  */
// const previousStep = (reviewCard) => {
//   if (reviewCard == null || reviewCard.nextPresentation == null)
//     throw new Error('La carte est vide ou le step est invalide');

//   const currentStepIndex = Object.values(STEPS).findIndex(
//     (step) => step.id === reviewCard.nextPresentation.id
//   );
//   const previousStep =
//     currentStepIndex === 0
//       ? STEPS.STEP1
//       : Object.values(STEPS)[currentStepIndex - 1];
//   reviewCard.nextPresentation = previousStep;
//   return reviewCard;
// };

module.exports = {
  checkUserAnswer,
  // nextStep,
  // previousStep,
  createReview,
  getOldestReviewByTheme,
};

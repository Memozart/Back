const { Review, Step } = require('../models');
const moment = require('moment-timezone');
const mongoose = require('mongoose');
const { isEmpty } = require('../utils/tool');
const { ERROR_MESSAGE } = require('../utils/constants');
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
  if (
    isEmpty(userId) ||
    isEmpty(organisationId) ||
    isEmpty(cardId) ||
    isEmpty(themeId)
  )
    throw new Error(ERROR_MESSAGE.PARAMETER_EMPTY);

  if (
    dateNextPresentation &&
    moment(dateNextPresentation, 'DD/MM/YYYY').isBefore(moment())
  )
    throw new Error('The first presentation date cannot be before today!');

  if (!dateNextPresentation)
    dateNextPresentation = moment
      .tz('Europe/Paris')
      .startOf('day')
      .add(1, 'day')
      .add(1,'hour');
  else
    dateNextPresentation = moment
      .tz(dateNextPresentation, 'DD/MM/YYYY', 'Europe/Paris')
      .startOf('day')
      .add(1,'hour');

  return Review.create({
    card: new mongoose.Types.ObjectId(cardId),
    organisation: new mongoose.Types.ObjectId(organisationId),
    user: new mongoose.Types.ObjectId(userId),
    nextPresentation: dateNextPresentation,
    theme: new mongoose.Types.ObjectId(themeId),
    step: new mongoose.Types.ObjectId('640f9ba0334e910d6ed41e67'), // step one
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
      select: '-answer -theme', // exclut le champs 'réponse'
    })
    .populate({
      path: 'organisation',
      select: 'name', // inclus uniquement le champs 'name'
    })
    .lean();

  const hasNext = page < totalPages;
  const queryResult = reviews && reviews.length == 1 ? reviews[0] : null;
  if (!queryResult) return null;
  return { queryResult, hasNext, totalPages, currentPage: page };
};

/**
 * Vérifie si la réponse de l'utilisateur est correcte
 * si oui, avance la date de représentation de la carte
 * sinon, recule la date de représentation de la carte
 * @param {*} reviewCard
 * @returns le statut de la réponse avec la bonne réponse
 */
const checkUserAnswer = async (
  userId,
  currentOrganisationId,
  reviewId,
  userAnswer
) => {
  const review = await Review.findOne({
    user: userId,
    organisation: currentOrganisationId,
    _id: reviewId,
  })
    .populate(['theme', 'step'])
    .populate({
      path: 'card',
      select: '-theme', // exclut le champs 'réponse'
    })
    .populate({
      path: 'organisation',
      select: 'name', // inclus uniquement le champs 'name'
    })
    .lean();

  const steps = await Step.find();

  const { card, theme } = review;
  if (card.answer.toLowerCase() == userAnswer.toLowerCase()) {
    const reviewed = await nextStep(review, steps);
    const { queryResult } = await getOldestReviewByTheme(
      userId,
      currentOrganisationId,
      theme._id
    );
    return {
      statusResponse: {
        success: false,
        dayNextPresentation: reviewed.step.day,
      },
      queryResult,
    };
  } else {
    const reviewed = await previousStep(review, steps);
    const { queryResult } = await getOldestReviewByTheme(
      userId,
      currentOrganisationId,
      theme._id
    );
    return {
      statusResponse: {
        success: false,
        feedback: {
          userAnswer: userAnswer,
          goodAnswer: card.answer,
        },
        dayNextPresentation: reviewed.step.day,
      },
      queryResult,
    };
  }
};

// /**
//  * en cas de réponse juste, permets d'avancer la date de représentation de la carte
//  * @param {*} card carte à modifier
//  * @returns retourne la carte avec la date de représentation avancée
//  */
const nextStep = async (review, steps) => {
  if (review == null || review.nextPresentation == null)
    throw new Error('La carte est vide ou le step est invalide');

  const { order } = review.step;
  if (order == 10) {
    const step = steps.find((step) => step.order === order);
    const { day, _id } = step;
    const dateNextPresentation = moment
      .tz('Europe/Paris')
      .startOf('day')
      .add(day, 'day')
      .add(1, 'hours');
    review.step = _id;
    review.nextPresentation = dateNextPresentation;
  } else {
    const step = steps.find((step) => step.order === order + 1);
    const { day, _id } = step;
    const dateNextPresentation = moment
      .tz('Europe/Paris')
      .startOf('day')
      .add(day, 'day')
      .add(1, 'hours');
    review.step = _id;
    review.nextPresentation = dateNextPresentation;
  }
  return await Review.findByIdAndUpdate(review._id, review, { new: true });
};

// /**
//  * en cas de réponse fausse, permets de reculer la date de représentation de la carte
//  * @param {*} reviewCard carte à modifier
//  * @returns retourne la carte avec la date de représentation reculée
//  */
const previousStep = async (review, steps) => {
  if (review == null || review.nextPresentation == null)
    throw new Error('La carte est vide ou le step est invalide');

  const { order } = review.step;
  if (order == 1) {
    const dateNextPresentation = moment
      .tz('Europe/Paris')
      .startOf('day')
      .add(1, 'day')
      .add(1, 'hours');
    review.nextPresentation = dateNextPresentation;
  } else {
    const step = steps.find((step) => step.order === order - 1);
    const { day, _id } = step;
    const dateNextPresentation = moment
      .tz('Europe/Paris')
      .startOf('day')
      .add(day, 'day')
      .add(1, 'hours');
    review.step = _id;
    review.nextPresentation = dateNextPresentation;
  }

  return await Review.findByIdAndUpdate(review._id, review, { new: true });
};

module.exports = {
  checkUserAnswer,
  nextStep,
  previousStep,
  createReview,
  getOldestReviewByTheme,
};

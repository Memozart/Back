const { Review, Step } = require('../models');
const dayjs = require('dayjs');
const mongoose = require('mongoose');
const { isEmpty } = require('../utils/tool');
const { ERROR_MESSAGE, CONFIG_SEQUENCE_DEMO } = require('../utils/constants');
const utc = require('dayjs/plugin/utc');
const config = require('../config');
dayjs.extend(utc);

/**
 * Methode qui créer une révision (dans la collection "review")
 * dès qu'une carte est créer
 * @param {*} userId l'utilisateur affecté à la révision
 * @param {*} organisationId l'organisation qui est affecté et qui gère la carte
 * @param {*} cardId la carte qui est affecté à la révision
 * @param {*} dateNextPresentation la date de la prochaine Présentation pour l'utilisateur
 * @returns la révision
 */
const createReview = async (
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
  
  const today = dayjs().utc().startOf('day');
  const dateCard = dateNextPresentation ? dayjs(dateNextPresentation,'YYYY-MM-DD').utc(true) : today;
  if (
    dateCard.isBefore(today) && !config.isDemo
  ) {
    throw new Error('The first presentation date cannot be before today!');
  }


  if (!dateNextPresentation)
    dateNextPresentation = dayjs()
      .utc()
      .add(1, 'day')
      .startOf('day');
  else{
    dateNextPresentation = dayjs.utc(dateNextPresentation, 'YYYY-MM-DD').startOf('day');
  }
  const stepOne =  await Step.findOne();
  return Review.create({
    card: new mongoose.Types.ObjectId(cardId),
    organisation: new mongoose.Types.ObjectId(organisationId),
    user: new mongoose.Types.ObjectId(userId),
    nextPresentation: dateNextPresentation,
    theme: new mongoose.Types.ObjectId(themeId),
    step: stepOne._id, // step one
  });
};

const getOldestReviewByTheme = async (
  userId,
  organisationId,
  themeId,
  page = 1
) => {
  const pageSize = 1;
  const dateMaxReview = CONFIG_SEQUENCE_DEMO.getMaxDateReview();
  const query = {
    user: userId,
    organisation: organisationId,
    theme: themeId,
    nextPresentation: { [`${CONFIG_SEQUENCE_DEMO.criteriaSearchDate}`]: dateMaxReview }
  };
  const count = await Review.countDocuments(query);
  const totalPages = Math.ceil(count / pageSize);

  const reviews = await Review.find(query)
    .sort({ nextPresentation: 1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .select(['-nextPresentation', '-user'])
    .populate({
      path: 'theme',
      select: '-_id', // exclut le champs 'réponse'
    })
    .populate({
      path: 'step',
      select: '-_id', // exclut le champs 'réponse'
    })
    .populate({
      path: 'card',
      select: '-answer -theme -_id', // exclut le champs 'réponse'
    })
    .populate({
      path: 'organisation',
      select: 'name -_id', // inclus uniquement le champs 'name'
    })
    .lean();

  const hasNext = page < totalPages;
  const review = reviews && reviews.length == 1 ? reviews[0] : null;
  if (!review) return null;
  return { review, hasNext, totalPages, currentPage: page };
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
  const reviewDB =  await Review.findOne({
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

  const { card, theme } = reviewDB;
  if (card.answer.toLowerCase() == userAnswer.toLowerCase()) {
    const reviewed = await nextStep(reviewDB, steps);
    const review = await getOldestReviewByTheme(
      userId,
      currentOrganisationId,
      theme._id
    );
    return {
      statusResponse: {
        success: true,
        feedback: {
          dayNextPresentation: reviewed.step.day,
        },
      },
      review,
    };
  } else {
    const reviewed = await previousStep(reviewDB, steps);
    const review  = await getOldestReviewByTheme(
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
          dayNextPresentation: reviewed.step.day,
        },
      },
      review,
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
    const dateNextPresentation = dayjs().utc()
      .add(day, CONFIG_SEQUENCE_DEMO.timeSequence)
      .startOf(CONFIG_SEQUENCE_DEMO.timeSequence);

    review.step = _id;
    review.nextPresentation = dateNextPresentation;
  } else {
    const step = steps.find((step) => step.order === order + 1);
    const { day, _id } = step;
    const dateNextPresentation = dayjs().utc()
      .add(day, CONFIG_SEQUENCE_DEMO.timeSequence)
      .startOf(CONFIG_SEQUENCE_DEMO.timeSequence);
    review.step = _id;
    review.nextPresentation = dateNextPresentation;
  }
  return await Review.findByIdAndUpdate(review._id, review, { new: true }).populate(['step']);
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
    const dateNextPresentation = dayjs().utc()
      .add(1, CONFIG_SEQUENCE_DEMO.timeSequence)    
      .startOf(CONFIG_SEQUENCE_DEMO.timeSequence);
    review.nextPresentation = dateNextPresentation;
  } else {
    const step = steps.find((step) => step.order === order - 1);
    const { day, _id } = step;
    const dateNextPresentation = dayjs().utc()
      .add(day, CONFIG_SEQUENCE_DEMO.timeSequence)
      .startOf(CONFIG_SEQUENCE_DEMO.timeSequence);
    review.step = _id;
    review.nextPresentation = dateNextPresentation;
  }

  return await Review.findByIdAndUpdate(review._id, review, { new: true }).populate(['step']);
};

const updateThemeByIdCardAndIdOrganisation= async (cardId, organisationId, themeId) =>{
  return await Review.updateMany({
    card : cardId,
    organisation : organisationId
  },{ $set: { theme: themeId } });
};

const addReviewsForNewUser = async (userId, organisationId, cards) => {
  const today = dayjs().utc().startOf('day');
  const stepOne =  await Step.findOne();
  const reviews = cards.map(card => {
    return {
      user: userId,
      organisation: organisationId,
      card: card._id,
      theme: card.theme._id,
      nextPresentation: today,
      step: stepOne._id
    };
  });
  await Review.insertMany(reviews);
};

const deleteReviewsUserBan = async(userId, organisationId) => {
  return await Review.deleteMany({
    user: userId,
    organisation: organisationId
  });
};

module.exports = {
  checkUserAnswer,
  nextStep,
  previousStep,
  createReview,
  getOldestReviewByTheme,
  updateThemeByIdCardAndIdOrganisation,
  addReviewsForNewUser,
  deleteReviewsUserBan
};

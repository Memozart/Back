const reviewService = require('../services/review.service');
const catchAsync = require('../utils/catchAsync');
const { successF } = require('../utils/message');
const tool = require('../utils/tool');
/**
 * récupère la plus vieille révision
 * possible par thème et paginé
 */
const getReviewByTheme = catchAsync(async (req, res, next) => {
  const { userId, currentOrganisationId } = tool.getUserIdAndOrganisationId(req);
  const { id: reviewId } = req.params;
  const { page = 1 } = req.query;
  const review = await reviewService.getOldestReviewByTheme(
    userId,
    currentOrganisationId,
    reviewId,
    page
  );
  if (!review)
    return successF('no result retrieve', null, 200, res, next);
  successF('review fetch', review, 200, res, next);
});


const sendReviewResponse = catchAsync(async (req, res, next) => {

  // je dois vérifier si la review qu'essaye de réviser 
  // l'utilisateur est bien la plus ancienne des thèmes et est bien révisable
  // s'il essaye de renvoyé plusieurs fois la meme réponse (genre par postman)

  const { userId, currentOrganisationId } = tool.getUserIdAndOrganisationId(req);
  const { idReview, answer } = req.body;
  const review = await reviewService.checkUserAnswer(
    userId,
    currentOrganisationId,
    idReview,
    answer
  );
  if (!review)
    return successF('no result retrieve', null, 200, res, next);
  successF('review fetch', review, 200, res, next);
});


module.exports = {
  getReviewByTheme,
  sendReviewResponse
};

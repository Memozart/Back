const reviewService = require('../services/review.service');
const catchAsync = require('../utils/catchAsync');
const { successF } = require('../utils/message');

/**
 * récupère la plus vieille révision
 * possible par thème et paginé
 */
const getReviewByTheme = catchAsync(async (req, res, next) => {
  const { id: userId, currentOrganisation } = req.user;
  const { id: reviewId } = req.params;
  const { page = 1 } = req.query;
  const currentOrganisationId = currentOrganisation.toString();
  const review  = await reviewService.getOldestReviewByTheme(
    userId,
    currentOrganisationId,
    reviewId,
    page
  );
  if(!review)
    return successF('no result retrieve', null, 200, res, next);
  successF('review fetch', review, 200, res, next);
});

module.exports = {
  getReviewByTheme,
};

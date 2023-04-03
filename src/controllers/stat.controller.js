const statService = require('../services/stat.service');
const catchAsync = require('../utils/catchAsync');
const { successF } = require('../utils/message');
const tool = require('../utils/tool');

const getInfoReview = catchAsync(async (req, res, next) => {
  const { userId, currentOrganisationId } = tool.getUserIdAndOrganisationId(req);
  const getReviewsTotal = await statService.getReviewsTotal(userId, currentOrganisationId);
  const getReviewsDone = await statService.getReviewsDone(userId, currentOrganisationId);
  const infoReview = {
    getReviewsTotal,
    getReviewsDone,
    getReviewsPourcent: Math.round((getReviewsDone / getReviewsTotal) * 100),
  };
  successF('infoReview fetch', infoReview, 200, res, next);
});

const getReviewsOfAllThemes = catchAsync(async (req, res, next) => {
  const { userId, currentOrganisationId } = tool.getUserIdAndOrganisationId(req);
  const reviews = await statService.getReviewsOfAllThemes(userId, currentOrganisationId);
  successF('reviews fetch', reviews, 200, res, next);
});

module.exports = {
  getInfoReview,
  getReviewsOfAllThemes,
};
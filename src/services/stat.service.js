const { Review, Theme } = require('../models');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

const getReviewsTotal = async (userId, organisationId) => {
  const reviews = await Review.find({
    user: userId,
    organisation: organisationId,
  });
  return reviews.length;
};

const getReviewsDone = async (userId, organisationId) => {
  const dateMaxReview = dayjs().utc().startOf('day');
  const reviews = await Review.find({
    user: userId,
    organisation: organisationId,
    nextPresentation: { $gt: dateMaxReview },
  });

  return reviews.length;
};

const getReviewsOfAllThemes = async (userId, organisationId) => {
  const dateMaxReview = new Date();
  dateMaxReview.setUTCHours(0, 0, 0, 0);
  dateMaxReview.setHours(dateMaxReview.getHours() + 2);
  return await Theme.aggregate([
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'theme',
        as: 'reviews',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        color1: 1,
        color2: 1,
        darkColor: 1,
        darkShadow: 1,
        lightShadow: 1,
        reviews: {
          $filter: {
            input: '$reviews',
            as: 'review',
            cond: {
              $and: [
                { $eq: ['$$review.user', ObjectId(userId)] },
                { $eq: ['$$review.organisation', ObjectId(organisationId)] },
                { $lt: ['$$review.nextPresentation', dateMaxReview] },
                { $eq: ['$$review.theme', '$_id'] },
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        color1: 1,
        color2: 1,
        darkColor: 1,
        darkShadow: 1,
        lightShadow: 1,
        nbReviews: { $size: '$reviews' },
      },
    },
  ]).exec();
};

module.exports = {
  getReviewsTotal,
  getReviewsDone,
  getReviewsOfAllThemes,
};

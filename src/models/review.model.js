const mongoose = require('mongoose');
const types = mongoose.Schema.Types;

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: types.ObjectId,
      required: true,
      trim: true,
      ref:'User'
    },
    organisation: {
      type: types.ObjectId,
      required: true,
      trim: true,
      ref:'Organisation'
    },
    card: {
      type: types.ObjectId,
      required: true,
      trim: true,
      ref:'Card'
    },
    theme: {
      type: types.ObjectId,
      required: true,
      trim: true,
      ref:'Theme'
    },
    nextPresentation: {
      type: types.Date,
      required: true,
      trim: true,
    },
  },
  { versionKey: false }
);

reviewSchema.pre('save', (next) => {
  next();
});

const review = mongoose.model('Review', reviewSchema);
module.exports = review;

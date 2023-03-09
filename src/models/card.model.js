const mongoose = require('mongoose');
const types = mongoose.Schema.Types;

const cardSchema = new mongoose.Schema(
  {
    question: {
      type: types.String,
      required: true,
      trim: true,
    },
    answer: {
      type: types.String,
      required: true,
      trim: true,
    },
    help: {
      type: types.String,
      trim: true,
    },
    theme: {
      type: types.ObjectId,
      required: true,
      trim: true,
      ref: 'Theme'
    },
  },
  { versionKey: false }
);

cardSchema.pre('save', (next) => {
  next();
});

const card = mongoose.model('Card', cardSchema);
module.exports = card;

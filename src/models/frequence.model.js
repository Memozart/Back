const mongoose = require('mongoose');
const types = mongoose.Schema.Types;

const frequenceSchema = new mongoose.Schema(
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
    nextPresentation: {
      type: types.Date,
      required: true,
      trim: true,
    },
  },
  { versionKey: false }
);

frequenceSchema.pre('save', (next) => {
  next();
});

const frequence = mongoose.model('Frequence', frequenceSchema);
module.exports = frequence;

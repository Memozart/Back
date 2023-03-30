const mongoose = require('mongoose');
const types = mongoose.Schema.Types;

const stepSchema = new mongoose.Schema(
  {
    info: {
      type: types.String,
      required: true,
      trim: true,
      unique: true,
    },
    step: {
      type: types.Number,
      required: true,
      trim: true,
      unique: true,
    },
    day: {
      type: types.Number,
      required: true,
      trim: true,
      unique: true,
    },
    order: {
      type: types.Number,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { versionKey: false }
);

stepSchema.pre('save', (next) => {
  next();
});

const Step = mongoose.model('Step', stepSchema);
module.exports = Step;
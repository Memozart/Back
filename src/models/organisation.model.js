const mongoose = require('mongoose');
const types = mongoose.Schema.Types;

const organisationSchema = new mongoose.Schema(
  {
    name: {
      type: types.String,
      required: true,
      trim: true,
    },
    users: [
      {
        type: types.ObjectId,
        required: true,
        trim: true,
        ref: 'User',
      },
    ],
    accountTypeName: {
      type: types.String,
      required: true,
      trim: true,
      default: 'personal'
    },
    accountUserLimit: {
      type: types.Number,
      required: true,
      trim: true,
      default: 1
    },
    accountTypeId: {
      type: types.Number,
      required: true,
      trim: true,
      default: 1
    },
    cards: [
      {
        type: types.ObjectId,
        required: true,
        trim: true,
        ref: 'Card',
      },
    ],
  },
  { versionKey: false }
);

organisationSchema.pre('save', (next) => {
  next();
});

const organisation = mongoose.model('Organisation', organisationSchema);
module.exports = organisation;

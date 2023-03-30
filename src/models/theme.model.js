const mongoose = require('mongoose');
const types = mongoose.Schema.Types;

const themeSchema = new mongoose.Schema(
  {
    name: {
      type: types.String,
      required: true,
      trim: true,
      unique: true,
    },
    icon: {
      type: types.String,
      required: true,
      trim: true,
      unique: true,
    },
    color1: {
      type: types.String,
      required: true,
      trim: true,
      unique: false,
    },
    color2: {
      type: types.String,
      required: true,
      trim: true,
      unique: false,
    },
    darkColor: {
      type: types.String,
      required: true,
      trim: true,
      unique: false,
    },
    darkShadow: {
      type: types.String,
      required: true,
      trim: true,
      unique: false,
    },
    lightShadow : {
      type: types.String,
      required: true,
      trim: true,
      unique: false,
    },
  },
  { versionKey: false }
);

themeSchema.pre('save', (next) => {
  next();
});

const Theme = mongoose.model('Theme', themeSchema);
module.exports = Theme;

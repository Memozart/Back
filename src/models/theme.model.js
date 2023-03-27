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
  },
  { versionKey: false }
);

themeSchema.pre('save', (next) => {
  next();
});

const Theme = mongoose.model('Theme', themeSchema);
module.exports = Theme;

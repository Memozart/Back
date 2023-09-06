const mongoose = require('mongoose');
const types = mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: types.String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: types.String,
      required: true,
      trim: true,
    },
    firstName: {
      type: types.String,
      required: true,
      trim: true,
    },
    lastName: {
      type: types.String,
      required: true,
      trim: true,
    },
    currentOrganisation: {
      type: types.ObjectId,
      required: true,
      trim: true,
      ref :'Organisation'
    },
    devices: [{
      type: types.Object,
      required: false,
      trim: true,
    }],
  },
  { versionKey: false }
);

userSchema.pre('save', (next) => {
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;

const mongoose = require('mongoose');
const types = mongoose.Schema.Types;
const { TYPE_ACCOUNT } = require('../utils/constants');

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
        trim: true,
        ref: 'User',
      },
    ],
    admin: [
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
      default: 'personal',
    },
    accountUserLimit: {
      type: types.Number,
      required: true,
      trim: true,
      default: 1,
    },
    accountTypeId: {
      type: types.Number,
      required: true,
      trim: true,
      default: 1,
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

organisationSchema.pre('findOneAndUpdate', async function (next) {
  const filter = this.getFilter();

  // récupérer l'id de l'organisation dans le filtre de la requête
  const orgaId = filter['_id'];

  // récupérer l'organisation complète depuis la base de données
  const orga = await organisation.findById(orgaId);

  if (orga.accountTypeId === TYPE_ACCOUNT.Personal.id) {
    throw new Error('Can add or remove user on personnal account');
  }

  const idCurrentUser = this.getFilter()['admin'];

  if (!orga.admin.includes(idCurrentUser)) {
    throw new Error('Current user is not admin');
  }

  // si la mise à jour concerne un ajout dans le champ "users"
  if (this.getUpdate().$push?.users) {
    const userIdToAdd = this.getUpdate().$push?.users;


    if (!userIdToAdd) {
      return next();
    }

    if (orga.admin.includes(userIdToAdd) || orga.users.includes(userIdToAdd)) {
      throw new Error('User already exists in organisation');
    }
    
    // Vérifier que le nombre d'utilisateurs ne dépasse pas la limite
    const totalUsersCount = orga.users.length + orga.admin.length + 1;

    if (totalUsersCount > orga.accountUserLimit) {
      throw new Error(
        `User limit reached ${orga.accountUserLimit} you can upgrade your account`
      );
    }
    return next();
  }

  return next();
});

const organisation = mongoose.model('Organisation', organisationSchema);
module.exports = organisation;

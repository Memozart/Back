const jwt = require('jsonwebtoken');
const config = require('../../src/config');
const { User, Card, Organisation, Theme, Step, Review } = require('../../src/models');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

let mongo;
const fakeData = {
  userId: '600000000000000000000000',
  themeId: '611111111111111111111111',
  organisationId: '644444444444444444444444',
  cardId: '655555555555555555555555',
  stepId: '666666666666666666666666',
  stepId2: '677777777777777777777777',
  reviewId: '688888888888888888888888',
  user: {
    _id: new mongoose.Types.ObjectId('600000000000000000000000'),
    email: 'test@test.fr',
    password: '$2a$10$B6xS9CT5m.I8CjjS78lP3Ovuh0QuW8doTHu0VorXGecKFfkoWmRH2', // testtest
    firstName: 'test',
    lastName: 'test',
    currentOrganisation: {
      _id: '644444444444444444444444',
      name: 'test',
    }
  },
  str_test : 'test'
};
/**
 * Démarrer l'instance MongoDB en mémoire avant les tests
 */
const startMongoMemory = async () => {
  mongo = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbName: 'test'
    }
  });
  const uri = mongo.getUri();
  await mongoose.connect(uri);
  createUser();
};

const createUser = async () => {
  await User.create(fakeData.user);
};

const setToken = async (time = '10s') => {
  return jwt.sign({ user: fakeData.user }, config.jwt.secret, {
    expiresIn: time,
  });
};

/**
 * Permets de supprimer tous les enregistrements
 * présent dans la base de données et de se déconnecter de la base
 */
const clearDatabaseAndDisconnect= async () => {
  await User.deleteMany();
  await mongoose.disconnect();
  await mongo.stop();
};

/**
 * Permets de supprimer tous les enregistrements
 * présent dans la base de données
 */
const clearDatabaseAndResetData = async () => {
  await clearAllDatas();
  await createReview();
  await initialiseDataset();
};


/**
 * Efface toutes les données 
 * en base de données
 */
const clearAllDatas = async () =>{
  await Theme.deleteMany();
  await Step.deleteMany();
  await Card.deleteMany();
  await Organisation.deleteMany();
  await Review.deleteMany();
};

/**
 * Créer un jeu de données de base
 * à injecter dans la base de données
 */
const initialiseDataset = async () => {
  await Theme.create({
    _id: fakeData.themeId,
    name: fakeData.str_test,
    color1: fakeData.str_test,
    color2: fakeData.str_test,
    darkColor: fakeData.str_test,
    darkShadow: fakeData.str_test,
    icon: fakeData.str_test,
    lightShadow: fakeData.str_test
  });
  await Step.create({
    _id: fakeData.stepId,
    day: '1',
    info: fakeData.str_test,
    order: 1,
    step: 1,
  });
  await Step.create({
    _id: fakeData.stepId2,
    day: '2',
    info: fakeData.str_test+'2',
    order: 2,
    step: 2,
  });
  await Card.create({
    _id: fakeData.cardId,
    answer: fakeData.str_test,
    question: fakeData.str_test,
    help: fakeData.str_test,
    theme: new mongoose.Types.ObjectId(fakeData.themeId),
  });
  await Organisation.create({
    _id: fakeData.organisationId,
    accountTypeId: 1,
    accountTypeName: fakeData.str_test,
    admin: [new mongoose.Types.ObjectId(fakeData.userId)],
    users: [],
    name: fakeData.str_test,
    accountUserLimit: 1,
    cards: [new mongoose.Types.ObjectId(fakeData.cardId)],
  });
};

/**
 * Créer une review en base avec une date
 * de présentation d'il y a 2 jours
 * @returns la review créée
 */
const createReview  = async ()=>{
  const twoDaysAgo = dayjs().utc().subtract(2, 'days').format('YYYY-MM-DD');
  await Review.create({
    _id: fakeData.reviewId,
    user: fakeData.userId,
    organisation: fakeData.organisationId,
    card: fakeData.cardId,
    theme: fakeData.themeId,
    nextPresentation: twoDaysAgo,
    step: fakeData.stepId
  });
};

module.exports = {
  startMongoMemory,
  setToken,
  clearDatabaseAndDisconnect,
  fakeData,
  initialiseDataset,
  createUser,
  createReview,
  clearDatabaseAndResetData
};

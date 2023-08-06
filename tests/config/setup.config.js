const jwt = require('jsonwebtoken');
const config = require('../../src/config');
const { User, Card, Organisation, Theme, Step } = require('../../src/models');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongo;
const fakeData = {
  userId: '6111a1111a1a11111a11a1aa',
  themeId: '6222a1111a1a11111a11a1aa',
  organisationId: '6333a1111a1a11111a11a1aa',
  cardId: '6444a1111a1a11111a11a1aa',
  stepId: '640f9ba0334e910d6ed41e67',
  user: {
    _id: new mongoose.Types.ObjectId('6111a1111a1a11111a11a1aa'),
    email: 'test@test.fr',
    password: '$2a$10$B6xS9CT5m.I8CjjS78lP3Ovuh0QuW8doTHu0VorXGecKFfkoWmRH2', // testtest
    firstName: 'test',
    lastName: 'test',
    currentOrganisation: {
      _id: '6333a1111a1a11111a11a1aa',
      name: 'test',
    }
  }
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

const clearDatabase = async () => {
  await User.deleteMany();
  await mongoose.disconnect();
  await mongo.stop();
};

const initialiseDataset = async () => {
  Theme.create({
    _id: fakeData.themeId,
    name: 'test',
    color1: 'test',
    color2: 'test',
    darkColor: 'test',
    darkShadow: 'test',
    icon: 'test',
    lightShadow: 'test'
  });
  Step.create({
    _id: fakeData.stepId,
    day: '1',
    info: 'test',
    order: 1,
    step: 1,
  });
  Card.create({
    _id: fakeData.cardId,
    answer: 'test',
    question: 'test',
    help: 'test',
    theme: new mongoose.Types.ObjectId(fakeData.themeId),
  });
  Organisation.create({
    _id: fakeData.organisationId,
    accountTypeId: 1,
    accountTypeName: 'test',
    admin: [new mongoose.Types.ObjectId(fakeData.userId)],
    users: [],
    name: 'test',
    accountUserLimit: 1,
    cards: [new mongoose.Types.ObjectId(fakeData.cardId)],
  });
};

module.exports = {
  startMongoMemory,
  setToken,
  clearDatabase,
  fakeData,
  initialiseDataset,
  createUser
};

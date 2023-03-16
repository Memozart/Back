const jwt = require('jsonwebtoken');
const config = require('../../src/config');
const { User, Card, Organisation, Theme, Step } = require('../../src/models');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const ObjectId = require('mongoose').Types.ObjectId;

const fakeData = {
  userId: '6111a1111a1a11111a11a1aa',
  themeId: '6222a1111a1a11111a11a1aa',
  organisationId: '6333a1111a1a11111a11a1aa',
  cardId: '6444a1111a1a11111a11a1aa',
  stepId: '640f9ba0334e910d6ed41e67',
};
/**
 * Démarrer l'instance MongoDB en mémoire avant les tests
 */
startMongoMemory = async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
  const userObjectId = new mongoose.Types.ObjectId(fakeData.userId);
  await User.create({
    _id: userObjectId,
    email: 'test@test.fr',
    password: 'test',
    firstName: 'test',
    lastName: 'test',
    currentOrganisation: new ObjectId(fakeData.organisation),
  });
};

setToken = async () => {
  return jwt.sign({ id: fakeData.userId }, config.jwt.secret, {
    expiresIn: '10s',
  });
};

clearDatabase = async () => {
  await User.deleteMany();
  await mongoose.disconnect();
  await mongo.stop();
};

initialiseDataset= async () => {
  Theme.create({ _id: fakeData.themeId, name: 'test' });
  Step.create({
    _id: fakeData.stepId,
    day: '1',
    info: 'test',
    order: 1,
    step: 'test',
  });
  Card.create({
    _id: fakeData.cardId,
    answer: 'test',
    question: 'test',
    help: 'test',
    theme: new mongoose.Types.ObjectId(fakeData.themeId),
  });
  Organisation.create({
    _id : fakeData.organisationId,
    accountTypeId : 1,
    accountTypeName : "test",
    admin : [new mongoose.Types.ObjectId(fakeData.userId)],
    users :[],
    name :'test',
    accountUserLimit : 1,
    cards : [new mongoose.Types.ObjectId(fakeData.cardId)]
  })
};

module.exports = {
  startMongoMemory,
  setToken,
  clearDatabase,
  fakeData,
  initialiseDataset
};

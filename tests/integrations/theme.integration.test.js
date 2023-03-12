const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Theme } = require('../../src/models');
const request = require('supertest');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');
const config = require('../../src/config');
const { User } = require('../../src/models');
const ObjectId = require('mongoose').Types.ObjectId;

let mongo;
const themeId1 = '6001c3324b3a98890c17c0ac';
const themeId2 = '6002c3324b3a98890c17c0ac';
const userId = '6111a1111a1a11111a11a1aa';

describe('Integration: fetch one theme by id', () => {
  let token;

  // Démarrer l'instance MongoDB en mémoire avant les tests
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);

    const userObjectId = new mongoose.Types.ObjectId(userId);
    await User.create({ _id: userObjectId, email: 'test@test.fr', password: 'test', firstName: 'test', lastName: 'test', currentOrganisation : new ObjectId('6111a1111a1a11111a11a1aa')});
  });

  // Ajouter un élément à chaque test
  beforeEach(async () => {
    const themeId = new mongoose.Types.ObjectId(themeId1);
    await Theme.create({ _id: themeId, name: 'mon theme' });
    token = jwt.sign({ id: userId }, config.jwt.secret, {
      expiresIn: '10s',
    });
  });

  // Supprimer toutes les données après chaque test
  afterEach(async () => {
    await Theme.deleteMany();
  });

  // Arrêter l'instance MongoDB après les tests
  afterAll(async () => {
    await User.deleteMany();
    await mongoose.disconnect();
    await mongo.stop();
  });

  test('Integration- should be return one theme', async () => {
    // arrange


    // act
    const response = await request(app)
      .get(`/api/themes/${themeId1}`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        return response;
      });

    const { body: result } = response;

    // assert
    expect(response.statusCode).toEqual(200);
    expect(result.body).toEqual({ _id: themeId1, name: 'mon theme' });
  });
});

describe('Integration: fetch all theme', () => {
  // Démarrer l'instance MongoDB en mémoire avant les tests
  let token;
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);

    const userObjectId = new mongoose.Types.ObjectId(userId);
    await User.create({ _id: userObjectId, email: 'test@test.fr', password: 'test', firstName: 'test', lastName: 'test', currentOrganisation : new ObjectId('6111a1111a1a11111a11a1aa') });
  });

  // Ajouter un élément à chaque test
  beforeEach(async () => {
    const _id1 = new mongoose.Types.ObjectId(themeId1);
    const _id2 = new mongoose.Types.ObjectId(themeId2);
    await Theme.insertMany([{ _id: _id1, name: 'mon theme 1' },{ _id: _id2, name: 'mon theme 2' }]);
    token = jwt.sign({ id: userId }, config.jwt.secret, {
      expiresIn: '10s',
    });
  });

  // Supprimer toutes les données après chaque test
  afterEach(async () => {
    await Theme.deleteMany();
  });

  // Arrêter l'instance MongoDB après les tests
  afterAll(async () => {
    await User.deleteMany();
    await mongoose.disconnect();
    await mongo.stop();
  });

  test('Integration- should be return all theme', async () => {
    // arrange

    // act
    const response = await request(app)
      .get('/api/themes')
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        return response;
      });

    const { body: result } = response;

    // assert
    expect(response.statusCode).toEqual(200);
    expect(result.body).toEqual([{ _id: themeId1, name: 'mon theme 1' },{ _id: themeId2, name: 'mon theme 2' }]);
  });
});

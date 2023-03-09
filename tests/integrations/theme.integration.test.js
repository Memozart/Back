const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Theme } = require('../../src/models');
const request = require('supertest');
const app = require('../../src/app');

let mongo;
const themeId1 = '6001c3324b3a98890c17c0ac';
const themeId2 = '6002c3324b3a98890c17c0ac';

describe('Integration: fetch one theme by id', () => {
  // Démarrer l'instance MongoDB en mémoire avant les tests
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
  });

  // Ajouter un élément à chaque test
  beforeEach(async () => {
    const themeId = new mongoose.Types.ObjectId(themeId1);
    await Theme.create({ _id: themeId, name: 'mon theme' });
  });

  // Supprimer toutes les données après chaque test
  afterEach(async () => {
    await Theme.deleteMany();
  });

  // Arrêter l'instance MongoDB après les tests
  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  test('Integration- should be return one theme', async () => {
    // arrange


    // act
    const response = await request(app)
      .get(`/api/themes/${themeId1}`)
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

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
  });

  // Ajouter un élément à chaque test
  beforeEach(async () => {
    const _id1 = new mongoose.Types.ObjectId(themeId1);
    const _id2 = new mongoose.Types.ObjectId(themeId2);
    await Theme.insertMany([{ _id: _id1, name: 'mon theme 1' },{ _id: _id2, name: 'mon theme 2' }]);
  });

  // Supprimer toutes les données après chaque test
  afterEach(async () => {
    await Theme.deleteMany();
  });

  // Arrêter l'instance MongoDB après les tests
  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  test('Integration- should be return all theme', async () => {
    // arrange

    // act
    const response = await request(app)
      .get('/api/themes')
      .then((response) => {
        return response;
      });

    const { body: result } = response;

    // assert
    expect(response.statusCode).toEqual(200);
    expect(result.body).toEqual([{ _id: themeId1, name: 'mon theme 1' },{ _id: themeId2, name: 'mon theme 2' }]);
  });
});

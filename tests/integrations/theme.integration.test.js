const mongoose = require('mongoose');
const { Theme } = require('../../src/models');
const request = require('supertest');
const app = require('../../src/app');
const setup = require('../config/setup.config');

let mongo;
const themeId1 = '6001c3324b3a98890c17c0ac';
const themeId2 = '6002c3324b3a98890c17c0ac';

describe('Integration: fetch one theme by id', () => {
  let token;

  //#region SETUP TEST
  beforeAll(async () => {
    await setup.startMongoMemory();  
  });


  beforeEach(async () => {
    const themeId = new mongoose.Types.ObjectId(themeId1);
    await Theme.create({ _id: themeId, name: 'mon theme' });
    token = await setup.setToken();  
  });


  afterEach(async () => {
    await Theme.deleteMany();
  });
  //#endregion

  afterAll(async () => {
    await setup.clearDatabase();
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
  let token;
  
  // Démarrer l'instance MongoDB en mémoire avant les tests
  beforeAll(async () => {
    await setup.startMongoMemory();  
  });

  // Ajouter un élément à chaque test
  beforeEach(async () => {
    const _id1 = new mongoose.Types.ObjectId(themeId1);
    const _id2 = new mongoose.Types.ObjectId(themeId2);
    await Theme.insertMany([{ _id: _id1, name: 'mon theme 1' },{ _id: _id2, name: 'mon theme 2' }]);
    token = await setup.setToken();  
  });

  // Supprimer toutes les données après chaque test
  afterEach(async () => {
    await Theme.deleteMany();
  });

  // Arrêter l'instance MongoDB après les tests
  afterAll(async () => {
    await setup.clearDatabase();
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

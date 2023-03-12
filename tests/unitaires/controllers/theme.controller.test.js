const themeService = require('../../../src/services/theme.service');
const request = require('supertest');
const app = require('../../../src/app');
const jwt = require('jsonwebtoken');
const config = require('../../../src/config');
const { User } = require('../../../src/models');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const ObjectId = require('mongoose').Types.ObjectId;

jest.mock('../../../src/services/theme.service', () => ({
  get: jest.fn(),
  getAll: jest.fn(),
}));
const userId = '6111a1111a1a11111a11a1aa';
let mongo;

describe('theme controller - get', () => {
  let spyGet;
  let token;

  /**
   *  Démarrer l'instance MongoDB en mémoire avant les tests
   */
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);

    spyGet = jest
      .spyOn(themeService, 'get')
      .mockReturnValue({ _id: '1', name: 'Test theme' });

    const userObjectId = new mongoose.Types.ObjectId(userId);
    await User.create({ _id: userObjectId, email: 'test@test.fr', password: 'test', firstName: 'test', lastName: 'test', currentOrganisation : new ObjectId('6111a1111a1a11111a11a1aa') });
  });

  // Ajouter un élément à chaque test
  beforeEach(async () => {
    token = jwt.sign({ id: userId }, config.jwt.secret, {
      expiresIn: '10s',
    });
  });

  // Arrêter l'instance MongoDB après les tests
  afterAll(async () => {
    await User.deleteMany();
    await mongoose.disconnect();
    await mongo.stop();
  });

  test('should be return one theme', async () => {
    // arrange
    const idParams = '1';

    //act
    const response = await request(app)
      .get(`/api/themes/${idParams}`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        return response;
      });
    const { body: result } = response;

    //assert
    expect(spyGet).toHaveBeenCalledWith(idParams);
    expect(response.statusCode).toEqual(200);
    expect(result.body).toEqual({ _id: '1', name: 'Test theme' });
  });
});

describe('theme controller - get all', () => {
  let spyGetAll;
  let token;


  /**
   *  Démarrer l'instance MongoDB en mémoire avant les tests
   */
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);

    spyGetAll = jest.spyOn(themeService, 'getAll').mockReturnValue([
      { _id: '1', name: 'Test theme 1' },
      { _id: '2', name: 'Test theme 2' },
    ]);

    const userObjectId = new mongoose.Types.ObjectId(userId);
    await User.create({ _id: userObjectId, email: 'test@test.fr', password: 'test', firstName: 'test', lastName: 'test', currentOrganisation : new ObjectId('6111a1111a1a11111a11a1aa') });
  });

  // Ajouter un élément à chaque test
  beforeEach(async () => {
    token = jwt.sign({ id: userId }, config.jwt.secret, {
      expiresIn: '10s',
    });
  });

  // Arrêter l'instance MongoDB après les tests
  afterAll(async () => {
    await User.deleteMany();
    await mongoose.disconnect();
    await mongo.stop();
  });

  test('should be return all themes', async () => {
    // arrange

    //act
    const { body: result } = await request(app)
      .get('/api/themes')
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        return response;
      });

    //assert
    expect(spyGetAll).toHaveBeenCalled();
    expect(result.body).toEqual([
      { _id: '1', name: 'Test theme 1' },
      { _id: '2', name: 'Test theme 2' },
    ]);
  });
});

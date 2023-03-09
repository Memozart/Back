const themeService = require('../../../src/services/theme.services');
const request = require('supertest');
const app = require('../../../src/app');

jest.mock('../../../src/services/theme.services', () => ({
  get: jest.fn(),
  getAll: jest.fn(),
}));

describe('theme controller - get', () => {
  let spyGet;

  /**
   * Mock de la méthode get du service
   * et retourne un theme
   */
  beforeAll(async () => {
    spyGet = jest
      .spyOn(themeService, 'get')
      .mockReturnValue({ _id: '1', name: 'Test theme' });
  });

  test('should be return one theme', async () => {
    // arrange
    const idParams = '1';

    //act
    const response = await request(app)
      .get(`/api/theme/${idParams}`)
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

  /**
   * Mock de la méthode get du service
   * et retourne un tableau de theme
   */
  beforeAll(async () => {
    spyGetAll = jest.spyOn(themeService, 'getAll').mockReturnValue([
      { _id: '1', name: 'Test theme 1' },
      { _id: '2', name: 'Test theme 2' },
    ]);
  });

  test('should be return all themes', async () => {
    // arrange

    //act
    const { body: result } = await request(app)
      .get('/api/theme')
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

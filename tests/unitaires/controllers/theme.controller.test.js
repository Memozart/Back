// const themeService = require('../../../src/services/theme.service');
// const request = require('supertest');
// const app = require('../../../src/app');
// const setup = require('../../config/setup.config');

// jest.mock('../../../src/services/theme.service', () => ({
//   get: jest.fn(),
//   getAll: jest.fn(),
// }));

describe('Sample Test', () => {
  it('should test that true === true', () => {
    expect(true).toBe(true);
  });
});

// describe('theme controller - get', () => {
//   let spyGet;
//   let token;
//   //#region SETUP TEST
//   beforeAll(async () => {
//     await setup.startMongoMemory();
//     spyGet = jest
//       .spyOn(themeService, 'get')
//       .mockReturnValue({ _id: '1', name: 'Test theme' });
//   });

//   beforeEach(async () => {
//     token = await setup.setToken();
//   });
  
//   afterAll(async () => {
//     await setup.clearDatabaseAndDisconnect();
//   });
//   //#endregion
//   test('should be return one theme', async () => {
//     // arrange
//     const idParams = '1';

//     //act
//     const response = await request(app)
//       .get(`/api/themes/${idParams}`)
//       .set('Authorization', `Bearer ${token}`)
//       .then((response) => {
//         return response;
//       });
//     const { body: result } = response;

//     //assert
//     expect(spyGet).toHaveBeenCalledWith(idParams);
//     expect(response.statusCode).toEqual(200);
//     expect(result.body).toEqual({ _id: '1', name: 'Test theme' });
//   });
// });

// describe('theme controller - get all', () => {
//   let spyGetAll;
//   let token;


//   /**
//    *  Démarrer l'instance MongoDB en mémoire avant les tests
//    */
//   beforeAll(async () => {
//     await setup.startMongoMemory();

//     spyGetAll = jest.spyOn(themeService, 'getAll').mockReturnValue([
//       { _id: '1', name: 'Test theme 1' },
//       { _id: '2', name: 'Test theme 2' },
//     ]);
//   });

//   // Ajouter un élément à chaque test
//   beforeEach(async () => {
//     token = await setup.setToken();
//   });

//   // Arrêter l'instance MongoDB après les tests
//   afterAll(async () => {
//     await setup.clearDatabaseAndDisconnect();
//   });

//   test('should be return all themes', async () => {
//     // arrange

//     //act
//     const { body: result } = await request(app)
//       .get('/api/themes')
//       .set('Authorization', `Bearer ${token}`)
//       .then((response) => {
//         return response;
//       });

//     //assert
//     expect(spyGetAll).toHaveBeenCalled();
//     expect(result.body).toEqual([
//       { _id: '1', name: 'Test theme 1' },
//       { _id: '2', name: 'Test theme 2' },
//     ]);
//   });
// });

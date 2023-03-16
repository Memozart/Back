const setup = require('../../config/setup.config');
const reviewService = require('../../../src/services/review.service');
const { Review } = require('../../../src/models');
const { ERROR_MESSAGE } = require('../../../src/utils/constants');
const moment = require('moment-timezone');
const mongoose = require('mongoose');

// jest.mock('../../../src/models/review.model.js', () => ({
//   // Mock des méthode du models
//   find: jest.fn(),
//   findById: jest.fn(),
// }));

describe('review service - create review', () => {
  let token;
  //#region SETUP TEST
  beforeAll(async () => {
    await setup.startMongoMemory();
    await setup.initialiseDataset();
  });

  beforeEach(async () => {
    token = await setup.setToken();
  });


  afterAll(async () => {
    await setup.clearDatabase();
  });
  //#endregion

  test('throw error if params is empty', async () => {
    //act
    const methodResult = async () =>
      await reviewService.createReview(null, null, null);
    const spy = jest.spyOn(Review, 'create');

    //assert
    expect(spy).not.toHaveBeenCalled();
    await expect(methodResult).rejects.toThrow(ERROR_MESSAGE.PARAMETER_EMPTY);
  });

  test('throw error if fist Presentation date is smaller than today', async () => {
    //arrange
    const twoDaysAgo = moment().subtract(2, 'days').format('DD/MM/YYYY');
    const spy = jest.spyOn(Review, 'create');
    //act
    const methodResult = async () =>
      await reviewService.createReview(
        setup.fakeData.userId,
        setup.fakeData.organisationId,
        setup.fakeData.cardId,
        setup.fakeData.themeId,
        twoDaysAgo
      );

    //assert
    expect(spy).not.toHaveBeenCalled();
    await expect(methodResult).rejects.toThrow(
      'The first presentation date cannot be before today!'
    );
  });

  test('should be success record review with tomorrow at midnight', async () => {
    //arrange
    const today = moment().startOf('day');
    const expectedDate = today
      .clone()
      .add(1, 'days')
      .set({ hour: 0, minute: 0, second: 0 });
    const spy = jest.spyOn(Review, 'create');

    //act
    const review = await reviewService.createReview(
      setup.fakeData.userId,
      setup.fakeData.organisationId,
      setup.fakeData.cardId,
      setup.fakeData.themeId,
    );

    //assert
    expect(spy).toHaveBeenCalled();
    await expect(new mongoose.Types.ObjectId(setup.fakeData.userId)).toEqual(review.user);
    await expect(new mongoose.Types.ObjectId(setup.fakeData.organisationId)).toEqual(review.organisation);
    await expect(new mongoose.Types.ObjectId(setup.fakeData.cardId)).toEqual(review.card);
    await expect(new mongoose.Types.ObjectId(setup.fakeData.themeId)).toEqual(review.theme);
    await expect(new mongoose.Types.ObjectId(setup.fakeData.stepId)).toEqual(review.step);
    await expect(expectedDate.format("DD/MM/YYYY hh:mm:ss")).toEqual(moment(review.nextPresentation).format("DD/MM/YYYY hh:mm:ss"));
  });

  test('should be success record review with date presentation at after tomorrow at midnight', async () => {
    //arrange
    const expectedDate = moment()
      .startOf('day')
      .add(2, 'day')
      .set({ hour: 0, minute: 0, second: 0 })
    const formatDate = expectedDate.format('DD/MM/YYYY');
    const spy = jest.spyOn(Review, 'create');

    //act
    const review = await reviewService.createReview(
      setup.fakeData.userId,
      setup.fakeData.organisationId,
      setup.fakeData.cardId,
      setup.fakeData.themeId,
      formatDate
    );

    //assert
    expect(spy).toHaveBeenCalled();
    await expect(new mongoose.Types.ObjectId(setup.fakeData.userId)).toEqual(review.user);
    await expect(new mongoose.Types.ObjectId(setup.fakeData.organisationId)).toEqual(review.organisation);
    await expect(new mongoose.Types.ObjectId(setup.fakeData.cardId)).toEqual(review.card);
    await expect(new mongoose.Types.ObjectId(setup.fakeData.themeId)).toEqual(review.theme);
    await expect(new mongoose.Types.ObjectId(setup.fakeData.stepId)).toEqual(review.step);
    await expect(expectedDate.format("DD/MM/YYYY hh:mm:ss")).toEqual(moment(review.nextPresentation).format("DD/MM/YYYY hh:mm:ss"));
  });
});

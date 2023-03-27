const setup = require('../../config/setup.config');
const reviewService = require('../../../src/services/review.service');
const { Review } = require('../../../src/models');
const { ERROR_MESSAGE } = require('../../../src/utils/constants');
const dayjs = require('dayjs');
const mongoose = require('mongoose');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);


describe('review service - create review', () => {
  //#region SETUP TEST
  beforeAll(async () => {
    await setup.startMongoMemory();
    await setup.initialiseDataset();
  });

  beforeEach(async () => {
    await setup.setToken();
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
    const twoDaysAgo = dayjs().utc().subtract(2, 'days').format('YYYY-MM-DD');
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
    const expectedDate = dayjs().utc().add(1, 'day').format('DD/MM/YYYY') + ' 00:00:00';
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
    await expect(expectedDate).toEqual(dayjs.utc(review.nextPresentation).format('DD/MM/YYYY HH:mm:ss'));
  });

  test('should be success record review with date presentation at after tomorrow at midnight', async () => {
    //arrange
    const now = dayjs().utc().add(1, 'day');
    const formatDate = now.format('YYYY-MM-DD');
    const expectedDate = now.format('DD/MM/YYYY') + ' 00:00:00';
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
    await expect(expectedDate).toEqual(dayjs.utc(review.nextPresentation).format('DD/MM/YYYY HH:mm:ss'));
  });
});

const assert = require('assert');
const { Given, When, Then, Before } = require('@cucumber/cucumber');

const { setToken, fakeData, clearDatabaseAndResetData } = require('../../config/setup.config');

const request = require('supertest');
const app = require('../../../src/app');
var { setDefaultTimeout } = require('@cucumber/cucumber');
setDefaultTimeout(60 * 1000);


//#region  INITIALISATION AND CONGIGURATION
Before(async () => {
  await clearDatabaseAndResetData();
}),
//#endregion

//#region COMMON STEP
Given('un utilisateur à une carte à réviser', async function () {
  this.token = await setToken('1m');
  this.reviewId = fakeData.reviewId;
});

Then('il recoit un statut réponse qui dit {string}', async function (string) {
  const result = String(this.body.statusResponse.success) === string;
  assert.ok(result);
});
//#endregion

//#region Un utilisateur va réviser une carte et donner une bonne réponse

When('il donne la bonne réponse', async function () {

  const userResponse = {
    answer: fakeData.str_test,
    idReview: this.reviewId
  };
  this.token = await setToken('1m');

  const { status, body } = await request(app)
    .post('/api/reviews')
    .send(userResponse)
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${this.token}`)
    .then((response) => {
      return response;
    });

  this.status = status;
  this.body = body?.body;
});

When('il donne la mauvaise réponse', async function () {
  const userResponse = {
    answer: '',
    idReview: this.reviewId
  };
  this.token = await setToken('1m');

  const { status, body } = await request(app)
    .post('/api/reviews')
    .send(userResponse)
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${this.token}`)
    .then((response) => {
      return response;
    });

  this.status = status;
  this.body = body?.body;
});

//#endregion

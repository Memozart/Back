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
Then('la nouvelle présentation devrait avoir lieu dans {int} jours', async function (int) {
  const result = this.body .statusResponse?.feedback?.dayNextPresentation;
  assert.equal(int, result);
});
//#endregion

//#region Un utilisateur va réviser une carte à l'étape 1 et va donner une bonne réponse
Given('un utilisateur à une carte à réviser à la premiere step', async function () {
  this.reviewId = fakeData.firstReviewId;
});

When('il donne la bonne réponse à l\'algorithme', async function () {

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
//#endregion

//#region Un utilisateur va réviser une carte à l'étape 2 et est va donner une mauvaise réponse
Given('un utilisateur à une carte à réviser à la seconde step', async function () {
  this.reviewId = fakeData.secondReviewId;
});

When('il donne une mauvaise réponse à l\'algorithme', async function () {
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

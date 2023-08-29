const assert = require('assert');
const { Given, When, Then, BeforeAll, Before, AfterAll } = require('@cucumber/cucumber');
const mongoose = require('mongoose');
const chai = require('chai');
const {
  setToken,
  fakeData,
  clearDatabaseAndResetData,
  startMongoMemory,
  clearDatabaseAndDisconnect,
} = require('../../config/setup.config');
const expect = chai.expect;
const request = require('supertest');
const app = require('../../../src/app');

var { setDefaultTimeout } = require('@cucumber/cucumber');
setDefaultTimeout(60 * 1000);

//#region  INITIALISATION AND CONGIGURATION
BeforeAll(async () => {
  await startMongoMemory();
});

Before(async () => {
  await clearDatabaseAndResetData();
});

AfterAll(async () => {
  await clearDatabaseAndDisconnect();
});
//#endregion

//#region COMMON STEP
Then('il recoit un code success {int}', async function (expectedAnswer) {
  assert.strictEqual(this.status, expectedAnswer);
});

Then('un message qui dit {string}', async function (expectedAnswer) {
  expect(this.message).be.contains(expectedAnswer);
});

//#endregion

//#region Un utilisateur va créer une carte avec des données valides
Given('un utilisateur créée une carte', async function () {
  // Write code here that turns the phrase above into concrete actions
  this.token = await setToken('1m');

  this.card = {
    question: 'un utilisateur créée une carte',
    answer: 'un utilisateur créée une carte',
    help: 'un utilisateur créée une carte',
    theme: new mongoose.Types.ObjectId(fakeData.firstThemeId),
  };
});

When('il la valide et envoi la carte créée', async function () {
  const { status, body } = await request(app)
    .post('/api/cards')
    .send(this.card)
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${this.token}`)
    .then((response) => {
      return response;
    });
  this.status = status;
  this.message = body?.message;
});
//#endregion

//#region Un utilisateur va modifier une carte avec des données valides
Given('un utilisateur modifie une carte', async function () {
  this.token = await setToken('1m');
  this.cardUpdate = {
    question: 'question modifiée',
    help: 'aide modifiée',
    answer: 'réponse modifiée',
    theme: new mongoose.Types.ObjectId(fakeData.firstThemeId),
  };
});

When('il la valide et envoi la carte modifiée', async function () {
  const { status, body } = await request(app)
    .put(`/api/cards/${fakeData.cardId}`)
    .send(this.cardUpdate)
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${this.token}`)
    .then((response) => {
      return response;
    });
  this.status = status;
  this.message = body?.message;
});
//#endregion

//#region Un utilisateur supprime une carte
Given('un utilisateur supprime une carte', async function () {
  this.token = await setToken('1m');

  this.cardIdToBeDelete = fakeData.cardId;
});

When('il la valide et envoi la carte à supprimer', async function () {
  const { status, body } = await request(app)
    .delete(`/api/cards/${this.cardIdToBeDelete}`)
    .set('Authorization', `Bearer ${this.token}`)
    .then((response) => {
      return response;
    });

  this.status = status;
  this.message = body?.message;
});
//#endregion

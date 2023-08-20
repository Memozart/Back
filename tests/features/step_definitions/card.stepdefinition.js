const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const HTTP_REQUEST = require('../../config/http.config');
const chai = require('chai');
const { setToken, fakeData } = require('../../config/setup.config');
const expect = chai.expect;





//#region Un utilisateur va créer une carte avec des données valides
Given('un utilisateur créée une carte', async function () {
  // Write code here that turns the phrase above into concrete actions
  this.token = await setToken('1m');


  this.card = {
    'question': 'test-card-perso-1',
    'answer': 'good',
    'help': 'you don\'t need helps !',
    'theme': '640b15c689e35929e7675db2'
  };
});

When('il la valide et envoi la carte créée', async function () {
  // Write code here that turns the phrase above into concrete actions
  const { status, body } = await HTTP_REQUEST.HTTP_POST('http://localhost:3000/api/cards', this.card, this.token);

  this.status = status;
  this.message = body?.message;
});
//#endregion

//#region Un utilisateur va modifier une carte avec des données valides
Given('un utilisateur modifie une carte', async function () {
  this.token = await setToken('1m');
  const { body } = await HTTP_REQUEST.HTTP_GET(`http://localhost:3000/api/cards/${fakeData.cardId}`, this.token);
  const { body: cardOriginal } = body;
  this.cardUpdate = { ...cardOriginal, answer: 'réponse modifié', question: 'question modifié', help: 'aide modifié', _id: undefined };
  delete this.cardUpdate._id;
});

When('il la valide et envoi la carte modifiée', async function () {
  const { status, body } = await HTTP_REQUEST.HTTP_PUT(`http://localhost:3000/api/cards/${fakeData.cardId}`, this.cardUpdate, this.token);
  this.status = status;
  this.message = body?.message;
});
//#endregion

//#region Un utilisateur supprime une carte 
Given('un utilisateur supprime une carte', async function () {
  // on va ajouter une carte pour qu'il n'y ai aucune dépendance
  this.token = await setToken('1m');

  this.card = {
    'question': 'card-a-supprimer',
    'answer': 'a supprimer',
    'help': 'a supprimer',
    'theme': '640b15c689e35929e7675db2'
  };
  const { body } = await HTTP_REQUEST.HTTP_POST('http://localhost:3000/api/cards', this.card, this.token);

  // on récupère la carte précèdemment enregistrer avec ces informations (son id)
  this.cardToBeDelete = body.body;
});


When('il la valide et envoi la carte à supprimer', async function () {
  const { status, body } = await HTTP_REQUEST.HTTP_DELETE(`http://localhost:3000/api/cards/${this.cardToBeDelete._id}`, this.token);

  this.status = status;
  this.message = body?.message;
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
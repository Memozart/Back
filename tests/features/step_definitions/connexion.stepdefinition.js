const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../../../src/app');
var { setDefaultTimeout } = require('@cucumber/cucumber');
setDefaultTimeout(60 * 1000);



Given('un utilisateur ne renseigne pas son email', async function () {
  // Write code here that turns the phrase above into concrete actions
  this.login = {
    'email': '',
    'password': ''
  };
});

When('il tente de se connecter', async function () {
  const { status, body } = await request(app)
    .post('/api/auth/login')
    .send(this.card)
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${this.token}`)
    .then((response) => {
      return response;
    });
  this.status = status;
  this.message = body?.message;
});


Then('il reçoit une réponse avec un code erreur {int}', async function (expectedAnswer) {
  assert.strictEqual(this.status, expectedAnswer);
});


Then('une réponse avec un message {string}', async function (expectedAnswer) {
  expect(this.message).be.contains(expectedAnswer);
});

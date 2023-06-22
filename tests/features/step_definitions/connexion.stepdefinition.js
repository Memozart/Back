const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const HTTP_POST  = require('../../config/http.config');
const chai = require('chai');
const expect = chai.expect;



Given('un utilisateur ne renseigne pas son email', async function () {
  // Write code here that turns the phrase above into concrete actions
  this.login = {
    'email': '',
    'password': ''
  };
});

When('il tente de se connecter', async function () {
  // Write code here that turns the phrase above into concrete actions
  const {status, body} = await HTTP_POST('http://localhost:3000/api/auth/login', this.login);
  this.status = status;
  this.message  = body?.message;
});


Then('il reçoit une réponse avec un code erreur {int}', async function (expectedAnswer) {
  assert.strictEqual(this.status, expectedAnswer);
});


Then('il reçoit une réponse avec un message {string}', async function (expectedAnswer) {
  expect(this.message).be.contains(expectedAnswer);
});

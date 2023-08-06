const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const HTTP_POST = require('../../config/http.config');
const chai = require('chai');
const { setToken } = require('../../config/setup.config');
const expect = chai.expect;




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

When('il la valide et l\'envoi', async function () {
  // Write code here that turns the phrase above into concrete actions
  const {status, body} = await HTTP_POST('http://localhost:3000/api/cards', this.card, this.token); 

  this.status = status;
  this.message = body?.message;
});


Then('il recoit un code success {int}', async function (expectedAnswer) {
  assert.strictEqual(this.status, expectedAnswer);
});


Then('un message qui dit {string}', async function (expectedAnswer) {
  expect(this.message).be.contains(expectedAnswer);
});

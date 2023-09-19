const assert = require('assert');
const { Given, When, Then, Before } = require('@cucumber/cucumber');

const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../../../src/app');
var { setDefaultTimeout } = require('@cucumber/cucumber');
const { fakeData, clearDatabaseAndResetData, setToken } = require('../../config/setup.config');
const { Organisation, Review, User } = require('../../../src/models');
setDefaultTimeout(60 * 1000);



//#region  INITIALISATION AND CONGIGURATION
Before(async () => {
  await clearDatabaseAndResetData();
}),
//#endregion

//#region COMMON STEP

Then('il reçoit une réponse avec un code {int}', async function (expectedAnswer) {
  assert.strictEqual(this.status, expectedAnswer);
});

Then('il n\'existe plus aucune données en base sur lui', async function () {
  
  // si toutes les organisations avec users ou admin l'ont bien le supprimer
  const orgas =  await Organisation.find({
    $or: [{ users: fakeData.userId }, { admin: fakeData.userId }]
  });

  // s'il n'existe aucune reviews avec cette utilisateur
  const reviews = await Review.find({
    user : fakeData.userId
  });

  // suppression de l'utilisateur
  const user = await User.findById(fakeData.userId);

  expect(orgas,'organisations non vide').to.be.empty;
  expect(reviews, 'reviews non vide').to.be.empty;
  expect(user, 'users non vide').to.be.null;
});
//#endregion

//#region Un utilisateur tente de se connecter sans email
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
    .send(this.login)
    .set('Content-Type', 'application/json')
    .then((response) => {
      return response;
    });
  this.status = status;
  this.message = body?.message;
});
//#endregion

//#region Un utilisateur tente de se connecter avec les bons credentials
Given('un utilisateur souhaite s\'authentifier', async function () {
  // Write code here that turns the phrase above into concrete actions
  this.login = {
    'email': fakeData.user.email,
    'password': 'testtest'
  };
});

When('il tente de se connecter avec les bons credentials', async function () {
  const { status, body } = await request(app)
    .post('/api/auth/login')
    .send(this.login)
    .set('Content-Type', 'application/json')
    .then((response) => {
      return response;
    });
  this.status = status;
  this.message = body?.message;
});
//#endregion

//#region Un utilisateur supprime son compte avec seulement compte personnel => succès
When('il souhaite supprimer son compte et qu\'il n\'a qu\'un compte personnel', async function () {
  // on va ajouter un adùinistrateur dans l'organisation où se trouve l'utilisateur
  this.token = await setToken('1m');
  const { status, body } = await request(app)
    .delete('/api/users')
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${this.token}`)
    .then((response) => {
      return response;
    });

  this.status = status;
  this.message = body?.message;
});

//#endregion

//#region Quand il souhaite supprimer son compte avec des organisations avec plusieurs admin
When('il souhaite supprimer son compte avec des organisations avec plusieurs admin', async function () {
  await Organisation.updateMany(
    { admin : fakeData.userId }, 
    { 
      $push: { 
        admin: fakeData.secondUserId ,
        users : fakeData.secondUserId
      },
      $set: { 
        accountTypeName: 'new',
        accountTypeId : 3,
        accountUserLimit : 100
      }  
    }
  );

  // on va ajouter un adùinistrateur dans l'organisation où se trouve l'utilisateur
  this.token = await setToken('1m');
  const { status, body } = await request(app)
    .delete('/api/users')
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${this.token}`)
    .then((response) => {
      return response;
    });

  this.status = status;
  this.message = body?.message;
});
//#endregion

//#region Quand il souhaite supprimer son compte avec une organisations ou il est le seul admin 
When('il souhaite supprimer son compte avec une organisations ou il est le seul admin',
  async function () {
    await Organisation.create({
      accountTypeId : 3,
      accountTypeName : fakeData.str_test,
      accountUserLimit : 100,
      admin : [fakeData.userId],
      users: [fakeData.secondUserId],
      cards : [fakeData.cardId],
      havePaid : true,
      siren : fakeData.str_test,
      name : fakeData.str_test
    });
  
    // on va ajouter un adùinistrateur dans l'organisation où se trouve l'utilisateur
    this.token = await setToken('1m');
    const { status, body } = await request(app)
      .delete('/api/users')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.token}`)
      .then((response) => {
        return response;
      });
  
    this.status = status;
    this.message = body?.message;
  });

Then('un message qui dit contient {string}', async function (string) {
  // Write code here that turns the phrase above into concrete actions
  expect(this.message).to.be.contain(string);
});
//#endregion
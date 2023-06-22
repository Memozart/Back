const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

function isItFriday(today) {
  if (today === 'Friday') {
    return 'TGIF';
  } else {
    return 'Nope';
  }
}

Given('aujourd\'hui est {string}', function (givenDay) {
  this.today = givenDay;
});

When('je demande si on est vendredi', function () {
  this.actualAnswer = isItFriday(this.today);
});

Then('je devrais avoir {string}', function (expectedAnswer) {
  assert.strictEqual(this.actualAnswer, expectedAnswer);
});

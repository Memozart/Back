const cardService = require('../../../src/services/card.service');
const TIMER = require('../../../src/models/steps.model');
const ReviewCard = require('../../../src/models/ReviewCard');

describe('card service - next step', () => {
  test('vérifie qu\'une erreur est levé si la carte est null ou que le timer est invalide', () => {
    // Arrange
    const card = null;

    // Act
    const callPreviousStep = () => {
      cardService.previousStep(card);
    };

    // Assert
    expect(callPreviousStep).toThrowError(
      'La carte est vide ou le step est invalide'
    );
  });

  test('vérifie que la méthode next step va avancer la date de représentation de la carte', () => {
    // Arrange
    const card = new ReviewCard('question', 'reponse', 'theme', 'aide', TIMER.STEP1);

    // Act
    const result = cardService.nextStep(card);

    // Assert
    expect(result.nextPresentation).toBe(TIMER.STEP2);
  });

  test('vérifie que la méthode next step n\'avance pas la date si on est déjà au maximum des présentations', () => {
    // Arrange
    const card = new ReviewCard('question', 'reponse', 'theme', 'aide', TIMER.STEP10);

    // Act
    const result = cardService.nextStep(card);

    // Assert
    expect(result.nextPresentation).toBe(TIMER.STEP10);
  });
});

describe('card service - previous step', () => {
  test('vérifie qu\'une erreur est levé si la carte est null ou que le timer est invalide', () => {
    // Arrange
    const card = null;

    // Act
    const callPreviousStep = () => {
      cardService.previousStep(card);
    };

    // Assert
    expect(callPreviousStep).toThrowError(
      'La carte est vide ou le step est invalide'
    );
  });

  test('vérifie que la méthode previous step va reculer la date de représentation de la carte', () => {
    // Arrange
    const card = new ReviewCard('question', 'reponse', 'theme', 'aide', TIMER.STEP10);

    // Act
    const result = cardService.previousStep(card);

    // Assert
    expect(result.nextPresentation).toBe(TIMER.STEP9);
  });

  test('vérifie que la méthode previous step ne recule pas la date si on est déjà au minimum des présentations', () => {
    // Arrange
    const card = new ReviewCard('question', 'reponse', 'theme', 'aide', TIMER.STEP1);

    // Act
    const result = cardService.previousStep(card);

    // Assert
    expect(result.nextPresentation).toBe(TIMER.STEP1);
  });
});

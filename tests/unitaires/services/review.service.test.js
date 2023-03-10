const reviewService = require('../../../src/services/review.service');
const { STEPS } = require('../../../src/utils/constants');
const ReviewCard = require('../../../src/models/review');

describe('card service - next step', () => {
  test('vérifie qu\'une erreur est levé si la carte est null ou que le timer est invalide', () => {
    // Arrange
    const card = null;

    // Act
    const callPreviousStep = () => {
      reviewService.previousStep(card);
    };

    // Assert
    expect(callPreviousStep).toThrowError(
      'La carte est vide ou le step est invalide'
    );
  });

  test('vérifie que la méthode next step va avancer la date de représentation de la carte', () => {
    // Arrange
    const card = new ReviewCard(
      'question',
      'reponse',
      'theme',
      'aide',
      STEPS.STEP1
    );

    // Act
    const result = reviewService.nextStep(card);

    // Assert
    expect(result.nextPresentation).toBe(STEPS.STEP2);
  });

  test('vérifie que la méthode next step n\'avance pas la date si on est déjà au maximum des présentations', () => {
    // Arrange
    const card = new ReviewCard(
      'question',
      'reponse',
      'theme',
      'aide',
      STEPS.STEP10
    );

    // Act
    const result = reviewService.nextStep(card);

    // Assert
    expect(result.nextPresentation).toBe(STEPS.STEP10);
  });
});

describe('card service - previous step', () => {
  test('vérifie qu\'une erreur est levé si la carte est null ou que le timer est invalide', () => {
    // Arrange
    const card = null;

    // Act
    const callPreviousStep = () => {
      reviewService.previousStep(card);
    };

    // Assert
    expect(callPreviousStep).toThrowError(
      'La carte est vide ou le step est invalide'
    );
  });

  test('vérifie que la méthode previous step va reculer la date de représentation de la carte', () => {
    // Arrange
    const card = new ReviewCard(
      'question',
      'reponse',
      'theme',
      'aide',
      STEPS.STEP10
    );

    // Act
    const result = reviewService.previousStep(card);

    // Assert
    expect(result.nextPresentation).toBe(STEPS.STEP9);
  });

  test('vérifie que la méthode previous step ne recule pas la date si on est déjà au minimum des présentations', () => {
    // Arrange
    const card = new ReviewCard(
      'question',
      'reponse',
      'theme',
      'aide',
      STEPS.STEP1
    );

    // Act
    const result = reviewService.previousStep(card);

    // Assert
    expect(result.nextPresentation).toBe(STEPS.STEP1);
  });
});

/**
 * Définition des étapes des divers leçons
 * @type {Object}
 */
const STEPS = {
  STEP1: { id: 1, info: '1 jour', step: 'Étape 1', day: 1 },
  STEP2: { id: 2, info: '3 jours', step: 'Étape 2', day: 2 },
  STEP3: { id: 3, info: '7 jours', step: 'Étape 3', day: 4 },
  STEP4: { id: 4, info: '14 jours', step: 'Étape 4', day: 7 },
  STEP5: { id: 5, info: '1 mois', step: 'Étape 5', day: 15 },
  STEP6: { id: 6, info: '2 mois', step: 'Étape 6', day: 30 },
  STEP7: { id: 7, info: '4 mois', step: 'Étape 7', day: 60 },
  STEP8: { id: 8, info: '10 mois', step: 'Étape 8', day: 120 },
  STEP9: { id: 9, info: '1 an et demi', step: 'Étape 9', day: 240 },
  STEP10: { id: 10, info: '3 ans', step: 'Étape 10', day: 480 },
};


const TYPE_ACCOUNT = {
  Personal : { id: 1 , name : 'personal',  limit_user : 1 , limit_card : 10000 },
  Enterprise : { id: 2 , name : 'enterprise',  limit_user : 10 , limit_card : 1000 },
  Prenium : { id: 3 , name : 'prenium',  limit_user : 100 , limit_card : 5000 },
  Gold : { id: 4 , name : 'gold',  limit_user : 1000 , limit_card : 10000 },
};

module.exports = {
  STEPS,
  TYPE_ACCOUNT
}; 

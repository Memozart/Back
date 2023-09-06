
const TYPE_ACCOUNT = {
  Personal : { id: 1 , name : 'personnel',  limit_user : 1 , limit_card : 10000 },
  MicroEntreprise : { id: 2 , name : 'micro entreprise',  limit_user : 10 , limit_card : 1000, price_id: 'price_1NmZwYDqres5xkWBzCMSPcg7' },
  PetiteEntreprise : { id: 3 , name : 'petite entreprise',  limit_user : 50 , limit_card : 5000, price_id: 'price_1NmZy7Dqres5xkWBB5ey8KCq' },
  MoyenneEntreprise : { id: 4 , name : 'moyenne entreprise',  limit_user : 250 , limit_card : 10000, price_id: 'price_1NmZyUDqres5xkWBI5HbnewY' },
  GrandeEntreprise : { id: 4 , name : 'grande entreprise',  limit_user : 1000 , limit_card : 100000 },
};

const ERROR_MESSAGE = {
  PARAMETER_EMPTY : 'The parameter cannot be empty'
};

module.exports = {
  TYPE_ACCOUNT,
  ERROR_MESSAGE
}; 

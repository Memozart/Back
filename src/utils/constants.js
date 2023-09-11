const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const config = require('../config');
dayjs.extend(utc);


const TYPE_ACCOUNT = {
  Personal : { id: 1 , name : 'Mon organisation',  limit_user : 1 , limit_card : 10000 },
  MicroEntreprise : { id: 2 , name : 'Micro entreprise',  limit_user : 10 , limit_card : 1000, price_id: 'price_1NmZwYDqres5xkWBzCMSPcg7' },
  PetiteEntreprise : { id: 3 , name : 'Petite entreprise',  limit_user : 50 , limit_card : 5000, price_id: 'price_1NmZy7Dqres5xkWBB5ey8KCq' },
  MoyenneEntreprise : { id: 4 , name : 'Moyenne entreprise',  limit_user : 250 , limit_card : 10000, price_id: 'price_1NmZyUDqres5xkWBI5HbnewY' },
  GrandeEntreprise : { id: 4 , name : 'Grande entreprise',  limit_user : 1000 , limit_card : 100000 },
};

const ERROR_MESSAGE = {
  PARAMETER_EMPTY : 'The parameter cannot be empty'
};

const CONFIG_SEQUENCE_DEMO = config.isDemo === true ? 
  {
    timeSequence : 'minutes', 
    getMaxDateReview : () => dayjs().utc().startOf('minutes'),
    criteriaSearchDate:  '$lte'
  }: 
  {
    timeSequence : 'day',
    getMaxDateReview: () => dayjs().utc().add(1,'day').startOf('day'),
    criteriaSearchDate : '$lt'
  };


module.exports = {
  TYPE_ACCOUNT,
  ERROR_MESSAGE,
  CONFIG_SEQUENCE_DEMO
}; 

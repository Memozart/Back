const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const config = require('../config');
dayjs.extend(utc);


const TYPE_ACCOUNT = {
  Personal : { id: 1 , name : 'personal',  limit_user : 1 , limit_card : 10000 },
  Enterprise : { id: 2 , name : 'enterprise',  limit_user : 10 , limit_card : 1000 },
  Prenium : { id: 3 , name : 'prenium',  limit_user : 100 , limit_card : 5000 },
  Gold : { id: 4 , name : 'gold',  limit_user : 1000 , limit_card : 10000 },
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

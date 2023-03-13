
const TYPE_ACCOUNT = {
  Personal : { id: 1 , name : 'personal',  limit_user : 1 , limit_card : 10000 },
  Enterprise : { id: 2 , name : 'enterprise',  limit_user : 10 , limit_card : 1000 },
  Prenium : { id: 3 , name : 'prenium',  limit_user : 100 , limit_card : 5000 },
  Gold : { id: 4 , name : 'gold',  limit_user : 1000 , limit_card : 10000 },
};

module.exports = {
  TYPE_ACCOUNT
}; 

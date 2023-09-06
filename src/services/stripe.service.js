const config = require('../config/index');
const stripe = require('stripe')(config.stripe.secret);
const bcrypt = require('bcryptjs');
const redis = require('redis');
const client = redis.createClient({
  password: config.redis.password,
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
});

/**
 * Permet de créer un client dans stripe
 * Si le client existe déjà, on le retourne
 * @param {string} name 
 * @param {string} email 
 * @returns 
 */
const createCustomer = async (name, email) => {
  const customerExist = await stripe.customers.list({
    email: email,
    limit: 1,
  });
  if (customerExist.data.length > 0) {
    return customerExist.data[0];
  }
  const customer = await stripe.customers.create({
    email: email,
    name: name,
    description: 'test',
  });
  return customer;
};

/**
 * Permet de souscrire un client à un abonnement
 * @param {string} customerId 
 * @param {TYPE_ACCOUNT} typeAccount 
 * @returns 
 */
const subscribeCustomer = async (customerId, typeAccount, randomString) => {
  return stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: typeAccount.price_id,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${config.stripe.successUrl}?hash=${randomString}`,
    cancel_url: `${config.stripe.cancelUrl}`,
  });
};

/**
 * Réupère les abonnements d'un client
 * @param {string} customerId 
 * @returns 
 */
const getSubscription = async (customerId) => {
  return stripe.subscriptions.list({
    customer: customerId,
  });
};

/**
 * Réupère les factures d'un client
 * @param {string} customerId 
 * @returns 
 */
const getInvoice = async (customerId) => {
  return stripe.invoices.list({
    customer: customerId,
  });
};

/**
 * Permet de récupérer le nombre d'employés d'une entreprise via l'api de l'insee
 * @param {string} siren 
 * @returns 
 */
const getNbEmployes = async (siren) => {
  const { access_token } = await getBearerTokenInsee();
  const response = await fetch(`https://api.insee.fr/entreprises/sirene/V3/siren/${siren}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`,
    }
  });
  const responseJson = await response.json();
  const trancheUniteLegale = responseJson.uniteLegale.trancheEffectifsUniteLegale;
  let nbEmployes = 0;
  switch (trancheUniteLegale) {
  case '00':
    nbEmployes = 0;
    break;
  case '01':
    nbEmployes = 2;
    break;
  case '02':
    nbEmployes = 5;
    break;
  case '03':
    nbEmployes = 9;
    break;
  case '11':
    nbEmployes = 19;
    break;
  case '12':
    nbEmployes = 49;
    break;
  case '21':
    nbEmployes = 99;
    break;
  case '22':
    nbEmployes = 199;
    break;
  case '31':
    nbEmployes = 249;
    break;
  case '32':
    nbEmployes = 499;
    break;
  case '41':
    nbEmployes = 999;
    break;
  case '42':
    nbEmployes = 1999;
    break;
  case '51':
    nbEmployes = 4999;
    break;
  case '52':
    nbEmployes = 9999;
    break;
  case '53':
    nbEmployes = 10000;
    break;
  default:
    nbEmployes = 0;
    break;
  }
  return nbEmployes;
};

const createRandomStringInRedis = async (customerId) => {
  const randomString = await bcrypt.hash(customerId, 10);
  await client.connect();
  await client.set(randomString, customerId);
  await client.quit();
  return randomString;
};

const getKeyFromValueInRedis = async (value) => {
  await client.connect();
  const key = await client.get(value);
  await client.quit();
  return key;
};

const removeKeyFromRedis = async (key) => {
  await client.connect();
  await client.del(key);
  await client.quit();
};

/**
 * Génère un token d'authentification pour l'api de l'insee
 * @returns 
 */
const getBearerTokenInsee = async () => {
  const response = await fetch('https://api.insee.fr/token?grant_type=client_credentials', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${config.insee.secret}`,
    },
  });
  const responseJson = await response.json();
  return responseJson;
};

module.exports = {
  createCustomer,
  subscribeCustomer,
  getNbEmployes,
  getSubscription,
  getInvoice,
  createRandomStringInRedis,
  getKeyFromValueInRedis,
  removeKeyFromRedis
};
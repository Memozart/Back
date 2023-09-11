/**
 * method qui va verifier si un parametre est vide
 * peut etre un string, un tableau, un objet, un map ou un set
 * @param {*} param doit etre un string, un tableau, un objet, un map ou un set
 * @returns true si le parametre est vide, false sinon
 */
const isEmpty = (param)=>{
  if (param === undefined || param === null) {
    return true;
  }
  if (typeof param === 'string' && param.trim() === '') {
    return true;
  }
  if (Array.isArray(param) && param.length === 0) {
    return true;
  }
  if (param instanceof Map || param instanceof Set) {
    return param.size === 0;
  }
  return false;
};

const getUserIdAndOrganisationId = (req) =>{
  const { _id: userId, currentOrganisation } = req.user;
  const currentOrganisationId = currentOrganisation._id?.toString();
  return { userId , currentOrganisationId };
};

const checkIfConnectionStringIsLocal = (connectionString) =>{
  return connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
};

module.exports = {
  isEmpty,
  getUserIdAndOrganisationId,
  checkIfConnectionStringIsLocal
};
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
  if (typeof param === 'object' && Object.keys(param).length === 0) {
    return true;
  }
  if (param instanceof Map || param instanceof Set) {
    return param.size === 0;
  }
  return false;
};

module.exports = {
  isEmpty
};
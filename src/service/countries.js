
const uuid = require('uuid');
const { getLogger } = require('../core/logging.js');

const countriesRepository = require("../repository/countries.js");



const getAll = async (limit = 200,offset = 0) => {
  
  const data = await countriesRepository.findAll(limit,offset);
  
  return {
    data:data,
    count: data.length,
  };
};




module.exports = {
  getAll,
  
};
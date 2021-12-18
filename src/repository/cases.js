const { log } = require('winston');
const { getKnex, tables } = require('../data');




/**
 * Find a place with the given `id`.
 *
 * @param {string} id - Id of the place to find.
 */
const findById = (id) => {
  return getKnex()(tables.cases)
  .select().limit(200).offset(0).where('date',id);
};

// .sum('total_cases')

const getCasesBetweenXDays = (date1,date2) =>{
  const from =date1
  const to = date2
  console.log(`date1 = ${from} date2 = ${to}`);
return getKnex()(tables.cases).whereBetween("date",[from,to]).groupBy('date').sum('total_cases as total_cases').sum('new_cases as new_cases').sum('total_deaths as total_deaths').sum('new_deaths as new_deaths').select('date');
};


module.exports = {
  findById,
  getCasesBetweenXDays
};
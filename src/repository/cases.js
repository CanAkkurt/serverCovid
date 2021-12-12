const { getKnex, tables } = require('../data');




/**
 * Find a place with the given `id`.
 *
 * @param {string} id - Id of the place to find.
 */
const findById = (id) => {
  return getKnex()(tables.cases)
  .select().limit(1).offset(0).where('country_id',id).orderBy('date','desc');
};

module.exports = {
  findById,
};
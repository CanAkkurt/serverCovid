const { getKnex, tables } = require('../data');

const findAll = ({
  limit,
  offset
}) => {
  return getKnex()(tables.countries).select().limit().offset(0).orderBy('id','DSC');
};

module.exports = {
  findAll,
};
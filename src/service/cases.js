const config = require('config');
const { getChildLogger } = require('../core/logging');
const caseRepository = require('../repository/cases');

// const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
// const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('cases-service');
	this.logger.debug(message, meta);
};

const getById = (id) => {
	debugLog(`Fetching case with id ${id}`);
	return caseRepository.findById(id);
};



module.exports = {
	getById,
};
const config = require('config');
const { log } = require('winston');
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

const getCasesBetweenXDays = async(date1,date2) => {
	debugLog(`Fetching case with date between ${date1} end ${date2}`);
	const data =await caseRepository.getCasesBetweenXDays(date1,date2)
	
;
	return {
		data:data,
	
	
	}



				
	
}


module.exports = {
	getById,
	getCasesBetweenXDays
};
const Router = require('@koa/router');
const countriesService = require('../service/countries.js');
const Joi = require('joi');
const validate = require('./_validation.js');

const getAllPlaces = async (ctx) => {
	ctx.body = await countriesService.getAll();
};
getAllPlaces.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};


module.exports = (app) => {
	const router = new Router({
		prefix: '/countries',
	});

	router.get('/',validate(getAllPlaces.validationScheme),getAllPlaces);


	app.use(router.routes()).use(router.allowedMethods());
};
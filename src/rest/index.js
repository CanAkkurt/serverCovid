const Router = require('@koa/router');
const installCountriesRouter = require('./_countries.js');
const installCasesRouter = require('./_cases.js')


/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
	const router = new Router({
		prefix: '/api',
	});
  installCountriesRouter(router);
  installCasesRouter(router);
  

	app.use(router.routes()).use(router.allowedMethods());
};
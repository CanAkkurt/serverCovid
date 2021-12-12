const Router = require('@koa/router');
const caseService = require('../service/cases');


const getPlaceById = async (ctx) => {
	ctx.body = await caseService.getById(ctx.params.id);
 
};




module.exports = (app) => {
 const router = new Router({
   prefix: '/cases',
 });

 
 router.get('/:id', getPlaceById);


 app.use(router.routes()).use(router.allowedMethods());
};
const Router = require('@koa/router');
const caseService = require('../service/cases');


const getPlaceById = async (ctx) => {
	ctx.body = await caseService.getById(ctx.params.id);
 
};

const getCasesBetweenXDays = async (ctx) => {
	const response = await caseService.getCasesBetweenXDays(ctx.params.date1,ctx.params.date2);
  ctx.body =response;
};




module.exports = (app) => {
 const router = new Router({
   prefix: '/cases',
 });

 
 router.get('/:id', getPlaceById);
 router.get('/dataBetween/:date1&:date2',getCasesBetweenXDays);


 app.use(router.routes()).use(router.allowedMethods());
};
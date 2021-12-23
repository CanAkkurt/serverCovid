const Router = require('@koa/router');
const caseService = require('../service/cases');
const Joi = require('joi');
const validate = require('./_validation.js');

const getPlaceById = async (ctx) => {
	ctx.body = await caseService.getById(ctx.params.id);
 
};
getPlaceById.validationScheme = {
  params: {
    id: Joi.string(),
  },
};


const getCasesBetweenXDays = async (ctx) => {
	const response = await caseService.getCasesBetweenXDays(ctx.params.date1,ctx.params.date2);
  ctx.body =response;
};
getCasesBetweenXDays.validationScheme = {
  params: {
    date1: Joi.string(),
    date2:Joi.string()
  },
};





module.exports = (app) => {
 const router = new Router({
   prefix: '/cases',
 });

 
 router.get('/:id',validate(getPlaceById.validationScheme), getPlaceById);
 router.get('/dataBetween/:date1&:date2',validate(getCasesBetweenXDays.validationScheme),getCasesBetweenXDays);


 app.use(router.routes()).use(router.allowedMethods());
};
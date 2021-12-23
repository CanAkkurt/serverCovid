const Router = require('@koa/router');
const userService = require('../service/user');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const validate = require('./_validation');
const Joi = require('joi');


const getAllUsers = async (ctx) => {
  const users = await userService.getAll(
     Number(ctx.query.limit),
     Number(ctx.query.offset),
  );
  ctx.body = users;
};getAllUsers.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};









const getUserById = async (ctx) => {
  const user = await userService.getById(ctx.params.id);
  ctx.body = user;
};
getUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const updateUserById = async (ctx) => {
  const user = await userService.updateById(ctx.params.id, ctx.request.body);
  ctx.body = user;
};
updateUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    name: Joi.string().max(255),
    email: Joi.string().email(),
  },
};

const deleteUserById = async (ctx) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};


const login = async (ctx) => {
  const {email , password} = ctx.request.body;
  const response = await userService.login(email,password);
  ctx.body = response;
};
login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};



const register = async (ctx) => {
  const response = await userService.register(ctx.request.body);
  ctx.body = response;
}
register.validationScheme = {
  body: {
    name: Joi.string().max(255),
    email: Joi.string().email(),
    password: Joi.string().min(6).max(30),
  },
};

const updateByIdPermissions = async (ctx) => {
  const response = await userService.updateByIdPermissions(ctx.params.id,ctx.request.body);
  ctx.body = response;
}
updateByIdPermissions.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    permission: Joi.string().max(6),
    
  },
};



module.exports = function installUsersRoutes(app) {
  const router = new Router({
    prefix: '/users',
  });
  router.post('/login',validate(login.validationScheme),login);
  router.post('/register',validate(register.validationScheme),register);
  
  const requireAdmin = makeRequireRole("admin");

  router.get('/', requireAuthentication,requireAdmin, validate(getAllUsers.validationScheme), getAllUsers);
  router.get('/:id',requireAuthentication,validate(getUserById.validationScheme), getUserById);
  router.put('/:id',requireAuthentication,validate(updateUserById.validationScheme), updateUserById);
  router.delete('/:id',requireAuthentication,validate(deleteUserById.validationScheme), deleteUserById);
  router.put('/permissions/:id',requireAuthentication,validate(updateByIdPermissions.validationScheme),updateByIdPermissions);

  app
    .use(router.routes())
    .use(router.allowedMethods());
};
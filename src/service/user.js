const { getChildLogger } = require('../core/logging');
const { hashPassword,verifyPassword } = require('../core/password.js');
const userRepository = require('../repository/user');
const Role = require('../core/roles.js');
const { generateJWT } = require('../core/jwt');


const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('user-service');
	this.logger.debug(message, meta);
};

const makeLoginData = async (user) => {
  const token = await generateJWT(user);

  return {
    user: makeExposedUser(user),
    token,
  };
};



const makeExposedUser = ({
  id,
  name,
  email,
  roles,
}) => ({
  id,
  name,
  email,
  roles,
});



const login  = async(email,password) =>{
  const user = await userRepository.findByEmail(email);

  if(!user){
    throw new Error('email does not match with password')
  }
  
  const passwordValid = await verifyPassword(password,user.password_hash);
  
  if(!passwordValid){
    throw new Error('email does not match with password')
  }

  const token = await generateJWT(user);
  return await makeLoginData(user);

  // return await makeLoginData(user);
  
};
/**
 * Register a new user
 *
 * @param {object} user - The user's data.
 * @param {string} user.name - The user's name.
 */
 const register = async ({
  name,
  email,
  password,
}) => {
  debugLog('Creating a new user', { name });
  const passwordHash = await hashPassword(password);

  const user = await userRepository.create({
    name,
    email,
    passwordHash,
    roles: 'user',
  });

  return await makeLoginData(user);
};


/**
 * Get all `limit` users, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of users to fetch.
 * @param {number} [offset] - Nr of users to skip.
 */
 const getAll = async (
  limit = 100,
  offset = 0,
) => {
  debugLog('Fetching all users', { limit, offset });
  const data = await userRepository.findAll({ limit, offset });
  const totalCount = await userRepository.findCount();
  return {
    data,
    count: totalCount,
    limit,
    offset,
  };
};

/**
 * Get the user with the given id.
 *
 * @param {string} id - Id of the user to get.
 *
 * @throws {ServiceError} One of:
 * - NOT_FOUND: No user with the given id could be found.
 */
const getById = async (id) => {
  debugLog(`Fetching user with id ${id}`);
  const user = await userRepository.findById(id);

  if (!user) {
    throw new Error(`No user with id ${id} exists`, { id });
  }

  return user;
};


/**
 * Update an existing user.
 *
 * @param {string} id - Id of the user to update.
 * @param {object} user - User to save.
 * @param {string} [user.name] - Name of the user.
 * @param {number} [user.email] - Email of the user.
 *
 * @throws {ServiceError} One of:
 * - NOT_FOUND: No user with the given id could be found.
 * - VALIDATION_FAILED: A user with the same email exists.
 */
const updateById = (id, { name, email }) => {
  debugLog(`Updating user with id ${id}`, { name, email });
  return userRepository.updateById(id, { name, email });
};


/**
 * Delete an existing user.
 *
 * @param {string} id - Id of the user to delete.
 *
 * @throws {ServiceError} One of:
 * - NOT_FOUND: No user with the given id could be found.
 */
const deleteById = async (id) => {
  debugLog(`Deleting user with id ${id}`);
  const deleted = await userRepository.deleteById(id);

  if (!deleted) {
    throw new Error(`No user with id ${id} exists`, { id });
  }
};

module.exports = {
  login,
  register,
  getAll,
  getById,
  updateById,
  deleteById,
};
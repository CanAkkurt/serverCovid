const { register } = require('rest/mime/registry');
const supertest = require('supertest');
const { log } = require('../config/production');
const createServer = require('../src/createServer');
const { getKnex, tables } = require('../src/data');



const data = {
  user: [	{
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
    name: 'Thomas Aelbrecht',
    email: 'thomas.aelbrecht@hogent.be',
    password_hash:
    '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
    roles: JSON.stringify(['user']),
  },
  {
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff81',
    name: 'Pieter Van Der Helst',
    email: 'pieter.vanderhelst@hogent.be',
    password_hash:
    '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
    roles: JSON.stringify(['user']),
  },
  {
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff82',
    name: 'Karine Samyn',
    email: 'karine.samyn@hogent.be',
    password_hash:
    '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
    roles: JSON.stringify(['user']),
  }
  
]
};


const dataToDelete = {
  user: [
    '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff82',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff81',
  ]
};

describe('user', () => {
  let server;

  let request;
  let knex;

  beforeAll(async () => {
    server = await createServer();
    knex = getKnex();
    request = supertest(server.getApp().callback());
  });

  afterAll(async () => {
   
    await server.stop();
  });

  const url = '/api/users';


  describe('GET /api/users', () => {

    beforeAll(async () => {
      await knex(tables.user).insert(data.user);
    });

    afterAll(async () => {
      await knex(tables.user)
        .whereIn('id', dataToDelete.user)
        .delete();
    });


    test('it should 200 and return all users', async () => {
      const response = await request.get(url)

      expect(response.status).toBe(200);
      // one place from transactions could be present due to Jest running all tests parallel
      // so check at least 3 places exist
      expect(response.body.count).toBeGreaterThanOrEqual(3);
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
    });



  });

  describe('GET /api/places/:id', () => {

    beforeAll(async () => {
      await knex(tables.user).insert(data.user[0]);
    });

    afterAll(async () => {
      await knex(tables.user)
        .where('id', data.user[0].id)
        .delete();
    });

    test('it should 200 and return the requested user', async () => {
      const response = await request.get(`${url}/${data.user[0].id}`)
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
      "email": "thomas.aelbrecht@hogent.be",
      "id": "7f28c5f9-d711-4cd6-ac15-d13d71abff80",
      "name": "Thomas Aelbrecht",
      "password_hash": "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
      "roles": ["user"]
    });
    });
  });

  const urlRegister = '/api/users/register';
  describe('POST /api/users/register', () => {

    const userToDelete = [];

    afterAll(async () => {
      await knex(tables.user)
        .where('id', userToDelete)
        .delete();
    });
    test('it should 201 and return the created user', async () => {
      const response = await request.post(urlRegister)
        .send({
          "name": 'Kadir akkurt',
          "email": 'kadircakkurtsss@hotmail.com',
          "password":"test",
          
        });
      
      console.log(response.body);
      expect(response.status).toBe(200);
      // expect(response.body.id).toBeTruthy();
      expect(response.body.user.name).toBe('Kadir akkurt');
      
      userToDelete.push(response.body.user.id);
    });


  });












  describe('GET /api/users', () => {
   it("should 200",async () => {
     const response = await request.get(url);
     expect(response.status).toBe(200);
     expect(response.limit).toBe(undefined);
     expect(response.offset).toBe(undefined);

   });
});








});


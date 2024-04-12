const supertest = require('supertest')
const mongoose = require('mongoose');

// import server file
const { app, server } = require('../server.js');

// Schemas
const User = require('../models/users.js');

describe('User Collection', () => {

  let testData = null;

  it('creates user', async () => {

    const testUser = {
      name: "testUser",
      email: "testUser@gmail.com"
    }

    const testUserData = new User(testUser);

    testData = await testUserData.save();

    expect(testData.name).toBe(testUser.name);
    expect(testData.email).toBe(testUser.email);


  });

  it('creates admin', async () => {

    const testUser = {
      admin: true,
      name: "testAdminJest",
      email: "testAdminJest@gmail.com"
    }

    const testUserData = new User(testUser);

    testData = await testUserData.save();

    expect(testData.admin).toBe(true);
    expect(testData.name).toBe(testUser.name);
    expect(testData.email).toBe(testUser.email);


  });

  it('creates user on Express API', async () => {
    const testUser = {
      name: "testUser",
      email: "testUser@gmail.com"
    };

    testData = await supertest(app)
      .post('/createUser')
      .send(testUser)
      .expect(200);


    expect(testData.body.name).toBe(testUser.name);
    expect(testData.body.email).toBe(testUser.email);

    if (testData) {

      await User.deleteOne({ _id: testData.body._id });

    }


  });


  afterEach(async () => {
    if (testData) {

      await User.deleteOne({ _id: testData._id });

    }

  });

  afterAll((done) => {


    if (server) server.close(() => {
      mongoose.disconnect().then(() => done());
    });
    else done();
  });


});

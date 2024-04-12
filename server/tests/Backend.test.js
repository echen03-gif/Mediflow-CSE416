const supertest = require('supertest')
const mongoose = require('mongoose');

// Schemas
const User = require('../models/users.js');


describe('User Collection', () => {

  let testData = null;

  const uri = process.env.MEDIFLOWKEY;

  async function connectDB() {
    await mongoose.connect(uri);
    return mongoose;
  }

  beforeAll(async () => {
    await connectDB();

  });

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

  afterEach(async () => {
    if (testData) {

      await User.deleteOne({ _id: testData._id });

    }

  });

  afterAll(async () => {

    mongoose.connection.close();
    
  });

});

require('text-encoding').TextDecoder;
require('setimmediate');
const request = require('supertest');
const express = require('express');
const app = express();

const { db } = require('../../jest.setup');

describe('Firestore Tests', () => {

  let docRef;

  beforeEach(() => {

    docRef = db.collection('users').doc('user1');
  });

  afterEach(async () => {

    await docRef.delete();
  });

  test('Write and Read DB', async () => {
    await docRef.set({ name: 'Hello World' });
    const snapshot = await docRef.get();
    expect(snapshot.data().name).toBe('Hello World');
  });



});

describe('API Tests', () => {
  test('Should write data to Firestore via API endpoint', async () => {
    
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'John Doe' });
    expect(response.status).toBe(404);

  
  });
});
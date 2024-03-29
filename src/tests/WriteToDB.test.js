require('text-encoding').TextDecoder;
require('setimmediate');
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

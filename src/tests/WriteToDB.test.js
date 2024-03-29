
require('text-encoding').TextDecoder;
require('setimmediate');
const { db } = require('../../jest.setup'); 


describe('Firestore Tests', () => {

  test('Write and Read DB', async () => {
    
    const docRef = db.collection('users').doc('user1');
  
    await docRef.set({ name: 'Hello World' });
    

    const snapshot = await docRef.get();
    

    expect(snapshot.data().name).toBe('Hello World');

  });

}); 

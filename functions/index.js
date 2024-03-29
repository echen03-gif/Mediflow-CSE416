const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

exports.retrieveTestData = functions.https.onCall(async (data, context) => {
    const testCollectionSnapshot = await db.collection('Test').get();
    const testData = testCollectionSnapshot.docs.map(doc => doc.data());
    return testData;
});
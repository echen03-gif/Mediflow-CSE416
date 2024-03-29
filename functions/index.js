const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

exports.retrieveTestData = functions.https.onCall(async (data, context) => {
    const testCollectionSnapshot = await db.collection('Test').get();
    const testData = testCollectionSnapshot.docs.map(doc => doc.data());
    return testData;
});
exports.addTestData = functions.https.onCall(async (data, context) => {
    try {
        const docRef = await db.collection('Test').add(data);
        return { id: docRef.id };
    } catch (error) {
        throw new functions.https.HttpsError('unknown', 'Failed to add the test data', error);
    }
});
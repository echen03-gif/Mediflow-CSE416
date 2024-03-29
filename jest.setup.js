require('text-encoding').TextDecoder;
const { Firestore } = require('@firebase/testing');

const PROJECT_ID = 'mediflow-568ba';
const admin = require('firebase-admin');
const serviceAccount = require(process.env.FIREBASEKEY); 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: PROJECT_ID 
});

const db = admin.firestore();


export { db };
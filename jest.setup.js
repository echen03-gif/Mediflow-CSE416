require('text-encoding').TextDecoder;
require('dotenv').config();
const { Firestore } = require('@firebase/testing');

const PROJECT_ID = 'mediflow-568ba';
const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_PRIVATE_KEY); 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: PROJECT_ID 
});

const db = admin.firestore();

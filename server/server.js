var admin = require("firebase-admin");

var serviceAccount = require(process.env.FIREBASEKEY);

console.log(serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});







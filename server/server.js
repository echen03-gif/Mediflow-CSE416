var admin = require("firebase-admin");
console.log(process.env)
var serviceAccount = require(process.env.FIREBASEKEY);

console.log(serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});







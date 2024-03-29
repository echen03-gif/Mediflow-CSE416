import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBxJp5r-ub9MLbIyuwtXQ9zV4trsv4Exbo",
    authDomain: "mediflow-568ba.firebaseapp.com",
    projectId: "mediflow-568ba",
    storageBucket: "mediflow-568ba.appspot.com",
    messagingSenderId: "167979714661",
    appId: "1:167979714661:web:9baf844bd6f2bc8d6f1e8c",
    measurementId: "G-GBY8T294R9"
  };
  

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export default db;
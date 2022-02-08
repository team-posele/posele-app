import firebase from 'firebase/app';
import 'firebase/firestore';
require('firebase/auth');
// Initialize firestore service on the front end

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBytvUb7bhcLSKCHs9OTD1AnLld_8ItpYU',
  authDomain: 'posele-3438d.firebaseapp.com',
  projectId: 'posele-3438d',
  storageBucket: 'posele-3438d.appspot.com',
  messagingSenderId: '344355728041',
  appId: '1:344355728041:web:5ebdd9678feaf6e35fd7b8',
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}
const auth = firebase.auth();

// Stored our database in db
const db = firebase.firestore();
console.log(db);

// This gets everything stored inside the users collection from firebase

export {auth, db};

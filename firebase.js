import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/firestore";

// Initialize Firebase
const firebaseConfig = {
  // CONFIG INFO
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const auth = app.auth();
const phoneProvider = new firebase.auth.PhoneAuthProvider();
const db = app.firestore();

export { app, auth, db, firebaseConfig, phoneProvider, firebase };

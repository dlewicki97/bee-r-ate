import firebase from "firebase";
import "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyCjhZDO-iotzY23fZGSYYcIla3FCWOO0gs",
  authDomain: "bee-r-ate.firebaseapp.com",
  projectId: "bee-r-ate",
  storageBucket: "bee-r-ate.appspot.com",
  messagingSenderId: "171707147979",
  appId: "1:171707147979:web:aee7ba0355e16c1c12dd4e",
};

export const fb = firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

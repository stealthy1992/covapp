// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJT519aqo3prQRPSRrFBwkRaus0JRB_gQ",
  authDomain: "covid-83db4.firebaseapp.com",
  projectId: "covid-83db4",
  storageBucket: "covid-83db4.appspot.com",
  messagingSenderId: "686259130922",
  appId: "1:686259130922:web:87bf76d9b9a784b2966953"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const storage = getStorage(app)

export { db, storage }
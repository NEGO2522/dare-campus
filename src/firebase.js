// src/firebase.js

// Import the functions you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

//  Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA8s7HXDqd2qOsxNYxgbeJAfMTXvypDr1c",
  authDomain: "dareoftheday-4e93c.firebaseapp.com",
  projectId: "dareoftheday-4e93c",
  storageBucket: "dareoftheday-4e93c.firebasestorage.app",
  messagingSenderId: "1066114244333",
  appId: "1:1066114244333:web:b3f74e4c68d3f43279f6e4",
  measurementId: "G-Y0E1M8XYZ7"
};

//  Initialize Firebase App
const app = initializeApp(firebaseConfig);

//  Initialize Firestore DB
const db = getFirestore(app);

//  Export Firestore to use in App.jsx
export { db };

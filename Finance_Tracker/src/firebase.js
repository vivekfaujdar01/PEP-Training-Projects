// src/firebase.js
// Firebase project config for Finance Tracker
// Go to: Firebase Console → Project Settings → Your Apps → Web App → Config

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBXWm2FMnxV0pC_zOpbRqOYLz7cmgA5EDE",
    authDomain: "finance-tracker-5db21.firebaseapp.com",
    databaseURL: "https://finance-tracker-5db21-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "finance-tracker-5db21",
    storageBucket: "finance-tracker-5db21.firebasestorage.app",
    messagingSenderId: "915657838753",
    appId: "1:915657838753:web:3c0da698a4f1a6c20560e0",
    measurementId: "G-QM1ZV5J6Z3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services used across the app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
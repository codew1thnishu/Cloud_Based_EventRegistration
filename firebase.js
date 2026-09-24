// ==========================================
// FIREBASE CONFIGURATION
// ==========================================
// IMPORTANT:
// This file uses the Web App config from:
// Firebase Console -> Project Settings -> Your apps -> Web app -> Config
//
// If Firebase Authentication reports auth/api-key-not-valid,
// copy a FRESH config from Firebase Console into this object.
// Do not use backup/firebase.js.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDJpJGJ8phlBbDnkluztd2yHZEvbUK4ynY",
  authDomain: "cloud-event-management-system.firebaseapp.com",
  projectId: "cloud-event-management-system",
  storageBucket: "cloud-event-management-system.firebasestorage.app",
  messagingSenderId: "282782271981",
  appId: "1:282782271981:web:237655dead12029afaffe4"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {
    db,
    auth,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    query,
    orderBy,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
};

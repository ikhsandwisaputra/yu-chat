// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Ganti config ini dengan punyamu dari Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDYWbCIntbrMr8mAMrINrlcs1Du5qoF7X8",
  authDomain: "yu-chat-apps.firebaseapp.com",
  projectId: "yu-chat-apps",
  storageBucket: "yu-chat-apps.firebasestorage.app",
  messagingSenderId: "1090596171423",
  appId: "1:1090596171423:web:b96e042a7000ac72123caa",
  measurementId: "G-CWN5L3BQKD"
};

// Inisialisasi
const app = initializeApp(firebaseConfig);

// Export instance Auth dan Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

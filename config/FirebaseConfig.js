// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "petshop-cf57a.firebaseapp.com",
  projectId: "petshop-cf57a",
  storageBucket: "petshop-cf57a.appspot.com",
  messagingSenderId: "997653642170",
  appId: "1:997653642170:web:2e7aa844866391b00cbb83",
  measurementId: "G-EWSM28VRYW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage=getStorage(app);
//const analytics = getAnalytics(app);
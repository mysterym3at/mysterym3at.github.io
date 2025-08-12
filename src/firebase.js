// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWGmSTd2qiic7NmYOKlZ3tV-FGfBloe0o",
  authDomain: "handbag-api.firebaseapp.com",
  projectId: "handbag-api",
  storageBucket: "handbag-api.firebasestorage.app",
  messagingSenderId: "628322443419",
  appId: "1:628322443419:web:1cc816260e7377cfe2663e",
  measurementId: "G-J4NTS0HVYX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
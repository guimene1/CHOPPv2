// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkCoNlzFAcGIVax7ElSGcqh1Yzy8f5M7Q",
  authDomain: "berrmapper.firebaseapp.com",
  projectId: "berrmapper",
  storageBucket: "berrmapper.firebasestorage.app",
  messagingSenderId: "543205407190",
  appId: "1:543205407190:web:3a1bf8a8ac812138898c77",
  measurementId: "G-KLZK4NME4V"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAH7FbgKZbZa3SrfawNmsWOCo03azSQtzM",
  authDomain: "agency-2-gul.firebaseapp.com",
  projectId: "agency-2-gul",
  storageBucket: "agency-2-gul.firebasestorage.app",
  messagingSenderId: "967795127395",
  appId: "1:967795127395:web:0c277e811385acec2df456",
  measurementId: "G-DVPXMJBG8L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


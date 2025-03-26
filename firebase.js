// Import the functions you need from the SDKs
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAH7FbgKZbZa3SrfawNmsWOCo03azSQtzM',
  authDomain: 'agency-2-gul.firebaseapp.com',
  projectId: 'agency-2-gul',
  storageBucket: 'agency-2-gul.firebasestorage.app',
  messagingSenderId: '967795127395',
  appId: '1:967795127395:web:0c277e811385acec2df456',
  measurementId: 'G-DVPXMJBG8L',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

const analytics = getAnalytics(app);

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace these with your actual Firebase project credentials from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAwP81fWWppTVAwIGll6JMm9LMQOSFIcWc",
  authDomain: "propstream-a247d.firebaseapp.com",
  projectId: "propstream-a247d",
  storageBucket: "propstream-a247d.firebasestorage.app",
  messagingSenderId: "126523529595",
  appId: "1:126523529595:web:3bfe5e3c55a9bfc03e85de"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
// firebase.js
//import { initializeApp } from "firebase/app";
//import { getFirestore } from "firebase/firestore"; // For Firestore
//import { getDatabase } from "firebase/database";   // For Realtime Database

/**
 * Step 6: Use Firebase in Your App
Import Firebase and the database service in your components:
import { db } from './firebase'; // For Firestore
import { realtimeDb } from './firebase'; // For Realtime Database
import { collection, getDocs } from 'firebase/firestore'; // Firestore functions
import { ref, set, get } from 'firebase/database'; // Realtime Database functions
 * 
 * 
 * 
 * Sign in to Google
firebase login
Initiate your project
Run this command from your app's root directory:

firebase init
When you're ready, deploy your web app
Put your static files (e.g., HTML, CSS, JS) in your app's deploy directory (the default is "public"). Then, run this command from your app's root directory:

firebase deploy
After deploying, view your app at pantherpace-2ea08.web.app
 * 
 */


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQmDwCRRJboKs454At-cd8nEZa6CnAnWA",
  authDomain: "pantherpace-2ea08.firebaseapp.com",
  projectId: "pantherpace-2ea08",
  storageBucket: "pantherpace-2ea08.firebasestorage.app",
  messagingSenderId: "835884258653",
  appId: "1:835884258653:web:0fb00affb99ec8f8c5c4b4",
  measurementId: "G-YKP3RHRGQV"
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Conditionally initialize analytics (only in the browser)
/*let analytics;
if (typeof window !== "undefined") {
  const { getAnalytics } = require("firebase/analytics");
  analytics = getAnalytics(app);
}*/

const auth = getAuth(app); 
const db = getFirestore(app);

console.log("🔥 Firebase Initialized:", app.name);
/*const testFirestoreConnection = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "testCollection"));
    console.log("✅ Firestore Connection Successful - Documents Found:", querySnapshot.size);
  } catch (error) {
    console.error("❌ Firestore Connection Failed:", error);
  }
};

testFirestoreConnection();*/
// Export the initialized app
export { auth, db,};
export default app;
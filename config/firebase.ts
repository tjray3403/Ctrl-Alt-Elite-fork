import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCQmDwCRRJboKs454At-cd8nEZa6CnAnWA",
  authDomain: "pantherpace-2ea08.firebaseapp.com",
  projectId: "pantherpace-2ea08",
  storageBucket: "pantherpace-2ea08.appspot.com",
  messagingSenderId: "835884258653",
  appId: "1:835884258653:web:0fb00affb99ec8f8c5c4b4",
  measurementId: "G-YKP3RHRGQV",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);



const db = getFirestore(app);

console.log("🔥 Firebase Initialized:", app.name);

export { auth, db };
export default app;

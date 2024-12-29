import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDAoM6ibpwo8shVdCHKkt5AfekfmNmiJNc",
  authDomain: "dustbin-5d55a.firebaseapp.com",
  databaseURL: "https://dustbin-5d55a-default-rtdb.firebaseio.com",
  projectId: "dustbin-5d55a",
  storageBucket: "dustbin-5d55a.firebasestorage.app",
  messagingSenderId: "335568282600",
  appId: "1:335568282600:web:58dffc4d4b57c65f7ffa5d",
  measurementId: "G-RZR2CFQYJE"
  
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

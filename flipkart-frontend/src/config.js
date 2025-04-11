// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAhyDIniDkbdPRjxlCxnMgBT_Fw05brvk8",
  authDomain: "flipkart-186a9.firebaseapp.com",
  projectId: "flipkart-186a9",
  storageBucket: "flipkart-186a9.firebasestorage.app",
  messagingSenderId: "994585191427",
  appId: "1:994585191427:web:2c432b88c05717976d9a36",
  measurementId: "G-KM018KV25G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export default auth
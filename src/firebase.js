// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBK5OSzCiJTixj_JK1TIg3IBMVJjAEqXnA",
  authDomain: "invitacionpilotos.firebaseapp.com",
  projectId: "invitacionpilotos",
  storageBucket: "invitacionpilotos.firebasestorage.app",
  messagingSenderId: "195575029998",
  appId: "1:195575029998:web:2391bd447269cc7c8413ff",
  measurementId: "G-RFK4168JLS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };

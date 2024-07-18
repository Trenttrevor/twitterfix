// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "x-nextv2.firebaseapp.com",
  projectId: "x-nextv2",
  storageBucket: "x-nextv2.appspot.com",
  messagingSenderId: "111252050975",
  appId: "1:111252050975:web:fe4f1b260111fc1f28312a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
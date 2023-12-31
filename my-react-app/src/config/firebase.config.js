// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDE9bcTumX-0-k3wBPpc1VbQUA6ZVtv5r4",
  authDomain: "tezzs-1c43e.firebaseapp.com",
  projectId: "tezzs-1c43e",
  storageBucket: "tezzs-1c43e.appspot.com",
  messagingSenderId: "694876710871",
  appId: "1:694876710871:web:b327cf40a3e4fe3423cd92",
  measurementId: "G-4PZV2NH14W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Firebase storage reference
const storage = getStorage(app);
export default storage;

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'; // For v9 modular SDK
import { getAuth } from 'firebase/auth'; // For Firebase Authentication

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.GOOGLE_API_KEY,
  authDomain: "inventorymanagement-ec9ff.firebaseapp.com",
  projectId: "inventorymanagement-ec9ff",
  storageBucket: "inventorymanagement-ec9ff.appspot.com",
  messagingSenderId: "",
  appId: "1:372050591677:web:75456eb0e6e4aeb1dc1cd4",
  measurementId: "G-GBYD5PNLPZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth, app };

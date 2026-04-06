import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCaIwrxsSc4s4SV_sIfOwcGaeB6obdpuzE",
  authDomain: "batyr-final.firebaseapp.com",
  projectId: "batyr-final",
  storageBucket: "batyr-final.firebasestorage.app",
  messagingSenderId: "621519255228",
  appId: "1:621519255228:web:6087e026a6db84afa2c2b9",
  measurementId: "G-73YT8RDF4W"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 

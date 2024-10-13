import { initializeApp } from "firebase/app";
import 
 { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyBbk23tm1Y-_Z-R3b5AQ3dsnb3HGEten1A",
  authDomain: "unsw-lost-and-found.firebaseapp.com",
  projectId: "unsw-lost-and-found",
  storageBucket: "unsw-lost-and-found.appspot.com",
  messagingSenderId: "58468338443",
  appId: "1:58468338443:web:321bfcfef440b9c7e0b00e",
  measurementId: "G-S4X7DTE66R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);   

export const db = getFirestore(app);
export const storage = getStorage(app);
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig: { 
  apiKey: string; 
  authDomain: string; 
  projectId: string; 
  storageBucket: string; 
  messagingSenderId: string; 
  appId: string; 
} = {
  apiKey: "AIzaSyC97QicSy3yIaW-vNLcalcCS9_c4CLOmLw",
  authDomain: "can-we-cook.firebaseapp.com",
  projectId: "can-we-cook",
  storageBucket: "can-we-cook.firebasestorage.app",
  messagingSenderId: "245318796446",
  appId: "1:245318796446:web:1fccaa4f2d0f9a7274278f",
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth: Auth = getAuth(app);
// console.log("Firebase initialized: ", app);
// console.log("Auth initialized: ", auth.currentUser);
export { firebaseConfig, auth, db };
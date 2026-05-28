import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth: Auth = getAuth(app);
// console.log("Firebase initialized: ", app);
// console.log("Auth initialized: ", auth.currentUser);
export { firebaseConfig, auth, db };
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlOtQjZbtiGJiO-hH0aFx7ZGZ6C6E8-fs",
  authDomain: "e2s-shop.firebaseapp.com",
  projectId: "e2s-shop",
  storageBucket: "e2s-shop.firebasestorage.app",
  messagingSenderId: "877963438202",
  appId: "1:877963438202:web:4709c9dc9f9058698173c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
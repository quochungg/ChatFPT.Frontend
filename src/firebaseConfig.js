// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDiBOP3PCTFqEPGWY8Y3TKD6UdwQgviu2w",
  authDomain: "chatfpt-d4d7a.firebaseapp.com",
  projectId: "chatfpt-d4d7a",
  storageBucket: "chatfpt-d4d7a.firebasestorage.app",
  messagingSenderId: "446182111599",
  appId: "1:446182111599:web:00188757c2c92c6134509a",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };

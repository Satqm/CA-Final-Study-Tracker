// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVUi-vAyvE-g_iK4W9zbTTa5Ps8MwZEtg",
  authDomain: "ca-final-537aa.firebaseapp.com",
  projectId: "ca-final-537aa",
  storageBucket: "ca-final-537aa.firebasestorage.app",
  messagingSenderId: "156489737512",
  appId: "1:156489737512:web:f8b06ec7cba71ddfe99c1d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export modules
export { 
  auth, 
  db, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  setDoc,
  getDoc
};

import { getFirebaseConfig } from './firebase-config-public.js';

// Firebase services
let auth = null;
let db = null;
let firebaseApp = null;

// Initialize Firebase
async function initializeFirebase() {
    if (firebaseApp) return { auth, db, firebaseApp };
    
    try {
        // Dynamically import Firebase modules
        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
        const { getAuth } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
        const { getFirestore } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
        
        // Get configuration
        const config = await getFirebaseConfig();
        
        // Initialize Firebase
        firebaseApp = initializeApp(config);
        auth = getAuth(firebaseApp);
        db = getFirestore(firebaseApp);
        
        console.log("Firebase initialized successfully");
        return { auth, db, firebaseApp };
        
    } catch (error) {
        console.error("Failed to initialize Firebase:", error);
        throw error;
    }
}

export { initializeFirebase, auth, db };

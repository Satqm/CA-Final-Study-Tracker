// Simple Firebase initialization
console.log("Loading Firebase...");

// Firebase configuration with your API key
const firebaseConfig = {
    apiKey: "AIzaSyBj1bi-xEDf-D0uBG1lSKUaMRI4JS8u4A4",
    authDomain: "ca-final-537aa.firebaseapp.com",
    projectId: "ca-final-537aa",
    storageBucket: "ca-final-537aa.firebasestorage.app",
    messagingSenderId: "156489737512",
    appId: "1:156489737512:web:f8b06ec7cba71ddfe99c1d"
};

let app = null;
let auth = null;
let db = null;

// Initialize Firebase
function initializeFirebase() {
    return new Promise(async (resolve, reject) => {
        try {
            // Dynamically load Firebase modules
            const firebaseApp = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
            const firebaseAuth = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
            const firebaseFirestore = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
            
            // Initialize Firebase
            app = firebaseApp.initializeApp(firebaseConfig);
            auth = firebaseAuth.getAuth(app);
            db = firebaseFirestore.getFirestore(app);
            
            console.log("✅ Firebase initialized successfully!");
            
            // Store Firebase functions globally for easy access
            window.firebaseAuth = firebaseAuth;
            window.firebaseFirestore = firebaseFirestore;
            window.firebaseApp = app;
            window.auth = auth;
            window.db = db;
            
            resolve({ app, auth, db, firebaseAuth, firebaseFirestore });
            
        } catch (error) {
            console.error("❌ Firebase initialization failed:", error);
            reject(error);
        }
    });
}

// Make initializeFirebase globally available
window.initializeFirebase = initializeFirebase;

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initializeFirebase();
        // Hide the loading screen after Firebase is initialized
        setTimeout(() => {
            const loader = document.getElementById('app-loader');
            if (loader) {
                loader.classList.add('hidden');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 300);
            }
        }, 1000);
    } catch (error) {
        console.error("Failed to auto-initialize Firebase:", error);
        // Show error to user
        const loader = document.getElementById('app-loader');
        if (loader) {
            loader.innerHTML = `
                <div style="text-align: center; color: #d32f2f;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 50px; margin-bottom: 20px;"></i>
                    <h3>Connection Error</h3>
                    <p>Failed to connect to server. Please check your internet connection and refresh.</p>
                    <p style="font-size: 14px; margin-top: 20px;">Error: ${error.message}</p>
                    <button onclick="location.reload()" style="
                        background: var(--primary-color);
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-top: 20px;
                    ">
                        <i class="fas fa-redo"></i> Refresh Page
                    </button>
                </div>
            `;
        }
    }
});// Simple Firebase initialization
console.log("Loading Firebase...");

// Firebase configuration with your API key
const firebaseConfig = {
    apiKey: "AIzaSyBj1bi-xEDf-D0uBG1lSKUaMRI4JS8u4A4",
    authDomain: "ca-final-537aa.firebaseapp.com",
    projectId: "ca-final-537aa",
    storageBucket: "ca-final-537aa.firebasestorage.app",
    messagingSenderId: "156489737512",
    appId: "1:156489737512:web:f8b06ec7cba71ddfe99c1d"
};

let app = null;
let auth = null;
let db = null;

// Initialize Firebase
function initializeFirebase() {
    return new Promise(async (resolve, reject) => {
        try {
            // Dynamically load Firebase modules
            const firebaseApp = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
            const firebaseAuth = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
            const firebaseFirestore = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
            
            // Initialize Firebase
            app = firebaseApp.initializeApp(firebaseConfig);
            auth = firebaseAuth.getAuth(app);
            db = firebaseFirestore.getFirestore(app);
            
            console.log("✅ Firebase initialized successfully!");
            
            // Store Firebase functions globally for easy access
            window.firebaseAuth = firebaseAuth;
            window.firebaseFirestore = firebaseFirestore;
            window.firebaseApp = app;
            window.auth = auth;
            window.db = db;
            
            resolve({ app, auth, db, firebaseAuth, firebaseFirestore });
            
        } catch (error) {
            console.error("❌ Firebase initialization failed:", error);
            reject(error);
        }
    });
}

// Make initializeFirebase globally available
window.initializeFirebase = initializeFirebase;

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initializeFirebase();
        // Hide the loading screen after Firebase is initialized
        setTimeout(() => {
            const loader = document.getElementById('app-loader');
            if (loader) {
                loader.classList.add('hidden');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 300);
            }
        }, 1000);
    } catch (error) {
        console.error("Failed to auto-initialize Firebase:", error);
        // Show error to user
        const loader = document.getElementById('app-loader');
        if (loader) {
            loader.innerHTML = `
                <div style="text-align: center; color: #d32f2f;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 50px; margin-bottom: 20px;"></i>
                    <h3>Connection Error</h3>
                    <p>Failed to connect to server. Please check your internet connection and refresh.</p>
                    <p style="font-size: 14px; margin-top: 20px;">Error: ${error.message}</p>
                    <button onclick="location.reload()" style="
                        background: var(--primary-color);
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-top: 20px;
                    ">
                        <i class="fas fa-redo"></i> Refresh Page
                    </button>
                </div>
            `;
        }
    }
});

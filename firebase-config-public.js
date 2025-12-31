// This file is safe to upload to GitHub
// It loads Firebase configuration without exposing the API key

// Dynamically load Firebase configuration
const getFirebaseConfig = async () => {
    try {
        // Try to load from environment-specific file
        const response = await fetch('./firebase-config.json');
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.log('Using default Firebase config');
    }
    
    // Default config (API key will be populated at runtime)
    return {
        apiKey: window.firebaseApiKey || '',
        authDomain: "ca-final-537aa.firebaseapp.com",
        projectId: "ca-final-537aa",
        storageBucket: "ca-final-537aa.firebasestorage.app",
        messagingSenderId: "156489737512",
        appId: "1:156489737512:web:f8b06ec7cba71ddfe99c1d"
    };
};

export { getFirebaseConfig };

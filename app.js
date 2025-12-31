import { 
    auth, 
    db, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    doc,
    setDoc,
    getDoc
} from './firebase-config.js';

// Global variables
let currentUser = null;
let studyData = [];

// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loadingSpinner = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');

// Tab Switching
function switchTab(tab) {
    const loginTab = document.getElementById('login-form');
    const signupTab = document.getElementById('signup-form');
    const loginBtn = document.querySelector('.tab-btn:nth-child(1)');
    const signupBtn = document.querySelector('.tab-btn:nth-child(2)');
    
    if (tab === 'login') {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginBtn.classList.add('active');
        signupBtn.classList.remove('active');
    } else {
        loginTab.classList.remove('active');
        signupTab.classList.add('active');
        loginBtn.classList.remove('active');
        signupBtn.classList.add('active');
    }
}

// Toggle Password Visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Show Loading
function showLoading() {
    if (loadingSpinner) loadingSpinner.style.display = 'block';
}

// Hide Loading
function hideLoading() {
    if (loadingSpinner) loadingSpinner.style.display = 'none';
}

// Show Error
function showError(message) {
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
    console.error(message);
}

// Signup Function
async function signupUser() {
    const name = document.getElementById('signup-name')?.value;
    const email = document.getElementById('signup-email')?.value;
    const password = document.getElementById('signup-password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;
    
    if (!name || !email || !password || !confirmPassword) {
        showError('Please fill all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }
    
    try {
        showLoading();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            name: name,
            email: email,
            createdAt: new Date().toISOString(),
            progress: initializeStudyData()
        });
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        hideLoading();
        showError(error.message);
    }
}

// Login Function
async function loginUser() {
    const email = document.getElementById('login-email')?.value;
    const password = document.getElementById('login-password')?.value;
    
    if (!email || !password) {
        showError('Please fill all fields');
        return;
    }
    
    try {
        showLoading();
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'dashboard.html';
    } catch (error) {
        hideLoading();
        showError(error.message);
    }
}

// Initialize Study Data
function initializeStudyData() {
    // This is your consolidated table data
    return [
        // Paper 1: FR
        { subject: "Paper 1: FR", topic: "Introduction to GPFS", subtopic: "Ind AS 1 basics", weightage: "10-15%", priority: "B", estimatedTime: 4, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Introduction to GPFS", subtopic: "Schedule III Div II", weightage: "10-15%", priority: "B", estimatedTime: 2, completed: false, actualHours: 0 },
        // Add all other topics similarly...
        // Paper 2: AFM
        { subject: "Paper 2: AFM", topic: "Financial Policy", subtopic: "CFO role + Value creation", weightage: "8-15%", priority: "B", estimatedTime: 3, completed: false, actualHours: 0 },
        // Continue for all papers...
    ];
}

// Check Auth State
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        if (window.location.pathname.includes('index.html')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        currentUser = null;
        if (!window.location.pathname.includes('index.html')) {
            window.location.href = 'index.html';
        }
    }
});

// Logout Function
async function logout() {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        showError(error.message);
    }
}

// Export functions globally
window.switchTab = switchTab;
window.togglePassword = togglePassword;
window.signupUser = signupUser;
window.loginUser = loginUser;
window.logout = logout;

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (auth.currentUser && window.location.pathname.includes('index.html')) {
        window.location.href = 'dashboard.html';
    }
});

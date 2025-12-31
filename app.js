import { 
    auth, 
    db, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    doc,
    setDoc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    updateDoc
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

// COMPLETE STUDY DATA - All 6 Papers from Consolidated Table
function initializeStudyData() {
    return [
        // ===== PAPER 1: FINANCIAL REPORTING (153 hrs) =====
        { subject: "Paper 1: FR", topic: "Introduction to GPFS", subtopic: "Ind AS 1 basics", weightage: "10-15%", priority: "B", estimatedTime: 4, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Introduction to GPFS", subtopic: "Schedule III Div II", weightage: "10-15%", priority: "B", estimatedTime: 2, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Introduction to GPFS", subtopic: "Applicability criteria", weightage: "10-15%", priority: "B", estimatedTime: 2, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Conceptual Framework", subtopic: "Application to GPFS", weightage: "5-10%", priority: "A", estimatedTime: 6, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Presentation of Items", subtopic: "Ind AS 1: Presentation", weightage: "5-10%", priority: "A", estimatedTime: 3, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Presentation of Items", subtopic: "Ind AS 34: Interim", weightage: "5-10%", priority: "A", estimatedTime: 2, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Presentation of Items", subtopic: "Ind AS 7: Cash Flows", weightage: "5-10%", priority: "A", estimatedTime: 3, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Measurement Policies", subtopic: "Ind AS 8: Policies/Errors", weightage: "5-10%", priority: "A", estimatedTime: 3, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Measurement Policies", subtopic: "Ind AS 10: Events", weightage: "5-10%", priority: "A", estimatedTime: 2, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Measurement Policies", subtopic: "Ind AS 113: Fair Value", weightage: "5-10%", priority: "A", estimatedTime: 2, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Income Statement", subtopic: "Ind AS 115: Revenue", weightage: "5-10%", priority: "A", estimatedTime: 12, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Assets", subtopic: "Ind AS 2: Inventories", weightage: "15-25%", priority: "A", estimatedTime: 4, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Assets", subtopic: "Ind AS 16: PPE", weightage: "15-25%", priority: "A", estimatedTime: 5, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Assets", subtopic: "Ind AS 116: Leases", weightage: "15-25%", priority: "A", estimatedTime: 6, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Assets", subtopic: "Ind AS 23: Borrowing Costs", weightage: "15-25%", priority: "A", estimatedTime: 2, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Assets", subtopic: "Ind AS 36: Impairment", weightage: "15-25%", priority: "A", estimatedTime: 4, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Assets", subtopic: "Ind AS 38: Intangibles", weightage: "15-25%", priority: "A", estimatedTime: 3, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Liabilities", subtopic: "Ind AS 19: Employee Benefits", weightage: "15-25%", priority: "A", estimatedTime: 5, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Liabilities", subtopic: "Ind AS 37: Provisions", weightage: "15-25%", priority: "A", estimatedTime: 5, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Items Impacting FS", subtopic: "Ind AS 12: Income Taxes", weightage: "15-20%", priority: "A", estimatedTime: 8, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Items Impacting FS", subtopic: "Ind AS 21: FX Rates", weightage: "15-20%", priority: "A", estimatedTime: 2, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Disclosures", subtopic: "Ind AS 24: Related Parties", weightage: "15-20%", priority: "B", estimatedTime: 2, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Disclosures", subtopic: "Ind AS 33: EPS", weightage: "15-20%", priority: "B", estimatedTime: 2, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Disclosures", subtopic: "Ind AS 108: Segments", weightage: "15-20%", priority: "B", estimatedTime: 2, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Financial Instruments", subtopic: "Ind AS 32/107/109 Classification", weightage: "10-15%", priority: "A", estimatedTime: 8, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Financial Instruments", subtopic: "Derivatives/Hedge Accounting", weightage: "10-15%", priority: "A", estimatedTime: 8, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Group Accounting", subtopic: "Ind AS 103: Business Combos", weightage: "10-20%", priority: "A", estimatedTime: 10, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Group Accounting", subtopic: "Ind AS 110/111/28: Consolidation", weightage: "10-20%", priority: "A", estimatedTime: 8, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "First-time Adoption", subtopic: "Ind AS 101", weightage: "5-10%", priority: "B", estimatedTime: 4, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "FS Analysis", subtopic: "Ind AS based analysis", weightage: "5-10%", priority: "B", estimatedTime: 5, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Ethics & Tech", subtopic: "Ethical issues", weightage: "5-10%", priority: "C", estimatedTime: 2, completed: false, actualHours: 0 },
        { subject: "Paper 1: FR", topic: "Ethics & Tech", subtopic: "Technology evolution", weightage: "5-10%", priority: "C", estimatedTime: 1, completed: false, actualHours: 0 },

        // ===== PAPER 2: ADVANCED FINANCIAL MANAGEMENT (150 hrs) =====
        { subject: "Paper 2: AFM", topic: "Financial Policy", subtopic: "CFO role + Value creation", weightage: "8-15%", priority: "B", estimatedTime: 3, completed: false, actualHours: 0 },
        { subject: "Paper 2: AFM", topic: "Financial Policy", subtopic: "Strategic framework", weightage: "8-15%", priority: "B", estimatedTime: 3, completed: false, actualHours: 0 },
        { subject: "Paper 2: AFM", topic: "Risk Management", subtopic: "Risk types + VaR", weightage: "8-15%", priority: "A", estimatedTime: 10, completed: false, actualHours: 0 },
        { subject: "Paper 2: AFM", topic: "Advanced Cap Budgeting", subtopic: "Inflation/Tech impact", weightage: "20-30%", priority: "A", estimatedTime: 7, completed: false, actualHours: 0 },
        { subject: "Paper 2: AFM", topic: "Advanced Cap Budgeting", subtopic: "Risk methods + APV", weightage: "20-30%", priority: "A", estimatedTime: 7, completed: false, actualHours: 0 },
        { subject: "Paper 2: AFM", topic: "Security Analysis", subtopic: "Fundamental Analysis", weightage: "20-30%", priority: "A", estimatedTime: 6, completed: false, actualHours: 0 },
        { subject: "Paper 2: AFM", topic: "Security Analysis", subtopic: "Technical Analysis + EMH", weightage: "20-30%", priority: "A", estimatedTime: 6, completed: false, actualHours: 0 },
        { subject: "Paper 2: AFM", topic: "Security Valuation", subtopic: "Equity/Pref/Debentures", weightage: "20-30%", priority: "A", estimatedTime: 6, completed: false, actualHours: 0 },
        { subject: "Paper 2: AFM", topic: "Security Valuation", subtopic: "CAPM + Risk premium", weightage: "20-30%", priority: "A", estimatedTime: 6, completed: false, actualHours: 0 },
        { subject: "Paper 2: AFM", topic: "Portfolio Management", subtopic: "Analysis/Selection/Revision", weightage: "20-30%", priority: "A", estimatedTime: 8, completed: false, actualHours: 0 },
        { subject: "Paper 2: AFM", topic: "Portfolio Management", subtopic: "Securitization + Mutual Funds", weightage: "20-30%", priority: "A", estimatedTime: 4, completed: false, actualHours: 0 },
        { subject: "Paper 2: AFM", topic: "Derivatives", subtopic: "Forwards/Futures/Options", weightage: "20-25%", priority: "A", estimatedTime: 8, completed: false, actualHours: 0 },
        { subject: "Paper 2: AFM", topic: "Derivatives", subtopic: "Swaps + Greeks", weightage: "20-25%", priority: "A", estimatedTime: 8, completed: false, actualHours: 0 },
        { subject: "Paper 2: AFM", topic: "Forex Risk", subtopic: "FX factors + SWIFT", weightage: "20-25%", priority: "A", estimatedTime: 12, completed: false, actualHours: 0 },
        { subject: "Paper 2: AFM", topic: "Business Valuation", subtopic: "Asset/Earning/Cashflow models", weightage: "10-15%", priority: "A", estimatedTime: 7, completed: false, actualHours: 0 },
        { subject: "Paper 2: AFM", topic: "Business Valuation", subtopic: "CAPM/APT + EVA/MVA", weightage: "10-15%", priority: "A", estimatedTime: 7, completed: false, actualHours: 0 },
        { subject: "Paper 2: AFM", topic: "Mergers", subtopic: "M&A + Takeovers + LBO", weightage: "2-5%", priority: "A", estimatedTime: 6, completed: false, actualHours: 0 },
        { subject: "Paper 2: AFM", topic: "Startup Finance", subtopic: "Unicorns + Funding", weightage: "2-5%", priority: "B", estimatedTime: 6, completed: false, actualHours: 0 },

        // ===== PAPER 3: ADVANCED AUDITING (120 hrs) =====
        { subject: "Paper 3: Audit", topic: "Quality Control", subtopic: "SQC 1 + SA 220", weightage: "45-55%", priority: "A", estimatedTime: 6, completed: false, actualHours: 0 },
        { subject: "Paper 3: Audit", topic: "General Principles", subtopic: "SA 240 (Fraud) + SA 250", weightage: "45-55%", priority: "A", estimatedTime: 4, completed: false, actualHours: 0 },
        { subject: "Paper 3: Audit", topic: "General Principles", subtopic: "SA 260 + SA 299 (Joint Audit)", weightage: "45-55%", priority: "A", estimatedTime: 4, completed: false, actualHours: 0 },
        { subject: "Paper 3: Audit", topic: "Audit Planning", subtopic: "SA 300/450/520/540", weightage: "45-55%", priority: "A", estimatedTime: 5, completed: false, actualHours: 0 },
        { subject: "Paper 3: Audit", topic: "Materiality & Risk", subtopic: "SA 265/315/320/330", weightage: "3-6%", priority: "A", estimatedTime: 6, completed: false, actualHours: 0 },
        { subject: "Paper 3: Audit", topic: "Audit Evidence", subtopic: "SA 500/501/505/530", weightage: "3-6%", priority: "A", estimatedTime: 5, completed: false, actualHours: 0 },
        { subject: "Paper 3: Audit", topic: "Completion", subtopic: "SA 560/570/580", weightage: "17-24%", priority: "A", estimatedTime: 4, completed: false, actualHours: 0 },
        { subject: "Paper 3: Audit", topic: "Reporting", subtopic: "SA 700/701/705/706", weightage: "17-24%", priority: "A", estimatedTime: 6, completed: false, actualHours: 0 },
        { subject: "Paper 3: Audit", topic: "Special Audits", subtopic: "Banks + NBFC + PSU", weightage: "17-24%", priority: "A", estimatedTime: 5, completed: false, actualHours: 0 },
        { subject: "Paper 3: Audit", topic: "Digital Auditing", subtopic: "CAATs + AI + Data Analytics", weightage: "3-6%", priority: "A", estimatedTime: 8, completed: false, actualHours: 0 },
        { subject: "Paper 3: Audit", topic: "Professional Ethics", subtopic: "CA Act + IESBA Code", weightage: "17-24%", priority: "A", estimatedTime: 10, completed: false, actualHours: 0 },

        // ===== PAPER 4: DIRECT TAX LAWS (85 hrs) =====
        { subject: "Paper 4: DT", topic: "Company Taxation", subtopic: "Computation - General Provisions", weightage: "40-45%", priority: "A", estimatedTime: 12, completed: false, actualHours: 0 },
        { subject: "Paper 4: DT", topic: "Company Taxation", subtopic: "Special Regimes (115BAA/BAB)", weightage: "40-45%", priority: "A", estimatedTime: 8, completed: false, actualHours: 0 },
        { subject: "Paper 4: DT", topic: "Company Taxation", subtopic: "Charitable Trusts (Sec 11-13)", weightage: "40-45%", priority: "A", estimatedTime: 5, completed: false, actualHours: 0 },
        { subject: "Paper 4: DT", topic: "Company Taxation", subtopic: "GAAR + Business Trusts", weightage: "40-45%", priority: "A", estimatedTime: 5, completed: false, actualHours: 0 },
        { subject: "Paper 4: DT", topic: "Tax Administration", subtopic: "TDS/TCS (Sec 192-206C)", weightage: "20-30%", priority: "B", estimatedTime: 6, completed: false, actualHours: 0 },
        { subject: "Paper 4: DT", topic: "Tax Administration", subtopic: "Assessment Procedures", weightage: "20-30%", priority: "B", estimatedTime: 5, completed: false, actualHours: 0 },
        { subject: "Paper 4: DT", topic: "Tax Administration", subtopic: "Appeals + Revision", weightage: "20-30%", priority: "B", estimatedTime: 4, completed: false, actualHours: 0 },
        { subject: "Paper 4: DT", topic: "International Taxation", subtopic: "Transfer Pricing (Sec 92)", weightage: "30-35%", priority: "A", estimatedTime: 10, completed: false, actualHours: 0 },
        { subject: "Paper 4: DT", topic: "International Taxation", subtopic: "Non-Resident Taxation", weightage: "30-35%", priority: "A", estimatedTime: 8, completed: false, actualHours: 0 },
        { subject: "Paper 4: DT", topic: "International Taxation", subtopic: "DTAA + BEPS", weightage: "30-35%", priority: "A", estimatedTime: 7, completed: false, actualHours: 0 },

        // ===== PAPER 5: INDIRECT TAX LAWS (82 hrs) =====
        // GST Section
        { subject: "Paper 5: IDT", topic: "GST - Core Concepts", subtopic: "Levy/Collection CGST/IGST", weightage: "45-65%", priority: "A", estimatedTime: 5, completed: false, actualHours: 0 },
        { subject: "Paper 5: IDT", topic: "GST - Core Concepts", subtopic: "Supply (Sec 7 + Sch I/II/III)", weightage: "45-65%", priority: "A", estimatedTime: 4, completed: false, actualHours: 0 },
        { subject: "Paper 5: IDT", topic: "GST - Core Concepts", subtopic: "Charge of Tax + RCM", weightage: "45-65%", priority: "A", estimatedTime: 3, completed: false, actualHours: 0 },
        { subject: "Paper 5: IDT", topic: "GST - Core Concepts", subtopic: "ITC (Sec 16-18)", weightage: "45-65%", priority: "A", estimatedTime: 6, completed: false, actualHours: 0 },
        { subject: "Paper 5: IDT", topic: "GST - Procedures", subtopic: "Registration (Sec 22-29)", weightage: "10-30%", priority: "B", estimatedTime: 4, completed: false, actualHours: 0 },
        { subject: "Paper 5: IDT", topic: "GST - Procedures", subtopic: "Returns (GSTR 1/3B/9)", weightage: "10-30%", priority: "B", estimatedTime: 4, completed: false, actualHours: 0 },
        { subject: "Paper 5: IDT", topic: "GST - Compliance", subtopic: "Demands/Recovery (Sec 73-76)", weightage: "15-30%", priority: "B", estimatedTime: 4, completed: false, actualHours: 0 },
        { subject: "Paper 5: IDT", topic: "GST - Compliance", subtopic: "Appeals/Advance Ruling", weightage: "15-30%", priority: "B", estimatedTime: 3, completed: false, actualHours: 0 },
        // Customs & FTP
        { subject: "Paper 5: IDT", topic: "Customs", subtopic: "Levy + Classification", weightage: "40-65%", priority: "B", estimatedTime: 4, completed: false, actualHours: 0 },
        { subject: "Paper 5: IDT", topic: "Customs", subtopic: "Import/Export Procedures", weightage: "40-65%", priority: "B", estimatedTime: 3, completed: false, actualHours: 0 },
        { subject: "Paper 5: IDT", topic: "FTP", subtopic: "Export Promotion Schemes", weightage: "10-20%", priority: "C", estimatedTime: 4, completed: false, actualHours: 0 },

        // ===== PAPER 6: INTEGRATED BUSINESS SOLUTIONS (60 hrs) =====
        { subject: "Paper 6: IBS", topic: "Multi-disciplinary Cases", subtopic: "FR + AFM + Audit + DT + IDT", weightage: "100%", priority: "A", estimatedTime: 60, completed: false, actualHours: 0 },
    ];
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
        
        hideLoading();
        showError('Account created successfully! Redirecting...');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        
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
        hideLoading();
        window.location.href = 'dashboard.html';
    } catch (error) {
        hideLoading();
        showError(error.message);
    }
}

// Load User Study Data
async function loadUserStudyData(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            studyData = userDoc.data().progress || initializeStudyData();
            return studyData;
        } else {
            studyData = initializeStudyData();
            return studyData;
        }
    } catch (error) {
        showError('Failed to load study data: ' + error.message);
        return initializeStudyData();
    }
}

// Update Study Progress
async function updateStudyProgress(userId, updatedData) {
    try {
        await updateDoc(doc(db, 'users', userId), {
            progress: updatedData,
            lastUpdated: new Date().toISOString()
        });
        studyData = updatedData;
        return true;
    } catch (error) {
        showError('Failed to update progress: ' + error.message);
        return false;
    }
}

// Get Study Statistics
function getStudyStatistics() {
    const totalTopics = studyData.length;
    const completedTopics = studyData.filter(item => item.completed).length;
    const totalEstimatedHours = studyData.reduce((sum, item) => sum + item.estimatedTime, 0);
    const totalActualHours = studyData.reduce((sum, item) => sum + item.actualHours, 0);
    const progressPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    
    return {
        totalTopics,
        completedTopics,
        totalEstimatedHours,
        totalActualHours,
        progressPercentage,
        remainingHours: totalEstimatedHours - totalActualHours
    };
}

// Get Topics by Subject
function getTopicsBySubject(subject) {
    return studyData.filter(item => item.subject === subject);
}

// Get Topics by Priority
function getTopicsByPriority(priority) {
    return studyData.filter(item => item.priority === priority);
}

// Get Topics by Status
function getTopicsByStatus(completed = false) {
    return studyData.filter(item => item.completed === completed);
}

// Mark Topic as Complete
function markTopicComplete(topicIndex) {
    if (studyData[topicIndex]) {
        studyData[topicIndex].completed = true;
        studyData[topicIndex].completedDate = new Date().toISOString();
        return true;
    }
    return false;
}

// Update Actual Hours
function updateActualHours(topicIndex, hours) {
    if (studyData[topicIndex]) {
        studyData[topicIndex].actualHours = hours;
        return true;
    }
    return false;
}

// Check Auth State
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        // Load user study data on auth state change
        loadUserStudyData(user.uid);
        
        if (window.location.pathname.includes('index.html') || 
            window.location.pathname.endsWith('/')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        currentUser = null;
        if (!window.location.pathname.includes('index.html') && 
            !window.location.pathname.includes('login') &&
            !window.location.pathname.endsWith('/')) {
            window.location.href = 'index.html';
        }
    }
});

// Logout Function
async function logout() {
    try {
        await signOut(auth);
        currentUser = null;
        studyData = [];
        window.location.href = 'index.html';
    } catch (error) {
        showError(error.message);
    }
}

// Get Current User
function getCurrentUser() {
    return currentUser;
}

// Get Study Data
function getStudyData() {
    return studyData;
}

// Export functions globally
window.switchTab = switchTab;
window.togglePassword = togglePassword;
window.signupUser = signupUser;
window.loginUser = loginUser;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.getStudyData = getStudyData;
window.getStudyStatistics = getStudyStatistics;
window.getTopicsBySubject = getTopicsBySubject;
window.getTopicsByPriority = getTopicsByPriority;
window.getTopicsByStatus = getTopicsByStatus;
window.markTopicComplete = markTopicComplete;
window.updateActualHours = updateActualHours;
window.updateStudyProgress = updateStudyProgress;
window.loadUserStudyData = loadUserStudyData;

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (auth.currentUser && (window.location.pathname.includes('index.html') || 
        window.location.pathname.endsWith('/'))) {
        window.location.href = 'dashboard.html';
    }
});

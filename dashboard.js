import { 
    auth, 
    db, 
    doc, 
    getDoc, 
    updateDoc,
    onAuthStateChanged 
} from './firebase-config.js';

let studyData = [];
let charts = {};

// Initialize Dashboard
async function initDashboard() {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        // Load user data
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            document.getElementById('user-name').textContent = userData.name || 'User';
            studyData = userData.progress || [];
            
            // Update UI
            updateStats();
            renderTable();
            updateCharts();
            updateKPI();
            loadRecentActivity();
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Update Statistics
function updateStats() {
    const totalTopics = studyData.length;
    const completedTopics = studyData.filter(item => item.completed).length;
    const totalHours = studyData.reduce((sum, item) => sum + (item.actualHours || 0), 0);
    const plannedHours = studyData.reduce((sum, item) => sum + item.estimatedTime, 0);
    
    document.getElementById('total-topics').textContent = totalTopics;
    document.getElementById('completed-topics').textContent = completedTopics;
    document.getElementById('total-hours').textContent = totalHours.toFixed(1);
    document.getElementById('planned-hours').textContent = plannedHours;
    document.getElementById('actual-hours').textContent = totalHours.toFixed(1);
    document.getElementById('hours-remaining').textContent = (plannedHours - totalHours).toFixed(1);
    
    // Calculate overall percentage
    const overallPercentage = totalTopics > 0 ? (completedTopics / totalTopics * 100).toFixed(1) : 0;
    document.getElementById('overall-percentage').textContent = `${overallPercentage}%`;
}

// Update Charts
function updateCharts() {
    updateOverallChart();
    updateSubjectChart();
}

function updateOverallChart() {
    const ctx = document.getElementById('overallProgressChart');
    if (!ctx) return;
    
    const completed = studyData.filter(item => item.completed).length;
    const pending = studyData.length - completed;
    
    if (charts.overall) {
        charts.overall.destroy();
    }
    
    charts.overall = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Pending'],
            datasets: [{
                data: [completed, pending],
                backgroundColor: ['#4cc9f0', '#e9ecef'],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '70%',
            rotation: -90,
            circumference: 180,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} topics`;
                        }
                    }
                }
            }
        }
    });
}

function updateSubjectChart() {
    const ctx = document.getElementById('subjectProgressChart');
    if (!ctx) return;
    
    const subject = document.getElementById('subject-select').value;
    let filteredData = studyData;
    
    if (subject !== 'all') {
        filteredData = studyData.filter(item => item.subject === subject);
    }
    
    const completed = filteredData.filter(item => item.completed).length;
    const pending = filteredData.length - completed;
    const percentage = filteredData.length > 0 ? (completed / filteredData.length * 100).toFixed(1) : 0;
    
    document.getElementById('subject-percentage').textContent = `${percentage}%`;
    document.getElementById('subject-label').textContent = subject === 'all' ? 'Overall Completion' : `${subject} Completion`;
    
    if (charts.subject) {
        charts.subject.destroy();
    }
    
    charts.subject = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Pending'],
            datasets: [{
                data: [completed, pending],
                backgroundColor: ['#4361ee', '#e9ecef'],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '70%',
            rotation: -90,
            circumference: 180,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Update KPI
function updateKPI() {
    // Priority coverage
    const priorityA = studyData.filter(item => item.priority === 'A');
    const priorityB = studyData.filter(item => item.priority === 'B');
    const priorityC = studyData.filter(item => item.priority === 'C');
    
    const completedA = priorityA.filter(item => item.completed).length;
    const completedB = priorityB.filter(item => item.completed).length;
    const completedC = priorityC.filter(item => item.completed).length;
    
    document.getElementById('priority-a').textContent = priorityA.length > 0 ? `${((completedA / priorityA.length) * 100).toFixed(1)}%` : '0%';
    document.getElementById('priority-b').textContent = priorityB.length > 0 ? `${((completedB / priorityB.length) * 100).toFixed(1)}%` : '0%';
    document.getElementById('priority-c').textContent = priorityC.length > 0 ? `${((completedC / priorityC.length) * 100).toFixed(1)}%` : '0%';
    
    // Study timeline
    const daysToExam = 180; // Example: 6 months
    const dailyTarget = 680 / daysToExam; // Total hours / days
    const currentPace = studyData.reduce((sum, item) => sum + item.actualHours, 0) / (daysToExam / 2);
    
    document.getElementById('days-to-exam').textContent = daysToExam;
    document.getElementById('daily-target').textContent = dailyTarget.toFixed(1);
    document.getElementById('current-pace').textContent = `${currentPace.toFixed(1)} hrs/day`;
}

// Render Table
function renderTable() {
    const tbody = document.getElementById('table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    let rowCount = 0;
    
    studyData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.subject}</td>
            <td>${item.topic}</td>
            <td>${item.subtopic}</td>
            <td>${item.weightage}</td>
            <td><span class="priority-badge">${item.priority}</span></td>
            <td>${item.estimatedTime}</td>
            <td>${item.actualHours || 0}</td>
            <td><span class="status-badge ${item.completed ? 'status-completed' : 'status-pending'}">${item.completed ? 'Completed' : 'Pending'}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-small btn-edit" onclick="editProgress(${index})">Edit</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
        rowCount++;
    });
    
    document.getElementById('total-rows').textContent = studyData.length;
    document.getElementById('visible-rows').textContent = rowCount;
}

// Filter Table
function filterTable() {
    const subject = document.getElementById('filter-subject').value;
    const status = document.getElementById('filter-status').value;
    const search = document.getElementById('search-topic').value.toLowerCase();
    
    const rows = document.querySelectorAll('#table-body tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const rowSubject = row.cells[0].textContent;
        const rowStatus = row.cells[7].querySelector('.status-badge').textContent.toLowerCase();
        const rowText = row.textContent.toLowerCase();
        
        const subjectMatch = subject === 'all' || rowSubject === subject;
        const statusMatch = status === 'all' || 
            (status === 'completed' && rowStatus === 'completed') ||
            (status === 'pending' && rowStatus === 'pending');
        const searchMatch = !search || rowText.includes(search);
        
        if (subjectMatch && statusMatch && searchMatch) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    document.getElementById('visible-rows').textContent = visibleCount;
}

// Edit Progress
let editingIndex = null;
function editProgress(index) {
    editingIndex = index;
    const item = studyData[index];
    
    document.getElementById('modal-subject').value = item.subject;
    document.getElementById('modal-topic').value = item.topic;
    document.getElementById('modal-subtopic').value = item.subtopic;
    document.getElementById('modal-actual-hours').value = item.actualHours || '';
    document.getElementById('modal-status').value = item.completed ? 'completed' : 'pending';
    document.getElementById('modal-notes').value = item.notes || '';
    
    document.getElementById('progress-modal').style.display = 'flex';
}

// Save Progress
async function saveProgress() {
    const actualHours = parseFloat(document.getElementById('modal-actual-hours').value) || 0;
    const status = document.getElementById('modal-status').value;
    const notes = document.getElementById('modal-notes').value;
    
    if (editingIndex !== null) {
        studyData[editingIndex].actualHours = actualHours;
        studyData[editingIndex].completed = status === 'completed';
        studyData[editingIndex].notes = notes;
        
        // Save to Firebase
        const user = auth.currentUser;
        if (user) {
            try {
                await updateDoc(doc(db, 'users', user.uid), {
                    progress: studyData
                });
                
                // Update UI
                updateStats();
                renderTable();
                updateCharts();
                updateKPI();
                closeModal();
                addActivity('Updated progress', `Updated ${studyData[editingIndex].subtopic}`);
                
            } catch (error) {
                console.error('Error saving progress:', error);
                showError('Failed to save progress');
            }
        }
    }
}

// Close Modal
function closeModal() {
    document.getElementById('progress-modal').style.display = 'none';
    editingIndex = null;
}

// Update Subject Progress
function updateSubjectProgress() {
    updateSubjectChart();
}

// Add Activity
function addActivity(title, description) {
    const activityList = document.getElementById('activity-list');
    if (!activityList) return;
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
        <div class="activity-icon">
            <i class="fas fa-check"></i>
        </div>
        <div>
            <strong>${title}</strong>
            <p>${description}</p>
            <small>Just now</small>
        </div>
    `;
    
    activityList.insertBefore(activityItem, activityList.firstChild);
    
    // Keep only last 5 activities
    while (activityList.children.length > 5) {
        activityList.removeChild(activityList.lastChild);
    }
}

// Load Recent Activity
function loadRecentActivity() {
    // This would typically load from Firebase
    // For now, we'll show some sample activities
    const activities = [
        { title: 'Logged in', description: 'Started study session', time: '5 minutes ago' },
        { title: 'Completed topic', description: 'Finished Ind AS 1 basics', time: '2 hours ago' },
        { title: 'Added video', description: 'Added FR video playlist', time: '1 day ago' }
    ];
    
    const activityList = document.getElementById('activity-list');
    if (!activityList) return;
    
    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fas fa-${activity.title.includes('Logged') ? 'sign-in-alt' : activity.title.includes('Completed') ? 'check' : 'video'}"></i>
            </div>
            <div>
                <strong>${activity.title}</strong>
                <p>${activity.description}</p>
                <small>${activity.time}</small>
            </div>
        `;
        activityList.appendChild(activityItem);
    });
}

// Export Data
function exportData() {
    const dataStr = JSON.stringify(studyData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ca-final-progress-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Export functions globally
window.updateSubjectProgress = updateSubjectProgress;
window.filterTable = filterTable;
window.editProgress = editProgress;
window.saveProgress = saveProgress;
window.closeModal = closeModal;
window.exportData = exportData;
window.toggleMobileMenu = toggleMobileMenu;

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', initDashboard);

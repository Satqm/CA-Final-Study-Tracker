import { 
    auth, 
    db, 
    doc, 
    getDoc, 
    updateDoc,
    arrayUnion,
    arrayRemove 
} from './firebase-config.js';

let videos = [];

// Initialize Videos Page
async function initVideos() {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            videos = userData.videos || [];
            renderVideos();
        }
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

// Show Video Form
function showVideoForm() {
    document.getElementById('video-form-modal').style.display = 'flex';
}

// Close Video Form
function closeVideoForm() {
    document.getElementById('video-form-modal').style.display = 'none';
    // Reset form
    document.getElementById('video-form').reset();
}

// Save Video
async function saveVideo() {
    const subject = document.getElementById('video-subject').value;
    const topic = document.getElementById('video-topic').value;
    const title = document.getElementById('video-title').value;
    const url = document.getElementById('video-url').value;
    const type = document.getElementById('video-type').value;
    const duration = parseInt(document.getElementById('video-duration').value) || 0;
    const notes = document.getElementById('video-notes').value;
    
    if (!subject || !topic || !title || !url) {
        alert('Please fill all required fields');
        return;
    }
    
    const video = {
        id: Date.now().toString(),
        subject,
        topic,
        title,
        url,
        type,
        duration,
        notes,
        createdAt: new Date().toISOString()
    };
    
    videos.push(video);
    
    // Save to Firebase
    const user = auth.currentUser;
    if (user) {
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                videos: videos
            });
            
            renderVideos();
            closeVideoForm();
            
        } catch (error) {
            console.error('Error saving video:', error);
            alert('Failed to save video');
        }
    }
}

// Render Videos
function renderVideos() {
    const container = document.getElementById('videos-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    videos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <div class="video-header">
                <h4>${video.subject}</h4>
                <p>${video.topic}</p>
            </div>
            <div class="video-body">
                <h5>${video.title}</h5>
                <p class="video-meta">
                    <i class="fas fa-clock"></i> ${video.duration || 'N/A'} min
                    <span class="video-type">${video.type}</span>
                </p>
                ${video.notes ? `<p class="video-notes">${video.notes}</p>` : ''}
            </div>
            <div class="video-footer">
                <a href="${video.url}" target="_blank" class="btn-primary" style="padding: 0.5rem 1rem;">
                    <i class="fas fa-play"></i> Play
                </a>
                <button class="btn-small btn-delete" onclick="deleteVideo('${video.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(videoCard);
    });
}

// Filter Videos
function filterVideos() {
    const subject = document.getElementById('filter-video-subject').value;
    const search = document.getElementById('search-video').value.toLowerCase();
    
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(card => {
        const cardSubject = card.querySelector('.video-header h4').textContent;
        const cardText = card.textContent.toLowerCase();
        
        const subjectMatch = subject === 'all' || cardSubject === subject;
        const searchMatch = !search || cardText.includes(search);
        
        card.style.display = subjectMatch && searchMatch ? 'block' : 'none';
    });
}

// Delete Video
async function deleteVideo(videoId) {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    videos = videos.filter(video => video.id !== videoId);
    
    const user = auth.currentUser;
    if (user) {
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                videos: videos
            });
            
            renderVideos();
            
        } catch (error) {
            console.error('Error deleting video:', error);
            alert('Failed to delete video');
        }
    }
}

// Export functions globally
window.showVideoForm = showVideoForm;
window.closeVideoForm = closeVideoForm;
window.saveVideo = saveVideo;
window.filterVideos = filterVideos;
window.deleteVideo = deleteVideo;

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', initVideos);

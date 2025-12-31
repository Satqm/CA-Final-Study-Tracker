import { 
    auth, 
    db, 
    doc, 
    getDoc, 
    updateDoc
} from './firebase-config.js';

let notes = [];

// Initialize Notes Page
async function initNotes() {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            notes = userData.notes || [];
            renderNotes();
        }
    } catch (error) {
        console.error('Error loading notes:', error);
    }
}

// Show Note Form
function showNoteForm() {
    document.getElementById('note-form-modal').style.display = 'flex';
}

// Close Note Form
function closeNoteForm() {
    document.getElementById('note-form-modal').style.display = 'none';
    // Reset form
    document.getElementById('note-form').reset();
}

// Save Note
async function saveNote() {
    const subject = document.getElementById('note-subject').value;
    const topic = document.getElementById('note-topic').value;
    const title = document.getElementById('note-title').value;
    const url = document.getElementById('note-url').value;
    const type = document.getElementById('note-type').value;
    const description = document.getElementById('note-description').value;
    
    if (!subject || !topic || !title || !url) {
        alert('Please fill all required fields');
        return;
    }
    
    const note = {
        id: Date.now().toString(),
        subject,
        topic,
        title,
        url,
        type,
        description,
        createdAt: new Date().toISOString()
    };
    
    notes.push(note);
    
    // Save to Firebase
    const user = auth.currentUser;
    if (user) {
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                notes: notes
            });
            
            renderNotes();
            closeNoteForm();
            
        } catch (error) {
            console.error('Error saving note:', error);
            alert('Failed to save note');
        }
    }
}

// Render Notes
function renderNotes() {
    const container = document.getElementById('notes-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    notes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.innerHTML = `
            <div class="note-header">
                <h4>${note.subject}</h4>
                <p>${note.topic}</p>
            </div>
            <div class="note-body">
                <h5>${note.title}</h5>
                <p class="note-meta">
                    <i class="fas fa-file"></i> ${note.type}
                </p>
                ${note.description ? `<p class="note-description">${note.description}</p>` : ''}
            </div>
            <div class="note-footer">
                <a href="${note.url}" target="_blank" class="btn-primary" style="padding: 0.5rem 1rem;">
                    <i class="fas fa-external-link-alt"></i> Open
                </a>
                <button class="btn-small btn-delete" onclick="deleteNote('${note.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(noteCard);
    });
}

// Filter Notes
function filterNotes() {
    const subject = document.getElementById('filter-note-subject').value;
    const search = document.getElementById('search-note').value.toLowerCase();
    
    const noteCards = document.querySelectorAll('.note-card');
    
    noteCards.forEach(card => {
        const cardSubject = card.querySelector('.note-header h4').textContent;
        const cardText = card.textContent.toLowerCase();
        
        const subjectMatch = subject === 'all' || cardSubject === subject;
        const searchMatch = !search || cardText.includes(search);
        
        card.style.display = subjectMatch && searchMatch ? 'block' : 'none';
    });
}

// Delete Note
async function deleteNote(noteId) {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    notes = notes.filter(note => note.id !== noteId);
    
    const user = auth.currentUser;
    if (user) {
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                notes: notes
            });
            
            renderNotes();
            
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('Failed to delete note');
        }
    }
}

// Export functions globally
window.showNoteForm = showNoteForm;
window.closeNoteForm = closeNoteForm;
window.saveNote = saveNote;
window.filterNotes = filterNotes;
window.deleteNote = deleteNote;

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', initNotes);

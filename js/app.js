// public/js/app.js
// DOM Elements
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const noteEditor = document.getElementById('note-editor');
const notesGrid = document.querySelector('.notes-grid');
const searchInput = document.querySelector('.search-bar input');
const viewControls = document.querySelectorAll('.view-controls .btn-icon');
const newNoteBtn = document.getElementById('new-note-btn');

let currentUser = null;
let currentView = 'grid';
let notes = [];

document.addEventListener('DOMContentLoaded', initializeApp);
searchInput.addEventListener('input', handleSearch);
viewControls.forEach(btn => btn.addEventListener('click', handleViewChange));
newNoteBtn.addEventListener('click', () => openNoteEditor());

async function initializeApp() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
            currentUser = session.user;
            showApp();
            loadNotes();
        } else {
            showAuth();
        }
        
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                currentUser = session.user;
                showApp();
                loadNotes();
            } else if (event === 'SIGNED_OUT') {
                currentUser = null;
                showAuth();
            }
        });
    } catch (error) {
        console.error('Error initializing app:', error);
        showToast('Error initializing application', 'error');
    }
}

function showAuth() {
    authContainer.classList.remove('hidden');
    appContainer.classList.add('hidden');
}

function showApp() {
    authContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');
    updateUserProfile();
}

function updateUserProfile() {
    const userNameElement = document.getElementById('user-name');
    const userAvatarElement = document.getElementById('user-avatar');
    
    if (currentUser) {
        userNameElement.textContent = currentUser.user_metadata?.full_name || currentUser.email;
        userAvatarElement.src = currentUser.user_metadata?.avatar_url || 'assets/default-avatar.png';
    }
}

async function loadNotes() {
    try {
        showLoading();
        
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        notes = data || [];
        renderNotes();
    } catch (error) {
        console.error('Error loading notes:', error);
        showToast('Error loading notes', 'error');
    } finally {
        hideLoading();
    }
}

function renderNotes() {
    notesGrid.innerHTML = '';
    
    if (notes.length === 0) {
        notesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-sticky-note"></i>
                <p>No notes found</p>
                <button class="btn btn-primary" onclick="openNoteEditor()">
                    Create your first note
                </button>
            </div>
        `;
        return;
    }
    
    notes.forEach(note => {
        const noteCard = createNoteCard(note);
        notesGrid.appendChild(noteCard);
    });
}

function createNoteCard(note) {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.innerHTML = `
        <h3>${note.title || 'Untitled Note'}</h3>
        <p>${note.content ? note.content.substring(0, 100) + (note.content.length > 100 ? '...' : '') : ''}</p>
        <div class="note-footer">
            <div class="note-date">
                ${new Date(note.updated_at).toLocaleDateString()}
            </div>
            <div class="note-actions">
                <button class="btn btn-icon" onclick="editNote('${note.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-icon" onclick="deleteNote('${note.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    return card;
}

function openNoteEditor(note = null) {
    const titleInput = noteEditor.querySelector('.note-title');
    const contentDiv = noteEditor.querySelector('.editor-content');
    
    if (note) {
        titleInput.value = note.title || '';
        contentDiv.innerHTML = note.content || '';
    } else {
        titleInput.value = '';
        contentDiv.innerHTML = '';
    }
    
    noteEditor.classList.remove('hidden');
}

function closeNoteEditor() {
    noteEditor.classList.add('hidden');
}

async function saveNote() {
    try {
        const titleInput = noteEditor.querySelector('.note-title');
        const contentDiv = noteEditor.querySelector('.editor-content');
        
        const noteData = {
            title: titleInput.value,
            content: contentDiv.innerHTML,
            user_id: currentUser.id,
            updated_at: new Date().toISOString()
        };
        
        if (!noteData.title.trim()) {
            showToast('Please enter a title', 'error');
            return;
        }
        
        showLoading();
        
        const { data, error } = await supabase
            .from('notes')
            .upsert([noteData])
            .select()
            .single();
            
        if (error) throw error;
        
        showToast('Note saved successfully', 'success');
        closeNoteEditor();
        loadNotes();
    } catch (error) {
        console.error('Error saving note:', error);
        showToast('Error saving note', 'error');
    } finally {
        hideLoading();
    }
}

async function deleteNote(noteId) {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
        showLoading();
        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', noteId);
            
        if (error) throw error;
        
        showToast('Note deleted successfully', 'success');
        loadNotes();
    } catch (error) {
        console.error('Error deleting note:', error);
        showToast('Error deleting note', 'error');
    } finally {
        hideLoading();
    }
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredNotes = notes.filter(note => 
        (note.title && note.title.toLowerCase().includes(searchTerm)) ||
        (note.content && note.content.toLowerCase().includes(searchTerm))
    );
    renderFilteredNotes(filteredNotes);
}

function renderFilteredNotes(filteredNotes) {
    notesGrid.innerHTML = '';
    filteredNotes.forEach(note => {
        const noteCard = createNoteCard(note);
        notesGrid.appendChild(noteCard);
    });
}

function handleViewChange(event) {
    const view = event.currentTarget.getAttribute('data-view');
    currentView = view;
    
    viewControls.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-view') === view);
    });
    
    notesGrid.className = `notes-${view}`;
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loader';
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.querySelector('.loader');
    if (loader) {
        document.body.removeChild(loader);
    }
}

window.editNote = function(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        openNoteEditor(note);
    }
};

window.deleteNote = deleteNote;
window.saveNote = saveNote;
window.closeNoteEditor = closeNoteEditor;
window.openNoteEditor = openNoteEditor;
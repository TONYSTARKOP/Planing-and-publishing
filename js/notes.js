// public/js/notes.js

// DOM Elements
const notesGrid = document.getElementById('notes-grid');
const noteEditor = document.getElementById('note-editor');
const noteTitle = document.getElementById('note-title');
const noteContent = document.getElementById('note-content');
const noteTags = document.getElementById('note-tags');
const saveNoteBtn = document.getElementById('save-note');
const deleteNoteBtn = document.getElementById('delete-note');
const searchInput = document.getElementById('search-input');
const viewControls = document.getElementById('view-controls');

let currentNote = null;
let notes = [];
let filteredNotes = [];

saveNoteBtn.addEventListener('click', saveNote);
deleteNoteBtn.addEventListener('click', deleteNote);
searchInput.addEventListener('input', handleSearch);
viewControls.addEventListener('click', handleViewChange);

async function loadNotes() {
    try {
        showLoading();
        
        const { data, error } = await supabase
            .from('notes')
            .select(`
                *,
                note_tags (
                    tags (
                        id,
                        name,
                        color
                    )
                )
            `)
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
    
        notes = data.map(note => ({
            ...note,
            tags: note.note_tags.map(nt => nt.tags)
        }));
        filteredNotes = [...notes];
        renderNotes();
    } catch (error) {
        console.error('Error loading notes:', error);
        showToast('Failed to load notes', 'error');
    } finally {
        hideLoading();
    }
}

function renderNotes() {
    notesGrid.innerHTML = '';
    
    if (filteredNotes.length === 0) {
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
    
    filteredNotes.forEach(note => {
        const noteCard = createNoteCard(note);
        notesGrid.appendChild(noteCard);
    });
}

function createNoteCard(note) {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.innerHTML = `
        <div class="note-header">
            <h3>${note.title}</h3>
            <div class="note-actions">
                <button class="btn btn-icon" onclick="openNoteEditor('${note.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-icon" onclick="deleteNote('${note.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="note-content">${note.content}</div>
        <div class="note-footer">
            <div class="note-tags">
                ${note.tags.map(t => `
                    <span class="tag" style="background-color: ${t.color}">
                        ${t.name}
                    </span>
                `).join('')}
            </div>
            <div class="note-date">
                ${formatDate(note.updated_at)}
            </div>
        </div>
    `;
    
    return card;
}

async function openNoteEditor(noteId = null) {
    currentNote = noteId ? notes.find(n => n.id === noteId) : null;
    
    if (currentNote) {
        noteTitle.value = currentNote.title;
        noteContent.value = currentNote.content;
        noteTags.value = currentNote.tags.map(t => t.name).join(', ');
    } else {
        noteTitle.value = '';
        noteContent.value = '';
        noteTags.value = '';
    }
    
    noteEditor.classList.add('active');
}

async function saveNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();
    const tags = noteTags.value.split(',').map(t => t.trim()).filter(Boolean);
    
    if (!title) {
        showToast('Please enter a title', 'error');
        return;
    }
    
    try {
        showLoading();
        
        if (currentNote) {
            const { error } = await supabase
                .from('notes')
                .update({
                    title,
                    content,
                    updated_at: new Date().toISOString()
                })
                .eq('id', currentNote.id);
            
            if (error) throw error;
            
            await updateNoteTags(currentNote.id, tags);
            
            showToast('Note updated successfully', 'success');
        } else {
            const { data, error } = await supabase
                .from('notes')
                .insert({
                    title,
                    content,
                    user_id: currentUser.id
                })
                .select()
                .single();
            
            if (error) throw error;
            await updateNoteTags(data.id, tags);
            
            showToast('Note created successfully', 'success');
        }
        
        closeNoteEditor();
        loadNotes();
    } catch (error) {
        console.error('Error saving note:', error);
        showToast('Failed to save note', 'error');
    } finally {
        hideLoading();
    }
}

async function updateNoteTags(noteId, tagNames) {
    await supabase
        .from('note_tags')
        .delete()
        .eq('note_id', noteId);
    
    for (const tagName of tagNames) {
        let { data: tag, error: tagError } = await supabase
            .from('tags')
            .select()
            .eq('name', tagName)
            .single();
        
        if (tagError && tagError.code !== 'PGRST116') {
            throw tagError;
        }
        
        if (!tag) {
            const { data: newTag, error: insertError } = await supabase
                .from('tags')
                .insert({
                    name: tagName,
                    color: getRandomColor()
                })
                .select()
                .single();
            
            if (insertError) throw insertError;
            
            tag = newTag;
        }
    
        const { error: noteTagError } = await supabase
            .from('note_tags')
            .insert({
                note_id: noteId,
                tag_id: tag.id
            });
            
        if (noteTagError) throw noteTagError;
    }
}

async function deleteNote(noteId = null) {
    const id = noteId || currentNote?.id;
    
    if (!id) return;
    
    if (!confirm('Are you sure you want to delete this note?')) {
        return;
    }
    
    try {
        showLoading();
        
        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        showToast('Note deleted successfully', 'success');
        closeNoteEditor();
        loadNotes();
    } catch (error) {
        console.error('Error deleting note:', error);
        showToast('Failed to delete note', 'error');
    } finally {
        hideLoading();
    }
}

function closeNoteEditor() {
    noteEditor.classList.remove('active');
    currentNote = null;
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
    );
    renderNotes();
}

function handleViewChange(event) {
    const view = event.currentTarget.getAttribute('data-view');
    viewControls.querySelectorAll('.btn-icon').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-view') === view);
    });
    notesGrid.className = `notes-${view}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getRandomColor() {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
        '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}
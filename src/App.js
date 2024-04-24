import React, { useState, useEffect } from 'react';
import './style.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes'));
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
    handleSearch(); // Update filtered notes whenever notes change
  }, [notes]);

  const handleAddNote = () => {
    if (title.trim() !== '' && content.trim() !== '') {
      const newNote = { id: Date.now(), title, content };
      setNotes([...notes, newNote]);
      setSearchTerm('');
      setTitle('');
      setContent('');
    }
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
  };

  const handleEditNote = (id) => {
    setEditMode(id);
    const noteToEdit = notes.find((note) => note.id === id);
    setEditTitle(noteToEdit.title);
    setEditContent(noteToEdit.content);
  };

  const handleSaveEdit = () => {
    const updatedNotes = notes.map((note) => {
      if (note.id === editMode) {
        return { ...note, title: editTitle, content: editContent };
      }
      return note;
    });
    setNotes(updatedNotes);
    setEditMode(null);
  };

  const handleCancelEdit = () => {
    setEditMode(null);
  };

  const handleSearch = () => {
    const filteredNotes = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotes(filteredNotes);
  };

  return (
    <div className="App">
      <h1>Note Taking App</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleAddNote}>Add Note</button>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(); // Update filtered notes on search term change
          }}
        />
      </div>
      <div className="notes-container">
        {filteredNotes.map((note) => (
          <div className="note" key={note.id}>
            {editMode === note.id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <h2>{note.title}</h2>
                <p>{note.content}</p>
                <button onClick={() => handleEditNote(note.id)}>Edit</button>
                <button onClick={() => handleDeleteNote(note.id)}>
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
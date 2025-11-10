// components/TechnologyCard.js
import React, { useState } from 'react';
import './TechnologyCard.css';

function TechnologyCard({ 
  title, 
  description, 
  status, 
  category, 
  notes, 
  isSelected, 
  onStatusChange, 
  onNoteToggle 
}) {
  const [notesExpanded, setNotesExpanded] = useState(false);

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return '⚡';
      case 'in-progress':
        return '🌀';
      case 'not-started':
        return '💤';
      default:
        return '💤';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return 'Завершено';
      case 'in-progress':
        return 'В процессе';
      case 'not-started':
        return 'Не начато';
      default:
        return 'Не начато';
    }
  };

  const handleCardClick = () => {
    if (onStatusChange) {
      onStatusChange();
    }
  };

  const handleNotesToggle = (e) => {
    e.stopPropagation();
    setNotesExpanded(!notesExpanded);
  };

  const handleNoteClick = (e, noteId) => {
    e.stopPropagation();
    if (onNoteToggle) {
      onNoteToggle(noteId);
    }
  };

  // Прогресс по заметкам
  const completedNotes = notes.filter(note => note.completed).length;
  const totalNotes = notes.length;
  const notesProgress = totalNotes > 0 ? Math.round((completedNotes / totalNotes) * 100) : 0;

  return (
    <div 
      className={`technology-card status-${status} ${isSelected ? 'selected' : ''}`}
      onClick={handleCardClick}
    >
      <div className="card-glow"></div>
      
      <div className="card-header">
        <div className="category-badge">{category}</div>
        <span className="status-icon">{getStatusIcon()}</span>
      </div>
      
      <h3 className="card-title">{title}</h3>
      
      <p className="card-description">{description}</p>
      
      {/* Блок заметок */}
      {notes.length > 0 && (
        <div className="notes-section">
          <div className="notes-header" onClick={handleNotesToggle}>
            <span className="notes-toggle">
              Заметки ({completedNotes}/{totalNotes})
              <span className={`notes-arrow ${notesExpanded ? 'expanded' : ''}`}>
                ▼
              </span>
            </span>
            <div className="notes-progress-bar">
              <div 
                className="notes-progress-fill" 
                style={{ width: `${notesProgress}%` }}
              ></div>
            </div>
          </div>
          
          {notesExpanded && (
            <div className="notes-list">
              {notes.map(note => (
                <div 
                  key={note.id}
                  className={`note-item ${note.completed ? 'completed' : ''}`}
                  onClick={(e) => handleNoteClick(e, note.id)}
                >
                  <div className="note-checkbox">
                    {note.completed && '✓'}
                  </div>
                  <span className="note-text">{note.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="card-footer">
        <span className={`status-badge status-${status}`}>
          {getStatusText()}
        </span>
        <div className="progress-indicator">
          <div className={`progress-dot ${status === 'completed' ? 'completed' : ''} ${status === 'in-progress' ? 'in-progress' : ''}`}></div>
          <div className={`progress-dot ${status === 'completed' ? 'completed' : ''}`}></div>
          <div className={`progress-dot ${status === 'completed' ? 'completed' : ''}`}></div>
        </div>
      </div>
      
      {isSelected && <div className="selection-pulse"></div>}
    </div>
  );
}

export default TechnologyCard;
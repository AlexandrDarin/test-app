import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './TechnologyDetail.css';

function TechnologyDetail({ technologies, updateStatus, updateNote }) {
  const { techId } = useParams();
  const navigate = useNavigate();
  const [notesExpanded, setNotesExpanded] = useState(false);
  
  const technology = technologies.find(tech => tech.id === parseInt(techId));

  if (!technology) {
    return (
      <div className="container">
        <div className="page">
          <h1>Технология не найдена</h1>
          <p>Технология с ID {techId} не существует.</p>
          <Link to="/technologies" className="btn">
            ← Назад к списку
          </Link>
        </div>
      </div>
    );
  }

  const handleStatusChange = () => {
    updateStatus(technology.id);
  };

  const handleNoteToggle = (noteId) => {
    updateNote(technology.id, noteId);
  };

  const getStatusText = () => {
    switch (technology.status) {
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

  const getStatusIcon = () => {
    switch (technology.status) {
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

  const completedNotes = technology.notes.filter(note => note.completed).length;
  const totalNotes = technology.notes.length;
  const notesProgress = totalNotes > 0 ? Math.round((completedNotes / totalNotes) * 100) : 0;

  return (
    <div className="container">
      <div className="technology-detail-page">
        <div className="page-header">
          <Link to="/technologies" className="back-link">
            ← Назад к списку
          </Link>
          <h1>{technology.title}</h1>
        </div>

        <div className="technology-detail">
          <div className="detail-main">
            <div className="detail-header">
              <span className="category-badge">{technology.category}</span>
              <div className="status-section">
                <span className="status-icon-large">{getStatusIcon()}</span>
                <span className={`status-badge-large status-${technology.status}`}>
                  {getStatusText()}
                </span>
                <button onClick={handleStatusChange} className="btn btn-primary">
                  Сменить статус
                </button>
              </div>
            </div>

            <div className="detail-section">
              <h3>Описание</h3>
              <p>{technology.description}</p>
            </div>

            {technology.notes.length > 0 && (
              <div className="detail-section">
                <div className="notes-header" onClick={() => setNotesExpanded(!notesExpanded)}>
                  <h3>
                    Заметки ({completedNotes}/{totalNotes})
                    <span className={`notes-arrow ${notesExpanded ? 'expanded' : ''}`}>
                      ▼
                    </span>
                  </h3>
                  <div className="notes-progress-bar">
                    <div 
                      className="notes-progress-fill" 
                      style={{ width: `${notesProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                {notesExpanded && (
                  <div className="notes-list">
                    {technology.notes.map(note => (
                      <div 
                        key={note.id}
                        className={`note-item ${note.completed ? 'completed' : ''}`}
                        onClick={() => handleNoteToggle(note.id)}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechnologyDetail;
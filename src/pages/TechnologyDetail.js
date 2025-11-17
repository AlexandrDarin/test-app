import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import JobOpportunities from '../components/JobOpportunities';
import './TechnologyDetail.css';

function TechnologyDetail({ technologies, updateStatus, updateNote, addNote, deleteNote, editNote }) {
  const { techId } = useParams();
  const navigate = useNavigate();
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [showJobs, setShowJobs] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteText, setEditingNoteText] = useState('');
  
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

  const handleAddNote = () => {
    if (newNoteText.trim()) {
      addNote(technology.id, newNoteText.trim());
      setNewNoteText('');
    }
  };

  const handleDeleteNote = (noteId) => {
    deleteNote(technology.id, noteId);
  };

  const handleStartEdit = (note) => {
    setEditingNoteId(note.id);
    setEditingNoteText(note.text);
  };

  const handleSaveEdit = () => {
    if (editingNoteText.trim()) {
      editNote(technology.id, editingNoteId, editingNoteText.trim());
      setEditingNoteId(null);
      setEditingNoteText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingNoteText('');
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
        return '✅';
      case 'in-progress':
        return '🔄';
      case 'not-started':
        return '⏳';
      default:
        return '⏳';
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
          <button 
            onClick={() => setShowJobs(true)}
            className="btn btn-primary jobs-btn"
          >
            💼 Посмотреть вакансии
          </button>
        </div>

        <div className="technology-detail">
          <div className="detail-main">
            <div className="detail-header">
              <div className="tech-meta">
                <span className="category-badge">{technology.category}</span>
                {technology.difficulty && (
                  <span className={`difficulty-badge difficulty-${technology.difficulty}`}>
                    {technology.difficulty === 'beginner' ? '👶 Начинающий' : 
                     technology.difficulty === 'intermediate' ? '🚀 Средний' : '🔥 Продвинутый'}
                  </span>
                )}
              </div>
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
              <h3>📝 Описание</h3>
              <p>{technology.description}</p>
            </div>

            {technology.estimatedHours && (
              <div className="detail-section">
                <h3>⏱️ Время изучения</h3>
                <div className="estimated-hours">
                  <span className="hours-badge">{technology.estimatedHours} часов</span>
                </div>
              </div>
            )}

            {technology.prerequisites && (
              <div className="detail-section">
                <h3>📚 Предварительные требования</h3>
                <p>{technology.prerequisites}</p>
              </div>
            )}

            {technology.learningGoals && (
              <div className="detail-section">
                <h3>🎯 Цели изучения</h3>
                <p>{technology.learningGoals}</p>
              </div>
            )}

            {technology.resources && technology.resources.length > 0 && (
              <div className="detail-section">
                <h3>🔗 Ресурсы</h3>
                <div className="resources-list">
                  {technology.resources.map((resource, index) => (
                    <a 
                      key={index}
                      href={resource} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="resource-link"
                    >
                      📖 {resource}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="detail-section">
              <div className="notes-header" onClick={() => setNotesExpanded(!notesExpanded)}>
                <h3>
                  📋 Заметки ({completedNotes}/{totalNotes})
                  <span className={`notes-arrow ${notesExpanded ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </h3>
                <div className="notes-progress">
                  <div className="notes-progress-bar">
                    <div 
                      className="notes-progress-fill" 
                      style={{ width: `${notesProgress}%` }}
                    ></div>
                  </div>
                  <span className="notes-progress-text">{notesProgress}%</span>
                </div>
              </div>
              
              {notesExpanded && (
                <div className="notes-section">
                  <div className="add-note-form">
                    <input
                      type="text"
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Добавить новую заметку..."
                      className="note-input"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                    />
                    <button 
                      onClick={handleAddNote}
                      className="btn btn-primary"
                      disabled={!newNoteText.trim()}
                    >
                      ➕ Добавить
                    </button>
                  </div>
                  
                  <div className="notes-list">
                    {technology.notes.map(note => (
                      <div 
                        key={note.id}
                        className={`note-item ${note.completed ? 'completed' : ''}`}
                      >
                        <div 
                          className="note-checkbox"
                          onClick={() => handleNoteToggle(note.id)}
                        >
                          {note.completed && '✓'}
                        </div>
                        
                        {editingNoteId === note.id ? (
                          <div className="note-edit-form">
                            <input
                              type="text"
                              value={editingNoteText}
                              onChange={(e) => setEditingNoteText(e.target.value)}
                              className="note-edit-input"
                              onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                            />
                            <button 
                              onClick={handleSaveEdit}
                              className="btn btn-success btn-small"
                            >
                              ✅
                            </button>
                            <button 
                              onClick={handleCancelEdit}
                              className="btn btn-secondary btn-small"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <>
                            <span 
                              className="note-text"
                              onClick={() => handleNoteToggle(note.id)}
                            >
                              {note.text}
                            </span>
                            <div className="note-actions">
                              <button 
                                onClick={() => handleStartEdit(note)}
                                className="btn-icon"
                                title="Редактировать"
                              >
                                ✏️
                              </button>
                              <button 
                                onClick={() => handleDeleteNote(note.id)}
                                className="btn-icon"
                                title="Удалить"
                              >
                                🗑️
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    
                    {technology.notes.length === 0 && (
                      <div className="empty-notes">
                        <p>Пока нет заметок. Добавьте первую!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showJobs && (
        <JobOpportunities 
          technology={technology} 
          onClose={() => setShowJobs(false)} 
        />
      )}
    </div>
  );
}

export default TechnologyDetail;
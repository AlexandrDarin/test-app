// components/TechnologyCard.js
import React from 'react';
import './TechnologyCard.css';

function TechnologyCard({ title, description, status, category, isSelected, onStatusChange }) {
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

  const handleClick = () => {
    if (onStatusChange) {
      onStatusChange();
    }
  };

  return (
    <div 
      className={`technology-card status-${status} ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      <div className="card-glow"></div>
      
      <div className="card-header">
        <div className="category-badge">{category}</div>
        <span className="status-icon">{getStatusIcon()}</span>
      </div>
      
      <h3 className="card-title">{title}</h3>
      
      <p className="card-description">{description}</p>
      
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
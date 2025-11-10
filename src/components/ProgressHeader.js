// components/ProgressHeader.js
import React from 'react';
import './ProgressHeader.css';

function ProgressHeader({ 
  technologies, 
  searchTerm, 
  onSearchChange, 
  filteredCount
}) {
  const studiedCount = technologies.filter(tech => tech.status === 'completed').length;
  const inProgressCount = technologies.filter(tech => tech.status === 'in-progress').length;
  const notStartedCount = technologies.filter(tech => tech.status === 'not-started').length;

  return (
    <div className="progress-header">
      <div className="header-main">
        <h1>
          <span className="header-icon">🚀</span>
          Трекер изучения технологий
        </h1>
        
        <div className="progress-stats">
          <div className="stat-item">
            <span className="stat-value">{studiedCount}</span>
            <span className="stat-label">ЗАВЕРШЕНО</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{inProgressCount}</span>
            <span className="stat-label">В ПРОЦЕССЕ</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{notStartedCount}</span>
            <span className="stat-label">НЕ НАЧАТО</span>
          </div>
        </div>
      </div>

      <div className="search-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Поиск по технологиям, описанию или заметкам..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="search-results">
          Найдено: <span className="results-count">{filteredCount}</span> технологий
        </div>
      </div>
    </div>
  );
}

export default ProgressHeader;
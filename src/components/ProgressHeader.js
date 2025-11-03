// components/ProgressHeader.js
import React from 'react';
import './ProgressHeader.css';

function ProgressHeader({ technologies }) {
  const total = technologies.length;
  const completed = technologies.filter(tech => tech.status === 'completed').length;
  const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
  const notStarted = technologies.filter(tech => tech.status === 'not-started').length;
  
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="progress-header">
      <div className="header-glow"></div>
      
      <h1>
        <span className="title-main">ТРЕКЕР ТЕХНОЛОГИЙ</span>
        <span className="title-sub">СИСТЕМА МОНИТОРИНГА ПРОГРЕССА</span>
      </h1>
      
      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-number neon-cyan">{total}</span>
          <span className="stat-label">Всего технологий</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-number neon-green">{completed}</span>
          <span className="stat-label">Изучено</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-number neon-blue">{inProgress}</span>
          <span className="stat-label">В процессе</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-number neon-red">{notStarted}</span>
          <span className="stat-label">Не начато</span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-info">
          <span className="neon-cyan">ОБЩИЙ ПРОГРЕСС: {completionPercentage}%</span>
          <span className="neon-white">{completed} ИЗ {total}</span>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${completionPercentage}%` }}
          ></div>
          <div className="progress-glow"></div>
        </div>
      </div>
    </div>
  );
}

export default ProgressHeader;
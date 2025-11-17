import React from 'react';
import { Link } from 'react-router-dom';

function Statistics({ technologies, getStats }) {
  const stats = getStats();

  return (
    <div className="container">
      <div className="page">
        <div className="page-header">
          <h1>📊 Статистика прогресса</h1>
          <Link to="/" className="back-link">
            ← На главную
          </Link>
        </div>

        <div className="stats-grid-large">
          <div className="stat-card-large">
            <div className="stat-number">{stats.totalTechnologies}</div>
            <div className="stat-label">Всего технологий</div>
          </div>
          <div className="stat-card-large">
            <div className="stat-number" style={{color: '#00ff88'}}>{stats.completedTechnologies}</div>
            <div className="stat-label">Завершено</div>
          </div>
          <div className="stat-card-large">
            <div className="stat-number" style={{color: '#00aaff'}}>{stats.inProgressTechnologies}</div>
            <div className="stat-label">В процессе</div>
          </div>
          <div className="stat-card-large">
            <div className="stat-number" style={{color: '#ff4444'}}>{stats.notStartedTechnologies}</div>
            <div className="stat-label">Не начато</div>
          </div>
        </div>
        
        <div className="progress-section">
          <div className="progress-header">
            <span>Общий прогресс изучения</span>
            <span className="progress-percent">{stats.progressPercent}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${stats.progressPercent}%` }}
            ></div>
          </div>
        </div>
        
        <div className="notes-stats">
          <h4>📝 Прогресс по заметкам</h4>
          <div className="notes-progress">
            <span style={{marginBottom: '8px', display: 'block', fontSize: '1.1rem'}}>
              {stats.completedNotes}/{stats.totalNotes} завершено
            </span>
            <div className="notes-progress-bar">
              <div 
                className="notes-progress-fill" 
                style={{ 
                  width: `${stats.totalNotes > 0 ? Math.round((stats.completedNotes / stats.totalNotes) * 100) : 0}%` 
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="technologies-breakdown">
          <h3 style={{
            background: 'linear-gradient(135deg, #ff44aa, #aa44ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 20px rgba(255, 68, 170, 0.3)',
            marginBottom: '1.5rem',
            fontSize: '1.5rem',
            fontWeight: '700'
          }}>
            📈 Распределение по статусам
          </h3>
          <div className="breakdown-chart">
            <div 
              className="breakdown-segment completed" 
              style={{ width: `${(stats.completedTechnologies / stats.totalTechnologies) * 100}%` }}
              title={`Завершено: ${stats.completedTechnologies}`}
            ></div>
            <div 
              className="breakdown-segment in-progress" 
              style={{ width: `${(stats.inProgressTechnologies / stats.totalTechnologies) * 100}%` }}
              title={`В процессе: ${stats.inProgressTechnologies}`}
            ></div>
            <div 
              className="breakdown-segment not-started" 
              style={{ width: `${(stats.notStartedTechnologies / stats.totalTechnologies) * 100}%` }}
              title={`Не начато: ${stats.notStartedTechnologies}`}
            ></div>
          </div>
          <div className="breakdown-legend">
            <div className="legend-item">
              <div className="legend-color completed"></div>
              <span>Завершено ({stats.completedTechnologies})</span>
            </div>
            <div className="legend-item">
              <div className="legend-color in-progress"></div>
              <span>В процессе ({stats.inProgressTechnologies})</span>
            </div>
            <div className="legend-item">
              <div className="legend-color not-started"></div>
              <span>Не начато ({stats.notStartedTechnologies})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
// src/pages/Statistics.js
import React from 'react';
import './Statistics.css';

function Statistics({ technologies, getStats }) {
  const stats = getStats();

  const statCards = [
    {
      icon: '📊',
      title: 'Всего технологий',
      value: stats.totalTechnologies,
      color: '#00aaff'
    },
    {
      icon: '✅',
      title: 'Завершено',
      value: stats.completedTechnologies,
      color: '#00ff88'
    },
    {
      icon: '🔄',
      title: 'В процессе',
      value: stats.inProgressTechnologies,
      color: '#ffaa00'
    },
    {
      icon: '⏳',
      title: 'Не начато',
      value: stats.notStartedTechnologies,
      color: '#ff6b6b'
    },
    {
      icon: '📝',
      title: 'Всего заметок',
      value: stats.totalNotes,
      color: '#9b59b6'
    },
    {
      icon: '🎯',
      title: 'Выполнено заметок',
      value: stats.completedNotes,
      color: '#2ecc71'
    }
  ];

  return (
    <div className="container">
      <div className="page-header">
        <h1>📈 Статистика</h1>
        <p>Обзор вашего прогресса в изучении технологий</p>
      </div>

      {/* Основная статистика */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-title">{stat.title}</div>
            </div>
            <div 
              className="stat-glow" 
              style={{ backgroundColor: stat.color }}
            ></div>
          </div>
        ))}
      </div>

      {/* Прогресс по категориям */}
      <div className="categories-section">
        <h2>📂 Прогресс по категориям</h2>
        <div className="categories-grid">
          {stats.categories.map((category, index) => (
            <div key={index} className="category-card">
              <div className="category-header">
                <h3>{category.category}</h3>
                <span className="category-progress">{category.progress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${category.progress}%`,
                    background: `linear-gradient(90deg, #00ff88, #00ccff)`
                  }}
                ></div>
              </div>
              <div className="category-stats">
                <span>✅ {category.completed} из {category.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Визуализация прогресса */}
      <div className="progress-visualization">
        <h2>🎯 Общий прогресс</h2>
        <div className="progress-circle-large">
          <div className="circle-background"></div>
          <div 
            className="circle-progress"
            style={{ 
              background: `conic-gradient(
                #00ff88 0% ${stats.progressPercent}%, 
                #333 ${stats.progressPercent}% 100%
              )`
            }}
          ></div>
          <div className="circle-text">
            <div className="progress-percent-large">{stats.progressPercent}%</div>
            <div className="progress-label">Завершено</div>
          </div>
        </div>
        
        <div className="progress-breakdown">
          <div className="breakdown-item">
            <div className="breakdown-color completed"></div>
            <span>Завершено: {stats.completedTechnologies}</span>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-color in-progress"></div>
            <span>В процессе: {stats.inProgressTechnologies}</span>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-color not-started"></div>
            <span>Не начато: {stats.notStartedTechnologies}</span>
          </div>
        </div>
      </div>

      {/* Мотивационное сообщение */}
      <div className="motivation-section">
        <div className="motivation-card">
          <div className="motivation-icon">🚀</div>
          <div className="motivation-content">
            <h3>Продолжайте в том же духе!</h3>
            <p>
              {stats.progressPercent === 100 
                ? '🎉 Поздравляем! Вы изучили все технологии!'
                : stats.progressPercent >= 70 
                ? 'Отличный прогресс! Вы близки к завершению!'
                : stats.progressPercent >= 40 
                ? 'Хорошие результаты! Продолжайте двигаться вперед!'
                : 'Начало положено! Каждый день - новый шаг к цели!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
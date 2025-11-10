// components/QuickActions.js
import React, { useState } from 'react';
import Modal from './Modal';
import './QuickActions.css';

function QuickActions({ 
  onMarkAllCompleted, 
  onResetAll, 
  onRandomNext, 
  onExport, 
  onShowStats,
  progressPercent 
}) {
  const [showExportModal, setShowExportModal] = useState(false);

  const handleExport = () => {
    onExport();
    setShowExportModal(true);
  };

  return (
    <div className="quick-actions">
      {/* Прогресс в QuickActions */}
      <div className="progress-section">
        <div className="progress-header">
          <span>Общий прогресс</span>
          <span className="progress-percent">{progressPercent}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="actions-header">
        <h3>⚡ Быстрые действия</h3>
      </div>
      
      <div className="action-buttons">
        <button 
          onClick={onMarkAllCompleted} 
          className="action-btn btn-completed"
          title="Отметить все технологии как завершенные"
        >
          <span className="btn-icon">✅</span>
          Завершить все
        </button>
        
        <button 
          onClick={onResetAll} 
          className="action-btn btn-reset"
          title="Сбросить статусы всех технологий"
        >
          <span className="btn-icon">🔄</span>
          Сбросить все
        </button>
        
        <button 
          onClick={onRandomNext} 
          className="action-btn btn-random"
          title="Выбрать случайную технологию для изучения"
        >
          <span className="btn-icon">🎯</span>
          Случайная
        </button>
        
        <button 
          onClick={handleExport} 
          className="action-btn btn-export"
          title="Экспортировать данные в JSON"
        >
          <span className="btn-icon">📤</span>
          Экспорт
        </button>
        
        <button 
          onClick={onShowStats} 
          className="action-btn btn-stats"
          title="Показать статистику"
        >
          <span className="btn-icon">📊</span>
          Статистика
        </button>
      </div>

      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="✅ Экспорт завершен"
      >
        <div className="modal-export-content">
          <p style={{textAlign: 'center', marginBottom: '20px', fontSize: '1.1rem'}}>
            Данные успешно экспортированы в JSON файл!
          </p>
          <button 
            onClick={() => setShowExportModal(false)}
            className="modal-close-btn"
          >
            Закрыть
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default QuickActions;
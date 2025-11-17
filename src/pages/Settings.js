import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import './Settings.css';

function Settings({ technologies, resetAllStatuses, markAllAsCompleted }) {
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      technologies: technologies,
      totalTechnologies: technologies.length,
      stats: {
        completed: technologies.filter(tech => tech.status === 'completed').length,
        inProgress: technologies.filter(tech => tech.status === 'in-progress').length,
        notStarted: technologies.filter(tech => tech.status === 'not-started').length
      }
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `technologies-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    // Показать уведомление об успешном экспорте
    alert('✅ Данные успешно экспортированы!');
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.technologies && Array.isArray(data.technologies)) {
            if (window.confirm('Вы уверены, что хотите импортировать данные? Текущие данные будут заменены.')) {
              localStorage.setItem('technologies', JSON.stringify(data.technologies));
              alert('✅ Данные успешно импортированы! Страница будет перезагружена.');
              window.location.reload();
            }
          } else {
            alert('❌ Ошибка: Неверный формат файла');
          }
        } catch (error) {
          alert('❌ Ошибка при импорте файла: неверный формат JSON');
        }
      };
      reader.readAsText(file);
    }
    // Сброс input для возможности повторной загрузки того же файла
    event.target.value = '';
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleResetAll = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все статусы? Это действие нельзя отменить.')) {
      resetAllStatuses();
      alert('✅ Все статусы успешно сброшены!');
    }
  };

  const handleMarkAllCompleted = () => {
    if (window.confirm('Вы уверены, что хотите отметить все технологии как завершенные?')) {
      markAllAsCompleted();
      alert('✅ Все технологии отмечены как завершенные!');
    }
  };

  const clearAllData = () => {
    if (window.confirm('⚠️ ВНИМАНИЕ! Это удалит все ваши данные. Это действие нельзя отменить. Продолжить?')) {
      localStorage.removeItem('technologies');
      alert('✅ Все данные очищены! Страница будет перезагружена.');
      window.location.reload();
    }
  };

  return (
    <div className="container">
      <div className="page">
        <div className="page-header">
          <h1>⚙️ Настройки</h1>
          <Link to="/" className="back-link">
            ← На главную
          </Link>
        </div>

        <div className="settings-grid">
          {/* Управление данными */}
          <div className="setting-card">
            <div className="setting-header">
              <span className="setting-icon">💾</span>
              <h3>Управление данными</h3>
            </div>
            <div className="setting-description">
              <p>Экспортируйте или импортируйте ваши данные для резервного копирования</p>
            </div>
            <div className="setting-actions">
              <button onClick={handleExport} className="btn btn-primary">
                <span className="btn-icon">📤</span>
                Экспорт данных
              </button>
              <button onClick={handleImportClick} className="btn btn-secondary">
                <span className="btn-icon">📥</span>
                Импорт данных
              </button>
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".json" 
                onChange={handleImport}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Массовые действия */}
          <div className="setting-card">
            <div className="setting-header">
              <span className="setting-icon">🔄</span>
              <h3>Массовые действия</h3>
            </div>
            <div className="setting-description">
              <p>Быстрое управление статусами всех технологий</p>
            </div>
            <div className="setting-actions">
              <button onClick={handleMarkAllCompleted} className="btn btn-success">
                <span className="btn-icon">✅</span>
                Завершить все
              </button>
              <button onClick={handleResetAll} className="btn btn-warning">
                <span className="btn-icon">🔄</span>
                Сбросить статусы
              </button>
            </div>
          </div>

          {/* Информация о приложении */}
          <div className="setting-card">
            <div className="setting-header">
              <span className="setting-icon">ℹ️</span>
              <h3>Информация о приложении</h3>
            </div>
            <div className="app-info">
              <div className="info-item">
                <span className="info-label">Версия:</span>
                <span className="info-value">1.0.0</span>
              </div>
              <div className="info-item">
                <span className="info-label">Всего технологий:</span>
                <span className="info-value">{technologies.length}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Завершено:</span>
                <span className="info-value" style={{color: '#00ff88'}}>
                  {technologies.filter(tech => tech.status === 'completed').length}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">В процессе:</span>
                <span className="info-value" style={{color: '#00ccff'}}>
                  {technologies.filter(tech => tech.status === 'in-progress').length}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Последнее обновление:</span>
                <span className="info-value">{new Date().toLocaleDateString('ru-RU')}</span>
              </div>
            </div>
          </div>

          {/* Опасная зона */}
          <div className="setting-card danger-zone">
            <div className="setting-header">
              <span className="setting-icon">⚠️</span>
              <h3>Опасная зона</h3>
            </div>
            <div className="setting-description">
              <p>Эти действия нельзя отменить. Будьте осторожны!</p>
            </div>
            <div className="setting-actions">
              <button onClick={clearAllData} className="btn btn-danger">
                <span className="btn-icon">🗑️</span>
                Очистить все данные
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
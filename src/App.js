// App.js
import React, { useState } from 'react';
import './App.css';
import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';
import QuickActions from './components/QuickActions';
import FilterTabs from './components/FilterTabs';
import Modal from './components/Modal';
import useTechnologies from './hooks/useTechnologies';

function App() {
  const {
    technologies,
    updateStatus,
    updateNote,
    markAllAsCompleted,
    resetAllStatuses,
    getStats
  } = useTechnologies();

  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTech, setSelectedTech] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const randomNextTechnology = () => {
    const notStartedTech = technologies.filter(tech => tech.status === 'not-started');
    if (notStartedTech.length > 0) {
      const randomTech = notStartedTech[Math.floor(Math.random() * notStartedTech.length)];
      
      updateStatus(randomTech.id);
      setSelectedTech(randomTech.id);
      
      setTimeout(() => {
        alert(`🎯 Случайно выбрана технология: ${randomTech.title}\nСтатус изменен на "В процессе"`);
      }, 100);
    } else {
      alert('Все технологии уже начаты или завершены!');
    }
  };

  const handleStatusChange = (techId) => {
    updateStatus(techId);
    if (technologies.find(tech => tech.id === techId)?.status === 'not-started') {
      setSelectedTech(techId);
    }
  };

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      technologies: technologies,
      stats: getStats()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `technologies-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    setShowExportModal(true);
  };

  const filteredTechnologies = technologies.filter(tech => {
    const matchesSearch = tech.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tech.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tech.notes.some(note => note.text.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = activeFilter === 'all' || tech.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const stats = getStats();

  return (
    <div className="App">
      <div className="container">
        <ProgressHeader 
          technologies={technologies}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filteredCount={filteredTechnologies.length}
        />
        
        <QuickActions
          onMarkAllCompleted={markAllAsCompleted}
          onResetAll={resetAllStatuses}
          onRandomNext={randomNextTechnology}
          onExport={handleExport}
          onShowStats={() => setShowStatsModal(true)}
          progressPercent={stats.progressPercent}
        />
        
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          technologies={technologies}
        />
        
        <div className="technologies-grid">
          {filteredTechnologies.map(tech => (
            <TechnologyCard
              key={tech.id}
              title={tech.title}
              description={tech.description}
              status={tech.status}
              category={tech.category}
              notes={tech.notes}
              isSelected={tech.id === selectedTech}
              onStatusChange={() => handleStatusChange(tech.id)}
              onNoteToggle={(noteId) => updateNote(tech.id, noteId)}
            />
          ))}
        </div>

        {filteredTechnologies.length === 0 && (
          <div className="empty-state">
            <h3>🕳️ Нет технологий для отображения</h3>
            <p>Измените фильтр или поисковый запрос, чтобы увидеть больше технологий</p>
          </div>
        )}
      </div>

      {/* Модальное окно экспорта */}
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

      {/* Модальное окно статистики */}
      <Modal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        title="📊 Статистика прогресса"
      >
        <div className="modal-stats-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.totalTechnologies}</div>
              <div className="stat-label">Всего технологий</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{color: '#00ff88'}}>{stats.completedTechnologies}</div>
              <div className="stat-label">Завершено</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{color: '#00aaff'}}>{stats.inProgressTechnologies}</div>
              <div className="stat-label">В процессе</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{color: '#ff4444'}}>{stats.notStartedTechnologies}</div>
              <div className="stat-label">Не начато</div>
            </div>
          </div>
          
          <div className="progress-section">
            <div className="progress-header">
              <span>Общий прогресс</span>
              <span>{stats.progressPercent}%</span>
            </div>
            <div className="progress-bar-large">
              <div 
                className="progress-fill-large" 
                style={{ width: `${stats.progressPercent}%` }}
              ></div>
            </div>
          </div>
          
          <div className="notes-stats">
            <h4>Прогресс по заметкам</h4>
            <div className="notes-progress">
              <span style={{marginBottom: '8px', display: 'block'}}>
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
          
          <button 
            onClick={() => setShowStatsModal(false)}
            className="modal-close-btn"
          >
            Закрыть
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
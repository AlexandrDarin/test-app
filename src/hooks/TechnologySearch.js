// components/TechnologySearch.js
import { useState, useEffect, useRef } from 'react';

function TechnologySearch({ onSearch, technologies }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [localResults, setLocalResults] = useState([]);
  const searchTimeoutRef = useRef(null);

  // Локальный поиск по уже загруженным технологиям
  const performLocalSearch = (query) => {
    if (!query.trim()) {
      setLocalResults([]);
      return;
    }

    const results = technologies.filter(tech =>
      tech.title.toLowerCase().includes(query.toLowerCase()) ||
      tech.description.toLowerCase().includes(query.toLowerCase()) ||
      tech.category.toLowerCase().includes(query.toLowerCase()) ||
      tech.language?.toLowerCase().includes(query.toLowerCase())
    );

    setLocalResults(results);
  };

  // Обработчик изменения поискового запроса
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Очищаем предыдущий таймер
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Устанавливаем новый таймер для debounce (300ms)
    searchTimeoutRef.current = setTimeout(() => {
      performLocalSearch(value);
      if (onSearch) {
        onSearch(value);
      }
    }, 300);
  };

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="technology-search">
      <div className="search-header">
        <h3>🔍 Поиск технологий</h3>
        <div className="search-stats">
          Найдено: {searchTerm ? localResults.length : technologies.length}
        </div>
      </div>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="Введите название технологии, язык или категорию..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="clear-search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Быстрые фильтры */}
      <div className="quick-filters">
        <button onClick={() => setSearchTerm('react')} className="filter-btn">
          React
        </button>
        <button onClick={() => setSearchTerm('javascript')} className="filter-btn">
          JavaScript
        </button>
        <button onClick={() => setSearchTerm('node')} className="filter-btn">
          Node.js
        </button>
        <button onClick={() => setSearchTerm('frontend')} className="filter-btn">
          Frontend
        </button>
        <button onClick={() => setSearchTerm('backend')} className="filter-btn">
          Backend
        </button>
      </div>

      {/* Результаты локального поиска */}
      {searchTerm && localResults.length > 0 && (
        <div className="local-results">
          <h4>Результаты поиска:</h4>
          <div className="results-grid">
            {localResults.map(tech => (
              <div key={tech.id} className="search-result-card">
                <h5>{tech.title}</h5>
                <p>{tech.description}</p>
                <div className="tech-meta">
                  <span className={`category ${tech.category}`}>
                    {tech.category}
                  </span>
                  <span className="language">{tech.language}</span>
                  <span className="difficulty">{tech.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchTerm && localResults.length === 0 && (
        <div className="no-local-results">
          <p>Локальные результаты не найдены. Попробуйте изменить запрос.</p>
        </div>
      )}
    </div>
  );
}

export default TechnologySearch;
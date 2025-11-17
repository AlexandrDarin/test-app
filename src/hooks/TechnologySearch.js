// src/components/TechnologySearch.js
import { useState, useEffect, useRef } from 'react';
import './TechnologySearch.css';

function TechnologySearch({ onSearch, technologies }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [localResults, setLocalResults] = useState([]);
  const searchTimeoutRef = useRef(null);

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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performLocalSearch(value);
      if (onSearch) {
        onSearch(value);
      }
    }, 300);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setLocalResults([]);
    if (onSearch) {
      onSearch('');
    }
  };

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
          Найдено: <span className="results-count">{searchTerm ? localResults.length : technologies.length}</span>
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
            onClick={clearSearch}
            className="clear-search"
            title="Очистить поиск"
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
                <div className="result-header">
                  <h5>{tech.title}</h5>
                  <span className={`status-badge status-${tech.status}`}>
                    {tech.status === 'completed' ? '✅' : 
                     tech.status === 'in-progress' ? '🔄' : '⏳'}
                  </span>
                </div>
                <p className="result-description">{tech.description}</p>
                <div className="tech-meta">
                  <span className={`category category-${tech.category.toLowerCase()}`}>
                    {tech.category}
                  </span>
                  {tech.language && (
                    <span className="language">{tech.language}</span>
                  )}
                  <span className={`difficulty difficulty-${tech.difficulty}`}>
                    {tech.difficulty}
                  </span>
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
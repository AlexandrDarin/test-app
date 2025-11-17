// src/components/APITechnologySearch.js
import { useState, useEffect, useRef } from 'react';
import useTechnologiesApi from '../hooks/useTechnologiesApi';

function APITechnologySearch({ onTechnologySelect, existingTechnologies }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [localResults, setLocalResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { 
    apiTechnologies, 
    loading, 
    error, 
    searchTechnologiesWithDebounce,
    clearApiTechnologies 
  } = useTechnologiesApi();
  
  const searchTimeoutRef = useRef(null);

  // Проверяем, есть ли технология уже в списке
  const isTechnologyExists = (techId) => {
    return existingTechnologies.some(tech => tech.id === techId);
  };

  // Обработчик поиска
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setLocalResults([]);
      clearApiTechnologies();
      return;
    }

    setIsSearching(true);
    try {
      await searchTechnologiesWithDebounce(query);
    } finally {
      setIsSearching(false);
    }
  };

  // Обработчик изменения поискового запроса с debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 500);
  };

  // Обработчик выбора технологии
  const handleSelectTechnology = (tech) => {
    if (onTechnologySelect) {
      onTechnologySelect(tech);
    }
    setSearchTerm('');
    setLocalResults([]);
    clearApiTechnologies();
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
    <div className="api-technology-search">
      <div className="search-section">
        <h3>🔍 Поиск технологий в GitHub</h3>
        <p className="search-description">
          Найдите популярные технологии и фреймворки для добавления в ваш трекер
        </p>
        
        <div className="search-box">
          <input
            type="text"
            placeholder="Введите название технологии (например: React, Vue, Express)..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {(loading || isSearching) && (
            <div className="search-loading">⏳</div>
          )}
        </div>

        {error && (
          <div className="search-error">
            ❌ {error}
          </div>
        )}
      </div>

      {/* Результаты поиска */}
      {apiTechnologies.length > 0 && (
        <div className="search-results">
          <h4>Найдено технологий: {apiTechnologies.length}</h4>
          <div className="api-technologies-grid">
            {apiTechnologies.map(tech => (
              <div key={tech.id} className={`api-tech-card ${isTechnologyExists(tech.id) ? 'exists' : ''}`}>
                <div className="api-tech-header">
                  <h5>{tech.title}</h5>
                  {isTechnologyExists(tech.id) && (
                    <span className="exists-badge">Уже добавлено</span>
                  )}
                </div>
                
                <p className="api-tech-description">{tech.description}</p>
                
                <div className="api-tech-meta">
                  <span className="tech-language">{tech.language}</span>
                  <span className="tech-stars">⭐ {tech.stars}</span>
                  <span className={`tech-difficulty ${tech.difficulty}`}>
                    {tech.difficulty}
                  </span>
                </div>

                <div className="api-tech-actions">
                  {!isTechnologyExists(tech.id) ? (
                    <button
                      onClick={() => handleSelectTechnology(tech)}
                      className="btn btn-primary"
                    >
                      ➕ Добавить в трекер
                    </button>
                  ) : (
                    <button className="btn btn-secondary" disabled>
                      ✅ Уже в трекере
                    </button>
                  )}
                  
                  <a 
                    href={tech.resources[0]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    🔗 GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchTerm && apiTechnologies.length === 0 && !loading && (
        <div className="no-results">
          <p>Технологии не найдены. Попробуйте изменить запрос.</p>
        </div>
      )}
    </div>
  );
}

export default APITechnologySearch;
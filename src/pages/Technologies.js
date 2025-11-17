import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import TechnologyCard from '../components/TechnologyCard';
import ProgressHeader from '../components/ProgressHeader';
import FilterTabs from '../components/FilterTabs';

function Technologies({ technologies, updateStatus, updateNote, addNote, deleteTechnology, addTechnology, searchTechnologies }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showApiSearch, setShowApiSearch] = useState(false);
  const [apiSearchResults, setApiSearchResults] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  const searchTimeoutRef = useRef(null);

  // Фильтрация технологий
  const filteredTechnologies = searchTerm ? 
    searchTechnologies(searchTerm) : 
    technologies.filter(tech => activeFilter === 'all' || tech.status === activeFilter);

  // Функция поиска через GitHub API
  const searchGitHubRepos = async (query) => {
    if (!query.trim()) {
      setApiSearchResults([]);
      return;
    }

    setApiLoading(true);
    setApiError(null);
    
    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+language:javascript&sort=stars&per_page=6`
      );
      
      if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Преобразуем данные GitHub в формат технологий
      const transformed = data.items.map(repo => ({
        id: `api-${repo.id}`,
        title: repo.name,
        description: repo.description || 'Описание отсутствует',
        category: getCategory(repo.language),
        difficulty: getRandomDifficulty(),
        status: 'not-started',
        resources: [repo.html_url],
        language: repo.language,
        stars: repo.stargazers_count,
        isFromApi: true
      }));
      
      setApiSearchResults(transformed);
    } catch (error) {
      setApiError('Не удалось загрузить данные из GitHub API');
      console.error('API Error:', error);
    } finally {
      setApiLoading(false);
    }
  };

  const getCategory = (language) => {
    const categories = {
      'JavaScript': 'Frontend',
      'TypeScript': 'Language', 
      'Python': 'Backend',
      'Java': 'Backend',
      'HTML': 'Frontend',
      'CSS': 'Frontend',
      'Vue': 'Frontend',
      'React': 'Frontend',
      'Node': 'Backend'
    };
    return categories[language] || 'Other';
  };

  const getRandomDifficulty = () => {
    const difficulties = ['beginner', 'intermediate', 'advanced'];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  };

  // Обработчик поиска с debounce
  const handleApiSearch = (query) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      searchGitHubRepos(query);
    }, 500);
  };

  // Добавление технологии из API
  const handleAddFromApi = (apiTech) => {
    addTechnology({
      title: apiTech.title,
      description: apiTech.description,
      category: apiTech.category,
      resources: apiTech.resources,
      language: apiTech.language
    });
    
    // Показываем подтверждение
    alert(`Технология "${apiTech.title}" добавлена в ваш трекер!`);
  };

  // Проверяем, есть ли технология уже в трекере
  const isTechInTracker = (apiTech) => {
    return technologies.some(tech => 
      tech.title.toLowerCase() === apiTech.title.toLowerCase() ||
      tech.description.includes(apiTech.title)
    );
  };

  return (
    <div className="container">
      <ProgressHeader 
        technologies={technologies}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filteredCount={filteredTechnologies.length}
      />
      
      <FilterTabs
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        technologies={technologies}
      />

      {/* Заголовок страницы с кнопкой API */}
      <div className="page-header">
        <div>
          <h1>Все технологии</h1>
          <div className="technologies-count">
            Всего: {technologies.length} технологий
          </div>
        </div>
        <button 
          onClick={() => setShowApiSearch(!showApiSearch)}
          className="btn btn-primary"
        >
          {showApiSearch ? '✕ Закрыть поиск' : '🔍 Поиск в GitHub API'}
        </button>
      </div>

      {/* Поиск через API */}
      {showApiSearch && (
        <div className="api-technology-search">
          <h3>🔍 Поиск технологий в GitHub</h3>
          <p className="search-description">
            Найдите популярные технологии и фреймворки для добавления в ваш трекер
          </p>
          
          <div className="search-box">
            <input
              type="text"
              placeholder="Введите технологию (react, vue, node, typescript...)"
              onChange={(e) => handleApiSearch(e.target.value)}
              className="search-input"
            />
            {apiLoading && <div className="search-loading">⏳</div>}
          </div>

          {apiError && (
            <div className="search-error">
              {apiError}
            </div>
          )}

          {apiSearchResults.length > 0 && (
            <div className="search-results">
              <h4>Найдено в GitHub: {apiSearchResults.length} репозиториев</h4>
              <div className="api-technologies-grid">
                {apiSearchResults.map(tech => (
                  <div key={tech.id} className={`api-tech-card ${isTechInTracker(tech) ? 'exists' : ''}`}>
                    <div className="api-tech-header">
                      <h5>{tech.title}</h5>
                      {isTechInTracker(tech) && (
                        <span className="exists-badge">Уже в трекере</span>
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
                      {!isTechInTracker(tech) ? (
                        <button
                          onClick={() => handleAddFromApi(tech)}
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

          {!apiLoading && apiSearchResults.length === 0 && (
            <div className="empty-state">
              <p>Введите название технологии для поиска в GitHub</p>
              <p className="search-tips">
                Попробуйте: <strong>react</strong>, <strong>vue</strong>, <strong>node</strong>, <strong>typescript</strong>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Список технологий */}
      <div className="technologies-grid">
        {filteredTechnologies.map(tech => (
          <Link 
            key={tech.id} 
            to={`/technology/${tech.id}`}
            style={{ textDecoration: 'none' }}
          >
            <TechnologyCard
              title={tech.title}
              description={tech.description}
              status={tech.status}
              category={tech.category}
              notes={tech.notes}
              onStatusChange={() => updateStatus(tech.id)}
              onNoteToggle={(noteId) => updateNote(tech.id, noteId)}
            />
          </Link>
        ))}
      </div>

      {filteredTechnologies.length === 0 && !showApiSearch && (
        <div className="empty-state">
          <h3>🕳️ Нет технологий для отображения</h3>
          <p>Измените фильтр или поисковый запрос, чтобы увидеть больше технологий</p>
          <div className="empty-state-actions">
            <button 
              onClick={() => setShowApiSearch(true)}
              className="btn btn-primary"
            >
              🔍 Найти технологии в API
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Technologies;
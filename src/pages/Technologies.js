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
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);
  
  const searchTimeoutRef = useRef(null);

  const filteredTechnologies = searchTerm ? 
    searchTechnologies(searchTerm) : 
    technologies.filter(tech => activeFilter === 'all' || tech.status === activeFilter);

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
      
      const transformed = data.items.map(repo => ({
        id: `api-${repo.id}`,
        title: repo.name,
        description: repo.description || 'Описание отсутствует',
        category: getCategory(repo.language),
        difficulty: getDifficulty(repo.stargazers_count, repo.size),
        status: 'not-started',
        resources: [repo.html_url],
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        size: repo.size,
        open_issues: repo.open_issues_count,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        isFromApi: true,
        avatar_url: repo.owner?.avatar_url
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
      'Node': 'Backend',
      'Go': 'Backend',
      'Rust': 'Language',
      'C++': 'Language'
    };
    return categories[language] || 'Other';
  };

  const getDifficulty = (stars, size) => {
    if (stars > 10000 || size > 100000) return 'advanced';
    if (stars > 1000 || size > 10000) return 'intermediate';
    return 'beginner';
  };

  const handleApiSearch = (query) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      searchGitHubRepos(query);
    }, 500);
  };

  const handleOpenAddForm = (apiTech) => {
    setSelectedTech(apiTech);
    setShowAddForm(true);
  };

  const handleAddFromApi = (formData) => {
    const techData = {
      title: selectedTech.title,
      description: selectedTech.description,
      category: formData.category || selectedTech.category,
      difficulty: formData.difficulty || selectedTech.difficulty,
      resources: selectedTech.resources,
      language: selectedTech.language,
      estimatedHours: formData.estimatedHours || calculateEstimatedHours(selectedTech),
      prerequisites: formData.prerequisites || '',
      learningGoals: formData.learningGoals || generateLearningGoals(selectedTech),
      avatar_url: selectedTech.avatar_url
    };

    addTechnology(techData);
    
    setShowAddForm(false);
    setSelectedTech(null);
    alert(`Технология "${selectedTech.title}" добавлена в ваш трекер!`);
  };

  const calculateEstimatedHours = (tech) => {
    const baseHours = {
      'beginner': 20,
      'intermediate': 40,
      'advanced': 80
    };
    return baseHours[tech.difficulty] + Math.floor(tech.stars / 1000);
  };

  const generateLearningGoals = (tech) => {
    const goals = {
      'Frontend': 'Изучить основы, компоненты, состояние, маршрутизацию',
      'Backend': 'Изучить серверную логику, API, базы данных, аутентификацию',
      'Language': 'Изучить синтаксис, типы данных, ООП, асинхронное программирование',
      'Tools': 'Освоить инструменты разработки, сборку, деплоймент'
    };
    return goals[tech.category] || 'Изучить основные концепции и применение';
  };

  const isTechInTracker = (apiTech) => {
    return technologies.some(tech => 
      tech.title.toLowerCase() === apiTech.title.toLowerCase()
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const formatSize = (size) => {
    if (size < 1024) return `${size} KB`;
    return `${(size / 1024).toFixed(1)} MB`;
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
                      <div className="tech-title-section">
                        {tech.avatar_url && (
                          <img 
                            src={tech.avatar_url} 
                            alt={tech.title}
                            className="tech-avatar"
                          />
                        )}
                        <h5>{tech.title}</h5>
                      </div>
                      {isTechInTracker(tech) && (
                        <span className="exists-badge">✅ В трекере</span>
                      )}
                    </div>
                    
                    <p className="api-tech-description">{tech.description}</p>
                    
                    <div className="api-tech-stats">
                      <div className="stat-row">
                        <span className="stat-item">
                          <strong>⭐ {tech.stars}</strong> звезд
                        </span>
                        <span className="stat-item">
                          <strong>🍴 {tech.forks}</strong> форков
                        </span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-item">
                          <strong>📦 {formatSize(tech.size)}</strong>
                        </span>
                        <span className="stat-item">
                          <strong>🐛 {tech.open_issues}</strong> issues
                        </span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-item">
                          Создан: {formatDate(tech.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="api-tech-meta">
                      <span className="tech-language">{tech.language}</span>
                      <span className={`tech-difficulty ${tech.difficulty}`}>
                        {tech.difficulty === 'beginner' ? '👶 Начинающий' : 
                         tech.difficulty === 'intermediate' ? '🚀 Средний' : '🔥 Продвинутый'}
                      </span>
                    </div>

                    <div className="api-tech-actions">
                      {!isTechInTracker(tech) ? (
                        <button
                          onClick={() => handleOpenAddForm(tech)}
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

      {showAddForm && selectedTech && (
        <AddTechnologyForm 
          technology={selectedTech}
          onAdd={handleAddFromApi}
          onCancel={() => {
            setShowAddForm(false);
            setSelectedTech(null);
          }}
          calculateEstimatedHours={calculateEstimatedHours}
          generateLearningGoals={generateLearningGoals}
        />
      )}

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

function AddTechnologyForm({ technology, onAdd, onCancel, calculateEstimatedHours, generateLearningGoals }) {
  const [formData, setFormData] = useState({
    category: technology.category,
    difficulty: technology.difficulty,
    estimatedHours: calculateEstimatedHours(technology),
    prerequisites: '',
    learningGoals: generateLearningGoals(technology)
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="add-tech-modal">
      <div className="modal-overlay" onClick={onCancel}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h3>➕ Добавить технологию в трекер</h3>
          <button onClick={onCancel} className="close-btn">✕</button>
        </div>

        <div className="tech-preview">
          <div className="preview-header">
            {technology.avatar_url && (
              <img 
                src={technology.avatar_url} 
                alt={technology.title}
                className="preview-avatar"
              />
            )}
            <div className="preview-title">
              <h4>{technology.title}</h4>
              <p>{technology.description}</p>
            </div>
          </div>
          
          <div className="preview-stats">
            <div className="preview-stat">
              <span className="stat-label">⭐ Звезды:</span>
              <span className="stat-value">{technology.stars}</span>
            </div>
            <div className="preview-stat">
              <span className="stat-label">🍴 Форки:</span>
              <span className="stat-value">{technology.forks}</span>
            </div>
            <div className="preview-stat">
              <span className="stat-label">📦 Размер:</span>
              <span className="stat-value">
                {technology.size < 1024 ? `${technology.size} KB` : `${(technology.size / 1024).toFixed(1)} MB`}
              </span>
            </div>
            <div className="preview-stat">
              <span className="stat-label">🔤 Язык:</span>
              <span className="stat-value">{technology.language}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="add-tech-form">
          <div className="form-section">
            <h4>📋 Настройки изучения</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label>Категория</label>
                <select 
                  name="category" 
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Language">Language</option>
                  <option value="Tools">Tools</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Сложность</label>
                <select 
                  name="difficulty" 
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="beginner">👶 Начинающий</option>
                  <option value="intermediate">🚀 Средний</option>
                  <option value="advanced">🔥 Продвинутый</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>⏱️ Предполагаемое время изучения (часов)</label>
              <input
                type="number"
                name="estimatedHours"
                value={formData.estimatedHours}
                onChange={handleChange}
                min="1"
                max="500"
                className="form-input"
              />
              <div className="form-hint">
                Основано на сложности и популярности технологии
              </div>
            </div>

            <div className="form-group">
              <label>📚 Предварительные требования</label>
              <textarea
                name="prerequisites"
                value={formData.prerequisites}
                onChange={handleChange}
                placeholder="Что нужно знать перед изучением этой технологии..."
                rows="3"
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label>🎯 Цели изучения</label>
              <textarea
                name="learningGoals"
                value={formData.learningGoals}
                onChange={handleChange}
                placeholder="Что вы планируете изучить..."
                rows="3"
                className="form-textarea"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              ✅ Добавить в трекер
            </button>
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              ✕ Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Technologies;
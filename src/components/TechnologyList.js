// components/TechnologyList.js
import { useState } from 'react';
import ResourceLoader from './ResourceLoader';

function TechnologyList({ technologies, onUpdateTech, onRemoveTech }) {
  const [expandedTech, setExpandedTech] = useState(null);
  const [techResources, setTechResources] = useState({});

  const handleResourcesLoaded = (techId, resources) => {
    setTechResources(prev => ({
      ...prev,
      [techId]: resources
    }));
  };

  const toggleExpand = (techId) => {
    setExpandedTech(expandedTech === techId ? null : techId);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: '#4CAF50',
      intermediate: '#FF9800',
      advanced: '#F44336'
    };
    return colors[difficulty] || '#9E9E9E';
  };

  const getCategoryColor = (category) => {
    const colors = {
      frontend: '#2196F3',
      backend: '#4CAF50',
      language: '#9C27B0',
      other: '#607D8B'
    };
    return colors[category] || '#9E9E9E';
  };

  if (!technologies || technologies.length === 0) {
    return (
      <div className="technology-list empty">
        <p>Технологии не найдены</p>
      </div>
    );
  }

  return (
    <div className="technology-list">
      <div className="list-header">
        <h2>📚 Список технологий ({technologies.length})</h2>
      </div>

      <div className="technologies-grid">
        {technologies.map(tech => (
          <div key={tech.id} className="technology-card">
            <div className="card-header">
              <h3 onClick={() => toggleExpand(tech.id)} className="tech-title">
                {tech.title}
                <span className="expand-icon">
                  {expandedTech === tech.id ? '▲' : '▼'}
                </span>
              </h3>
              <button 
                onClick={() => onRemoveTech(tech.id)}
                className="remove-btn"
                title="Удалить технологию"
              >
                ×
              </button>
            </div>

            <p className="tech-description">{tech.description}</p>

            <div className="tech-meta">
              <span 
                className="category-badge"
                style={{ backgroundColor: getCategoryColor(tech.category) }}
              >
                {tech.category}
              </span>
              <span 
                className="difficulty-badge"
                style={{ backgroundColor: getDifficultyColor(tech.difficulty) }}
              >
                {tech.difficulty}
              </span>
              {tech.language && (
                <span className="language-badge">
                  {tech.language}
                </span>
              )}
              {tech.stars > 0 && (
                <span className="stars">
                  ⭐ {tech.stars}
                </span>
              )}
            </div>

            {expandedTech === tech.id && (
              <div className="tech-details">
                <div className="resources-section">
                  <h4>🔗 Ресурсы:</h4>
                  <ul className="resources-list">
                    {tech.resources?.map((resource, index) => (
                      <li key={index}>
                        <a href={resource} target="_blank" rel="noopener noreferrer">
                          {resource}
                        </a>
                      </li>
                    ))}
                  </ul>
                  
                  <ResourceLoader 
                    technology={tech}
                    onResourcesLoaded={(resources) => 
                      handleResourcesLoaded(tech.id, resources)
                    }
                  />

                  {techResources[tech.id] && (
                    <div className="additional-resources">
                      <h5>Дополнительные ресурсы:</h5>
                      {techResources[tech.id].map((resource, index) => (
                        <div key={index} className="additional-resource">
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            {resource.title}
                          </a>
                          <span className="resource-stars">⭐ {resource.stars}</span>
                          <p className="resource-desc">{resource.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="tech-actions">
                  <button 
                    onClick={() => onUpdateTech(tech.id, { 
                      difficulty: tech.difficulty === 'beginner' ? 'intermediate' : 
                                 tech.difficulty === 'intermediate' ? 'advanced' : 'beginner'
                    })}
                    className="update-difficulty-btn"
                  >
                    Изменить сложность
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TechnologyList;
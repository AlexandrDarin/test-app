// src/components/ResourceLoader.js
import { useState, useRef } from 'react';
import useTechnologiesApi from '../hooks/useTechnologiesApi';

function ResourceLoader({ technology, onResourcesLoaded }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadedResources, setLoadedResources] = useState([]);
  
  const { fetchAdditionalResources } = useTechnologiesApi();
  const abortControllerRef = useRef(null);

  // Загрузка дополнительных ресурсов
  const loadAdditionalResources = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const resources = await fetchAdditionalResources(technology);
      setLoadedResources(resources);

      if (onResourcesLoaded) {
        onResourcesLoaded(resources);
      }

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Не удалось загрузить дополнительные ресурсы: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resource-loader">
      <button 
        onClick={loadAdditionalResources}
        disabled={loading}
        className="btn btn-secondary"
      >
        {loading ? '⏳ Загрузка...' : '📚 Найти дополнительные ресурсы'}
      </button>
      
      {error && (
        <div className="resource-error">
          <p>{error}</p>
          <button onClick={loadAdditionalResources} className="btn btn-primary">
            Попробовать снова
          </button>
        </div>
      )}

      {loadedResources.length > 0 && (
        <div className="additional-resources">
          <h5>🎯 Рекомендуемые ресурсы:</h5>
          <div className="resources-list">
            {loadedResources.map((resource, index) => (
              <div key={index} className="resource-item">
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-link"
                >
                  <strong>{resource.title}</strong>
                  <span className="resource-stars">⭐ {resource.stars}</span>
                </a>
                <p className="resource-description">{resource.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResourceLoader;
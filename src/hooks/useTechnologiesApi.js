// src/hooks/useTechnologiesApi.js
import { useState, useEffect, useCallback } from 'react';

function useTechnologiesApi() {
  const [apiTechnologies, setApiTechnologies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка технологий из GitHub API
  const fetchTechnologiesFromApi = useCallback(async (searchQuery = '') => {
    try {
      setLoading(true);
      setError(null);
      
      let apiUrl = 'https://api.github.com/search/repositories?q=topic:javascript+react+node&sort=stars&per_page=12';
      if (searchQuery) {
        apiUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}+language:javascript&sort=stars&per_page=12`;
      }
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Преобразуем данные GitHub в формат наших технологий
      const transformedTechnologies = data.items.map((repo, index) => ({
        id: `api-${repo.id}`,
        title: repo.name,
        description: repo.description || 'Описание отсутствует',
        category: getCategory(repo.language),
        difficulty: getRandomDifficulty(),
        status: 'not-started',
        notes: [],
        resources: [repo.html_url],
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        lastUpdated: repo.updated_at,
        isFromApi: true,
        apiSource: 'GitHub'
      }));
      
      setApiTechnologies(transformedTechnologies);
      return transformedTechnologies;
      
    } catch (err) {
      setError('Не удалось загрузить технологии: ' + err.message);
      console.error('Ошибка загрузки:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Определяем категорию по языку программирования
  const getCategory = (language) => {
    const categories = {
      'JavaScript': 'Frontend',
      'TypeScript': 'Language',
      'Python': 'Backend',
      'Java': 'Backend',
      'Go': 'Backend',
      'Rust': 'Language',
      'C++': 'Language',
      'HTML': 'Frontend',
      'CSS': 'Frontend',
      'Vue': 'Frontend',
      'Angular': 'Frontend'
    };
    return categories[language] || 'Other';
  };

  // Случайная сложность для демонстрации
  const getRandomDifficulty = () => {
    const difficulties = ['beginner', 'intermediate', 'advanced'];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  };

  // Загрузка дополнительных ресурсов для технологии
  const fetchAdditionalResources = async (technology) => {
    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(technology.title)}+documentation+tutorial&sort=stars&per_page=3`
      );

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      // Преобразуем результаты в ресурсы
      const additionalResources = data.items.map(repo => ({
        title: repo.name,
        url: repo.html_url,
        description: repo.description,
        type: 'github',
        stars: repo.stargazers_count
      }));

      return additionalResources;

    } catch (err) {
      console.error('Ошибка загрузки ресурсов:', err);
      return [];
    }
  };

  // Поиск технологий с debounce
  const searchTechnologiesWithDebounce = useCallback(async (searchTerm, delay = 500) => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        if (searchTerm.trim()) {
          const results = await fetchTechnologiesFromApi(searchTerm);
          resolve(results);
        } else {
          resolve([]);
        }
      }, delay);
    });
  }, [fetchTechnologiesFromApi]);

  return {
    apiTechnologies,
    loading,
    error,
    fetchTechnologiesFromApi,
    fetchAdditionalResources,
    searchTechnologiesWithDebounce,
    clearApiTechnologies: () => setApiTechnologies([])
  };
}

export default useTechnologiesApi;
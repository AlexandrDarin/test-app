// src/hooks/useJobsApi.js
import { useState, useCallback } from 'react';

function useJobsApi() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchJobsByTechnology = useCallback(async (technology, location = '', level = '') => {
    try {
      setLoading(true);
      setError(null);

      const searchQuery = mapTechnologyToJobQuery(technology);
      
      let url = `https://www.themuse.com/api/public/jobs?page=0&descending=true`;
      
      const category = getJobCategory(technology);
      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }
      
      if (location) {
        url += `&location=${encodeURIComponent(location)}`;
      }
      
      if (level) {
        url += `&level=${encodeURIComponent(level)}`;
      }

      console.log('🔍 Запрос вакансий:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status}`);
      }
      
      const data = await response.json();
      
      const filteredJobs = data.results.filter(job => 
        job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.contents.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.tags && job.tags.some(tag => 
          tag.name.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      ).slice(0, 6);

      setJobs(filteredJobs);
      return filteredJobs;
      
    } catch (err) {
      setError('Не удалось загрузить вакансии: ' + err.message);
      console.error('Jobs API Error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const mapTechnologyToJobQuery = (technology) => {
    const techMap = {
      'react': 'React',
      'vue': 'Vue',
      'angular': 'Angular',
      'node': 'Node.js',
      'express': 'Express',
      'typescript': 'TypeScript',
      'javascript': 'JavaScript',
      'python': 'Python',
      'django': 'Django',
      'flask': 'Flask',
      'java': 'Java',
      'spring': 'Spring',
      'go': 'Go',
      'golang': 'Go',
      'rust': 'Rust',
      'php': 'PHP',
      'laravel': 'Laravel',
      'ruby': 'Ruby',
      'rails': 'Rails',
      'sql': 'SQL',
      'mongodb': 'MongoDB',
      'postgresql': 'PostgreSQL',
      'docker': 'Docker',
      'kubernetes': 'Kubernetes',
      'aws': 'AWS',
      'azure': 'Azure'
    };
    
    return techMap[technology.toLowerCase()] || technology;
  };

  const getJobCategory = (technology) => {
    const categoryMap = {
      'react': 'Software Engineering',
      'vue': 'Software Engineering', 
      'angular': 'Software Engineering',
      'node': 'Software Engineering',
      'typescript': 'Software Engineering',
      'javascript': 'Software Engineering',
      'python': 'Software Engineering',
      'java': 'Software Engineering',
      'go': 'Software Engineering',
      'rust': 'Software Engineering',
      'php': 'Software Engineering',
      'ruby': 'Software Engineering',
      'sql': 'Data & Analytics',
      'mongodb': 'Data & Analytics',
      'postgresql': 'Data & Analytics',
      'docker': 'Software Engineering',
      'kubernetes': 'Software Engineering',
      'aws': 'Software Engineering',
      'azure': 'Software Engineering'
    };
    
    return categoryMap[technology.toLowerCase()];
  };

  const getExperienceLevels = () => {
    return [
      { value: '', label: 'Любой уровень' },
      { value: 'Internship', label: 'Стажер' },
      { value: 'Entry Level', label: 'Начальный уровень' },
      { value: 'Mid Level', label: 'Средний уровень' },
      { value: 'Senior Level', label: 'Старший уровень' }
    ];
  };

  const getPopularLocations = () => {
    return [
      { value: '', label: 'Любое местоположение' },
      { value: 'New York, NY', label: 'Нью-Йорк, США' },
      { value: 'San Francisco, CA', label: 'Сан-Франциско, США' },
      { value: 'London, UK', label: 'Лондон, Великобритания' },
      { value: 'Berlin, Germany', label: 'Берлин, Германия' },
      { value: 'Remote', label: 'Удаленная работа' }
    ];
  };

  return {
    jobs,
    loading,
    error,
    searchJobsByTechnology,
    getExperienceLevels,
    getPopularLocations,
    clearJobs: () => setJobs([])
  };
}

export default useJobsApi;
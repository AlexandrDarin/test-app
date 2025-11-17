// src/components/JobOpportunities.js
import './JobOpportunities.css';
import React, { useState, useEffect } from 'react';
import useJobsApi from '../hooks/useJobsApi';

function JobOpportunities({ technology, onClose }) {
  const { 
    jobs, 
    loading, 
    error, 
    searchJobsByTechnology, 
    getExperienceLevels, 
    getPopularLocations 
  } = useJobsApi();
  
  const [filters, setFilters] = useState({
    location: '',
    level: ''
  });

  useEffect(() => {
    if (technology) {
      searchJobsByTechnology(technology.title, filters.location, filters.level);
    }
  }, [technology, filters, searchJobsByTechnology]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const formatSalary = (job) => {
    const salaryMatch = job.contents.match(/\$(\d+,\d+|\d+)k?/i);
    return salaryMatch ? `~ ${salaryMatch[0]}` : 'Зарплата не указана';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const getJobType = (job) => {
    if (job.type) return job.type;
    if (job.contents.toLowerCase().includes('full-time')) return 'Полная занятость';
    if (job.contents.toLowerCase().includes('part-time')) return 'Частичная занятость';
    if (job.contents.toLowerCase().includes('contract')) return 'Контракт';
    return 'Полная занятость';
  };

  if (!technology) return null;

  return (
    <div className="job-opportunities-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content jobs-modal">
        <div className="modal-header">
          <div className="header-content">
            <h3>💼 Вакансии для {technology.title}</h3>
            <p>Актуальные предложения на рынке труда</p>
          </div>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="jobs-filters">
          <div className="filter-group">
            <label>📍 Местоположение</label>
            <select 
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="filter-select"
            >
              {getPopularLocations().map(location => (
                <option key={location.value} value={location.value}>
                  {location.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>🎯 Уровень опыта</label>
            <select 
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              className="filter-select"
            >
              {getExperienceLevels().map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="jobs-results">
          {loading && (
            <div className="jobs-loading">
              <div className="loading-spinner"></div>
              <p>Ищем актуальные вакансии...</p>
            </div>
          )}

          {error && (
            <div className="jobs-error">
              <p>❌ {error}</p>
              <button 
                onClick={() => searchJobsByTechnology(technology.title, filters.location, filters.level)}
                className="btn btn-primary"
              >
                Попробовать снова
              </button>
            </div>
          )}

          {!loading && !error && jobs.length > 0 && (
            <div className="jobs-list">
              <div className="jobs-count">
                Найдено {jobs.length} вакансий
              </div>
              {jobs.map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <div className="job-title-section">
                      <h4>{job.name}</h4>
                      <div className="job-company">
                        {job.company?.name && (
                          <span className="company-name">🏢 {job.company.name}</span>
                        )}
                      </div>
                    </div>
                    <div className="job-meta">
                      <span className="job-type">{getJobType(job)}</span>
                      <span className="job-date">{formatDate(job.publication_date)}</span>
                    </div>
                  </div>

                  <div className="job-details">
                    <div className="job-location">
                      📍 {job.locations?.[0]?.name || 'Местоположение не указано'}
                    </div>
                    <div className="job-level">
                      🎯 {job.levels?.[0]?.name || 'Уровень не указан'}
                    </div>
                    <div className="job-salary">
                      💰 {formatSalary(job)}
                    </div>
                  </div>

                  <div className="job-description">
                    {job.contents && (
                      <p>
                        {job.contents.substring(0, 200)}...
                        {job.contents.length > 200 && (
                          <span className="read-more">читать далее</span>
                        )}
                      </p>
                    )}
                  </div>

                  <div className="job-actions">
                    <a 
                      href={job.refs?.landing_page} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      📨 Откликнуться
                    </a>
                    <button className="btn btn-secondary">
                      💾 Сохранить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && jobs.length === 0 && (
            <div className="no-jobs">
              <div className="no-jobs-icon">🔍</div>
              <h4>Вакансии не найдены</h4>
              <p>Попробуйте изменить фильтры или проверить позже</p>
              <div className="no-jobs-tips">
                <strong>Советы:</strong>
                <ul>
                  <li>Измените местоположение</li>
                  <li>Попробуйте другой уровень опыта</li>
                  <li>Ищите на английском языке</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="jobs-footer">
          <p>
            💡 <strong>Совет:</strong> Изучайте технологии, востребованные на рынке труда, 
            чтобы увеличить свои карьерные возможности!
          </p>
        </div>
      </div>
    </div>
  );
}

export default JobOpportunities;
// src/components/FilterTabs.js
import React from 'react';
import './FilterTabs.css';

function FilterTabs({ activeFilter, onFilterChange, technologies }) {
  const filters = [
    { key: 'all', label: 'ВСЕ', count: technologies.length },
    { key: 'not-started', label: 'НЕ НАЧАТЫЕ', count: technologies.filter(t => t.status === 'not-started').length },
    { key: 'in-progress', label: 'В ПРОЦЕССЕ', count: technologies.filter(t => t.status === 'in-progress').length },
    { key: 'completed', label: 'ЗАВЕРШЕННЫЕ', count: technologies.filter(t => t.status === 'completed').length }
  ];

  return (
    <div className="filter-tabs">
      <div className="filter-header">
        <h3>ФИЛЬТР ПО СТАТУСУ</h3>
      </div>
      <div className="filter-buttons">
        {filters.map(filter => (
          <button
            key={filter.key}
            className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
            onClick={() => onFilterChange(filter.key)}
          >
            <span className="filter-label">{filter.label}</span>
            <span className="filter-count">{filter.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterTabs;
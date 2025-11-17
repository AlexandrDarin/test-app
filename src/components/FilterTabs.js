import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './FilterTabs.css';

function FilterTabs({ activeFilter, onFilterChange, technologies }) {
  const location = useLocation();
  
  const isTechnologiesPage = location.pathname === '/technologies';

  const getCount = (status) => {
    return technologies.filter(tech => status === 'all' || tech.status === status).length;
  };

  const tabs = [
    { key: 'all', label: 'Все', count: getCount('all') },
    { key: 'not-started', label: 'Не начато', count: getCount('not-started') },
    { key: 'in-progress', label: 'В процессе', count: getCount('in-progress') },
    { key: 'completed', label: 'Завершено', count: getCount('completed') }
  ];

  return (
    <div className="filter-tabs">
      <div className="filter-buttons">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`filter-tab ${activeFilter === tab.key ? 'active' : ''}`}
            onClick={() => onFilterChange(tab.key)}
          >
            <span className="filter-label">{tab.label}</span>
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>
      
      {!isTechnologiesPage && (
        <Link to="/technologies" className="view-all-link">
          Смотреть все технологии →
        </Link>
      )}
    </div>
  );
}

export default FilterTabs;
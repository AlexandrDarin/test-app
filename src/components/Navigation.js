// src/components/Navigation.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import './Navigation.css';

function Navigation({ themeToggle }) {
  const location = useLocation();

  return (
    <nav className="main-navigation">
      <div className="nav-brand">
        <Link to="/">
          <h2>🚀 Трекер технологий</h2>
        </Link>
      </div>
      
      <ul className="nav-menu">
        <li>
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Главная
          </Link>
        </li>
        <li>
          <Link 
            to="/technologies" 
            className={location.pathname === '/technologies' ? 'active' : ''}
          >
            Все технологии
          </Link>
        </li>
        <li>
          <Link 
            to="/statistics" 
            className={location.pathname === '/statistics' ? 'active' : ''}
          >
            Статистика
          </Link>
        </li>
        <li>
          <Link 
            to="/settings" 
            className={location.pathname === '/settings' ? 'active' : ''}
          >
            Настройки
          </Link>
        </li>
      </ul>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {themeToggle}
      </Box>
    </nav>
  );
}

export default Navigation;
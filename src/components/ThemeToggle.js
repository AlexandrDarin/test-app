// src/components/ThemeToggle.js
import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { Palette as PaletteIcon } from '@mui/icons-material';

function ThemeToggle({ currentTheme, onThemeChange }) {
  const themes = [
    { name: 'neon', label: '🔴 Неоновая тема', icon: '🔴' },
    { name: 'default', label: '🌀 Стандартная тема', icon: '🌀' }
  ];

  const nextTheme = currentTheme === 'neon' ? 'default' : 'neon';
  const currentThemeConfig = themes.find(t => t.name === nextTheme);

  return (
    <Tooltip title={currentThemeConfig.label}>
      <IconButton
        onClick={() => onThemeChange(nextTheme)}
        sx={{
          color: '#fff',
          background: 'rgba(255, 0, 0, 0.1)',
          border: '1px solid rgba(255, 0, 0, 0.3)',
          '&:hover': {
            background: 'rgba(255, 0, 0, 0.2)',
            boxShadow: '0 0 15px rgba(255, 0, 0, 0.5)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <Box sx={{ fontSize: '1.2rem' }}>
          {currentThemeConfig.icon}
        </Box>
      </IconButton>
    </Tooltip>
  );
}

export default ThemeToggle;
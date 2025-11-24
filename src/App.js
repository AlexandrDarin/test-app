// src/App.js
import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { muiTheme } from './styles/muiTheme';
import { neonTheme } from './styles/neonTheme';

// Компоненты
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Technologies from './pages/Technologies';
import TechnologyDetail from './pages/TechnologyDetail';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import ThemeToggle from './components/ThemeToggle';

// Хуки
import useTechnologies from './hooks/useTechnologies';

// Стили
import './App.css';

function App() {
  const [currentTheme, setCurrentTheme] = useState('default');
  const technologyHook = useTechnologies();

  const theme = useMemo(() => {
    return currentTheme === 'neon' ? neonTheme : muiTheme;
  }, [currentTheme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className={`App ${currentTheme}-theme`}>
          <Navigation 
            themeToggle={
              <ThemeToggle 
                currentTheme={currentTheme} 
                onThemeChange={setCurrentTheme} 
              />
            }
          />
          <main className="main-content">
            <Routes>
              <Route 
                path="/" 
                element={
                  <Home 
                    technologies={technologyHook.technologies}
                    updateStatus={technologyHook.updateStatus}
                    updateNote={technologyHook.updateNote}
                    markAllAsCompleted={technologyHook.markAllAsCompleted}
                    resetAllStatuses={technologyHook.resetAllStatuses}
                    getStats={technologyHook.getStats}
                    currentTheme={currentTheme}
                  />
                } 
              />
              <Route 
                path="/technologies" 
                element={
                  <Technologies 
                    technologies={technologyHook.technologies}
                    updateStatus={technologyHook.updateStatus}
                    updateNote={technologyHook.updateNote}
                    addNote={technologyHook.addNote}
                    deleteTechnology={technologyHook.deleteTechnology}
                    addTechnology={technologyHook.addTechnology}
                    searchTechnologies={technologyHook.searchTechnologies}
                    currentTheme={currentTheme}
                  />
                } 
              />
              <Route 
                path="/technology/:techId" 
                element={
                  <TechnologyDetail 
                    technologies={technologyHook.technologies}
                    updateStatus={technologyHook.updateStatus}
                    updateNote={technologyHook.updateNote}
                    addNote={technologyHook.addNote}
                    deleteNote={technologyHook.deleteNote}
                    editNote={technologyHook.editNote}
                    currentTheme={currentTheme}
                  />
                } 
              />
              <Route 
                path="/statistics" 
                element={
                  <Statistics 
                    technologies={technologyHook.technologies}
                    getStats={technologyHook.getStats}
                    currentTheme={currentTheme}
                  />
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <Settings 
                    technologies={technologyHook.technologies}
                    resetAllStatuses={technologyHook.resetAllStatuses}
                    markAllAsCompleted={technologyHook.markAllAsCompleted}
                    currentTheme={currentTheme}
                  />
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
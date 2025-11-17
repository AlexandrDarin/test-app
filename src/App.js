import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Technologies from './pages/Technologies';
import TechnologyDetail from './pages/TechnologyDetail';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import useTechnologies from './hooks/useTechnologies';

function App() {
  const {
    technologies,
    updateStatus,
    updateNote,
    addNote,
    deleteNote,
    editNote,
    addTechnology,
    deleteTechnology,
    updateTechnology,
    getTechnologyById,
    markAllAsCompleted,
    resetAllStatuses,
    clearAllData,
    importTechnologies,
    searchTechnologies,
    getStats
  } = useTechnologies();

  return (
    <Router>
      <div className="App">
        <Navigation />
        
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  technologies={technologies}
                  updateStatus={updateStatus}
                  updateNote={updateNote}
                  addNote={addNote}
                  markAllAsCompleted={markAllAsCompleted}
                  resetAllStatuses={resetAllStatuses}
                  getStats={getStats}
                  searchTechnologies={searchTechnologies}
                />
              } 
            />
            <Route 
              path="/technologies" 
              element={
                <Technologies 
                  technologies={technologies}
                  updateStatus={updateStatus}
                  updateNote={updateNote}
                  addNote={addNote}
                  deleteTechnology={deleteTechnology}
                  addTechnology={addTechnology}
                  searchTechnologies={searchTechnologies}
                />
              } 
            />
            <Route 
              path="/technology/:techId" 
              element={
                <TechnologyDetail 
                  technologies={technologies}
                  updateStatus={updateStatus}
                  updateNote={updateNote}
                  addNote={addNote}
                  deleteNote={deleteNote}
                  editNote={editNote}
                  getTechnologyById={getTechnologyById}
                  updateTechnology={updateTechnology}
                />
              } 
            />
            <Route 
              path="/statistics" 
              element={
                <Statistics 
                  technologies={technologies}
                  getStats={getStats}
                />
              } 
            />
            <Route 
              path="/settings" 
              element={
                <Settings 
                  technologies={technologies}
                  resetAllStatuses={resetAllStatuses}
                  markAllAsCompleted={markAllAsCompleted}
                  clearAllData={clearAllData}
                  importTechnologies={importTechnologies}
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
// App.js
import React, { useState } from 'react';
import './App.css';
import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';
import QuickActions from './components/QuickActions';
import FilterTabs from './components/FilterTabs';

function App() {
  const [technologies, setTechnologies] = useState([
    { 
      id: 1, 
      title: 'React Components', 
      description: 'Изучение функциональных и классовых компонентов, их жизненного цикла', 
      status: 'completed',
      category: 'React Basics'
    },
    { 
      id: 2, 
      title: 'JSX Syntax', 
      description: 'Освоение синтаксиса JSX и его отличий от обычного HTML', 
      status: 'in-progress',
      category: 'React Basics'
    },
    { 
      id: 3, 
      title: 'State Management', 
      description: 'Работа с состоянием компонентов с помощью useState и useReducer', 
      status: 'not-started',
      category: 'Advanced React'
    },
    { 
      id: 4, 
      title: 'Props and Data Flow', 
      description: 'Передача данных между компонентами через props', 
      status: 'not-started',
      category: 'React Basics'
    },
    { 
      id: 5, 
      title: 'React Hooks', 
      description: 'Изучение основных хуков: useEffect, useContext, useMemo', 
      status: 'not-started',
      category: 'Advanced React'
    },
    { 
      id: 6, 
      title: 'React Router', 
      description: 'Навигация в React приложениях', 
      status: 'not-started',
      category: 'Routing'
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTech, setSelectedTech] = useState(null);

  // Функция для изменения статуса технологии
  const handleStatusChange = (techId) => {
    setTechnologies(prevTech => 
      prevTech.map(tech => {
        if (tech.id === techId) {
          const statusOrder = ['not-started', 'in-progress', 'completed'];
          const currentIndex = statusOrder.indexOf(tech.status);
          const nextIndex = (currentIndex + 1) % statusOrder.length;
          const newStatus = statusOrder[nextIndex];
          
          if (newStatus === 'in-progress') {
            setSelectedTech(techId);
          }
          
          return { ...tech, status: newStatus };
        }
        return tech;
      })
    );
  };

  // Функции для быстрых действий
  const markAllAsCompleted = () => {
    setTechnologies(prevTech => 
      prevTech.map(tech => ({ ...tech, status: 'completed' }))
    );
    setSelectedTech(null);
  };

  const resetAllStatuses = () => {
    setTechnologies(prevTech => 
      prevTech.map(tech => ({ ...tech, status: 'not-started' }))
    );
    setSelectedTech(null);
  };

  const randomNextTechnology = () => {
    const notStartedTech = technologies.filter(tech => tech.status === 'not-started');
    if (notStartedTech.length > 0) {
      const randomTech = notStartedTech[Math.floor(Math.random() * notStartedTech.length)];
      
      // Автоматически меняем статус на "в процессе"
      setTechnologies(prevTech => 
        prevTech.map(tech => 
          tech.id === randomTech.id 
            ? { ...tech, status: 'in-progress' }
            : tech
        )
      );
      
      setSelectedTech(randomTech.id);
      
      // Показываем уведомление
      setTimeout(() => {
        alert(`🎯 Случайно выбрана технология: ${randomTech.title}\nСтатус изменен на "В процессе"`);
      }, 100);
      
    } else {
      alert('Все технологии уже начаты или завершены!');
    }
  };

  // Фильтрация технологий
  const filteredTechnologies = technologies.filter(tech => {
    switch (activeFilter) {
      case 'completed':
        return tech.status === 'completed';
      case 'in-progress':
        return tech.status === 'in-progress';
      case 'not-started':
        return tech.status === 'not-started';
      default:
        return true;
    }
  });

  return (
    <div className="App">
      <div className="container">
        <ProgressHeader technologies={technologies} />
        
        <QuickActions
          onMarkAllCompleted={markAllAsCompleted}
          onResetAll={resetAllStatuses}
          onRandomNext={randomNextTechnology}
        />
        
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          technologies={technologies}
        />
        
        <div className="technologies-grid">
          {filteredTechnologies.map(tech => (
            <TechnologyCard
              key={tech.id}
              title={tech.title}
              description={tech.description}
              status={tech.status}
              category={tech.category}
              isSelected={tech.id === selectedTech}
              onStatusChange={() => handleStatusChange(tech.id)}
            />
          ))}
        </div>

        {filteredTechnologies.length === 0 && (
          <div className="empty-state">
            <h3>🕳️ Нет технологий для отображения</h3>
            <p>Измените фильтр, чтобы увидеть больше технологий</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
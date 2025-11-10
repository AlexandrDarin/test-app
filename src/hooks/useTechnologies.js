// src/hooks/useTechnologies.js
import useLocalStorage from './useLocalStorage';

const initialTechnologies = [
  { 
    id: 1, 
    title: 'React Components', 
    description: 'Изучение функциональных и классовых компонентов, их жизненного цикла', 
    status: 'completed',
    category: 'React Basics',
    notes: [
      { id: 1, text: "Изучить функциональные компоненты", completed: true },
      { id: 2, text: "Разобраться с жизненным циклом", completed: true }
    ]
  },
  { 
    id: 2, 
    title: 'JSX Syntax', 
    description: 'Освоение синтаксиса JSX и его отличий от обычного HTML', 
    status: 'in-progress',
    category: 'React Basics',
    notes: [
      { id: 1, text: "Синтаксис JSX выражения", completed: true },
      { id: 2, text: "Условный рендеринг", completed: false }
    ]
  },
  { 
    id: 3, 
    title: 'State Management', 
    description: 'Работа с состоянием компонентов с помощью useState и useReducer', 
    status: 'not-started',
    category: 'Advanced React',
    notes: []
  },
  { 
    id: 4, 
    title: 'Props and Data Flow', 
    description: 'Передача данных между компонентами через props', 
    status: 'not-started',
    category: 'React Basics',
    notes: []
  }
];

function useTechnologies() {
  const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);

  const updateTechnology = (techId, updatedFields) => {
    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === techId ? { ...tech, ...updatedFields } : tech
      )
    );
  };

  const updateStatus = (techId) => {
    setTechnologies(prevTech => 
      prevTech.map(tech => {
        if (tech.id === techId) {
          const statusOrder = ['not-started', 'in-progress', 'completed'];
          const currentIndex = statusOrder.indexOf(tech.status);
          const nextIndex = (currentIndex + 1) % statusOrder.length;
          return { ...tech, status: statusOrder[nextIndex] };
        }
        return tech;
      })
    );
  };

  const updateNote = (techId, noteId) => {
    setTechnologies(prevTech => 
      prevTech.map(tech => {
        if (tech.id === techId) {
          const updatedNotes = tech.notes.map(note =>
            note.id === noteId ? { ...note, completed: !note.completed } : note
          );
          
          const completedNotes = updatedNotes.filter(note => note.completed).length;
          let newStatus = tech.status;
          
          if (completedNotes === updatedNotes.length && updatedNotes.length > 0) {
            newStatus = 'completed';
          } else if (completedNotes > 0) {
            newStatus = 'in-progress';
          }
          
          return { ...tech, notes: updatedNotes, status: newStatus };
        }
        return tech;
      })
    );
  };

  const markAllAsCompleted = () => {
    setTechnologies(prevTech => 
      prevTech.map(tech => ({ 
        ...tech, 
        status: 'completed',
        notes: tech.notes.map(note => ({ ...note, completed: true }))
      }))
    );
  };

  const resetAllStatuses = () => {
    setTechnologies(prevTech => 
      prevTech.map(tech => ({ 
        ...tech, 
        status: 'not-started',
        notes: tech.notes.map(note => ({ ...note, completed: false }))
      }))
    );
  };

  const calculateProgress = () => {
    if (technologies.length === 0) return 0;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  };

  const getStats = () => {
    const totalNotes = technologies.reduce((sum, tech) => sum + tech.notes.length, 0);
    const completedNotes = technologies.reduce((sum, tech) => 
      sum + tech.notes.filter(note => note.completed).length, 0
    );
    
    return {
      totalTechnologies: technologies.length,
      completedTechnologies: technologies.filter(tech => tech.status === 'completed').length,
      inProgressTechnologies: technologies.filter(tech => tech.status === 'in-progress').length,
      notStartedTechnologies: technologies.filter(tech => tech.status === 'not-started').length,
      totalNotes,
      completedNotes,
      progressPercent: calculateProgress()
    };
  };

  return {
    technologies,
    updateTechnology,
    updateStatus,
    updateNote,
    markAllAsCompleted,
    resetAllStatuses,
    getStats
  };
}

export default useTechnologies;
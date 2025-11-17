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

  const addTechnology = (newTech) => {
    const newTechnology = {
      id: Date.now(),
      ...newTech,
      status: 'not-started',
      notes: []
    };
    setTechnologies(prev => [...prev, newTechnology]);
    return newTechnology.id;
  };

  const deleteTechnology = (techId) => {
    setTechnologies(prev => prev.filter(tech => tech.id !== techId));
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

  const setSpecificStatus = (techId, status) => {
    setTechnologies(prevTech =>
      prevTech.map(tech =>
        tech.id === techId ? { ...tech, status } : tech
      )
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

  const addNote = (techId, noteText) => {
    setTechnologies(prevTech =>
      prevTech.map(tech => {
        if (tech.id === techId) {
          const newNote = {
            id: Date.now(),
            text: noteText,
            completed: false
          };
          return {
            ...tech,
            notes: [...tech.notes, newNote],
            status: tech.status === 'not-started' ? 'in-progress' : tech.status
          };
        }
        return tech;
      })
    );
  };

  const deleteNote = (techId, noteId) => {
    setTechnologies(prevTech =>
      prevTech.map(tech => {
        if (tech.id === techId) {
          const updatedNotes = tech.notes.filter(note => note.id !== noteId);

          let newStatus = tech.status;
          if (updatedNotes.length === 0) {
            newStatus = 'not-started';
          } else if (updatedNotes.every(note => note.completed)) {
            newStatus = 'completed';
          }

          return { ...tech, notes: updatedNotes, status: newStatus };
        }
        return tech;
      })
    );
  };

  const editNote = (techId, noteId, newText) => {
    setTechnologies(prevTech =>
      prevTech.map(tech => {
        if (tech.id === techId) {
          const updatedNotes = tech.notes.map(note =>
            note.id === noteId ? { ...note, text: newText } : note
          );
          return { ...tech, notes: updatedNotes };
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

  const clearAllData = () => {
    setTechnologies(initialTechnologies);
  };

  const importTechnologies = (importedTechnologies) => {
    if (Array.isArray(importedTechnologies)) {
      setTechnologies(importedTechnologies);
      return true;
    }
    return false;
  };

  const getTechnologyById = (techId) => {
    return technologies.find(tech => tech.id === techId);
  };

  const getTechnologiesByCategory = (category) => {
    return technologies.filter(tech => tech.category === category);
  };

  const getCategories = () => {
    const categories = [...new Set(technologies.map(tech => tech.category))];
    return categories.sort();
  };

  const searchTechnologies = (searchTerm) => {
    if (!searchTerm.trim()) return technologies;

    const term = searchTerm.toLowerCase();
    return technologies.filter(tech =>
      tech.title.toLowerCase().includes(term) ||
      tech.description.toLowerCase().includes(term) ||
      tech.category.toLowerCase().includes(term) ||
      tech.notes.some(note => note.text.toLowerCase().includes(term))
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

    const categories = getCategories();
    const categoryStats = categories.map(category => {
      const categoryTechs = technologies.filter(tech => tech.category === category);
      const completedInCategory = categoryTechs.filter(tech => tech.status === 'completed').length;
      return {
        category,
        total: categoryTechs.length,
        completed: completedInCategory,
        progress: categoryTechs.length > 0 ? Math.round((completedInCategory / categoryTechs.length) * 100) : 0
      };
    });

    return {
      totalTechnologies: technologies.length,
      completedTechnologies: technologies.filter(tech => tech.status === 'completed').length,
      inProgressTechnologies: technologies.filter(tech => tech.status === 'in-progress').length,
      notStartedTechnologies: technologies.filter(tech => tech.status === 'not-started').length,
      totalNotes,
      completedNotes,
      categories: categoryStats,
      progressPercent: calculateProgress()
    };
  };

  return {
    technologies,
    updateTechnology,
    addTechnology,
    deleteTechnology,
    getTechnologyById,
    updateStatus,
    setSpecificStatus,
    markAllAsCompleted,
    resetAllStatuses,
    updateNote,
    addNote,
    deleteNote,
    editNote,
    searchTechnologies,
    getTechnologiesByCategory,
    getCategories,
    clearAllData,
    importTechnologies,
    getStats
  };
}

export default useTechnologies;
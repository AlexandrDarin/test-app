// src/components/AddTechnologyForm.js
import { useState } from 'react';

function AddTechnologyForm({ onAddTechnology, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'beginner'
  });

  const categories = ['React Basics', 'Advanced React', 'Frontend', 'Backend', 'Language', 'Tools', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Пожалуйста, введите название технологии');
      return;
    }

    onAddTechnology({
      title: formData.title,
      description: formData.description,
      category: formData.category || 'Other',
      difficulty: formData.difficulty
    });

    // Сброс формы
    setFormData({
      title: '',
      description: '',
      category: '',
      difficulty: 'beginner'
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="add-technology-form">
      <h3>➕ Добавить новую технологию</h3>
      
      <form onSubmit={handleSubmit} className="tech-form">
        <div className="form-group">
          <label htmlFor="title">Название технологии *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Например: React Hooks, Node.js, TypeScript..."
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Краткое описание технологии..."
            rows="3"
            className="form-textarea"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Категория</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Выберите категорию</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="difficulty">Сложность</label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="form-select"
            >
              <option value="beginner">Начинающий</option>
              <option value="intermediate">Средний</option>
              <option value="advanced">Продвинутый</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-success">
            ➕ Добавить технологию
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            ✕ Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTechnologyForm;
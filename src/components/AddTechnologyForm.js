// src/components/AddTechnologyForm.js
import { useState, useEffect } from 'react';
import './AddTechnologyForm.css';

function AddTechnologyForm({ onAddTechnology, onCancel, initialData = {} }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || '',
    difficulty: initialData.difficulty || 'beginner',
    estimatedHours: initialData.estimatedHours || '',
    prerequisites: initialData.prerequisites || '',
    learningGoals: initialData.learningGoals || ''
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touched, setTouched] = useState({});

  const categories = ['Frontend', 'Backend', 'Language', 'Tools', 'React Basics', 'Advanced React', 'Other'];

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};

    // Валидация названия
    if (!formData.title.trim()) {
      newErrors.title = 'Название технологии обязательно';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Название должно содержать минимум 2 символа';
    } else if (formData.title.trim().length > 50) {
      newErrors.title = 'Название не должно превышать 50 символов';
    }

    // Валидация описания
    if (!formData.description.trim()) {
      newErrors.description = 'Описание технологии обязательно';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Описание должно содержать минимум 10 символов';
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'Описание не должно превышать 500 символов';
    }

    // Валидация категории
    if (!formData.category) {
      newErrors.category = 'Выберите категорию';
    }

    // Валидация времени изучения
    if (formData.estimatedHours) {
      const hours = parseInt(formData.estimatedHours);
      if (isNaN(hours) || hours < 1 || hours > 1000) {
        newErrors.estimatedHours = 'Введите корректное количество часов (1-1000)';
      }
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  // Валидация при каждом изменении
  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Проверяем touched для всех обязательных полей
    const allTouched = {
      title: true,
      description: true,
      category: true
    };
    setTouched(allTouched);

    validateForm();

    if (isFormValid) {
      onAddTechnology({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        difficulty: formData.difficulty,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
        prerequisites: formData.prerequisites.trim() || undefined,
        learningGoals: formData.learningGoals.trim() || undefined
      });

      // Сброс формы
      setFormData({
        title: '',
        description: '',
        category: '',
        difficulty: 'beginner',
        estimatedHours: '',
        prerequisites: '',
        learningGoals: ''
      });
      setTouched({});
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Отмечаем поле как "тронутое"
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const shouldShowError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  return (
    <div className="add-technology-form">
      <h3>➕ {initialData.title ? 'Редактировать технологию' : 'Добавить новую технологию'}</h3>
      
      <form onSubmit={handleSubmit} className="tech-form" noValidate>
        {/* Название технологии */}
        <div className="form-group">
          <label htmlFor="title" className="required">
            Название технологии
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${shouldShowError('title') ? 'error' : ''}`}
            placeholder="Например: React Hooks, Node.js, TypeScript..."
            aria-describedby={shouldShowError('title') ? 'title-error' : 'title-help'}
            aria-required="true"
            aria-invalid={shouldShowError('title')}
            required
          />
          {shouldShowError('title') && (
            <span id="title-error" className="error-message" role="alert">
              {errors.title}
            </span>
          )}
          <div id="title-help" className="help-text">
            Минимум 2 символа, максимум 50 символов
          </div>
        </div>

        {/* Описание */}
        <div className="form-group">
          <label htmlFor="description" className="required">
            Описание
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            rows="4"
            className={`form-textarea ${shouldShowError('description') ? 'error' : ''}`}
            placeholder="Краткое описание технологии, что вы планируете изучить..."
            aria-describedby={shouldShowError('description') ? 'description-error' : 'description-help'}
            aria-required="true"
            aria-invalid={shouldShowError('description')}
            required
          />
          {shouldShowError('description') && (
            <span id="description-error" className="error-message" role="alert">
              {errors.description}
            </span>
          )}
          <div id="description-help" className="help-text">
            Минимум 10 символов, максимум 500 символов. Осталось: {500 - formData.description.length}
          </div>
        </div>

        <div className="form-row">
          {/* Категория */}
          <div className="form-group">
            <label htmlFor="category" className="required">
              Категория
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-select ${shouldShowError('category') ? 'error' : ''}`}
              aria-describedby={shouldShowError('category') ? 'category-error' : undefined}
              aria-required="true"
              aria-invalid={shouldShowError('category')}
              required
            >
              <option value="">Выберите категорию</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {shouldShowError('category') && (
              <span id="category-error" className="error-message" role="alert">
                {errors.category}
              </span>
            )}
          </div>

          {/* Сложность */}
          <div className="form-group">
            <label htmlFor="difficulty">
              Сложность
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="form-select"
            >
              <option value="beginner">👶 Начинающий</option>
              <option value="intermediate">🚀 Средний</option>
              <option value="advanced">🔥 Продвинутый</option>
            </select>
          </div>
        </div>

        {/* Время изучения */}
        <div className="form-group">
          <label htmlFor="estimatedHours">
            ⏱️ Предполагаемое время изучения (часов)
          </label>
          <input
            type="number"
            id="estimatedHours"
            name="estimatedHours"
            value={formData.estimatedHours}
            onChange={handleChange}
            onBlur={handleBlur}
            min="1"
            max="1000"
            className={`form-input ${shouldShowError('estimatedHours') ? 'error' : ''}`}
            placeholder="20"
            aria-describedby={shouldShowError('estimatedHours') ? 'hours-error' : 'hours-help'}
          />
          {shouldShowError('estimatedHours') && (
            <span id="hours-error" className="error-message" role="alert">
              {errors.estimatedHours}
            </span>
          )}
          <div id="hours-help" className="help-text">
            Необязательное поле. От 1 до 1000 часов
          </div>
        </div>

        {/* Предварительные требования */}
        <div className="form-group">
          <label htmlFor="prerequisites">
            📚 Предварительные требования
          </label>
          <textarea
            id="prerequisites"
            name="prerequisites"
            value={formData.prerequisites}
            onChange={handleChange}
            rows="3"
            className="form-textarea"
            placeholder="Что нужно знать перед изучением этой технологии..."
            aria-describedby="prerequisites-help"
          />
          <div id="prerequisites-help" className="help-text">
            Необязательное поле. Укажите необходимые базовые знания
          </div>
        </div>

        {/* Цели изучения */}
        <div className="form-group">
          <label htmlFor="learningGoals">
            🎯 Цели изучения
          </label>
          <textarea
            id="learningGoals"
            name="learningGoals"
            value={formData.learningGoals}
            onChange={handleChange}
            rows="3"
            className="form-textarea"
            placeholder="Что вы планируете изучить, какие навыки получить..."
            aria-describedby="goals-help"
          />
          <div id="goals-help" className="help-text">
            Необязательное поле. Опишите конкретные цели обучения
          </div>
        </div>

        {/* Сообщение о валидности формы */}
        <div 
          className={`form-validation ${!isFormValid && Object.keys(touched).length > 0 ? 'invalid' : ''}`}
          role="status"
          aria-live="polite"
        >
          {!isFormValid && Object.keys(touched).length > 0 ? (
            <span className="validation-message">
              ⚠️ Исправьте ошибки в форме перед отправкой
            </span>
          ) : isFormValid ? (
            <span className="validation-message valid">
              ✅ Форма заполнена корректно
            </span>
          ) : null}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-success"
            disabled={!isFormValid}
            aria-describedby="submit-help"
          >
            {initialData.title ? '💾 Обновить технологию' : '➕ Добавить технологию'}
          </button>
          
          <button 
            type="button" 
            onClick={onCancel} 
            className="btn btn-secondary"
          >
            ✕ Отмена
          </button>
        </div>

        <div id="submit-help" className="help-text">
          {!isFormValid 
            ? 'Заполните все обязательные поля корректно для активации кнопки' 
            : 'Форма готова к отправке'
          }
        </div>
      </form>
    </div>
  );
}

export default AddTechnologyForm;
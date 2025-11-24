// src/components/MuiDashboard.js
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  keyframes
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Star as StarIcon
} from '@mui/icons-material';

// Создаем keyframes для анимаций
const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

function MuiDashboard({ technologies, currentTheme = 'default' }) {
  const stats = {
    total: technologies.length,
    completed: technologies.filter(tech => tech.status === 'completed').length,
    inProgress: technologies.filter(tech => tech.status === 'in-progress').length,
    notStarted: technologies.filter(tech => tech.status === 'not-started').length,
    progress: technologies.length > 0 ? 
      Math.round((technologies.filter(tech => tech.status === 'completed').length / technologies.length) * 100) : 0
  };

  // Цвета для разных тем
  const themeColors = {
    default: {
      completed: '#00ff88',
      inProgress: '#ffaa00',
      notStarted: '#ff6b6b',
      primary: '#00aaff',
      secondary: '#00ffff'
    },
    neon: {
      completed: '#ff0000', // Красный неон
      inProgress: '#00ffff', // Голубой неон
      notStarted: '#ff00ff', // Розовый неон
      primary: '#ff0000',
      secondary: '#00ffff'
    }
  };

  const colors = themeColors[currentTheme];

  const statCards = [
    {
      title: 'Всего технологий',
      value: stats.total,
      icon: '📚',
      color: colors.primary,
      gradient: currentTheme === 'neon' 
        ? 'linear-gradient(135deg, #ff0000, #cc0000)'
        : 'linear-gradient(135deg, #00aaff, #0077ff)',
      description: 'В вашем трекере'
    },
    {
      title: 'Завершено',
      value: stats.completed,
      icon: '✅',
      color: colors.completed,
      gradient: currentTheme === 'neon'
        ? 'linear-gradient(135deg, #ff0000, #cc0000)'
        : 'linear-gradient(135deg, #00ff88, #00cc6a)',
      description: 'Изучено полностью'
    },
    {
      title: 'В процессе',
      value: stats.inProgress,
      icon: '🔄',
      color: colors.inProgress,
      gradient: currentTheme === 'neon'
        ? 'linear-gradient(135deg, #00ffff, #00cccc)'
        : 'linear-gradient(135deg, #ffaa00, #ff8800)',
      description: 'Активное изучение'
    },
    {
      title: 'Не начато',
      value: stats.notStarted,
      icon: '⏳',
      color: colors.notStarted,
      gradient: currentTheme === 'neon'
        ? 'linear-gradient(135deg, #ff00ff, #cc00cc)'
        : 'linear-gradient(135deg, #ff6b6b, #ff4444)',
      description: 'Ждут своего часа'
    }
  ];

  const recentTechnologies = technologies
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3);

  const getMotivationMessage = () => {
    if (stats.progress === 100) return { 
      message: '🎉 Вы изучили все технологии! Вы гений!', 
      color: colors.completed,
      icon: '🏆'
    };
    if (stats.progress >= 80) return { 
      message: '🚀 Отличный прогресс! Почти у цели!', 
      color: colors.primary,
      icon: '⭐'
    };
    if (stats.progress >= 50) return { 
      message: '💪 Хорошие результаты! Продолжайте в том же духе!', 
      color: colors.inProgress,
      icon: '🔥'
    };
    if (stats.progress >= 20) return { 
      message: '🌟 Начало положено! Каждый день - новый шаг!', 
      color: colors.secondary,
      icon: '🚀'
    };
    return { 
      message: '🎯 Время начинать! Первый шаг - самый важный!', 
      color: colors.notStarted,
      icon: '✨'
    };
  };

  const motivation = getMotivationMessage();

  // Стили для карточек в зависимости от темы
  const getCardStyles = (color) => ({
    textAlign: 'center', 
    p: 3,
    background: currentTheme === 'neon' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(18, 18, 18, 0.9)',
    border: `1px solid ${currentTheme === 'neon' ? '#333' : color + '30'}`,
    borderRadius: '20px',
    backdropFilter: 'blur(20px)',
    boxShadow: currentTheme === 'neon' 
      ? `0 8px 32px ${color}20`
      : `0 8px 32px ${color}20`,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: currentTheme === 'neon'
        ? `0 12px 40px ${color}40`
        : `0 12px 40px ${color}30`,
      borderColor: currentTheme === 'neon' ? color : color + '60',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: currentTheme === 'neon'
        ? `linear-gradient(90deg, ${color}, ${color}80)`
        : statCards.find(card => card.color === color)?.gradient,
    }
  });

  return (
    <Box sx={{ mb: 4 }}>
      {/* Заголовок с анимацией */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          mb: 4,
          background: currentTheme === 'neon'
            ? 'linear-gradient(135deg, rgba(255, 0, 0, 0.1), rgba(0, 255, 255, 0.1))'
            : 'linear-gradient(135deg, rgba(0, 170, 255, 0.1), rgba(0, 255, 136, 0.1))',
          border: currentTheme === 'neon'
            ? '1px solid rgba(255, 0, 0, 0.2)'
            : '1px solid rgba(0, 255, 136, 0.2)',
          borderRadius: '20px',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: currentTheme === 'neon'
              ? 'linear-gradient(90deg, transparent, #ff0000, #00ffff, #ff0000, transparent)'
              : 'linear-gradient(90deg, transparent, #00ffff, #00ff88, #00aaff, transparent)',
            animation: `${shimmer} 3s infinite`
          }
        }}
      >
        <Typography 
          variant="h3" 
          component="h2" 
          gutterBottom 
          sx={{ 
            fontWeight: 800,
            background: currentTheme === 'neon'
              ? 'linear-gradient(135deg, #ff0000, #00ffff, #ff0000)'
              : 'linear-gradient(135deg, #00ffff, #00ff88, #00aaff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: currentTheme === 'neon'
              ? '0 0 30px rgba(255, 0, 0, 0.5)'
              : '0 0 30px rgba(0, 255, 255, 0.5)',
            mb: 2,
            animation: `${float} 3s ease-in-out infinite`
          }}
        >
          📊 Обзор прогресса
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: 600
          }}
        >
          Ваш путь к мастерству в технологиях
        </Typography>
      </Box>

      {/* Мотивационное сообщение */}
      <Card 
        sx={{ 
          mb: 4,
          background: `linear-gradient(135deg, ${motivation.color}20, ${
            currentTheme === 'neon' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(18, 18, 18, 0.9)'
          })`,
          border: `1px solid ${motivation.color}40`,
          borderRadius: '20px',
          backdropFilter: 'blur(20px)',
          boxShadow: `0 8px 32px ${motivation.color}30`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography 
            variant="h2"
            sx={{ 
              mb: 2,
              animation: `${float} 2s ease-in-out infinite`
            }}
          >
            {motivation.icon}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: motivation.color,
              fontWeight: 700,
              fontSize: '1.2rem'
            }}
          >
            {motivation.message}
          </Typography>
        </CardContent>
      </Card>

      {/* Статистические карточки */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={getCardStyles(stat.color)}>
              <CardContent sx={{ p: 0 }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    mb: 2, 
                    fontSize: '3rem',
                    filter: `drop-shadow(0 0 10px ${stat.color})`,
                    animation: `${float} 3s ease-in-out infinite`,
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  {stat.icon}
                </Typography>
                <Typography 
                  variant="h3" 
                  component="div" 
                  sx={{ 
                    fontWeight: 800, 
                    mb: 1,
                    color: stat.color,
                    fontSize: '2.5rem',
                    textShadow: currentTheme === 'neon' 
                      ? `0 0 20px ${stat.color}`
                      : 'none'
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#ffffff',
                    fontWeight: 700,
                    mb: 1
                  }}
                >
                  {stat.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.8rem'
                  }}
                >
                  {stat.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Общий прогресс изучения */}
      <Card 
        sx={{ 
          mb: 4,
          background: currentTheme === 'neon' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(18, 18, 18, 0.9)',
          border: currentTheme === 'neon' 
            ? '1px solid rgba(255, 0, 0, 0.3)'
            : '1px solid rgba(0, 255, 136, 0.3)',
          borderRadius: '20px',
          backdropFilter: 'blur(20px)',
          boxShadow: currentTheme === 'neon'
            ? '0 8px 32px rgba(255, 0, 0, 0.2)'
            : '0 8px 32px rgba(0, 255, 136, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: currentTheme === 'neon'
              ? 'linear-gradient(90deg, #ff0000, #00ffff, #ff0000)'
              : 'linear-gradient(90deg, #00aaff, #00ffff, #00ff88)',
            animation: `${shimmer} 3s infinite`
          }
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#ffffff', 
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <TrendingUpIcon sx={{ 
                  color: currentTheme === 'neon' ? '#ff0000' : '#00ff88' 
                }} />
                Общий прогресс изучения
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 0.5 }}>
                На пути к полному освоению всех технологий
              </Typography>
            </Box>
            <Box 
              sx={{ 
                textAlign: 'center',
                background: currentTheme === 'neon'
                  ? 'linear-gradient(135deg, rgba(255, 0, 0, 0.2), rgba(0, 255, 255, 0.2))'
                  : 'linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 170, 255, 0.2))',
                border: currentTheme === 'neon'
                  ? '1px solid rgba(255, 0, 0, 0.3)'
                  : '1px solid rgba(0, 255, 136, 0.3)',
                borderRadius: '15px',
                padding: '1rem 1.5rem',
                minWidth: '100px'
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800,
                  color: currentTheme === 'neon' ? '#ff0000' : '#00ff88'
                }}
              >
                {stats.progress}%
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ position: 'relative' }}>
            <LinearProgress 
              variant="determinate" 
              value={stats.progress}
              sx={{ 
                height: 20, 
                borderRadius: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  background: currentTheme === 'neon'
                    ? 'linear-gradient(90deg, #ff0000, #ff3333, #ff0000)'
                    : 'linear-gradient(90deg, #00aaff, #00ffff, #00ff88, #00ffff, #00aaff)',
                  backgroundSize: '200% 100%',
                  borderRadius: 10,
                  animation: `${gradientShift} 2s infinite linear`,
                  boxShadow: currentTheme === 'neon'
                    ? '0 0 20px rgba(255, 0, 0, 0.5)'
                    : '0 0 20px rgba(0, 255, 136, 0.5)',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                    animation: `${shimmer} 2s infinite`
                  }
                }
              }}
            />
            <Box 
              sx={{ 
                position: 'absolute',
                top: '50%',
                left: `${stats.progress}%`,
                transform: 'translate(-50%, -50%)',
                width: '30px',
                height: '30px',
                background: currentTheme === 'neon'
                  ? 'linear-gradient(135deg, #ff0000, #00ffff)'
                  : 'linear-gradient(135deg, #00ff88, #00aaff)',
                borderRadius: '50%',
                border: '3px solid #121212',
                boxShadow: currentTheme === 'neon'
                  ? '0 0 15px rgba(255, 0, 0, 0.8)'
                  : '0 0 15px rgba(0, 255, 136, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: `${float} 2s ease-in-out infinite`
              }}
            >
              <TrendingUpIcon sx={{ fontSize: '1rem', color: '#121212' }} />
            </Box>
          </Box>
          
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Начало
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Мастерство
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Недавно добавленные элементы */}
      <Card
        sx={{
          background: currentTheme === 'neon' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(18, 18, 18, 0.9)',
          border: currentTheme === 'neon'
            ? '1px solid rgba(255, 0, 0, 0.3)'
            : '1px solid rgba(0, 170, 255, 0.3)',
          borderRadius: '20px',
          backdropFilter: 'blur(20px)',
          boxShadow: currentTheme === 'neon'
            ? '0 8px 32px rgba(255, 0, 0, 0.2)'
            : '0 8px 32px rgba(0, 170, 255, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: currentTheme === 'neon'
              ? 'linear-gradient(90deg, #ff0000, #00ffff, #ff0000)'
              : 'linear-gradient(90deg, #00aaff, #00ffff, #00aaff)',
            animation: `${shimmer} 3s infinite`
          }
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              color: '#ffffff',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 3
            }}
          >
            <Box
              sx={{
                background: currentTheme === 'neon'
                  ? 'linear-gradient(135deg, #ff0000, #cc0000)'
                  : 'linear-gradient(135deg, #00aaff, #0077ff)',
                borderRadius: '12px',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: `${float} 2s ease-in-out infinite`
              }}
            >
              <AddIcon sx={{ color: '#ffffff', fontSize: '1.5rem' }} />
            </Box>
            Недавно добавленные технологии
          </Typography>

          {recentTechnologies.length > 0 ? (
            <Grid container spacing={3}>
              {recentTechnologies.map((tech) => (
                <Grid item xs={12} md={4} key={tech.id}>
                  <Box 
                    sx={{ 
                      p: 3, 
                      border: currentTheme === 'neon'
                        ? '1px solid rgba(255, 255, 255, 0.1)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      background: currentTheme === 'neon'
                        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        borderColor: currentTheme === 'neon'
                          ? 'rgba(255, 0, 0, 0.4)'
                          : 'rgba(0, 255, 136, 0.4)',
                        transform: 'translateY(-5px)',
                        boxShadow: currentTheme === 'neon'
                          ? '0 10px 30px rgba(255, 0, 0, 0.2)'
                          : '0 10px 30px rgba(0, 255, 136, 0.2)',
                        background: currentTheme === 'neon'
                          ? 'linear-gradient(135deg, rgba(255, 0, 0, 0.1), rgba(0, 255, 255, 0.05))'
                          : 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 170, 255, 0.05))',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: tech.status === 'completed' 
                          ? (currentTheme === 'neon' 
                              ? 'linear-gradient(90deg, #ff0000, #cc0000)'
                              : 'linear-gradient(90deg, #00ff88, #00cc6a)')
                          : tech.status === 'in-progress' 
                          ? (currentTheme === 'neon'
                              ? 'linear-gradient(90deg, #00ffff, #00cccc)'
                              : 'linear-gradient(90deg, #ffaa00, #ff8800)')
                          : (currentTheme === 'neon'
                              ? 'linear-gradient(90deg, #ff00ff, #cc00cc)'
                              : 'linear-gradient(90deg, #ff6b6b, #ff4444)'),
                      }
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      fontWeight={600} 
                      gutterBottom
                      sx={{ 
                        color: '#ffffff',
                        lineHeight: 1.3
                      }}
                    >
                      {tech.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.8)', 
                        mb: 2,
                        lineHeight: 1.4,
                        minHeight: '40px'
                      }}
                    >
                      {tech.description.length > 80 ? tech.description.substring(0, 80) + '...' : tech.description}
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Chip 
                        label={tech.category}
                        size="small"
                        sx={{
                          color: currentTheme === 'neon' ? '#ff0000' : '#00aaff',
                          borderColor: currentTheme === 'neon' ? '#ff0000' : '#00aaff',
                          backgroundColor: currentTheme === 'neon' 
                            ? 'rgba(255, 0, 0, 0.1)'
                            : 'rgba(0, 170, 255, 0.1)',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                      <Chip 
                        icon={tech.status === 'completed' ? <CheckCircleIcon /> :
                              tech.status === 'in-progress' ? <ScheduleIcon /> :
                              <RadioButtonUncheckedIcon />}
                        label={tech.status === 'completed' ? 'Завершено' :
                              tech.status === 'in-progress' ? 'В процессе' : 'Не начато'}
                        size="small"
                        sx={{ 
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          backgroundColor: tech.status === 'completed' 
                            ? (currentTheme === 'neon' 
                                ? 'rgba(255, 0, 0, 0.2)'
                                : 'rgba(0, 255, 136, 0.2)')
                            : tech.status === 'in-progress' 
                            ? (currentTheme === 'neon'
                                ? 'rgba(0, 255, 255, 0.2)'
                                : 'rgba(255, 170, 0, 0.2)')
                            : (currentTheme === 'neon'
                                ? 'rgba(255, 0, 255, 0.2)'
                                : 'rgba(255, 107, 107, 0.2)'),
                          color: tech.status === 'completed' 
                            ? (currentTheme === 'neon' ? '#ff0000' : '#00ff88')
                            : tech.status === 'in-progress' 
                            ? (currentTheme === 'neon' ? '#00ffff' : '#ffaa00')
                            : (currentTheme === 'neon' ? '#ff00ff' : '#ff6b6b'),
                          borderColor: tech.status === 'completed' 
                            ? (currentTheme === 'neon' ? '#ff0000' : '#00ff88')
                            : tech.status === 'in-progress' 
                            ? (currentTheme === 'neon' ? '#00ffff' : '#ffaa00')
                            : (currentTheme === 'neon' ? '#ff00ff' : '#ff6b6b'),
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="rgba(255, 255, 255, 0.5)" gutterBottom>
                Пока нет добавленных технологий
              </Typography>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.3)">
                Добавьте первую технологию для отслеживания прогресса
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default MuiDashboard;
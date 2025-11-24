// src/styles/neonTheme.js
import { createTheme } from '@mui/material/styles';

export const neonTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff0000', // Красный неон
      light: '#ff3333',
      dark: '#cc0000',
    },
    secondary: {
      main: '#00ffff', // Голубой неон
      light: '#33ffff',
      dark: '#00cccc',
    },
    background: {
      default: '#000000',
      paper: '#0a0a0a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
    },
    neon: {
      red: '#ff0000',
      blue: '#00ffff',
      pink: '#ff00ff',
      green: '#00ff00',
      glow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor'
    }
  },
  typography: {
    fontFamily: '"JetBrains Mono", "Courier New", monospace',
    h3: {
      fontWeight: 800,
      textShadow: '0 0 10px #ff0000, 0 0 20px #ff0000',
    },
    h4: {
      fontWeight: 700,
      textShadow: '0 0 5px #ff0000',
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontFamily: '"JetBrains Mono", "Courier New", monospace',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 100%)',
          '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(circle at 20% 80%, rgba(255, 0, 0, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(255, 0, 255, 0.05) 0%, transparent 50%)
            `,
            pointerEvents: 'none',
            zIndex: -1,
          }
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 10, 10, 0.9)',
          border: '1px solid #333',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: '1px solid transparent',
            background: 'linear-gradient(135deg, transparent, #333, transparent)',
            borderRadius: 'inherit',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            WebkitMaskComposite: 'xor',
            padding: '1px',
          }
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          border: '1px solid transparent',
          background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: '1px solid transparent',
            background: 'linear-gradient(135deg, #ff0000, #00ffff)',
            borderRadius: 'inherit',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            WebkitMaskComposite: 'xor',
            padding: '1px',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover::before': {
            opacity: 1,
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 0 20px rgba(255, 0, 0, 0.3)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #ff0000, #cc0000)',
          boxShadow: '0 0 10px rgba(255, 0, 0, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #ff3333, #ff0000)',
            boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          border: '1px solid #333',
          background: 'rgba(20, 20, 20, 0.8)',
          '&:hover': {
            boxShadow: '0 0 10px currentColor',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid #333',
        },
        bar: {
          background: 'linear-gradient(90deg, #ff0000, #ff3333, #ff0000)',
          backgroundSize: '200% 100%',
        },
      },
    },
  },
});
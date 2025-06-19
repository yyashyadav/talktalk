import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3a6073', // Updated to match theme
      light: '#4a7083', // Lighter shade
      dark: '#2a4a5a', // Darker shade for hover states
    },
    secondary: {
      main: '#16222a', // Updated to match theme
      light: '#1e2a35', // Lighter shade
      dark: '#0f1c26', // Darker shade
    },
    background: {
      default: '#16222a',
      paper: '#1e2a35',
    },
    text: {
      primary: '#f0f4f8',
      secondary: 'rgba(240, 244, 248, 0.7)',
    },
    message: {
      sent: {
        background: '#3a6073',
        text: '#f0f4f8',
        glow: '0 0 10px rgba(58, 96, 115, 0.3)',
      },
      received: {
        background: '#1e2a35',
        text: '#f0f4f8',
        border: 'rgba(58, 96, 115, 0.2)',
      },
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FFD369',
    },
    error: {
      main: '#ea7070',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#f0f4f8',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#f0f4f8',
    },
    h3: {
      fontWeight: 600,
      color: '#f0f4f8',
    },
    button: {
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '1rem',
          textTransform: 'none',
          transition: 'all 300ms ease-in-out',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 0 15px rgba(58, 96, 115, 0.5)',
            '&::after': {
              opacity: 1,
            },
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '1rem',
            boxShadow: '0 0 10px rgba(58, 96, 115, 0.3)',
            opacity: 0,
            transition: 'opacity 300ms ease-in-out',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #3a6073 30%, #4a7083 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #4a7083 30%, #3a6073 90%)',
          },
        },
        outlined: {
          borderColor: '#3a6073',
          color: '#f0f4f8',
          '&:hover': {
            borderColor: '#4a7083',
            backgroundColor: 'rgba(58, 96, 115, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      variants: [
        {
          props: { variant: 'message-sent' },
          style: {
            backgroundColor: '#3a6073',
            color: '#f0f4f8',
            boxShadow: '0 0 10px rgba(58, 96, 115, 0.3)',
            borderRadius: '1.5rem 1.5rem 0.5rem 1.5rem',
            padding: '0.75rem 1rem',
            maxWidth: '80%',
            marginLeft: 'auto',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '1rem',
              height: '1rem',
              background: 'linear-gradient(135deg, transparent 50%, #3a6073 50%)',
              borderRadius: '0 0 0 0.5rem',
            },
          },
        },
        {
          props: { variant: 'message-received' },
          style: {
            backgroundColor: '#1e2a35',
            color: '#f0f4f8',
            border: '1px solid rgba(58, 96, 115, 0.2)',
            borderRadius: '1.5rem 1.5rem 1.5rem 0.5rem',
            padding: '0.75rem 1rem',
            maxWidth: '80%',
            marginRight: 'auto',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '1rem',
              height: '1rem',
              background: 'linear-gradient(135deg, #1e2a35 50%, transparent 50%)',
              borderRadius: '0 0 0.5rem 0',
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          borderRadius: '1rem',
          backgroundImage: 'none',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(240, 244, 248, 0.1)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 0 20px rgba(58, 96, 115, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '1rem',
          transition: 'all 300ms ease-in-out',
          backgroundImage: 'none',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(240, 244, 248, 0.1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 0 20px rgba(58, 96, 115, 0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '1rem',
            transition: 'all 300ms ease-in-out',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3a6073',
                boxShadow: '0 0 10px rgba(58, 96, 115, 0.2)',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3a6073',
                boxShadow: '0 0 15px rgba(58, 96, 115, 0.3)',
              },
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#3a6073',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          borderBottom: '1px solid rgba(240, 244, 248, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(22, 34, 42, 0.95)',
          borderRight: '1px solid rgba(240, 244, 248, 0.1)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e2a35',
          color: '#f0f4f8',
          border: '1px solid rgba(240, 244, 248, 0.1)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(58, 96, 115, 0.2)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#f0f4f8',
          '&:hover': {
            backgroundColor: 'rgba(240, 244, 248, 0.1)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '2px solid rgba(240, 244, 248, 0.2)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '1rem',
          transition: 'all 300ms ease-in-out',
          '&:hover': {
            boxShadow: '0 0 10px rgba(0, 255, 171, 0.3)',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '1rem',
          transition: 'all 300ms ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(0, 255, 171, 0.1)',
            boxShadow: '0 0 10px rgba(0, 255, 171, 0.2)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 255, 171, 0.15)',
            boxShadow: '0 0 15px rgba(0, 255, 171, 0.3)',
          },
        },
      },
    },
  },
});

export { theme }; 
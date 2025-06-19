import { createTheme } from '@mui/material/styles';
import { myblue, myblueLight, myblueDark } from '../constants/color';

const adminTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: myblue, // #5fb9a9
      light: myblueLight,
      dark: myblueDark,
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '0.5rem',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          backgroundColor: myblue,
          color: '#ffffff',
          '&:hover': {
            backgroundColor: myblueDark,
          },
        },
        outlined: {
          borderColor: myblue,
          color: myblue,
          '&:hover': {
            borderColor: myblueDark,
            backgroundColor: 'rgba(95, 185, 169, 0.05)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '1rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: myblue,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: myblue,
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: myblue,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: myblue,
          '&:hover': {
            backgroundColor: 'rgba(95, 185, 169, 0.1)',
          },
        },
      },
    },
  },
});

export { adminTheme }; 
export const theme = {
  colors: {
    primary: {
      main: '#222831', // Dark charcoal
      light: '#393E46', // Gunmetal grey
    },
    secondary: {
      main: '#00ADB5', // Tiffany blue
    },
    text: {
      primary: '#EEEEEE', // Off white
      secondary: '#C8C8C8',
    },
    status: {
      success: '#00FFAB',
      warning: '#FFD369',
      error: '#FF3F34',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Poppins', 'Roboto', sans-serif",
  },
  components: {
    borderRadius: '1rem', // rounded-2xl
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
    transition: 'all 300ms ease-in-out',
  },
};

export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    secondary: {
      main: '#FF3F34', // Inverted accent for dark mode
    },
  },
}; 
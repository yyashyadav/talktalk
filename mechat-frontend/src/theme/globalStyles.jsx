import { GlobalStyles as MuiGlobalStyles } from '@mui/material';

export const globalStyles = (
  <MuiGlobalStyles
    styles={(theme) => ({
      '@keyframes pulse': {
        '0%': { opacity: 0.6, boxShadow: '0 0 5px rgba(58, 96, 115, 0.3)' },
        '50%': { opacity: 1, boxShadow: '0 0 20px rgba(58, 96, 115, 0.6)' },
        '100%': { opacity: 0.6, boxShadow: '0 0 5px rgba(58, 96, 115, 0.3)' },
      },
      '@keyframes fadeIn': {
        from: { opacity: 0, transform: 'translateY(10px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
      },
      '@keyframes glow': {
        '0%': { boxShadow: '0 0 5px rgba(58, 96, 115, 0.3)' },
        '50%': { boxShadow: '0 0 20px rgba(58, 96, 115, 0.6)' },
        '100%': { boxShadow: '0 0 5px rgba(58, 96, 115, 0.3)' },
      },
      '@keyframes messageAppear': {
        from: { 
          opacity: 0, 
          transform: 'translateY(10px) scale(0.95)',
        },
        to: { 
          opacity: 1, 
          transform: 'translateY(0) scale(1)',
        },
      },
      '@keyframes sparkle': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
      },
      '*': {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      },
      html: {
        scrollBehavior: 'smooth',
        background: 'linear-gradient(to right, #16222a, #3a6073)',
      },
      body: {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        backgroundColor: 'transparent',
        color: '#f0f4f8',
        minHeight: '100vh',
        backgroundImage: `
          radial-gradient(circle at 50% 50%, 
            rgba(58, 96, 115, 0.05) 0%, 
            rgba(22, 34, 42, 0) 50%
          )
        `,
        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
      },
      '::selection': {
        backgroundColor: '#3a6073',
        color: '#f0f4f8',
      },
      '::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: 'rgba(240, 244, 248, 0.05)',
        borderRadius: '4px',
      },
      '::-webkit-scrollbar-thumb': {
        background: 'linear-gradient(45deg, #3a6073, #2a4a5a)',
        borderRadius: '4px',
        border: '1px solid rgba(240, 244, 248, 0.1)',
        '&:hover': {
          background: 'linear-gradient(45deg, #4a7083, #3a6073)',
        },
      },
      '.message-bubble': {
        position: 'relative',
        animation: 'messageAppear 0.3s ease-out forwards',
        '&.sent': {
          backgroundColor: '#3a6073',
          color: '#f0f4f8',
          boxShadow: '0 0 10px rgba(58, 96, 115, 0.3)',
          '&:hover': {
            boxShadow: '0 0 15px rgba(58, 96, 115, 0.7)',
          },
        },
        '&.received': {
          backgroundColor: '#1e2a35',
          color: '#f0f4f8',
          border: '1px solid rgba(58, 96, 115, 0.2)',
          '&:hover': {
            borderColor: 'rgba(58, 96, 115, 0.3)',
          },
        },
      },
      '.neon-text': {
        textShadow: '0 0 10px rgba(58, 96, 115, 0.5)',
      },
      '.glass-effect': {
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(22, 34, 42, 0.8)',
        border: '1px solid rgba(240, 244, 248, 0.1)',
      },
      '.chat-container': {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem',
        maxWidth: '100%',
        margin: '0 auto',
        background: 'linear-gradient(to right, #16222a, #3a6073)',
      },
      '.message-group': {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        '&.sent': {
          alignItems: 'flex-end',
        },
        '&.received': {
          alignItems: 'flex-start',
        },
      },
      '.message-time': {
        fontSize: '0.75rem',
        opacity: 0.7,
        marginTop: '0.25rem',
        color: 'rgba(240, 244, 248, 0.5)',
      },
      '.sidebar': {
        backgroundColor: 'rgba(22, 34, 42, 0.95)',
        borderRight: '1px solid rgba(240, 244, 248, 0.1)',
      },
      '.chat-area': {
        backgroundColor: '#0f1c26',
      },
      '.input-area': {
        backgroundColor: '#1e2a35',
        borderTop: '1px solid rgba(240, 244, 248, 0.1)',
      },
      '.header-bar': {
        backgroundColor: '#3a6073',
        borderBottom: '1px solid rgba(240, 244, 248, 0.1)',
      },
    })}
  />
); 
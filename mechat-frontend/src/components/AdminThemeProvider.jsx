import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { adminTheme } from '../theme/adminTheme';

const AdminThemeProvider = ({ children }) => {
  return (
    <ThemeProvider theme={adminTheme}>
      {children}
    </ThemeProvider>
  );
};

export default AdminThemeProvider; 
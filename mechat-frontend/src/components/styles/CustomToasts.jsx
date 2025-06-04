import React from 'react';
import {
  Box,
  Typography,
  Avatar
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  DeleteForever as DeleteIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

export const LogoutToast = ({ username }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      p: 1.5,
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: (theme) => theme.shadows[3],
      border: '1px solid',
      borderColor: 'success.light',
      minWidth: 300,
      animation: 'slideIn 0.3s ease-out',
      '@keyframes slideIn': {
        from: {
          transform: 'translateY(100%)',
          opacity: 0
        },
        to: {
          transform: 'translateY(0)',
          opacity: 1
        }
      }
    }}
  >
    <Avatar
      sx={{
        bgcolor: 'success.light',
        width: 40,
        height: 40
      }}
    >
      <CheckCircleIcon />
    </Avatar>
    <Box>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
        Goodbye, {username}! 👋
      </Typography>
      <Typography variant="body2" color="text.secondary">
        You've been successfully logged out. See you soon!
      </Typography>
    </Box>
  </Box>
);

export const DeleteAccountToast = ({ username }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      p: 1.5,
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: (theme) => theme.shadows[3],
      border: '1px solid',
      borderColor: 'error.light',
      minWidth: 300,
      animation: 'slideIn 0.3s ease-out',
      '@keyframes slideIn': {
        from: {
          transform: 'translateY(100%)',
          opacity: 0
        },
        to: {
          transform: 'translateY(0)',
          opacity: 1
        }
      }
    }}
  >
    <Avatar
      sx={{
        bgcolor: 'error.main',
        width: 40,
        height: 40
      }}
    >
      <DeleteIcon />
    </Avatar>
    <Box>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
        Account Deleted
      </Typography>
      <Typography variant="body2" color="text.secondary">
        We're sorry to see you go, {username}. Take care!
      </Typography>
    </Box>
  </Box>
);

export const ErrorToast = ({ message }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      p: 1.5,
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: (theme) => theme.shadows[3],
      border: '1px solid',
      borderColor: 'warning.light',
      minWidth: 300,
      animation: 'slideIn 0.3s ease-out'
    }}
  >
    <Avatar
      sx={{
        bgcolor: 'warning.light',
        width: 40,
        height: 40
      }}
    >
      <WarningIcon />
    </Avatar>
    <Box>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
        Oops!
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  </Box>
); 
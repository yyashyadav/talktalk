import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

const DeleteAccountDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        bgcolor: 'error.light',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <WarningIcon />
        Delete Account
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          This action cannot be undone. All your data will be permanently deleted.
        </Alert>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete your account? This will:
        </Typography>
        <Box component="ul" sx={{ pl: 2, mt: 1 }}>
          <Typography component="li" variant="body2" color="text.secondary">
            Delete all your messages and chats
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            Remove you from all groups
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            Delete your profile and all associated data
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          autoFocus
        >
          Delete Account
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAccountDialog; 
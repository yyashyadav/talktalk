import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';

const ConfirmDeleteDialog = ({ open, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel" }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 600 }}>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
          <Typography
            sx={{
              fontSize: '1.18rem',
              color: '#fff',
              textAlign: 'center',
              mb: 1.5,
              lineHeight: 1.7,
              fontWeight: 500,
              px: 2,
              py: 1,
            }}
          >
            {message}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="primary" sx={{ minWidth: 100 }}>
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" sx={{ minWidth: 100 }}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;

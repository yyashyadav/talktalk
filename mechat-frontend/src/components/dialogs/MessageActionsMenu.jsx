import React, { useState } from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Tooltip
} from '@mui/material';
import {
  Reply as ReplyIcon,
  Forward as ForwardIcon,
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  EmojiEmotions as EmojiIcon
} from '@mui/icons-material';
import EmojiPicker from 'emoji-picker-react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { getSocket } from '../../socket';

const MessageActionsMenu = ({ 
  anchorEl, 
  open, 
  onClose, 
  message,
  onReply,
  onForward,
  onDelete,
  onReact,
  isOwnMessage 
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const socket = getSocket();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast.success('Message copied to clipboard');
    onClose();
  };

  const handleReply = () => {
    onReply(message);
    onClose();
  };

  const handleForward = () => {
    onForward(message);
    onClose();
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (!message || !message._id) return;
    
    onDelete(message);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleEmojiClick = (emojiObject) => {
    onReact(message, emojiObject.emoji);
    setShowEmojiPicker(false);
    onClose();
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleReply}>
          <ListItemIcon>
            <ReplyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Reply</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleForward}>
          <ListItemIcon>
            <ForwardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Forward</ListItemText>
        </MenuItem>

        {message.content && (
          <MenuItem onClick={handleCopy}>
            <ListItemIcon>
              <CopyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Copy</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={() => setShowEmojiPicker(true)}>
          <ListItemIcon>
            <EmojiIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>React</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {showEmojiPicker && (
        <Dialog
          open={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
          PaperProps={{
            sx: {
              position: 'absolute',
              bottom: '20%',
              m: 0,
              zIndex: 9999
            }
          }}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width={300}
            height={400}
            searchDisabled
            skinTonesDisabled
            previewConfig={{
              showPreview: false
            }}
          />
        </Dialog>
      )}

      <Dialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
      >
        <DialogTitle>Delete Message</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this message?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default React.memo(MessageActionsMenu); 
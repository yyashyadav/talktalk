import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction, CircularProgress } from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useRenameGroupMutation, useRemoveGroupMemberMutation, useChatDetailsQuery } from '../../redux/api/api';
import { useSelector } from 'react-redux';
import { setIsAddMember } from '../../redux/reducers/misc';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { transformImage } from '../../lib/features';

const GroupInfoDialog = ({ open, onClose, chatId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const { data: chatDetails, isLoading, error } = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !open || !chatId }
  );

  const [renameGroup] = useRenameGroupMutation();
  const [removeMember] = useRemoveGroupMemberMutation();

  const handleRename = async () => {
    if (!newGroupName.trim()) return;
    try {
      await renameGroup({ chatId, name: newGroupName.trim() }).unwrap();
      setIsEditing(false);
      toast.success('Group renamed successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to rename group');
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await removeMember({ chatId, userId }).unwrap();
      toast.success('Member removed successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to remove member');
    }
  };

  const handleAddMembers = () => {
    dispatch(setIsAddMember(true));
    onClose();
  };

  const isAdmin = chatDetails?.chat?.creator?._id === user?._id;

  if (error) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Error</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography color="error">
            {error?.data?.message || 'Failed to load group info'}
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Group Info</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Avatar
                src={chatDetails?.chat?.avatar?.url && transformImage(chatDetails.chat.avatar.url, 100)}
                alt={chatDetails?.chat?.name}
                sx={{ width: 100, height: 100, mb: 2, border: '2px solid #e0e0e0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
              />
              {isEditing ? (
                <Box display="flex" gap={1}>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder={chatDetails?.chat?.name}
                    style={{
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                    }}
                  />
                  <Button variant="contained" onClick={handleRename}>
                    Save
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                </Box>
              ) : (
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h6">{chatDetails?.chat?.name}</Typography>
                  {isAdmin && (
                    <IconButton size="small" onClick={() => {
                      setNewGroupName(chatDetails?.chat?.name);
                      setIsEditing(true);
                    }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              )}
              <Typography variant="body2" color="textSecondary">
                {chatDetails?.chat?.members?.length || 0} members
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="subtitle1">Members</Typography>
              {isAdmin && (
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddMembers}
                  size="small"
                  variant="outlined"
                >
                  Add Members
                </Button>
              )}
            </Box>

            <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {chatDetails?.chat?.members?.map((member) => (
                <ListItem 
                  key={member._id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      src={member.avatar && transformImage(member.avatar, 50)}
                      alt={member.name}
                      sx={{
                        border: member._id === chatDetails?.chat?.creator?._id ? '2px solid #1976d2' : 'none',
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<>
                      {member.name}
                      {member._id === user?._id && ' (You)'}
                    </>}
                    secondary={member._id === chatDetails?.chat?.creator?._id ? 'Admin' : 'Member'}
                  />
                  {isAdmin && member._id !== user?._id && (
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleRemoveMember(member._id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
            </List>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GroupInfoDialog; 
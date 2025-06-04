import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  ListItemIcon,
  InputBase,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Call as CallIcon,
  VideoCall as VideoCallIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Block as BlockIcon,
  Delete as DeleteIcon,
  Report as ReportIcon,
  Wallpaper as WallpaperIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  PersonAdd as PersonAddIcon,
  Close as CloseIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { transformImage } from '../../lib/features';
import { myblue } from '../../constants/color';
import GroupInfoDialog from '../dialogs/GroupInfoDialog';
import { useSelector, useDispatch } from 'react-redux';
import { setIsMobile } from '../../redux/reducers/misc';

const ChatHeader = ({ chat, user, onlineUsers = [], handleDeleteChat, openBackground }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const isAdmin = chat?.groupChat && chat?.creator?._id === user?._id;

  const isOnline = chat?.members?.some(memberId => 
    onlineUsers.includes(memberId) && memberId !== user?._id
  );

  const handleBack = () => {
    dispatch(setIsMobile(true));
    navigate("/");
  };

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDelete = () => {
    handleDeleteChat();
    handleMenuClose();
  };

  const handleGroupInfo = () => {
    setIsGroupInfoOpen(true);
  };

  const handleSearchToggle = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setSearchQuery('');
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    window.searchMessages?.(value);
  };

  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          background: myblue,
          boxShadow: 1,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton 
            edge="start" 
            color="inherit"
            sx={{ display: { sm: 'none' }, mr: 1 }}
            onClick={handleBack}
          >
            <ArrowBackIcon />
          </IconButton>

          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={2} 
            sx={{ flexGrow: 1, minWidth: 0 }}
          >
            <Avatar
              src={transformImage(Array.isArray(chat?.avatar) ? chat.avatar[0] : '')}
              alt={chat?.name}
              sx={{ width: 40, height: 40, cursor: chat?.groupChat && isAdmin ? 'pointer' : 'default', flexShrink: 0 }}
              onClick={() => {
                if (chat?.groupChat && isAdmin) {
                  handleGroupInfo();
                }
              }}
            />
            
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography 
                  variant="subtitle1" 
                  color="white" 
                  fontWeight={600}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%'
                  }}
                >
                  {chat?.name || 'Chat'}
                </Typography>
                {chat?.groupChat && isAdmin && (
                  <IconButton size="small" color="inherit" onClick={handleGroupInfo} sx={{ flexShrink: 0 }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.8)">
                {chat?.groupChat 
                  ? `${chat?.members?.length} members`
                  : isOnline ? 'online' : 'offline'
                }
              </Typography>
            </Box>
          </Stack>

          {chat?.groupChat && (
            <IconButton onClick={handleGroupInfo} color="inherit" sx={{ flexShrink: 0 }}>
              <InfoIcon />
            </IconButton>
          )}

          <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
            <Tooltip title="Voice Call">
              <IconButton color="inherit">
                <CallIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Search">
              <IconButton color="inherit" onClick={handleSearchToggle}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="More">
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {chat?.groupChat && isAdmin && (
              <MenuItem onClick={() => {
                handleGroupInfo();
                handleMenuClose();
              }}>
                <ListItemIcon>
                  <PersonAddIcon fontSize="small" />
                </ListItemIcon>
                Add Members
              </MenuItem>
            )}
            <MenuItem onClick={openBackground}>
              <ListItemIcon>
                <WallpaperIcon fontSize="small" />
              </ListItemIcon>
              Change Background
            </MenuItem>
            
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <BlockIcon fontSize="small" />
              </ListItemIcon>
              Block User
            </MenuItem>
            
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <ReportIcon fontSize="small" />
              </ListItemIcon>
              Report
            </MenuItem>
            
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              Delete Chat
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {isSearchVisible && (
        <Box
          sx={{
            position: 'absolute',
            top: '54px', // Adjusted for better positioning
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '600px',
            p: 1.5,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            zIndex: 1000,
            animation: 'slideDown 0.2s ease-out',
            '@keyframes slideDown': {
              from: {
                opacity: 0,
                transform: 'translate(-50%, -10px)'
              },
              to: {
                opacity: 1,
                transform: 'translate(-50%, 0)'
              }
            }
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', ml: 1 }} />
          <InputBase
            autoFocus
            fullWidth
            placeholder="Search messages..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              '& .MuiInputBase-input': {
                p: '8px 0',
                fontSize: '1rem',
                transition: 'all 0.2s',
                '&:focus': {
                  outline: 'none'
                }
              }
            }}
          />
          {searchQuery && (
            <IconButton 
              size="small" 
              onClick={() => {
                setSearchQuery('');
                window.searchMessages?.('');
              }}
              sx={{ 
                mr: 1,
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton 
            size="small" 
            onClick={handleSearchToggle}
            sx={{
              bgcolor: 'action.hover',
              '&:hover': {
                bgcolor: 'action.selected'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <GroupInfoDialog
        open={isGroupInfoOpen}
        onClose={() => setIsGroupInfoOpen(false)}
        chatId={chat?._id}
      />
    </>
  );
};

export default ChatHeader; 
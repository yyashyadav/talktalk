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
import { myblue, headerBg } from '../../constants/color';
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
          background: headerBg,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          borderBottom: "1px solid rgba(240, 244, 248, 0.1)",
        }}
      >
        <Toolbar>
          <IconButton 
            edge="start" 
            sx={{ 
              display: { sm: 'none' }, 
              mr: 1,
              color: "#f0f4f8",
              "&:hover": {
                backgroundColor: "rgba(240, 244, 248, 0.1)",
              },
            }}
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
              sx={{ 
                width: 40, 
                height: 40, 
                cursor: chat?.groupChat && isAdmin ? 'pointer' : 'default', 
                flexShrink: 0,
                border: "2px solid rgba(240, 244, 248, 0.2)",
              }}
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
                  sx={{ 
                    color: "#f0f4f8",
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%'
                  }}
                >
                  {chat?.name || 'Chat'}
                </Typography>
                {chat?.groupChat && isAdmin && (
                  <IconButton 
                    size="small" 
                    sx={{ 
                      flexShrink: 0,
                      color: "#f0f4f8",
                      "&:hover": {
                        backgroundColor: "rgba(240, 244, 248, 0.1)",
                      },
                    }} 
                    onClick={handleGroupInfo}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: "rgba(240, 244, 248, 0.7)",
                }}
              >
                {chat?.groupChat 
                  ? `${chat?.members?.length} members`
                  : isOnline ? 'online' : 'offline'
                }
              </Typography>
            </Box>
          </Stack>

          {chat?.groupChat && (
            <IconButton 
              onClick={handleGroupInfo} 
              sx={{ 
                flexShrink: 0,
                color: "#f0f4f8",
                "&:hover": {
                  backgroundColor: "rgba(240, 244, 248, 0.1)",
                },
              }}
            >
              <InfoIcon />
            </IconButton>
          )}

          <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
            <Tooltip title="Voice Call">
              <IconButton 
                sx={{
                  color: "#f0f4f8",
                  "&:hover": {
                    backgroundColor: "rgba(240, 244, 248, 0.1)",
                  },
                }}
              >
                <CallIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Search">
              <IconButton 
                onClick={handleSearchToggle}
                sx={{
                  color: "#f0f4f8",
                  "&:hover": {
                    backgroundColor: "rgba(240, 244, 248, 0.1)",
                  },
                }}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="More">
              <IconButton 
                onClick={handleMenuOpen}
                sx={{
                  color: "#f0f4f8",
                  "&:hover": {
                    backgroundColor: "rgba(240, 244, 248, 0.1)",
                  },
                }}
              >
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
            sx={{
              "& .MuiPaper-root": {
                backgroundColor: "#1e2a35",
                color: "#f0f4f8",
                border: "1px solid rgba(240, 244, 248, 0.1)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              },
            }}
          >
            {chat?.groupChat && isAdmin && (
              <MenuItem onClick={() => {
                handleGroupInfo();
                handleMenuClose();
              }}>
                <ListItemIcon>
                  <EditIcon sx={{ color: "#f0f4f8" }} />
                </ListItemIcon>
                Edit Group
              </MenuItem>
            )}

            <MenuItem onClick={() => {
              openBackground();
              handleMenuClose();
            }}>
              <ListItemIcon>
                <WallpaperIcon sx={{ color: "#f0f4f8" }} />
              </ListItemIcon>
              Change Background
            </MenuItem>

            {chat?.groupChat && (
              <MenuItem onClick={() => {
                handleGroupInfo();
                handleMenuClose();
              }}>
                <ListItemIcon>
                  <InfoIcon sx={{ color: "#f0f4f8" }} />
                </ListItemIcon>
                Group Info
              </MenuItem>
            )}

            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon sx={{ color: "#ea7070" }} />
              </ListItemIcon>
              <Typography sx={{ color: "#ea7070" }}>
                Delete Chat
              </Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Search Bar */}
      {isSearchVisible && (
        <Box
          sx={{
            p: 2,
            backgroundColor: "#1e2a35",
            borderBottom: "1px solid rgba(240, 244, 248, 0.1)",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <SearchIcon sx={{ color: "rgba(240, 244, 248, 0.7)" }} />
            <InputBase
              placeholder="Search messages..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                flex: 1,
                color: "#f0f4f8",
                "& .MuiInputBase-input": {
                  color: "#f0f4f8",
                  "&::placeholder": {
                    color: "rgba(240, 244, 248, 0.6)",
                    opacity: 1,
                  },
                },
              }}
            />
            <IconButton
              onClick={handleSearchToggle}
              sx={{
                color: "rgba(240, 244, 248, 0.7)",
                "&:hover": {
                  backgroundColor: "rgba(240, 244, 248, 0.1)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>
      )}

      <GroupInfoDialog
        open={isGroupInfoOpen}
        onClose={() => setIsGroupInfoOpen(false)}
        chat={chat}
        user={user}
      />
    </>
  );
};

export default ChatHeader; 
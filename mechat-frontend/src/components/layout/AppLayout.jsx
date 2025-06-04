import { Drawer, Grid, Skeleton, Box, TextField, InputAdornment, Stack, IconButton } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../constants/events";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getOrSaveFromStorage } from "../../lib/features";
import { useMyChatsQuery } from "../../redux/api/api";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";
import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectedDeleteChat,
  setIsProfileOpen,
} from "../../redux/reducers/misc";
import { getSocket } from "../../socket";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import Header from "./Header";
import UserProfileSidebar from "../specific/UserProfileSidebar";
import { Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";
import { ChatItemSkeleton } from "./Loaders";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const socket = getSocket();

    const chatId = params.chatId;
    const deleteMenuAnchor = useRef(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 600);

    const { isMobile, isProfileOpen } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    useErrors([{ isError, error }]);

    // Handle window resize
    useEffect(() => {
      const handleResize = () => {
        setIsMobileView(window.innerWidth < 600);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));

    const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };

    useSocketEvents(socket, eventHandlers);

    const handleProfileClose = () => {
      dispatch(setIsProfileOpen(false));
    };

    const handleProfileOpen = () => {
      dispatch(setIsProfileOpen(true));
    };

    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };

    // Filter chats based on search query
    const filteredChats = data?.chats?.filter((chat) => 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <>
        <Title />
        {/* Only hide header on mobile when in chat view */}
        {(!chatId || !isMobileView) && <Header onProfileClick={handleProfileOpen} />}

        <Box sx={{ 
          height: chatId && isMobileView ? "calc(100vh - 64px)" : "calc(100vh - 65px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Mobile View */}
          {isMobile && (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden", // Prevent outer scrolling
              }}
            >
              {/* Fixed Search Bar for Mobile */}
              <Box
                sx={{
                  p: 1.5,
                  borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                  backgroundColor: "background.paper",
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.2s ease"
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#5fb9a9',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#5fb9a9',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#5fb9a9',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                      <SearchIcon sx={{ 
                        color: 'text.secondary',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          color: '#5fb9a9',
                          cursor: 'default',
                        },
                        '.MuiInputBase-root.Mui-focused &': {
                          color: '#5fb9a9'
                        }
                      }} />
                    </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton 
                          size="small" 
                          onClick={() => setSearchQuery('')}
                          sx={{ 
                            color: 'text.secondary',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              color: '#5fb9a9',
                              backgroundColor: 'rgba(95, 185, 169, 0.1)',
                            }
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>

              {/* Scrollable Chat List Container for Mobile */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  '&::-webkit-scrollbar': {
                    width: '10px',
                    height: '10px'
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(0, 0, 0, 0.03)',
                    borderRadius: '10px',
                    margin: '2px'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'linear-gradient(45deg, #5fb9a9, rgb(92, 157, 203))',
                    borderRadius: '10px',
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease'
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: 'linear-gradient(45deg, #4da697, rgb(82, 141, 182))',
                    border: '2px solid rgba(255, 255, 255, 0.9)',
                    boxShadow: 'inset 0 0 8px rgba(0,0,0,0.2)'
                  },
                  '&::-webkit-scrollbar-corner': {
                    background: 'transparent'
                  }
                }}
              >
                {isLoading ? (
                  <Stack spacing={1} p={1}>
                    {[...Array(5)].map((_, index) => (
                      <ChatItemSkeleton key={index} />
                    ))}
                  </Stack>
                ) : (
                  <ChatList
                    chats={filteredChats}
                    chatId={chatId}
                    handleDeleteChat={handleDeleteChat}
                    newMessagesAlert={newMessagesAlert}
                    onlineUsers={onlineUsers}
                  />
                )}
              </Box>
            </Box>
          )}

          {/* Desktop View */}
          {!isMobile && (
            <Grid container height="100%">
              {/* Left Sidebar - Chat List */}
              <Grid
                item
                sx={{
                  width: { 
                    xs: "100%",
                    sm: isProfileOpen ? "25%" : "30%",
                    md: isProfileOpen ? "25%" : "30%"
                  },
                  display: { xs: "none", sm: "block" },
                  transition: "width 0.3s ease",
                  borderRight: "1px solid rgba(0, 0, 0, 0.1)",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: "#bac8e0",
                  zIndex: 10,
                  isolation: "isolate",
                  '& .MuiListItem-root': {
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateX(5px)',
                      '& .MuiTypography-root': {
                        color: '#2c3e50',
                      },
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 255, 255, 0.4)',
                      borderLeft: '4px solid #2c3e50',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '& .MuiTypography-root': {
                        color: '#1a1a1a',
                        fontWeight: 600,
                      },
                      '& .MuiListItemText-primary': {
                        color: '#1a1a1a',
                        fontWeight: 700,
                      },
                      '& .MuiListItemText-secondary': {
                        color: '#2c3e50',
                        fontWeight: 500,
                      },
                      '& .MuiAvatar-root': {
                        border: '2px solid #2c3e50',
                        boxShadow: '0 0 8px rgba(44, 62, 80, 0.3)',
                      },
                    },
                  },
                  '& .online-dot': {
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#4CAF50',
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    border: '2px solid #bac8e0',
                    boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.3)',
                    animation: 'pulse 2s infinite',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '-4px',
                      left: '-4px',
                      right: '-4px',
                      bottom: '-4px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(76, 175, 80, 0.2)',
                      animation: 'pulse 2s infinite',
                    }
                  },
                }}
              >
                {/* Search Bar for Desktop */}
                <Box
                  sx={{
                    p: 1.5,
                    borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    backdropFilter: "blur(8px)",
                    transition: "all 0.2s ease"
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2c3e50',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2c3e50',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#2c3e50',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                        <SearchIcon sx={{ 
                          color: '#2c3e50',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            color: '#1a1a1a',
                            cursor: 'default',
                          },
                          '.MuiInputBase-root.Mui-focused &': {
                            color: '#1a1a1a'
                          }
                        }} />
                      </InputAdornment>
                      ),
                      endAdornment: searchQuery && (
                        <InputAdornment position="end">
                          <IconButton 
                            size="small" 
                            onClick={() => setSearchQuery('')}
                            sx={{ 
                              color: '#2c3e50',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                color: '#1a1a1a',
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                              }
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
                
                {/* Scrollable Container */}
                <Box
                  sx={{
                    height: "calc(100% - 56px)",
                    overflow: "auto",
                    '&::-webkit-scrollbar': {
                      width: '10px',
                      height: '10px'
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(0, 0, 0, 0.03)',
                      borderRadius: '10px',
                      margin: '2px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'linear-gradient(45deg, #5fb9a9, rgb(92, 157, 203))',
                      borderRadius: '10px',
                      border: '2px solid rgba(255, 255, 255, 0.8)',
                      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease'
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: 'linear-gradient(45deg, #4da697, rgb(82, 141, 182))',
                      border: '2px solid rgba(255, 255, 255, 0.9)',
                      boxShadow: 'inset 0 0 8px rgba(0,0,0,0.2)'
                    },
                    '&::-webkit-scrollbar-corner': {
                      background: 'transparent'
                    }
                  }}
                >
                  {isLoading ? (
                    <Stack spacing={1} p={1}>
                      {[...Array(5)].map((_, index) => (
                        <ChatItemSkeleton key={index} />
                      ))}
                    </Stack>
                  ) : (
                    <ChatList
                      chats={filteredChats}
                      chatId={chatId}
                      handleDeleteChat={handleDeleteChat}
                      newMessagesAlert={newMessagesAlert}
                      onlineUsers={onlineUsers}
                    />
                  )}
                </Box>
              </Grid>

              {/* Middle - Chat Area */}
              <Grid
                item
                sx={{
                  width: {
                    xs: "100%",
                    sm: isProfileOpen ? "45%" : "70%",
                    md: isProfileOpen ? "45%" : "70%"
                  },
                  display: { xs: "block", sm: "block" },
                  transition: "width 0.3s ease",
                  height: "100%",
                  overflow: "auto"
                }}
              >
                <WrappedComponent {...props} chatId={chatId} user={user} />
              </Grid>

              {/* Right - Profile Area (Desktop) */}
              {isProfileOpen && (
                <Grid
                  item
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "30%",
                      md: "30%"
                    },
                    height: "100%",
                    display: { xs: "none", sm: "block" },
                    borderLeft: "1px solid rgba(0, 0, 0, 0.1)",
                    overflow: "auto",
                    position: "relative",
                    zIndex: 10,
                    backgroundColor: "background.paper",
                    boxShadow: "-1px 0 5px rgba(0,0,0,0.05)",
                    isolation: "isolate",
                    '&::-webkit-scrollbar': {
                      width: '10px',
                      height: '10px'
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(0, 0, 0, 0.03)',
                      borderRadius: '10px',
                      margin: '2px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'linear-gradient(45deg, #5fb9a9, rgb(92, 157, 203))',
                      borderRadius: '10px',
                      border: '2px solid rgba(255, 255, 255, 0.8)',
                      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease'
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: 'linear-gradient(45deg, #4da697, rgb(82, 141, 182))',
                      border: '2px solid rgba(255, 255, 255, 0.9)',
                      boxShadow: 'inset 0 0 8px rgba(0,0,0,0.2)'
                    },
                    '&::-webkit-scrollbar-corner': {
                      background: 'transparent'
                    }
                  }}
                >
                  <Suspense fallback={<Skeleton variant="rectangular" height="100%" />}>
                    <UserProfileSidebar user={user} />
                  </Suspense>
                </Grid>
              )}
            </Grid>
          )}

          {/* Mobile Drawer for Profile */}
          <Drawer
            anchor="right"
            open={isProfileOpen && window.innerWidth < 600}
            onClose={() => dispatch(setIsProfileOpen(false))}
            sx={{
              '& .MuiDrawer-paper': {
                width: '100%',
                maxWidth: '100%',
                zIndex: 1300,
                backgroundColor: "background.paper",
                '&::-webkit-scrollbar': {
                  width: '10px',
                  height: '10px'
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(0, 0, 0, 0.03)',
                  borderRadius: '10px',
                  margin: '2px'
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'linear-gradient(45deg, #5fb9a9, rgb(92, 157, 203))',
                  borderRadius: '10px',
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: 'linear-gradient(45deg, #4da697, rgb(82, 141, 182))',
                  border: '2px solid rgba(255, 255, 255, 0.9)',
                  boxShadow: 'inset 0 0 8px rgba(0,0,0,0.2)'
                },
                '&::-webkit-scrollbar-corner': {
                  background: 'transparent'
                }
              }
            }}
          >
            <Suspense fallback={<Skeleton variant="rectangular" height="100%" />}>
              <UserProfileSidebar user={user} />
            </Suspense>
          </Drawer>
        </Box>

        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />
      </>
    );
  };
};

export default AppLayout;

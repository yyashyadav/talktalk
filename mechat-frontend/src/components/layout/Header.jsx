import {
  AppBar,
  Avatar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import React, { Suspense, lazy, useState } from "react";
import { mybluerev, orange } from "../../constants/color";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  DeleteForever as DeleteIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  Chat as ChatIcon,
  AdminPanelSettings as AdminIcon,
  NoEncryption,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../constants/config";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
  setIsProfileOpen,
} from "../../redux/reducers/misc";
import { resetNotificationCount } from "../../redux/reducers/chat";
import DeleteAccountDialog from "../dialogs/DeleteAccountDialog";
import {
  LogoutToast,
  DeleteAccountToast,
  ErrorToast,
} from "../styles/CustomToasts";
import { useDeleteAccountMutation } from "../../redux/api/api";
import Logo from "../shared/Logo";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotifcationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));
const ConfirmDeleteDialog = lazy(() =>
  import("../dialogs/ConfirmDeleteDialog")
);

const SimpleToast = ({ message }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      color: "#fff",
      fontSize: "0.875rem",
      fontWeight: 500,
    }}
  >
    {/* <DoneIcon sx={{ fontSize: '1.1rem' }} /> */}
    <Typography variant="body2">{message}</Typography>
  </Box>
);

const Header = ({ onProfileClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { isSearch, isNotification, isNewGroup, isProfileOpen } = useSelector(
    (state) => state.misc
  );
  const { notificationCount } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [deleteAccount] = useDeleteAccountMutation();

  const handleMobile = () => dispatch(setIsMobile(true));

  const openSearch = () => dispatch(setIsSearch(true));

  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };

  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  const openProfile = () => {
    handleMenuClose();
    if (onProfileClick) {
      onProfileClick();
    } else {
      const currentState = isProfileOpen;
      dispatch(setIsProfileOpen(!currentState));

      // If on mobile and opening profile, close the mobile drawer
      if (!currentState && window.innerWidth < 600) {
        dispatch(setIsMobile(false));
      }
    }
  };

  const handleLogoutClick = () => {
    setIsLogoutConfirmOpen(true);
  };

  const handleLogoutCancel = () => {
    setIsLogoutConfirmOpen(false);
  };

  const handleLogoutConfirm = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      setIsLogoutConfirmOpen(false);
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      setIsLogoutConfirmOpen(false);
    }
  };

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });

      // Clear the auth state first
      dispatch(userNotExists());

      toast.success(
        (t) => (
          <SimpleToast message={`Bye, ${user?.name || "User"}! See you soon`} />
        ),
        {
          duration: 4000,
          style: {
            background: "#4caf50",
            padding: "8px 12px",
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#4caf50",
          },
        }
      );

      // Navigate to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
    handleMenuClose();
  };

  const handleDeleteAccount = async () => {
    try {
      const result = await deleteAccount().unwrap();

      toast.success(
        (t) => (
          <SimpleToast
            message={`Account deleted successfully. Goodbye, ${
              user?.name || "User"
            }`}
          />
        ),
        {
          duration: 3000,
          style: {
            background: "#f44336",
            padding: "8px 12px",
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#f44336",
          },
        }
      );

      setTimeout(() => {
        dispatch(userNotExists());
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete account");
    }
    setDeleteDialogOpen(false);
    handleMenuClose();
  };

  const handleLogoClick = () => {
    // Close the chat list if it's open
    if (isMobile) {
      dispatch(setIsMobile(false));
    }
    navigate("/");
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: mybluerev,
            backgroundImage: mybluerev,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", minHeight: "64px" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "0px 10px",

                cursor: "pointer",
                gap: 1,
                display: "flex",
                alignItems: "center",
                userSelect: "none",
                ":hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "5px",
                },
              }}
              onClick={handleLogoClick}
            >
              <Logo size={40} isHeader={true} />
              <Typography
                variant="h6"
                sx={{
                  display: { xs: "none", sm: "block" },
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                  textShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                  fontFamily: "monospace, sans-serif",
                }}
              >
                TalkTalk
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
              }}
            >
              <Tooltip title="New Users">
                <IconButton
                  color="inherit"
                  onClick={openSearch}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="New Group">
                <IconButton
                  color="inherit"
                  onClick={openNewGroup}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  <GroupIcon />
                </IconButton>
              </Tooltip>

              <IconBtn
                title={"Notifications"}
                icon={<NotificationsIcon />}
                onClick={openNotification}
                value={notificationCount}
              />

              <Tooltip title="Profile">
                <IconButton
                  onClick={openProfile}
                  sx={{
                    padding: "4px",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.1)",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  <Avatar
                    src={user?.avatar?.url}
                    alt={user?.name}
                    sx={{
                      width: 32,
                      height: 32,
                      border: "2px solid rgba(255, 255, 255, 0.9)",
                      boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Tooltip title="Settings">
                <IconButton
                  color="inherit"
                  onClick={handleMenuOpen}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      )}

      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <NotifcationDialog />
        </Suspense>
      )}

      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroupDialog />
        </Suspense>
      )}
      <Suspense fallback={<Backdrop open />}>
        <ConfirmDeleteDialog
          open={isLogoutConfirmOpen}
          handleClose={handleLogoutCancel}
          handleConfirm={handleLogoutConfirm}
          title="Confirm Logout"
          description="Are you sure you want to logout?"
        />
      </Suspense>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          elevation: 4,
          sx: {
            mt: 0.7,
            minWidth: 210,
            maxWidth: '90vw',
            borderRadius: '12px',
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[8],
            border: `1px solid ${theme.palette.divider}`,
            backdropFilter: 'blur(8px)',
            '& .MuiMenuItem-root': {
              px: 2.5,
              py: 1.75,
              borderRadius: 1.5,
              gap: 1.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(95, 185, 169, 0.08)',
                transform: 'translateX(4px)'
              },
              '& .MuiListItemIcon-root': {
                minWidth: 36
              }
            }
          }
        }}
      >
        <MenuItem onClick={openProfile}>
          <ListItemIcon>
            <AccountCircleIcon sx={{ color: '#5fb9a9', fontSize: 24 }} />
          </ListItemIcon>
          <ListItemText 
            primary="Profile"
            primaryTypographyProps={{
              fontWeight: 500
            }}
          />
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate("/admin");
          }}
        >
          <ListItemIcon>
            <AdminIcon sx={{ color: '#5fb9a9', fontSize: 24 }} />
          </ListItemIcon>
          <ListItemText 
            primary="Admin Panel"
            primaryTypographyProps={{
              fontWeight: 500
            }}
          />
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon sx={{ color: '#5fb9a9', fontSize: 22 }} />
          </ListItemIcon>
          <ListItemText 
            primary="Logout"
            primaryTypographyProps={{
              fontWeight: 500
            }}
          />
        </MenuItem>

        <Divider sx={{ 
          my: 1,
          borderColor: theme.palette.divider,
          opacity: 0.9
        }} />

        <MenuItem
          onClick={() => setDeleteDialogOpen(true)}
          sx={{
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'rgba(244, 67, 54, 0.08)',
              color: 'error.dark'
            }
          }}
        >
          <ListItemIcon>
            <DeleteIcon color="error" sx={{ fontSize: 24 }} />
          </ListItemIcon>
          <ListItemText 
            primary="Delete Account"
            primaryTypographyProps={{
              fontWeight: 500
            }}
          />
        </MenuItem>
      </Menu>

      <DeleteAccountDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </>
  );
};

const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip 
      title={title}
      arrow
      placement="bottom"
      enterDelay={400}
    >
      <IconButton 
        color="inherit" 
        size="large" 
        onClick={onClick}
        sx={{
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(95, 185, 169, 0.08)',
            transform: 'scale(1.05)'
          },
          '&:active': {
            transform: 'scale(0.95)'
          }
        }}
      >
        {value ? (
          <Badge 
            badgeContent={value} 
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#5fb9a9',
                color: 'white',
                fontWeight: 600,
                minWidth: 20,
                height: 20,
                padding: '0 6px',
                fontSize: '0.75rem'
              }
            }}
          >
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  );
};

export default Header;

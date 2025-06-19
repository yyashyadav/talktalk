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
import { mybluerev, orange, headerBg } from "../../constants/color";
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
import store from '../../redux/store';
import api from '../../redux/api/api';

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
  const { user, isAdmin } = useSelector((state) => state.auth);

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
      localStorage.clear();
      sessionStorage.clear();
      store.dispatch(api.util.resetApiState());
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
      localStorage.clear();
      sessionStorage.clear();
      store.dispatch(api.util.resetApiState());

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
      <AppBar
        position="static"
        sx={{
          background: headerBg,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          borderBottom: "1px solid rgba(240, 244, 248, 0.1)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 1, sm: 2 } }}>
          {/* Left side - Logo and Mobile Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Logo onClick={handleLogoClick} />
            
            {isMobile && (
              <IconButton
                onClick={handleMobile}
                sx={{
                  color: "#f0f4f8",
                  "&:hover": {
                    backgroundColor: "rgba(240, 244, 248, 0.1)",
                  },
                }}
              >
                <ChatIcon />
              </IconButton>
            )}
          </Box>

          {/* Center - Title (only on desktop) */}
          {!isMobile && (
            <Typography
              variant="h6"
              sx={{
                color: "#f0f4f8",
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              TalkTalk
            </Typography>
          )}

          {/* Right side - Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Search */}
            <IconBtn
              title="Search"
              icon={<SearchIcon />}
              onClick={openSearch}
            />

            {/* New Group */}
            <IconBtn
              title="New Group"
              icon={<AddIcon />}
              onClick={openNewGroup}
            />

            {/* Notifications */}
            <IconBtn
              title="Notifications"
              icon={<NotificationsIcon />}
              onClick={openNotification}
              value={notificationCount}
            />

            {/* Profile Menu */}
            <Box>
              <Tooltip title="Profile">
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    color: "#f0f4f8",
                    "&:hover": {
                      backgroundColor: "rgba(240, 244, 248, 0.1)",
                    },
                  }}
                >
                  <Avatar
                    src={user?.avatar?.url}
                    alt={user?.name}
                    sx={{
                      width: 32,
                      height: 32,
                      border: "2px solid rgba(240, 244, 248, 0.2)",
                    }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor: "#1e2a35",
                    color: "#f0f4f8",
                    border: "1px solid rgba(240, 244, 248, 0.1)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  },
                }}
              >
                <MenuItem onClick={openProfile}>
                  <ListItemIcon>
                    <AccountCircleIcon sx={{ color: "#f0f4f8" }} />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </MenuItem>

                <MenuItem onClick={() => navigate("/groups")}>
                  <ListItemIcon>
                    <GroupIcon sx={{ color: "#f0f4f8" }} />
                  </ListItemIcon>
                  <ListItemText primary="Groups" />
                </MenuItem>

                <MenuItem onClick={() => { handleMenuClose(); navigate("/admin"); }}>
                  <ListItemIcon>
                    <AdminIcon sx={{ color: "#f0f4f8" }} />
                  </ListItemIcon>
                  <ListItemText primary="Admin Panel" />
                </MenuItem>

                <Divider sx={{ backgroundColor: "rgba(240, 244, 248, 0.1)" }} />

                <MenuItem onClick={handleLogoutClick}>
                  <ListItemIcon>
                    <LogoutIcon sx={{ color: "#f0f4f8" }} />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>

                <MenuItem onClick={() => setDeleteDialogOpen(true)}>
                  <ListItemIcon>
                    <DeleteIcon sx={{ color: "#ea7070" }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Delete Account" 
                    sx={{ "& .MuiTypography-root": { color: "#ea7070" } }}
                  />
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Dialogs */}
      <Suspense fallback={<div>Loading...</div>}>
        {isSearch && <SearchDialog />}
        {isNotification && <NotifcationDialog />}
        {isNewGroup && <NewGroupDialog />}
      </Suspense>

      {/* Delete Account Dialog */}
      <DeleteAccountDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
      />

      {/* Confirm Logout Dialog */}
      <ConfirmDeleteDialog
        open={isLogoutConfirmOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
      />
    </>
  );
};

const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton
        onClick={onClick}
        sx={{
          color: "#f0f4f8",
          "&:hover": {
            backgroundColor: "rgba(240, 244, 248, 0.1)",
          },
        }}
      >
        <Badge badgeContent={value} color="error">
          {icon}
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default Header;

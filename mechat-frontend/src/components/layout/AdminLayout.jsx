import {
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  Groups as GroupsIcon,
  ManageAccounts as ManageAccountsIcon,
  Menu as MenuIcon,
  Message as MessageIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Stack,
  Typography,
  styled,
  useTheme,
  useMediaQuery
} from "@mui/material";
import React, { useState } from "react";
import { Link as LinkComponent, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../redux/thunks/admin";
// import meChatIcon from "../../assets/meChatIcon.png";
import Logo from '../shared/Logo';

const Link = styled(LinkComponent)(({ theme }) => ({
  textDecoration: 'none',
  borderRadius: '0.5rem',
  padding: '0.75rem 1.5rem',
  color: theme.palette.text.secondary,
  transition: 'all 0.2s ease',
  position: 'relative',
  
  '&:hover': {
    color: theme.palette.primary.main,
    background: `${theme.palette.primary.main}10`,
    
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      width: '3px',
      background: theme.palette.primary.main,
      borderRadius: '0 2px 2px 0',
    }
  }
}));

const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <ManageAccountsIcon />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <GroupsIcon />,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <MessageIcon />,
  },
];

const Sidebar = ({ w = "100%" }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const logoutHandler = () => {
    dispatch(adminLogout());
  };

  const handleBackToChat = async () => {
    try {
      await dispatch(adminLogout()).unwrap();
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Stack 
      width={w} 
      direction={"column"} 
      p={isMobile ? "1.5rem" : "3rem"} 
      spacing={isMobile ? "1.5rem" : "3rem"}
      sx={{
        height: "100%",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "0.4em",
        },
        "&::-webkit-scrollbar-track": {
          boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
          webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0,.1)",
          borderRadius: "20px",
        },
      }}
    >
      <Box sx={{ 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
       }}>
        <Box 
          onClick={() => window.location.reload()}
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            pl: 3,
            pr: 4,
            gap: 1, 
            cursor: "pointer",
            transition: "background-color 0.1s ease",
            userSelect: "none", 
            borderRadius: "0.35rem",
            "&:hover": {
              bgcolor: "rgba(0, 0, 0, 0.05)",
            }
          }}>

          <Logo size={isMobile ? 48 : 56} />
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            sx={{ 
              fontSize: isMobile ? "1.25rem" : "1.5rem", 
              fontFamily: "monospace",
              color: theme.palette.text.primary
            }}
          >
            TalkTalk
          </Typography>
        </Box>
      </Box>

      <Stack spacing={isMobile ? "0.5rem" : "1rem"}>
        {adminTabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            sx={{
              ...(location.pathname === tab.path && {
                color: theme.palette.primary.main,
                background: `${theme.palette.primary.main}10`,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: "3px",
                  background: theme.palette.primary.main,
                  borderRadius: "0 2px 2px 0",
                },
                ":hover": { 
                  color: theme.palette.primary.main,
                  background: `${theme.palette.primary.main}10`,
                },
              }),
              padding: isMobile ? "0.75rem 1.5rem" : "1rem 2rem",
            }}
          >
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
              {tab.icon}
              <Typography sx={{ 
                fontSize: isMobile ? "0.875rem" : "1rem",
                color: "inherit"
              }}>
                {tab.name}
              </Typography>
            </Stack>
          </Link>
        ))}

        <Link 
          onClick={handleBackToChat}
          sx={{ padding: isMobile ? "0.75rem 1.5rem" : "1rem 2rem" }}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            <ArrowBackIcon sx={{ fontSize: isMobile ? "1.25rem" : "1.5rem" }} />
            <Typography sx={{ 
              fontSize: isMobile ? "0.875rem" : "1rem",
              color: "inherit"
            }}>
              Back to Chat
            </Typography>
          </Stack>
        </Link>

        <Link 
          onClick={logoutHandler}
          sx={{ padding: isMobile ? "0.75rem 1.5rem" : "1rem 2rem" }}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            <ExitToAppIcon sx={{ fontSize: isMobile ? "1.25rem" : "1.5rem" }} />
            <Typography sx={{ 
              fontSize: isMobile ? "0.875rem" : "1rem",
              color: "inherit"
            }}>
              Logout
            </Typography>
          </Stack>
        </Link>
      </Stack>
    </Stack>
  );
};

const AdminLayout = ({ children }) => {
  const { isAdmin } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  if (!isAdmin) return <Navigate to="/admin" />;

  return (
    <Grid container minHeight={"100vh"}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <Box
          sx={{
            position: "fixed",
            right: "1rem",
            top: "1rem",
            zIndex: 1300,
          }}
        >
          <IconButton 
            onClick={handleDrawerToggle}
            sx={{ 
              bgcolor: theme.palette.background.paper,
              boxShadow: isDrawerOpen ? 0 : 1,
              "&:hover": { 
                bgcolor: theme.palette.background.paper,
                boxShadow: isDrawerOpen ? 0 : 2
              }
            }}
          >
            {isDrawerOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      )}

      {/* Desktop Sidebar */}
      <Grid 
        item 
        md={4} 
        lg={3} 
        sx={{ 
          display: { xs: "none", md: "block" },
          borderRight: `1px solid ${theme.palette.divider}`,
          height: "100vh",
          position: "sticky",
          top: 0,
          bgcolor: theme.palette.background.paper
        }}
      >
        <Sidebar />
      </Grid>

      {/* Main Content */}
      <Grid
        item
        xs={12}
        md={8}
        lg={9}
        sx={{
          bgcolor: theme.palette.background.default,
          minHeight: "100vh",
          p: { xs: 2, md: 3 },
        }}
      >
        {children}
      </Grid>

      {/* Mobile Drawer */}
      <Drawer 
        variant="temporary"
        anchor="right"
        open={isDrawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: '100%',
            maxWidth: '300px',
            zIndex: 1200,
            bgcolor: theme.palette.background.paper
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Sidebar />
        </Box>
      </Drawer>
    </Grid>
  );
};

export default AdminLayout;

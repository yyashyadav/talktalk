import React, { useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Fab,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { myblue, primaryColor, secondaryColor } from "../constants/color"; // Assuming color constants are defined
import { Chat as ChatIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setIsMobile } from "../redux/reducers/misc";

// Main Landing Page Component
const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { isMobile: isMobileDrawerOpen } = useSelector((state) => state.misc);

  // Close mobile drawer when navigating to a chat
  useEffect(() => {
    if (isMobileDrawerOpen) {
      // Keep the drawer open when on the home page
      // It will be closed automatically when navigating to a chat
    }
  }, [isMobileDrawerOpen]);

  const handleStartChat = () => {
    dispatch(setIsMobile(true));
  };

  return (
    <Box
      sx={{
        height: "91.3vh",
        // background: "linear-gradient(45deg, #F5A623, #F06595, #6A11CB  , #75b695)",
        // "linear-gradient(45deg, #00C6FF, #F5A623, #6A11CB)
        background: "linear-gradient(45deg, #00C6FF, #F5A623, #6A11CB)",
        backgroundSize: "500% 500%",
        animation: "gradient 15s ease infinite",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Main Content */}
      <Container maxWidth="md" sx={{ zIndex: 1 }}>
        <Box sx={{ textAlign: "center", color: "white", marginBottom: 4 }}>
          <Typography
            component="div"
            sx={{
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            <Typography
              component="h1"
              sx={{
                fontWeight: "bold",
                fontSize: "48px",
                letterSpacing: "1px",
                animation: "fadeIn 2s ease-in-out",
              }}
            >
              Welcome to 
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontWeight: "bold",
                fontSize: "60px",
                letterSpacing: "1px",
                bgcolor: "rgba(255, 255, 255, 0.3)",
                padding: "10px 35px",
                width: "fit-content",
                display: "inline-block",
                margin: "0 auto",
                borderRadius: "10px",
                animation: "fadeIn 2s ease-in-out",
              }}
            >
              MeChat!
            </Typography>
          </Typography>
          <Typography
            component="h3"
            sx={{
              marginTop: 2,
              color: "rgba(255, 255, 255, 0.8)",
              animation: "fadeIn 2s ease-in-out",
              fontSize: "21px",
              position: "relative",
              display: "block",
              textAlign: "center",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: "-4px",
                left: "0",
                width: "100%",
                height: "8px",
                background: `url("data:image/svg+xml,%3Csvg width='100%25' height='8' viewBox='0 0 100 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,4 C20,0 40,8 60,4 C80,0 100,8 100,4' stroke='rgba(255,255,255,0.8)' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                opacity: 0.8,
              }
            }}
          >
            Connect, Chat, and Share   
          </Typography>
          
          {/* Start Chat Button - Only visible on mobile */}
          {isMobile && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<ChatIcon />}
                onClick={handleStartChat}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: "bold",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  animation: "fadeIn 2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Start Chat
              </Button>
            </Box>
          )}
        </Box>
      </Container>

      {/* Floating Action Button - Only visible on mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="start chat"
          onClick={handleStartChat}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            animation: "pulse 2s infinite",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
        >
          <ChatIcon />
        </Fab>
      )}

      {/* Footer */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          textAlign: "center",
          padding: "20px",
          // background: "rgba(255, 255, 255, 0.1)",
          // backdropFilter: "blur(15px)",
        }}
      >
        <Typography
          component="div"
          sx={{
            color: "black",
            opacity: 0.5,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 400,
            letterSpacing: "0.5px",
            fontSize: "16px",
            textTransform: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          A Chat webapp by
          <Typography
            component="span"
            sx={{
              bgcolor: "rgba(246, 247, 196, 0.8)",
              padding: "0px 7px 0px 5px",
              fontSize: "16px",
              fontStyle: "italic",
              borderRadius: "5px",
              animation: "fadeIn 2s ease-in-out",
              cursor: "pointer",
              "&:hover": {
                bgcolor: "rgb(250, 255, 114)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Vinay Tyagi⚡
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
};

export default AppLayout()(Home);
// CSS Animations (Add this globally or in your CSS file):
const style = document.createElement("style");
style.innerHTML = `
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 198, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(0, 198, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 198, 255, 0);
  }
}
`;
document.head.appendChild(style);


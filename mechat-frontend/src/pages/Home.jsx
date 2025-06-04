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
import talktalkIcon from "../assets/talktalk-icon.png";

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
        minHeight: "100%",
        background: "linear-gradient(to top, #6a85b6 0%, #bac8e0 100%)",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          opacity: 0.4,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1) 75%, transparent 75%, transparent)",
          backgroundSize: "60px 60px",
          opacity: 0.2,
          animation: "sparkle 3s linear infinite",
        },
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
            {/* <Typography
              component="h1"
              sx={{
                color: "black",
                // fontWeight: "bold",
                fontFamily: "cursive",
                // fontFamily: "'Inter', 'Segoe UI', sans-serif",
                // fontSize: "48px",
                fontSize: { xs: "36px", md: "48px" },
                letterSpacing: "1px",
                textAlign: "center",
                marginBottom: "10px",
                animation: "fadeIn 2s ease-in-out",
                fontWeight: 300,
              }}
            >
              Welcome to 
            </Typography>
             */}
            
           <Typography
              component="h1"
              sx={{
                // color: "#2c3e50",
                color: "#000000",
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                fontSize: { xs: "36px", md: "48px" },
                letterSpacing: "1px",
                textAlign: "center",
                marginBottom: "10px",
                fontWeight: 300,
                animation: "fadeIn 2s ease-in-out",
              }}
            >
              Welcome to
            </Typography>
            
            <Typography
              component="h2"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "48px", md: "60px" },
                letterSpacing: "1px",
                background: "linear-gradient(135deg, #000000, #1a1a1a, #2d2d2d)",
                padding: "10px 35px",
                width: "fit-content",
                display: "inline-block",
                margin: "0 auto",
                borderRadius: "10px 35px",
                animation: "fadeIn 2s ease-in-out",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.5s ease",
                cursor: `url(${talktalkIcon}), none`,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                  opacity: 0.3,
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)",
                  backgroundSize: "40px 40px",
                  opacity: 0.2,
                  animation: "sparkle 3s linear infinite",
                },
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.4)",
                  "&::before": {
                    left: "100%",
                  },
                },
              }}
            >
              <span style={{ 
                position: "relative", 
                zIndex: 1,
                background: "linear-gradient(135deg, #ffffff, #e0e0e0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}>
                TalkTalk!
              </span>
            </Typography>
          </Typography>
          <Typography
            component="h3"
            sx={{
              marginTop: 2,
              color: "#2c3e50",
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
                background: `url("data:image/svg+xml,%3Csvg width='100%25' height='8' viewBox='0 0 100 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,4 C20,0 40,8 60,4 C80,0 100,8 100,4' stroke='%232c3e50' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                opacity: 0.9,
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
            bottom: 60,
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
          width: { xs: '100%', md: '70%' },
          textAlign: "center", 
          padding: "15px",
          backdropFilter: "blur(2px)",
          position: "fixed",
        }}
      >
        <Typography
          component="div"
          sx={{
            color: "#2c3e50",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            letterSpacing: "0.5px",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            position: "relative",
            zIndex: 1,
          }}
        >
          A Chat webapp by
          <a 
            href="https://mevinay.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1
            }}
          >
            <Typography
              component="span"
              sx={{
                background: "linear-gradient(-45deg, rgba(95, 185, 169, 0.2), rgba(92, 157, 203, 0.2))",
                padding: "1px 10px",
                fontSize: "14px",
                fontStyle: "italic",
                borderRadius: "20px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                display: "inline-block",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
                  transition: "0.5s",
                },
                "&:hover": {
                  background: "linear-gradient(-45deg, #5fb9a9, rgb(92, 157, 203))",
                  color: "white",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 15px rgba(92, 157, 203, 0.3)",
                  "&::before": {
                    left: "100%",
                  },
                },
                "& .sparkle": {
                  position: "absolute",
                  background: "red",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  transition: "0.5s",
                  opacity: 0,
                },
                "&:hover .sparkle": {
                  opacity: 1,
                  transform: "rotate(45deg) translate(75px, -75px) scale(2)",
                },
              }}
            >
              <span className="sparkle" style={{ top: "60%", left: "40%" }} />
              <span className="sparkle" style={{ top: "40%", left: "60%" }} />
              <span className="sparkle" style={{ top: "80%", left: "80%" }} />
              Yash Yadav⚡
            </Typography>
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default AppLayout()(Home);
// CSS Animations (Add this globally or in your CSS file):
const style = document.createElement("style");
style.innerHTML = `
@keyframes sparkle {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 60px 60px;
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
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(33, 150, 243, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
  }
}
`;
document.head.appendChild(style);

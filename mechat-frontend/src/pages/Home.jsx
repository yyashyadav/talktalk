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
        background: "linear-gradient(to right, #16222a, #3a6073)",
        color: "#f0f4f8",
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
          background: "radial-gradient(circle, rgba(240, 244, 248, 0.05) 1px, transparent 1px)",
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
          background: "linear-gradient(45deg, rgba(240, 244, 248, 0.05) 25%, transparent 25%, transparent 50%, rgba(240, 244, 248, 0.05) 50%, rgba(240, 244, 248, 0.05) 75%, transparent 75%, transparent)",
          backgroundSize: "60px 60px",
          opacity: 0.2,
          animation: "sparkle 3s linear infinite",
        },
      }}
    >
      {/* Main Content */}
      <Container maxWidth="md" sx={{ zIndex: 1 }}>
        <Box sx={{ textAlign: "center", color: "#f0f4f8", marginBottom: 4 }}>
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
                color: "#f0f4f8",
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
                background: "linear-gradient(135deg, #16222a, #3a6073)",
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
                  background: "radial-gradient(circle, rgba(240, 244, 248, 0.1) 1px, transparent 1px)",
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
                  background: "linear-gradient(45deg, rgba(240, 244, 248, 0.1) 25%, transparent 25%, transparent 50%, rgba(240, 244, 248, 0.1) 50%, rgba(240, 244, 248, 0.1) 75%, transparent 75%, transparent)",
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
                background: "linear-gradient(135deg, #f0f4f8, #e0e8f0)",
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
              color: "rgba(240, 244, 248, 0.8)",
              animation: "fadeIn 2s ease-in-out", 
              fontSize: "21px",
              position: "relative",
              display: "block",
              textAlign: "center",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "60px",
                height: "2px",
                background: "linear-gradient(90deg, transparent, #3a6073, transparent)",
                animation: "fadeIn 2s ease-in-out 0.5s both"
              }
            }}
          >
            Connect, Chat, and Share with Friends
          </Typography>
        </Box>

        {/* Feature Cards */}
        <Grid container spacing={3} sx={{ marginBottom: 4 }}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: "rgba(22, 34, 42, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(240, 244, 248, 0.1)",
                borderRadius: "16px",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(58, 96, 115, 0.3)",
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    margin: "0 auto 16px",
                    background: "linear-gradient(135deg, #3a6073, #2a4a5a)",
                    color: "#f0f4f8",
                  }}
                >
                  <ChatIcon />
                </Avatar>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#f0f4f8",
                    marginBottom: 1,
                    fontWeight: 600,
                  }}
                >
                  Real-time Chat
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(240, 244, 248, 0.7)",
                    lineHeight: 1.6,
                  }}
                >
                  Experience instant messaging with real-time updates and notifications.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: "rgba(22, 34, 42, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(240, 244, 248, 0.1)",
                borderRadius: "16px",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(58, 96, 115, 0.3)",
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    margin: "0 auto 16px",
                    background: "linear-gradient(135deg, #3a6073, #2a4a5a)",
                    color: "#f0f4f8",
                  }}
                >
                  <ChatIcon />
                </Avatar>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#f0f4f8",
                    marginBottom: 1,
                    fontWeight: 600,
                  }}
                >
                  Group Conversations
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(240, 244, 248, 0.7)",
                    lineHeight: 1.6,
                  }}
                >
                  Create and manage group chats with multiple participants.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: "rgba(22, 34, 42, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(240, 244, 248, 0.1)",
                borderRadius: "16px",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(58, 96, 115, 0.3)",
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    margin: "0 auto 16px",
                    background: "linear-gradient(135deg, #3a6073, #2a4a5a)",
                    color: "#f0f4f8",
                  }}
                >
                  <ChatIcon />
                </Avatar>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#f0f4f8",
                    marginBottom: 1,
                    fontWeight: 600,
                  }}
                >
                  File Sharing
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(240, 244, 248, 0.7)",
                    lineHeight: 1.6,
                  }}
                >
                  Share files, images, and documents seamlessly with your contacts.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* CTA Button */}
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartChat}
            sx={{
              background: "linear-gradient(135deg, #3a6073, #2a4a5a)",
              color: "#f0f4f8",
              padding: "12px 32px",
              fontSize: "18px",
              fontWeight: 600,
              borderRadius: "25px",
              textTransform: "none",
              boxShadow: "0 4px 15px rgba(58, 96, 115, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #4a7083, #3a6073)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(58, 96, 115, 0.4)",
              },
            }}
          >
            Start Chatting Now
          </Button>
        </Box>
      </Container>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="start chat"
          onClick={handleStartChat}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            background: "linear-gradient(135deg, #3a6073, #2a4a5a)",
            color: "#f0f4f8",
            "&:hover": {
              background: "linear-gradient(135deg, #4a7083, #3a6073)",
            },
          }}
        >
          <ChatIcon />
        </Fab>
      )}
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

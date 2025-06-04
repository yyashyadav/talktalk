import { Button, Container, Typography, Box } from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { bgGradient, myblue } from "../constants/color";
// import meChatIcon from "../assets/meChatIcon.png";
import { motion } from "framer-motion";
import Logo from '../components/shared/Logo';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: myblue,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      {/* <motion.div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 0,
       
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "5%",
            left: "10%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(192, 79, 79, 0.8)",
            filter: "blur(20px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "5%",
            right: "10%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(192, 79, 79, 0.8)",
            filter: "blur(20px)",
          }}
        />
      </motion.div> */}

      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              textAlign: "center",
              p: 4,
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(80px)",
              // boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2 , gap: 2,
            userSelect: "none",
             }}>  
            {/* <img 
                src={meChatIcon} 
                alt="MeChat"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "contain"
                }}
              /> */}
              <Logo size={80} />
              <Typography variant="h6" sx={{ color: "black", fontSize: "2.2rem", fontFamily: "monospace" }}>
                MeChat
              </Typography>
            </Box>

            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "6rem", sm: "8rem" },
                  fontWeight: "bold",
                  // background: "linear-gradient(45deg,rgb(255, 68, 0),rgb(0, 0, 0))",
                  background:"red",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 2,
                }}
              >
                404
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Typography
                variant="h4"
                sx={{
                  // background:"linear-gradient(45deg, #00C6FF,rgb(246, 243, 79))",
                  background:"red",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  fontSize: "1.5rem",
                  mb: 2,
                  fontWeight: "bold",
                }}
              >
                Oops! Page Not Found
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "black",
                  mb: 4,
                }}
              >
                The page you are looking for might have been removed, had its name
                changed, or is temporarily unavailable.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<HomeIcon />}
                onClick={() => navigate("/")}
                sx={{
                  background: myblue,
                  // background:"white",
                  color: "black",
                  padding: "12px 24px",
                  borderRadius: "50px",
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "1.1rem",
                  background: myblue,
                  "&:hover": {
                    background: "linear-gradient(-45deg,rgba(95, 185, 168, 0.73),rgba(92, 157, 203, 0.8))",
                  },
                }}
              >
                Go to Homepage
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default NotFound;

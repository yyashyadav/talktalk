import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { bgGradient, myblue, mediumBlue, primaryColor, secondaryColor } from "../constants/color";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";
import talktalkIcon from '../assets/talktalk-icon.png';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");

  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Logging In...");

    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };
  // this function handles the mouse movement to create a parallax effect on the icon
    const [iconOffset, setIconOffset] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const offsetY = ((e.clientY - rect.top) / rect.height - 0.5) * 10;

      setIconOffset({ x: offsetX, y: offsetY });
    };

    const handleMouseLeave = () => {
      setIconOffset({ x: 0, y: 0 });
    };


  const handleSignUp = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );

      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    const toastId = toast.loading("Logging in as guest...");
    setIsLoading(true);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: "username",
          password: "password",
        },
        config
      );
      dispatch(userExists(data.user));
      toast.success("Welcome! You're logged in as a guest.", {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: myblue,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: "400px",
            background: "linear-gradient(135deg, #000000, #1a1a1a, #2a2a2a)",
            color: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "16px",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0))",
              zIndex: 0,
            },
          }}
        >
        <Box
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
                position: "relative",
                zIndex: 1,
                width: "140px",
                height: "140px",
              }}
            >
              <img
                src={talktalkIcon}
                alt="TalkTalk"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "contain",
                  filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
                  transition: "transform 0.2s ease-out",
                  transform: `translate(${iconOffset.x}px, ${iconOffset.y}px)`,
                }}
              />
          </Box>


          {isLogin ? (
            <>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: "#ffffff",
                  mb: 3,
                  fontWeight: "500",
                  position: "relative",
                  zIndex: 1
                }}
              >
                Login
              </Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                  position: "relative",
                  zIndex: 1
                }}
                onSubmit={handleLogin}
              >
                <Stack spacing={2}>
                  <TextField
                    required
                    fullWidth
                    label="Username"
                    margin="normal"
                    variant="outlined"
                    value={username.value}
                    onChange={username.changeHandler}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: "#ffffff",
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: primaryColor,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: primaryColor,
                        },
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.94)',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: primaryColor,
                      },
                    }}
                  />

                  <TextField
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    margin="normal"
                    variant="outlined"
                    value={password.value}
                    onChange={password.changeHandler}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: "#ffffff",
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: primaryColor,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: primaryColor,
                        },
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.94)',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: primaryColor,
                      },
                    }}
                  />

                 <Button
                      sx={{
                        mt: 3,
                        mb: 2,
                        background: "linear-gradient(135deg, #28a745, #218838)",
                        color: "#ffffff",
                        '&:hover': {
                          background: "linear-gradient(135deg, #218838, #1e7e34)",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(40, 167, 69, 0.4)",
                        },
                        padding: "10px",
                        borderRadius: "8px",
                        textTransform: "none",
                        fontSize: "1rem",
                        transition: "all 0.2s ease",
                      }}
                      variant="contained"
                      type="submit"
                      fullWidth
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging In..." : "Login"}
                </Button>


                  <Button
                      sx={{
                        background: "linear-gradient(135deg, #007bff, #0056b3)",
                        color: "#ffffff",
                        '&:hover': {
                          background: "linear-gradient(135deg, #0056b3, #004085)",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(0, 123, 255, 0.4)",
                        },
                        padding: "10px",
                        borderRadius: "8px",
                        textTransform: "none",
                        transition: "all 0.2s ease",
                      }}
                      variant="contained"
                      fullWidth
                      disabled={isLoading}
                      onClick={handleGuestLogin}
                    >
                      Guest Login (For Interviewers)
                  </Button>


                  <Typography 
                    variant="caption" 
                    display="block" 
                    textAlign="center" 
                    sx={{ 
                      mt: 1,
                      color: "rgba(255, 255, 255, 0.94)",
                      fontSize: "0.75rem"
                    }}
                  >
                    Quick access for interview demonstration
                  </Typography>

                  <Typography 
                    textAlign={"center"} 
                    m={"1rem"}
                    sx={{ color: "rgba(255, 255, 255, 0.94)" }}
                  >
                    OR
                  </Typography>

                  <Button
                    disabled={isLoading}
                    fullWidth
                    variant="text"
                    onClick={toggleLogin}
                    sx={{
                      color: primaryColor,
                      '&:hover': {
                        color: "rgb(39, 82, 182)",
                        backgroundColor: "rgba(92, 157, 203, 0.08)",
                      },
                      textTransform: "none",
                    }}
                  >
                    Sign Up Instead
                  </Button>
                </Stack>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5">Sign Up</Typography>
              <Box
                sx={{
                  width: "100%",
                  marginTop: "1rem",
                  maxHeight: "calc(100vh - 240px)",
                  overflowY: "auto",
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                <form onSubmit={handleSignUp}>
                  <Stack spacing={2} alignItems="center">
                    <Box sx={{ 
                      position: "relative", 
                      width: "7rem", 
                      height: "7rem", 
                      margin: "0 auto",
                    }}>
                      <Avatar
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          border: "2px solid #ffffff",
                        }}
                        src={avatar.preview}
                      />

                      <IconButton
                        sx={{
                          position: "absolute",
                          bottom: "5%",
                          right: "5%",
                          color: "white",
                          bgcolor: "#5fb9a9",
                          ":hover": {
                            bgcolor: "#4d9b8c",
                            transform: "scale(1.1)",
                          },
                          width: "2.5rem",
                          height: "2.5rem",
                          transition: "all 0.2s ease",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                        }}
                        component="label"
                      >
                        <>
                          <CameraAltIcon sx={{ fontSize: "1.2rem" }} />
                          <VisuallyHiddenInput
                            type="file"
                            onChange={avatar.changeHandler}
                            accept="image/*"
                          />
                        </>
                      </IconButton>
                    </Box>

                    {avatar.error && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ 
                          textAlign: "center",
                          bgcolor: "rgba(211, 47, 47, 0.1)",
                          padding: "0.5rem 1rem",
                          borderRadius: "4px",
                          width: "100%"
                        }}
                      >
                        {avatar.error}
                      </Typography>
                    )}

                    <TextField
                      required
                      fullWidth
                      label="Name"
                      margin="normal"
                      variant="outlined"
                      value={name.value}
                      onChange={name.changeHandler}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: "#ffffff",
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: '#ffffff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#ffffff',
                          },
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.94)',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#ffffff',
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Bio"
                      margin="normal"
                      variant="outlined"
                      value={bio.value}
                      onChange={bio.changeHandler}
                      multiline
                      rows={1}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: "#ffffff",
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: '#ffffff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#ffffff',
                          },
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.94)',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#ffffff',
                        },
                      }}
                    />

                    <TextField
                      required
                      fullWidth
                      label="Username"
                      margin="normal"
                      variant="outlined"
                      value={username.value}
                      onChange={username.changeHandler}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: "#ffffff",
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: '#ffffff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#ffffff',
                          },
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.94)',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#ffffff',
                        },
                      }}
                    />

                    {username.error && (
                      <Typography color="error" variant="caption">
                        {username.error}
                      </Typography>
                    )}

                    <TextField
                      required
                      fullWidth
                      label="Password"
                      type="password"
                      margin="normal"
                      variant="outlined"
                      value={password.value}
                      onChange={password.changeHandler}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: "#ffffff",
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: '#ffffff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#ffffff',
                          },
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.94)',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#ffffff',
                        },
                      }}
                    />

                    <Button
                          sx={{
                        mt: 3,
                        mb: 2,
                        background: "linear-gradient(135deg, #28a745, #218838)",
                        color: "#ffffff",
                        '&:hover': {
                          background: "linear-gradient(135deg, #218838, #1e7e34)",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(40, 167, 69, 0.4)",
                        },
                        padding: "10px",
                        borderRadius: "8px",
                        textTransform: "none",
                        fontSize: "1rem",
                        transition: "all 0.2s ease",
                      }}
                        variant="contained"
                        type="submit"
                        fullWidth
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing Up..." : "Sign Up"}
                    </Button>



                    <Typography textAlign={"center"} m={"1rem"}>
                    OR
                  </Typography>
                  
                    <Button
                      disabled={isLoading}
                      fullWidth
                      variant="text"
                      onClick={toggleLogin}
                      sx={{
                        color: "#5c9ec9",
                        "&:hover": {
                          color: "#4d8ab0"
                        }
                      }}
                    >
                      Login Instead
                    </Button>
                  </Stack>
                </form>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;

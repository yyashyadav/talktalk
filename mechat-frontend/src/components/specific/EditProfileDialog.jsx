import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import {
  CameraAlt as CameraAltIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setIsProfileOpen } from "../../redux/reducers/misc";
import { transformImage } from "../../lib/features";
import { useAsyncMutation } from "../../hooks/hook";
import { useUpdateProfileMutation } from "../../redux/api/api";
import { VisuallyHiddenInput } from "../styles/StyledComponents";
import toast from "react-hot-toast";
import { userExists } from "../../redux/reducers/auth";

const EditProfileDialog = ({ user }) => {
  const dispatch = useDispatch();
  const [updateProfile] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    language: user?.language || "",
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    dispatch(setIsProfileOpen(false));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Updating profile...");
    
    try {
      const formDataToSend = new FormData();
      
      // Only append non-empty fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value && value.trim()) {
          formDataToSend.append(key, value.trim());
        }
      });
      
      if (avatar) {
        formDataToSend.append("avatar", avatar);
      }

      const response = await updateProfile(formDataToSend);
      
      if (response.data?.success) {
        dispatch(userExists(response.data.user));
        toast.success("Profile updated successfully", { id: toastId });
        handleClose();
      } else {
        throw new Error(response.error?.data?.message || "Update failed");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (error) {
      return "Invalid date";
    }
  };

  const getTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);
      
      let interval = seconds / 31536000;
      if (interval > 1) return Math.floor(interval) + " years ago";
      
      interval = seconds / 2592000;
      if (interval > 1) return Math.floor(interval) + " months ago";
      
      interval = seconds / 86400;
      if (interval > 1) return Math.floor(interval) + " days ago";
      
      interval = seconds / 3600;
      if (interval > 1) return Math.floor(interval) + " hours ago";
      
      interval = seconds / 60;
      if (interval > 1) return Math.floor(interval) + " minutes ago";
      
      return Math.floor(seconds) + " seconds ago";
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <Box 
      sx={{ 
        height: "100%",
        bgcolor: "background.paper",
        overflow: "auto",
        borderLeft: 1,
        borderColor: "divider"
      }}
    >
      {/* Header with gradient */}
      <Box
        sx={{
          position: "relative",
          height: "100px",
          background: "linear-gradient(-45deg, #5fb9a9,rgb(92, 157, 203))",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>

        {/* Avatar with upload button */}
        <Box
          sx={{
            position: "absolute",
            bottom: -50,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={avatarPreview}
              sx={{
                width: 130,
                height: 130,
                border: "3px solid #5fb9a9",
                boxShadow: 2,
              }}
            />
            <IconButton
              component="label"
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: "#5fb9a9",
                boxShadow: 3,
                "&:hover": { bgcolor: "#4ea698",
                  transform: "scale(1.05)",
                  transition: "all 0.2s ease",
                  boxShadow: 4,
                  // border: "3px solid #4ea698"
                 },
                color: "white",
              }}
            >
              <CameraAltIcon />
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                // sx={{

                //   "&:hover": {
                //     backgroundColor: "rgba(0,0,0,0.5)",
                //     scale: 1.01,
                //     transition: "all 0.2s ease",
                //     boxShadow: 3,
                //   },
                // }}
              />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Form Content */}
      <Box sx={{ mt: 8, px: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
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
            />
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              multiline
              rows={3}
              value={formData.bio}
              onChange={handleInputChange}
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
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
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
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
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
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
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
            />
            <TextField
              fullWidth
              label="Language"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
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
            />

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleClose}
                disabled={isLoading}
                sx={{
                  borderColor: '#5daeb5',
                  color: '#5daeb5',
                  // borderRadius: 2,
                  // textTransform: 'none',
                  // fontWeight: 500,
                  // padding: '10px',
                  "&:hover": {
                    borderColor: '#4e9ba1',
                    backgroundColor: 'rgba(93, 174, 181, 0.1)',
                  },
                  "&:disabled": {
                    borderColor: 'rgba(93, 174, 181, 0.5)',
                    color: 'rgba(93, 174, 181, 0.5)'
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                sx={{
                  backgroundColor: '#5daeb5',
                  boxShadow: '0 2px 4px rgba(93, 174, 181, 0.25)',
                  "&:hover": {
                    backgroundColor: '#4e9ba1',
                    boxShadow: '0 4px 8px rgba(93, 174, 181, 0.35)',
                  },
                  "&:disabled": {
                    backgroundColor: 'rgba(93, 174, 181, 0.5)',
                  }
                }}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </Stack>
          </Stack>
        </form>
        <Divider sx={{ mt: 2 }} />
      </Box>
    </Box>
  );
};

export default EditProfileDialog;
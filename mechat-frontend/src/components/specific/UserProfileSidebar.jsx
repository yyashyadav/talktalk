import React, { useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  EditRounded as EditIcon,
  AlternateEmailRounded as EmailIcon, 
  PhoneIphoneRounded as PhoneIcon,
  LocationOnRounded as LocationIcon,
  CalendarTodayRounded as CalendarIcon,
  TranslateRounded as LanguageIcon,
  UpdateRounded as AccessTimeIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setIsProfileOpen } from "../../redux/reducers/misc";
import { transformImage } from "../../lib/features";
import EditProfileDialog from "./EditProfileDialog";

const UserProfileSidebar = ({ user }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const handleClose = () => {
    dispatch(setIsProfileOpen(false));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
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

  const ProfileInfoItem = ({ icon, label, value }) => (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ 
      py: 1.5,
      px: 2, 
      borderRadius: 2,
      transition: 'all 0.2s ease',
      '&:hover': {
        bgcolor: 'rgba(95, 185, 169, 0.08)',
      }
    }}>
      {React.cloneElement(icon, { 
        sx: { 
          color: '#5fb9a9',
          fontSize: 24
        } 
      })}
      <Stack>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: value ? 'text.primary' : 'text.disabled' }}>
          {value || "Not set"}
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <Box
      sx={{
        height: "100%",
        overflow: "auto",
        bgcolor: 'background.paper',
        borderLeft: 1,
        borderColor: 'divider',
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
      {isEditing ? (
        <EditProfileDialog 
          user={user} 
          onClose={() => setIsEditing(false)}
        />
      ) : (
        <>
          <Box
            sx={{
              position: "relative",
              height: "140px",
              background: "linear-gradient(-45deg, #5fb9a9,rgb(92, 157, 203))",
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "white",
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'scale(1.05)',
                }
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              sx={{
                position: "absolute",
                bottom: -60,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <Avatar
                src={user?.avatar?.url} // Removed transformImage since it may be causing quality issues
                sx={{
                  width: 180,
                  height: 180,
                  border: "3px solid #5fb9a9",
                  boxShadow: 4,
                  bgcolor: 'rgb(255, 255, 255)',
                  '&:hover': {
                    transform: 'scale(1.01)',
                    transition: 'all 0.2s ease',
                    boxShadow: 3,
                  },
                  objectFit: 'cover' // Added to maintain aspect ratio
                }}
              />
            </Box>
          </Box>

          <Box sx={{ mt: 8, px: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'rgba(0, 0, 0, 0.7)' }}>{user?.name}</Typography>
              <IconButton 
                size="small" 
                onClick={handleEdit}
                sx={{
                  bgcolor: 'rgba(95, 185, 169, 0.1)',
                  color: '#5fb9a9',
                  '&:hover': {
                    bgcolor: 'rgba(95, 185, 169, 0.2)',
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <EditIcon />
              </IconButton>
            </Stack>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 500 
              }}
            >
              @{user?.username}
            </Typography>

            <Typography
              variant="body1"
              sx={{ 
                mt: 2, 
                mb: 3, 
                color: "text.secondary",
                lineHeight: 1.6 
              }}
            >
              {user?.bio || "No bio available"}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1}>
              <ProfileInfoItem
                icon={<EmailIcon />}
                label="Email"
                value={user?.email}
              />
              <ProfileInfoItem
                icon={<PhoneIcon />}
                label="Phone"
                value={user?.phone}
              />
              <ProfileInfoItem
                icon={<LocationIcon />}
                label="Location"
                value={user?.location}
              />
              <ProfileInfoItem
                icon={<LanguageIcon />}
                label="Language"
                value={user?.language}
              />
              <ProfileInfoItem
                icon={<CalendarIcon />}
                label="Joined"
                value={formatDate(user?.createdAt)}
              />
              <ProfileInfoItem
                icon={<AccessTimeIcon />}
                label="Last updated"
                value={getTimeAgo(user?.updatedAt)}
              />
              <Divider sx={{ mt: 2 }} />
            </Stack>
          </Box>
        </>
      )}
    </Box>
  );
};

export default UserProfileSidebar;

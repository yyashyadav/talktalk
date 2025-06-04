import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import { getSocket } from "../../socket";
import { ALERT } from "../../constants/events";
import { orange, chatBgPattern } from "../../constants/color";
import { server } from "../../constants/config";

const backgroundOptions = [
  { value: "default", label: "Default Pattern" },
  { value: "#ffffff", label: "White" },
  { value: "#f0f0f0", label: "Light Gray" },
  { value: "#e5ddd5", label: "Light Beige" },
  { value: "#d1e7dd", label: "Mint Green" },
  { value: "#e2d1f9", label: "Lavender" },
];

const ChatBackgroundDialog = ({ open, onClose, chatId, members, user }) => {
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const socket = getSocket();

  const handleBackgroundChange = (type, value) => {
    if (type === "image") {
      setSelectedImage(value);
      setSelectedBackground({ type, value });
    } else {
      setSelectedImage(null);
      setSelectedBackground({ type: "color", value });
    }
  };

  const handleApply = async () => {
    if (selectedBackground) {
      try {
        const res = await fetch(`${server}/api/v1/chat/update-background`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId,
            background: selectedBackground,
          }),
          credentials: 'include',
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to update background');
        }

        if (data.success) {
          socket.emit(ALERT, {
            chatId,
            members,
            background: selectedBackground,
            sender: {
              _id: user._id,
              name: user.name,
            },
          });
          onClose();
        }
      } catch (error) {
        console.error('Error updating background:', error);
        alert(error.message || 'Failed to update background. Please try again.');
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Change Chat Background</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Choose a color:
            </Typography>
            <Grid container spacing={1}>
              {backgroundOptions.map((option) => (
                <Grid item key={option.value}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      cursor: "pointer",
                      border: "2px solid",
                      borderColor:
                        selectedBackground?.value === option.value
                          ? orange
                          : "transparent",
                      background:
                        option.value === "default"
                          ? chatBgPattern
                          : option.value,
                      "&:hover": {
                        borderColor: orange,
                      },
                    }}
                    onClick={() => handleBackgroundChange("color", option.value)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Or upload an image:
            </Typography>
            <Box
              sx={{
                border: "2px dashed",
                borderColor: "gray",
                borderRadius: 2,
                p: 2,
                textAlign: "center",
                cursor: "pointer",
                "&:hover": {
                  borderColor: orange,
                },
              }}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      handleBackgroundChange("image", event.target.result);
                    };
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }}
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Selected"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 200,
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Typography>Click to upload an image</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleApply}
          variant="contained"
          sx={{ bgcolor: orange, "&:hover": { bgcolor: "error.dark" } }}
          disabled={!selectedBackground}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatBackgroundDialog;
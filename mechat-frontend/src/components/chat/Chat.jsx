import { Box, Stack, Typography, Avatar } from "@mui/material";
import { theme } from "../../constants/theme";

const Chat = ({ chat, user }) => {
  const isOwnMessage = chat.sender._id === user._id;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isOwnMessage ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <Stack
        direction={isOwnMessage ? "row-reverse" : "row"}
        spacing={1}
        sx={{
          maxWidth: "70%",
        }}
      >
        <Avatar
          src={chat.sender.avatar}
          alt={chat.sender.name}
          sx={{
            width: 35,
            height: 35,
            border: `2px solid ${theme.colors.secondary.main}`,
          }}
        />
        <Box
          sx={{
            bgcolor: isOwnMessage ? theme.colors.secondary.main : theme.colors.primary.light,
            color: isOwnMessage ? theme.colors.text.primary : theme.colors.text.secondary,
            p: 2,
            borderRadius: theme.components.borderRadius,
            boxShadow: theme.components.boxShadow,
            transition: theme.components.transition,
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
        >
          <Typography variant="body1">{chat.content}</Typography>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 1,
              color: isOwnMessage ? "rgba(255, 255, 255, 0.7)" : theme.colors.text.secondary,
            }}
          >
            {new Date(chat.createdAt).toLocaleTimeString()}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default Chat; 
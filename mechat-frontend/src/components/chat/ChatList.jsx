import { Box, Stack, Typography, Avatar, Badge } from "@mui/material";
import { theme } from "../../constants/theme";

const ChatList = ({ chats, currentChat, onChatSelect }) => {
  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "30%" },
        height: "100%",
        bgcolor: theme.colors.primary.main,
        borderRight: `1px solid ${theme.colors.primary.light}`,
        overflow: "auto",
      }}
    >
      <Stack spacing={1} sx={{ p: 2 }}>
        {chats.map((chat) => (
          <Box
            key={chat._id}
            onClick={() => onChatSelect(chat)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              cursor: "pointer",
              borderRadius: theme.components.borderRadius,
              bgcolor: currentChat?._id === chat._id ? theme.colors.primary.light : "transparent",
              transition: theme.components.transition,
              "&:hover": {
                bgcolor: theme.colors.primary.light,
                transform: "translateX(5px)",
              },
            }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              sx={{
                "& .MuiBadge-badge": {
                  bgcolor: chat.isOnline ? theme.colors.status.success : theme.colors.status.error,
                  border: `2px solid ${theme.colors.primary.main}`,
                },
              }}
            >
              <Avatar
                src={chat.avatar}
                alt={chat.name}
                sx={{
                  width: 50,
                  height: 50,
                  border: `2px solid ${theme.colors.secondary.main}`,
                }}
              />
            </Badge>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: theme.colors.text.primary,
                  fontWeight: "bold",
                }}
              >
                {chat.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.colors.text.secondary,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {chat.lastMessage}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: theme.colors.text.secondary,
                whiteSpace: "nowrap",
              }}
            >
              {new Date(chat.lastMessageTime).toLocaleTimeString()}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default ChatList; 
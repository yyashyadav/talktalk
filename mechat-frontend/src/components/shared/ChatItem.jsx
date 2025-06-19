import React, { memo } from "react";
import { Link } from "../styles/StyledComponents";
import { Box, Stack, Typography } from "@mui/material";
import AvatarCard from "./AvatarCard";
import { motion } from "framer-motion";
import { mychatlistcolor, sidebarBg } from "../../constants/color";
import { useDispatch } from "react-redux";
import { setIsMobile } from "../../redux/reducers/misc";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  onlineMembersCount = 0,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  const dispatch = useDispatch();

  const handleChatClick = () => {
    dispatch(setIsMobile(false));
  };

  // Common styles for the online dot
  const onlineDotStyles = {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#44b700",
    display: "inline-block",
    marginLeft: "6px",
    verticalAlign: "middle"
  };

  // Function to get status text
  const getStatusText = () => {
    if (groupChat) {
      if (onlineMembersCount === 0) return "Group Chat";
      return `Group Chat • ${onlineMembersCount} online`;
    }
    return isOnline ? "online" : "offline";
  };

  return (
    <Link
      sx={{
        padding: "0",
        textDecoration: "none",
        display: "block",
        width: "100%",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: sameSender ? "transparent" : "rgba(58, 96, 115, 0.2)",
          transform: sameSender ? "none" : "translateX(4px)",
          boxShadow: sameSender ? "none" : "inset 4px 0 0 0 rgba(58, 96, 115, 0.6)",
        }
      }}
      to={`/chat/${_id}`}
      onClick={handleChatClick}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <Box
        sx={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          backgroundColor: sameSender ? mychatlistcolor : "transparent",
          backgroundImage: sameSender ? mychatlistcolor : "unset",
          color: sameSender ? "#f0f4f8" : "#f0f4f8",
          position: "relative",
          padding: "1rem",
          width: "100%",
          boxSizing: "border-box",
          borderBottom: "1px solid rgba(240, 244, 248, 0.1)",
          "&:last-child": {
            borderBottom: "none"
          }
        }}
      >
        <Box sx={{ 
          position: "relative",
          display: "flex",
          alignItems: "center",
          flexShrink: 0
        }}>
          <AvatarCard avatar={avatar} />
        </Box>

        <Stack
          spacing={0.5}
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: "hidden"
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              color: sameSender ? "#f0f4f8" : "#f0f4f8",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "0.95rem"
            }}
          >
            {name}
          </Typography>

          {/* Status text with right-aligned dot */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: sameSender 
                  ? "rgba(240, 244, 248, 0.7)" 
                  : "rgba(240, 244, 248, 0.6)",
                fontSize: "0.75rem",
                lineHeight: 1.2,
              }}
            >
              {getStatusText()}
            </Typography>
            {/* Show green dot if online (for both group and individual chats) */}
            {isOnline && (
              <Box
                sx={{
                  ...onlineDotStyles,
                  boxShadow: sameSender 
                    ? "0 0 0 2px rgba(240, 244, 248, 0.8)"
                    : "0 0 0 2px #16222a",
                  transition: "box-shadow 0.3s ease"
                }}
              />
            )}
          </Box>

          {newMessageAlert && (
            <Typography
              sx={{
                color: sameSender ? "rgba(240, 244, 248, 0.9)" : "#3a6073",
                fontSize: "0.8rem",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                mt: "2px",
              }}
            >
              {newMessageAlert.count}{" "}
              {newMessageAlert.count > 1 ? "new messages" : "new message"}
            </Typography>
          )}
        </Stack>
      </Box>
    </Link>
  );
};

export default memo(ChatItem);

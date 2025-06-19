import { Box, Stack, Typography, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import React, { memo, useState, useMemo, useRef, useEffect } from "react";
import { grayColor, lightBlue, orange, myblue, chatBgPattern, messageSentBg, messageReceivedBg } from "../../constants/color";
import moment from "moment";
import { fileFormat, transformImage } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";
import { motion } from "framer-motion";
import MessageActionsMenu from "../dialogs/MessageActionsMenu";
import { MoreVert, Reply, Forward, Delete, PlayArrow as PlayIcon, Pause as PauseIcon } from "@mui/icons-material";

const MessageComponent = ({ 
  message, 
  user, 
  onReply, 
  onForward, 
  onDelete, 
  onReact 
}) => {
  const { 
    sender, 
    content, 
    attachments = [], 
    createdAt, 
    isSystem, 
    reactions = [],
    isVoiceMessage,
    audio
  } = message;
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const isMe = sender._id === user._id;
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleClick = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const formatMessageTime = (timestamp) => {
    const messageTime = moment(timestamp);
    const now = moment();
    const diffInSeconds = now.diff(messageTime, 'seconds');

    if (diffInSeconds < 30) {
      return "Just now";
    } else {
      // If message is from today, show only time
      if (messageTime.isSame(now, 'day')) {
        return messageTime.format('h:mm A');  // e.g., "4:51 AM"
      }
      // If message is from yesterday, show "Yesterday" with time
      else if (messageTime.isSame(now.clone().subtract(1, 'day'), 'day')) {
        return `Yesterday, ${messageTime.format('h:mm A')}`;
      }
      // If message is from this week, show day name and time
      else if (messageTime.isAfter(now.clone().subtract(7, 'days'))) {
        return messageTime.format('dddd, h:mm A');  // e.g., "Monday, 4:51 AM"
      }
      // For older messages, show full date and time
      else {
        return messageTime.format('MMM D, h:mm A');  // e.g., "Feb 15, 4:51 AM"
      }
    }
  };

  // Memoize reactions to prevent unnecessary re-renders
  const renderReactions = useMemo(() => {
    if (!reactions.length) return null;

    return (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          mt: 0.5,
          mb: 1
        }}
      >
        {reactions.map((reaction, index) => (
          <Box
            key={`${reaction.user._id}-${reaction.emoji}-${index}`}
            sx={{
              backgroundColor: isMe ? 'rgba(240, 244, 248, 0.2)' : 'rgba(0,0,0,0.2)',
              borderRadius: '12px',
              padding: '2px 6px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <span>{reaction.emoji}</span>
            <Typography variant="caption" sx={{ opacity: 0.7, color: '#f0f4f8' }}>
              {reaction.user.name}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }, [reactions, isMe]);

  const highlightSearchText = (text, searchQuery) => {
    if (!searchQuery || !text) return text;
    
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span key={i} style={{ backgroundColor: '#ffeb3b', padding: '0 2px', borderRadius: '2px' }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, []);

  if (isSystem) {
    return (
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        width="100%"
        my={1}
      >
        <Box
          sx={{
            backgroundColor: "rgba(240, 244, 248, 0.1)",
            padding: "0.5rem 1rem",
            borderRadius: "1rem",
            maxWidth: "70%",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "rgba(240, 244, 248, 0.8)",
              textAlign: "center",
            }}
          >
            {content}
          </Typography>
        </Box>
      </Stack>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: isMe ? "100%" : "-100%" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        alignSelf: isMe ? "flex-end" : "flex-start",
        maxWidth: "70%",
        position: "relative",
        marginBottom: "0.5rem"
      }}
    >
      <Box
        sx={{
          backgroundColor: isMe ? messageSentBg : messageReceivedBg,
          color: "#f0f4f8",
          borderRadius: "12px",
          padding: "0.5rem 1rem",
          position: "relative",
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
          '&:hover': {
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
          }
        }}
      >
        {!isMe && (
          <Typography color="rgba(240, 244, 248, 0.8)" fontWeight={"600"} variant="caption">
            {sender.name}
          </Typography>
        )}

        {/* Message content */}
        {content && (
          <Typography
            variant="body2"
            sx={{
              color: "#f0f4f8",
              wordBreak: "break-word",
              lineHeight: 1.4,
              mb: attachments.length > 0 ? 1 : 0
            }}
          >
            {highlightSearchText(content, window.searchQuery)}
          </Typography>
        )}

        {/* Attachments */}
        {attachments.length > 0 && (
          <Stack spacing={1} mt={1}>
            {attachments.map((attachment, index) => (
              <RenderAttachment
                key={index}
                attachment={attachment}
                isMe={isMe}
              />
            ))}
          </Stack>
        )}

        {/* Voice message */}
        {isVoiceMessage && audio && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={handlePlayPause}
              sx={{
                color: '#f0f4f8',
                backgroundColor: 'rgba(240, 244, 248, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(240, 244, 248, 0.2)',
                }
              }}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </IconButton>
            <audio ref={audioRef} src={audio} />
            <Typography variant="caption" sx={{ color: 'rgba(240, 244, 248, 0.7)' }}>
              Voice message
            </Typography>
          </Box>
        )}

        {/* Reactions */}
        {renderReactions}

        {/* Message actions */}
        <Box
          sx={{
            position: "absolute",
            top: "0.25rem",
            right: "0.25rem",
            opacity: 0,
            transition: "opacity 0.2s ease",
            "&:hover": {
              opacity: 1,
            },
          }}
        >
          <IconButton
            size="small"
            onClick={handleClick}
            sx={{
              color: "rgba(240, 244, 248, 0.7)",
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                color: "#f0f4f8",
              },
            }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>

        {/* Timestamp */}
        <Typography
          variant="caption"
          sx={{
            color: "rgba(240, 244, 248, 0.5)",
            fontSize: "0.7rem",
            display: "block",
            textAlign: isMe ? "right" : "left",
            mt: 0.5,
          }}
        >
          {formatMessageTime(createdAt)}
        </Typography>
      </Box>

      {/* Message actions menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "#1e2a35",
            color: "#f0f4f8",
            border: "1px solid rgba(240, 244, 248, 0.1)",
          },
        }}
      >
        <MenuItem onClick={() => { onReply(message); handleClose(); }}>
          <Reply sx={{ mr: 1, fontSize: "1rem" }} />
          Reply
        </MenuItem>
        <MenuItem onClick={() => { onForward(message); handleClose(); }}>
          <Forward sx={{ mr: 1, fontSize: "1rem" }} />
          Forward
        </MenuItem>
        {isMe && (
          <MenuItem onClick={() => { onDelete(message); handleClose(); }}>
            <Delete sx={{ mr: 1, fontSize: "1rem" }} />
            Delete
          </MenuItem>
        )}
      </Menu>
    </motion.div>
  );
};

// Optimize re-renders
export default React.memo(MessageComponent, (prevProps, nextProps) => {
  return (
    prevProps.message._id === nextProps.message._id &&
    prevProps.message.content === nextProps.message.content &&
    JSON.stringify(prevProps.message.reactions) === JSON.stringify(nextProps.message.reactions)
  );
});

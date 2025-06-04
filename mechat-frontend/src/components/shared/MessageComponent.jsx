import { Box, Stack, Typography, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import React, { memo, useState, useMemo, useRef, useEffect } from "react";
import { grayColor, lightBlue, orange, myblue, chatBgPattern } from "../../constants/color";
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
              backgroundColor: isMe ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
              borderRadius: '12px',
              padding: '2px 6px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <span>{reaction.emoji}</span>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
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
            backgroundColor: "rgba(0,0,0,0.1)",
            padding: "0.5rem 1rem",
            borderRadius: "1rem",
            maxWidth: "70%",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
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
          backgroundColor: isMe ? "#424242" : "#2C2C2C",
          color: "#FFFFFF",
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
          <Typography color="#757575" fontWeight={"600"} variant="caption">
            {sender.name}
          </Typography>
        )}

        {content && (
          <Typography sx={{ 
            wordBreak: "break-word",
            color: "#FFFFFF"
          }}>
            {highlightSearchText(content, window.searchQuery)}
          </Typography>
        )}

        {attachments.length > 0 && (
          <Stack spacing={1} mt={1}>
            {attachments.map((attachment, index) => {
              const url = attachment.url;
              const file = fileFormat(url);

              return (
                <Box key={index}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    style={{
                      color: isMe ? "white" : "black",
                    }}
                  >
                    {RenderAttachment(file, url)}
                  </a>
                </Box>
              );
            })}
          </Stack>
        )}

        {isVoiceMessage && (
          <Box
            sx={{
              bgcolor: isMe ? "primary.main" : "background.paper",
              color: isMe ? "white" : "text.primary",
              padding: "0.5rem 1rem",
              borderRadius: "1rem",
              maxWidth: "70%",
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              '&:hover': {
                opacity: 0.9
              }
            }}
            onClick={handlePlayPause}
          >
            <IconButton
              sx={{
                color: isMe ? "white" : "primary.main",
                padding: "0.5rem",
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </IconButton>
            <Typography variant="body2">
              {audio?.duration ? `${Math.floor(audio.duration / 60)}:${(audio.duration % 60).toString().padStart(2, '0')}` : '0:00'}
            </Typography>
            <audio
              ref={audioRef}
              src={audio?.url}
              style={{ display: 'none' }}
            />
          </Box>
        )}

        {renderReactions}

        {/* Message info */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="flex-end"
        >
          <Typography 
            variant="caption" 
            sx={{ 
              color: isMe ? "rgba(255,255,255,0.7)" : "text.secondary",
              fontSize: "0.7rem"
            }}
          >
            {formatMessageTime(createdAt)}
          </Typography>
          
          <IconButton
            size="small"
            onClick={handleClick}
            sx={{ 
              padding: 0.2,
              color: isMe ? "rgba(255,255,255,0.7)" : "text.secondary"
            }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <MessageActionsMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        message={message}
        onReply={onReply}
        onForward={onForward}
        onDelete={onDelete}
        onReact={onReact}
        isOwnMessage={isMe}
      />
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

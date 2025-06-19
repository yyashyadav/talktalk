import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledMessageBubble = styled(Paper)(({ theme, isSent }) => ({
  padding: '0.75rem 1rem',
  maxWidth: '80%',
  position: 'relative',
  animation: 'messageAppear 0.3s ease-out forwards',
  ...(isSent ? {
    backgroundColor: '#00FFC6',
    color: '#111827',
    boxShadow: '0 0 10px #00FFC6',
    borderRadius: '1.5rem 1.5rem 0.5rem 1.5rem',
    marginLeft: 'auto',
    '&:hover': {
      boxShadow: '0 0 15px rgba(0, 255, 198, 0.7)',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: '1rem',
      height: '1rem',
      background: 'linear-gradient(135deg, transparent 50%, #00FFC6 50%)',
      borderRadius: '0 0 0 0.5rem',
    },
  } : {
    backgroundColor: '#2E343D',
    color: '#EEEEEE',
    border: '1px solid rgba(0, 255, 198, 0.2)',
    borderRadius: '1.5rem 1.5rem 1.5rem 0.5rem',
    marginRight: 'auto',
    '&:hover': {
      borderColor: 'rgba(0, 255, 198, 0.3)',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '1rem',
      height: '1rem',
      background: 'linear-gradient(135deg, #2E343D 50%, transparent 50%)',
      borderRadius: '0 0 0.5rem 0',
    },
  }),
}));

const MessageTime = styled(Typography)({
  fontSize: '0.75rem',
  opacity: 0.7,
  marginTop: '0.25rem',
});

const MessageGroup = styled(Box)(({ isSent }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  alignItems: isSent ? 'flex-end' : 'flex-start',
  marginBottom: '1rem',
}));

const MessageBubble = ({ message, timestamp, isSent }) => {
  return (
    <MessageGroup isSent={isSent}>
      <StyledMessageBubble isSent={isSent}>
        <Typography>{message}</Typography>
        <MessageTime>{timestamp}</MessageTime>
      </StyledMessageBubble>
    </MessageGroup>
  );
};

export default MessageBubble; 
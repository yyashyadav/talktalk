import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import MessageBubble from './MessageBubble';

const ChatWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1rem',
  maxWidth: '100%',
  margin: '0 auto',
  height: '100%',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#393E46',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#00FFC6',
    borderRadius: '4px',
    '&:hover': {
      background: '#00FFAB',
    },
  },
});

const ChatContainer = ({ messages }) => {
  return (
    <ChatWrapper>
      {messages.map((msg, index) => (
        <MessageBubble
          key={index}
          message={msg.text}
          timestamp={msg.timestamp}
          isSent={msg.isSent}
        />
      ))}
    </ChatWrapper>
  );
};

export default ChatContainer; 
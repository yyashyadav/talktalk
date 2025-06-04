import React from 'react';
import { Box } from '@mui/material';
import talktalkIcon from "../../assets/talktalk-icon.png";
import { useLocation, matchPath } from 'react-router-dom';

// List of all valid routes in the app
const validRoutes = [
  '/',
  '/login',
  '/signup',
  '/chat/:chatId',
  '/groups',
  '/admin',
  '/admin/dashboard',
  '/admin/users',
  '/admin/chats',
  '/admin/messages'
];

const Logo = ({ size = 48, isHeader = false }) => {
  const location = useLocation();
  
  // Check if current path matches any valid route
  const isInvalidRoute = !validRoutes.some(route => matchPath(route, location.pathname));
  
  // Use reversed icon for login, signup, admin pages, and invalid routes
  const isReversedIcon = 
    location.pathname === '/login' || 
    location.pathname === '/signup' || 
    location.pathname.startsWith('/admin') ||
    isInvalidRoute;
      
  const iconSrc = isReversedIcon ? talktalkIcon : talktalkIcon;

  // Different animation values for header vs other places
  const animationValues = isHeader ? {
    duration: '15s',
    translate: {
      '20%': 'translate(0.2px, -0.2px)',
      '40%': 'translate(-0.2px, 0.1px)',
      '60%': 'translate(0.1px, 0.2px)',
      '80%': 'translate(-0.1px, -0.1px)',
    },
    shadowHeight: '5px',
    shadowOpacity: '0.1',
    dropShadow: '0px 1px 2px rgba(0,0,0,0.05)'
  } : {
    duration: '10s',
    translate: {
      '20%': 'translate(0.5px, -0.5px)',
      '40%': 'translate(-0.5px, 0.3px)',
      '60%': 'translate(0.3px, 0.5px)',
      '80%': 'translate(-0.3px, -0.3px)',
    },
    shadowHeight: '10px',
    shadowOpacity: '0.2',
    dropShadow: '0px 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <Box
      sx={{
        width: size,
        height: size,
        position: 'relative',
        animation: `float ${animationValues.duration} ease-in-out infinite`,
        '@keyframes float': {
          '0%': { transform: 'translate(0, 0)' },
          '20%': { transform: animationValues.translate['20%'] },
          '40%': { transform: animationValues.translate['40%'] },
          '60%': { transform: animationValues.translate['60%'] },
          '80%': { transform: animationValues.translate['80%'] },
          '100%': { transform: 'translate(0, 0)' },
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-1px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70%',
          height: animationValues.shadowHeight,
          background: `radial-gradient(ellipse at center, rgba(0,0,0,${animationValues.shadowOpacity}) 0%, rgba(0,0,0,0) 70%)`,
          animation: `shadow ${animationValues.duration} ease-in-out infinite`,
        }
      }}
    >
      <img 
        src={iconSrc}
        alt="TalkTalk"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: animationValues.dropShadow,
        }}
      />
    </Box>
  );
};

export default Logo; 
import React from 'react';
import { Box } from '@mui/material';
import meChatIcon from "../../assets/meChatIcon.png";


const AnimatedLogo = ({ size = 44 }) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        position: 'relative',
        animation: 'float 10s ease-in-out infinite', 
        '@keyframes float': {
          '0%': {
            transform: 'translate(0, 0)',
          },
          '20%': {
            transform: 'translate(0.5px, -0.5px)',
          },
          '40%': {
            transform: 'translate(-0.5px, 0.3px)',
          },
          '60%': {
            transform: 'translate(0.3px, 0.5px)',
          },
          '80%': {
            transform: 'translate(-0.3px, -0.3px)',
          },
          '100%': {
            transform: 'translate(0, 0)',
          },
        },
      
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-1px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70%',
          height: '10px',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 70%)',
          animation: 'shadow 10s ease-in-out infinite',
        }
      }}
    >
      <img 
        src={meChatIcon} 
        alt="MeChat"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))',
        }}
      />
    </Box>
  );
};

export default AnimatedLogo;

import React from 'react';
import { Box, Typography, Skeleton, Stack, useMediaQuery, useTheme } from '@mui/material';
import talktalkIcon from "../../assets/talktalk-icon.png";

const InitialLoader = ({ isLoading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!isLoading) return null;

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        background: 'white',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        opacity: 1,
        transition: 'opacity 0.3s ease-out',
        ...(isMobile && {
          flexDirection: 'column',
        }),
      }}
    >
      {/* Sidebar Skeleton - Hidden on Mobile */}
      {!isMobile && (
        <Box
          sx={{
            width: { 
              xs: "100%",
              sm: "30%",
              md: "30%"
            },
            height: '100%',
            background: '#f8f9fa',
            borderRight: '1px solid #e9ecef',
            p: 2,
            transition: "width 0.3s ease",
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 , mb: 3 }}>
            <Box
              component="img"
              src={talktalkIcon}
              alt="talktalk Logo"
              sx={{
                width: 40,
                height: 40,
                objectFit: 'contain',
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 'bold',
                color: '#212529',
              }}
            >
              TalkTalk
            </Typography>
          </Box>

          {/* Search Skeleton */}
          <Skeleton
            variant="rectangular"
            height={40}
            sx={{
              bgcolor: '#e9ecef',
              borderRadius: 2,
              mb: 2,
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />

          {/* Chat List Skeleton */}
          <Stack spacing={2}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1,
                  borderRadius: 2,
                  background: '#ffffff',
                  animation: `fadeIn ${0.2 * i}s ease-out`,
                }}
              >
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={{ bgcolor: '#e9ecef', animation: 'pulse 1.5s ease-in-out infinite' }}
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={20}
                    sx={{ bgcolor: '#e9ecef', animation: 'pulse 1.5s ease-in-out infinite' }}
                  />
                  <Skeleton
                    variant="text"
                    width="40%"
                    height={16}
                    sx={{ bgcolor: '#e9ecef', animation: 'pulse 1.5s ease-in-out infinite' }}
                  />
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* Main Content Skeleton */}
      <Box 
        sx={{ 
          flex: 1, 
          p: isMobile ? 2 : 3, 
          display: 'flex', 
          flexDirection: 'column', 
          background: '#ffffff', 
          position: 'relative',
          ...(isMobile && {
            overflow: 'auto',
          }),
        }}
      >
        {/* Header Skeleton */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 3,
            p: 2,
            background: '#f8f9fa',
            borderRadius: 2,
            animation: 'fadeIn 0.5s ease-out',
            ...(isMobile && {
              gap: 1,
              p: 1.5,
            }),
          }}
        >
          <Skeleton
            variant="circular"
            width={isMobile ? 40 : 50}
            height={isMobile ? 40 : 50}
            sx={{ bgcolor: '#e9ecef', animation: 'pulse 1.5s ease-in-out infinite' }}
          />
          <Box sx={{ flex: 1 }}>
            <Skeleton
              variant="text"
              width={isMobile ? "40%" : "30%"}
              height={24}
              sx={{ bgcolor: '#e9ecef', animation: 'pulse 1.5s ease-in-out infinite' }}
            />
            <Skeleton
              variant="text"
              width={isMobile ? "30%" : "20%"}
              height={16}
              sx={{ bgcolor: '#e9ecef', animation: 'pulse 1.5s ease-in-out infinite' }}
            />
          </Box>
        </Box>

        {/* Messages Skeleton */}
        <Box 
          sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            ...(isMobile && {
              gap: 1.5,
            }),
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
                gap: isMobile ? 1 : 2,
                maxWidth: isMobile ? '85%' : '70%',
                alignSelf: i % 2 === 0 ? 'flex-start' : 'flex-end',
                animation: `fadeIn ${0.3 * i}s ease-out`,
              }}
            >
              <Skeleton
                variant="circular"
                width={isMobile ? 30 : 35}
                height={isMobile ? 30 : 35}
                sx={{ bgcolor: '#e9ecef', animation: 'pulse 1.5s ease-in-out infinite' }}
              />
              <Box
                sx={{
                  background: i % 2 === 0 ? '#f8f9fa' : '#e9ecef',
                  p: isMobile ? 1.5 : 2,
                  borderRadius: 2,
                }}
              >
                <Skeleton
                  variant="text"
                  width={Math.random() * 100 + 100}
                  height={20}
                  sx={{ bgcolor: '#e9ecef', animation: 'pulse 1.5s ease-in-out infinite' }}
                />
              </Box>
            </Box>
          ))}
        </Box>

        {/* Input Skeleton */}
        <Box
          sx={{
            mt: 3,
            p: isMobile ? 1.5 : 2,
            background: '#f8f9fa',
            borderRadius: 2,
            animation: 'fadeIn 1s ease-out',
          }}
        >
          <Skeleton
            variant="rectangular"
            height={isMobile ? 36 : 40}
            sx={{ bgcolor: '#e9ecef', borderRadius: 2, animation: 'pulse 1.5s ease-in-out infinite' }}
          />
        </Box>
      </Box>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
};

export default InitialLoader;
import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Link, Skeleton, IconButton } from '@mui/material';
import { Launch as LaunchIcon, Close as CloseIcon } from '@mui/icons-material';
import { myblue } from '../../constants/color';

const WebsitePreview = ({ 
  show, 
  anchorEl, 
  url = 'https://mevinay.vercel.app',
  onClose,
  metadata = null // Optional pre-fetched metadata
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewData, setPreviewData] = useState(metadata || {
    title: '',
    description: '',
    image: '',
    launchDate: ''
  });

  useEffect(() => {
    if (show && !metadata) {
      fetchWebsiteMetadata();
    }
  }, [show, url, metadata]);

  const fetchWebsiteMetadata = async () => {
    try {
      setLoading(true);
      // In a real implementation, you would fetch metadata from your backend
      // For now, using mock data
      const data = {
        title: 'Portfolio 2.0',
        description: 'A new portfolio website showcasing latest projects and skills',
        launchDate: '2024'
      };
      setPreviewData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load preview');
    } finally {
      setLoading(false);
    }
  };

  if (!show || !anchorEl) return null;

  // Calculate position dynamically
  const rect = anchorEl.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const previewHeight = 250; // Approximate height of preview
  
  // Position above or below based on available space
  const showAbove = rect.top > previewHeight;
  const top = showAbove ? rect.top - previewHeight - 10 : rect.bottom + 10;

  return (
    <Paper
      role="tooltip"
      aria-label="Website Preview"
      elevation={8}
      sx={{
        position: 'fixed',
        // top: `${top}px`,
        // left: `${rect.left - 100}px`, // Center horizontally
        bottom: '10vh',
        right: '30vw',
        width: '300px',
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        overflow: 'hidden',
        animation: 'fadeIn 0.3s ease-out',
        border: '1px solid rgba(95, 185, 169, 0.2)',
        zIndex: 10000,
        '@keyframes fadeIn': {
          from: {
            opacity: 0,
            transform: `translateY(${showAbove ? '10px' : '-10px'})`,
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      {/* Preview Header */}
      <Box
        sx={{
          p: 1,
          background: 'linear-gradient(-45deg, #5fb9a9, rgb(92, 157, 203))',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LaunchIcon fontSize="small" />
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              fontWeight: 500,
            }}
          >
            {url}
          </Typography>
        </Box>
        {onClose && (
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ color: 'white', p: 0.5 }}
            aria-label="Close preview"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Preview Content */}
      <Box sx={{ p: 2 }}>
        {error ? (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        ) : loading ? (
          <LoadingPreview />
        ) : (
          <>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: '#2c3e50',
                mb: 1,
              }}
            >
              {previewData.title}
            </Typography>
            
            {/* Preview Image/Content */}
            <Box
              sx={{
                width: '100%',
                height: '120px',
                background: 'linear-gradient(-45deg, rgba(95, 185, 169, 0.1), rgba(92, 157, 203, 0.1))',
                borderRadius: '8px',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Typography
                sx={{
                  color: '#94a3b8',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  px: 2,
                }}
              >
                {previewData.description}
              </Typography>
              <AnimatedShimmer />
            </Box>

            {/* Launch Date */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: '#64748b',
                  fontStyle: 'italic',
                }}
              >
                Launching Soon
              </Typography>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '12px',
                  background: 'linear-gradient(-45deg, rgba(95, 185, 169, 0.1), rgba(92, 157, 203, 0.1))',
                  fontSize: '0.75rem',
                  color: myblue,
                  fontWeight: 500,
                }}
              >
                {previewData.launchDate}
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Paper>
  );
};

const LoadingPreview = () => (
  <>
    <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
    <Skeleton 
      variant="rectangular" 
      width="100%" 
      height={120} 
      sx={{ borderRadius: '8px', mb: 1 }} 
    />
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Skeleton variant="text" width="30%" />
      <Skeleton variant="rectangular" width="20%" height={28} sx={{ borderRadius: '12px' }} />
    </Box>
  </>
);

const AnimatedShimmer = () => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
      animation: 'shimmer 2s infinite',
      '@keyframes shimmer': {
        '0%': { transform: 'translateX(-100%)' },
        '100%': { transform: 'translateX(100%)' },
      },
    }}
  />
);

export default WebsitePreview;

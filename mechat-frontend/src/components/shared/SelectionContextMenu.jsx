import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

const MenuItem = ({ icon, text, onClick }) => (
  <Box
    sx={{
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      color: '#2c3e50',
      transition: 'all 0.2s ease',
      '&:hover': {
        background: 'linear-gradient(-45deg, rgba(95, 185, 169, 0.2), rgba(92, 157, 203, 0.2))',
      },
    }}
    onClick={onClick}
  >
    {React.cloneElement(icon, { 
      sx: { 
        fontSize: 18,
        color: '#5fb9a9'
      } 
    })}
    <Typography sx={{ 
      fontSize: '13px',
      fontWeight: 500,
    }}>
      {text}
    </Typography>
  </Box>
);

const SelectionContextMenu = () => {
  const [menu, setMenu] = useState({ show: false, x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');

  // Handle mouse up event when selection ends
  const handleMouseUp = useCallback((e) => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text) {
      setSelectedText(text);
      // Get the selection rectangle
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Position the menu above the selection
      setMenu({
        show: true,
        x: rect.left + (rect.width / 2),
        y: rect.top - 10
      });
    }
  }, []);

  // Handle context menu (right click)
  const handleContextMenu = useCallback((e) => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text) {
      e.preventDefault(); // Prevent browser context menu
      setSelectedText(text);
      setMenu({
        show: true,
        x: e.clientX,
        y: e.clientY
      });
    }
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(selectedText);
    setMenu({ show: false, x: 0, y: 0 });
  }, [selectedText]);

  const handleDeselect = useCallback(() => {
    window.getSelection().removeAllRanges();
    setMenu({ show: false, x: 0, y: 0 });
  }, []);

  const handleSearch = useCallback(() => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedText)}`, '_blank');
    setMenu({ show: false, x: 0, y: 0 });
  }, [selectedText]);

  // Handle clicks outside the menu
  const handleClickOutside = useCallback((e) => {
    if (!e.target.closest('.selection-menu')) {
      setMenu({ show: false, x: 0, y: 0 });
    }
  }, []);

  useEffect(() => {
    // Add event listeners
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Remove event listeners on cleanup
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleMouseUp, handleContextMenu, handleClickOutside]);

  if (!menu.show) return null;

  return (
    <Box
      className="selection-menu"
      sx={{
        position: 'fixed',
        top: menu.y,
        left: menu.x,
        zIndex: 9999, // Increased z-index to be above dialogs and other elements
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        border: '1px solid rgba(95, 185, 169, 0.2)',
        padding: '4px 0',
        transform: 'translate(-50%, -100%)', // Center horizontally and position above
        animation: 'fadeIn 0.15s ease',
        '@keyframes fadeIn': {
          from: {
            opacity: 0,
            transform: 'translate(-50%, -90%)',
          },
          to: {
            opacity: 1,
            transform: 'translate(-50%, -100%)',
          },
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-5px',
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          width: '10px',
          height: '10px',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRight: '1px solid rgba(95, 185, 169, 0.2)',
          borderBottom: '1px solid rgba(95, 185, 169, 0.2)',
        }
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <MenuItem 
        icon={<CopyIcon />} 
        text="Copy" 
        onClick={handleCopy}
      />
      <MenuItem 
        icon={<SearchIcon />} 
        text="Search" 
        onClick={handleSearch}
      />
      <MenuItem 
        icon={<ClearIcon />} 
        text="Deselect" 
        onClick={handleDeselect}
      />
    </Box>
  );
};

export default SelectionContextMenu;
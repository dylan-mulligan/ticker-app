import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Close, Minimize, CropSquare } from '@mui/icons-material';

const CustomToolbar: React.FC = () => {
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    setIsElectron(typeof window !== 'undefined' && (window as any).electronAPI?.isElectron);
  }, []);

  if (!isElectron) return null; // Do not render in a web browser

  const handleMinimize = () => {
    if ((window as any).electronAPI) {
      (window as any).electronAPI.minimizeWindow();
    }
  };

  const handleMaximize = () => {
    if ((window as any).electronAPI) {
      (window as any).electronAPI.maximizeWindow();
    }
  };

  const handleClose = () => {
    if ((window as any).electronAPI) {
      (window as any).electronAPI.closeWindow();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#333',
        color: 'white',
        padding: '0.5rem 1rem',
        WebkitAppRegion: 'drag', // Make the toolbar draggable
      }}
    >
      <Typography variant="h6" sx={{ WebkitAppRegion: 'no-drag' }}>
        Ticker App
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, WebkitAppRegion: 'no-drag' }}>
        <IconButton onClick={handleMinimize} sx={{ color: 'white' }}>
          <Minimize />
        </IconButton>
        <IconButton onClick={handleMaximize} sx={{ color: 'white' }}>
          <CropSquare />
        </IconButton>
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CustomToolbar;

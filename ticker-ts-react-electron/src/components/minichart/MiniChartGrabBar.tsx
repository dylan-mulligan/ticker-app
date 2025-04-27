import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Close, PushPin, PushPinOutlined } from '@mui/icons-material';

const MiniChartGrabBar: React.FC<{ ticker: string; currency: string; isHovered: boolean }> = ({ ticker, currency, isHovered }) => {
  const [alwaysOnTop, setAlwaysOnTop] = useState(false);

  useEffect(() => {
    // Initialize alwaysOnTop from localStorage
    const savedAlwaysOnTop = localStorage.getItem(`${ticker}-${currency}-alwaysOnTop`);
    if (savedAlwaysOnTop !== null) {
      const alwaysOnTopState = savedAlwaysOnTop === 'true';
      setAlwaysOnTop(alwaysOnTopState);
      if ((window as any).electronAPI) {
        (window as any).electronAPI.setChartInitialAlwaysOnTop(ticker, currency, alwaysOnTopState);
      }
    }
  }, [ticker, currency]);

  const handleAlwaysOnTopToggle = () => {
    const newAlwaysOnTop = !alwaysOnTop;
    setAlwaysOnTop(newAlwaysOnTop);
    localStorage.setItem(`${ticker}-${currency}-alwaysOnTop`, newAlwaysOnTop.toString());
    if ((window as any).electronAPI) {
      (window as any).electronAPI.setChartAlwaysOnTop(ticker, currency, newAlwaysOnTop);
    }
  };

  const handleClose = () => {
    if ((window as any).electronAPI) {
      (window as any).electronAPI.closeChartWindow(ticker, currency);
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
        height: '30px',
        padding: '0 8px',
        opacity: 1, // isHovered ? 1 : 0
        WebkitAppRegion: 'drag', // isHovered ? 'drag' : 'none'
      }}
    >
      <Typography variant="body2" sx={{ WebkitAppRegion: 'no-drag' }}>
        {`${ticker.toUpperCase()} - ${currency.toUpperCase()}`}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, WebkitAppRegion: 'no-drag' }}>
        <IconButton
          sx={{ color: 'white', padding: '4px' }}
          onClick={handleAlwaysOnTopToggle}
          title="Toggle Always on Top"
        >
          {alwaysOnTop ? <PushPin /> : <PushPinOutlined />}
        </IconButton>
        <IconButton
          sx={{ color: 'white', padding: '4px' }}
          onClick={handleClose}
          title="Close Window"
        >
          <Close />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MiniChartGrabBar;

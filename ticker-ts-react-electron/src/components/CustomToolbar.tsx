import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography, Select, MenuItem } from '@mui/material';
import {
  Close,
  Minimize,
  CropSquare,
  Brightness4,
  Brightness7,
  PushPin,
  PushPinOutlined,
  ShowChart
} from '@mui/icons-material';
import { currencyIconMap } from '../utils/currencyIconMap'; // Import the map

const CustomToolbar: React.FC<{ 
  currency: string; 
  setCurrency: (currency: string) => void; 
  darkMode: boolean; 
  setDarkMode: (mode: boolean) => void; 
}> = ({ currency, setCurrency, darkMode, setDarkMode }) => {
  const [isElectron, setIsElectron] = useState(false);
  const [alwaysOnTop, setAlwaysOnTop] = useState(false);

  useEffect(() => {
    setIsElectron(typeof window !== 'undefined' && (window as any).electronAPI?.isElectron);

    // Initialize alwaysOnTop and darkMode from localStorage
    const savedAlwaysOnTop = localStorage.getItem('alwaysOnTop');
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedAlwaysOnTop !== null) {
      const alwaysOnTopState = savedAlwaysOnTop === 'true';
      setAlwaysOnTop(alwaysOnTopState);
      if (isElectron && (window as any).electronAPI) {
        (window as any).electronAPI.setInitialAlwaysOnTop(alwaysOnTopState);
      }
    }
    if (savedDarkMode !== null) setDarkMode(savedDarkMode === 'true');
  }, [isElectron]);

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

  const handleAlwaysOnTopToggle = () => {
    const newAlwaysOnTop = !alwaysOnTop;
    setAlwaysOnTop(newAlwaysOnTop);
    localStorage.setItem('alwaysOnTop', newAlwaysOnTop.toString());
    if (isElectron && (window as any).electronAPI) {
      (window as any).electronAPI.setAlwaysOnTop(newAlwaysOnTop);
    }
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  if (!isElectron) return null; // Do not render in a web browser

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#333',
        color: 'white',
        padding: '0.5rem 1rem',
        WebkitAppRegion: 'drag',
        height: '40px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ShowChart sx={{ marginRight: 1 }} />
        <Typography variant="h6" sx={{ WebkitAppRegion: 'no-drag' }}>
          Ticker App
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', WebkitAppRegion: 'no-drag' }}>
        <Select
          id="currency-select-toolbar"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          sx={{
            color: 'white',
            backgroundColor: 'transparent',
            border: 'none',
            minWidth: 70,
            height: 30
          }}
        >
          {Object.entries(currencyIconMap).map(([key, symbol]) => (
            <MenuItem key={key} value={key}>
              <Typography variant="h6" sx={{ pl: 1 }}>
                {`${symbol}`}
              </Typography>
            </MenuItem>
          ))}
        </Select>
        <IconButton sx={{ color: 'white' }} onClick={handleDarkModeToggle}>
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
        <IconButton sx={{ color: 'white' }} onClick={handleAlwaysOnTopToggle}>
          {alwaysOnTop ? <PushPin /> : <PushPinOutlined />}
        </IconButton>
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


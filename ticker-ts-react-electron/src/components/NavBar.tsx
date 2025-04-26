import React, { useState, useEffect } from 'react';
import {
    AppBar, Toolbar, Typography, Select,
    MenuItem, Box, IconButton
} from '@mui/material';
import { ShowChart, Brightness4, Brightness7, PushPin, PushPinOutlined } from '@mui/icons-material'; // Import icons
import { currencyIconMap } from '../utils/currencyIconMap'; // Import the map

interface NavBarProps {
  currency: string;
  setCurrency: (currency: string) => void;
  darkMode: boolean; // Add dark mode prop
  setDarkMode: (mode: boolean) => void; // Add dark mode setter prop
}

const NavBar: React.FC<NavBarProps> = ({ currency, setCurrency, darkMode, setDarkMode }) => {
  const [isElectron, setIsElectron] = useState(false);
  const [alwaysOnTop, setAlwaysOnTop] = useState(false);

  useEffect(() => {
    // Check if running in Electron
    setIsElectron(typeof window !== 'undefined' && (window as any).electronAPI?.isElectron);

    // Initialize alwaysOnTop and darkMode from localStorage
    const savedAlwaysOnTop = localStorage.getItem('alwaysOnTop');
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedAlwaysOnTop !== null) {
      const alwaysOnTopState = savedAlwaysOnTop === 'true';
      setAlwaysOnTop(alwaysOnTopState);
      if (isElectron && (window as any).electronAPI) {
        (window as any).electronAPI.setInitialAlwaysOnTop(alwaysOnTopState); // Send initial state to Electron
      }
    }
    if (savedDarkMode !== null) setDarkMode(savedDarkMode === 'true');
  }, [isElectron]); // Add isElectron as a dependency

  const handleAlwaysOnTopToggle = () => {
    const newAlwaysOnTop = !alwaysOnTop;
    setAlwaysOnTop(newAlwaysOnTop);
    localStorage.setItem('alwaysOnTop', newAlwaysOnTop.toString()); // Save to localStorage
    if (isElectron && (window as any).electronAPI) {
      (window as any).electronAPI.setAlwaysOnTop(newAlwaysOnTop);
    }
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString()); // Save to localStorage
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <ShowChart sx={{ marginRight: 1 }} /> {/* Add the stock logo */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Ticker App
        </Typography>

        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
          <Select
            id="currency-select-navbar"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            sx={{
              color: 'white',
              backgroundColor: 'transparent', // Make the select transparent
              border: 'none',
              minWidth: 120
            }}
          >
            {Object.entries(currencyIconMap).map(([key, symbol]) => (
              <MenuItem key={key} value={key}>
                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                  {`${symbol}\u00A0\u00A0\u00A0\u00A0${key.toUpperCase()}`}
                </Typography>
              </MenuItem>
            ))}
          </Select>
          <IconButton
            sx={{ color: 'white' }}
            onClick={handleDarkModeToggle} // Use the new handler
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />} {/* Switch icons */}
          </IconButton>
          {isElectron && (
            <IconButton
              sx={{ color: 'white' }}
              onClick={handleAlwaysOnTopToggle} // Toggle always on top
            >
              {alwaysOnTop ? <PushPin /> : <PushPinOutlined />} {/* Switch icons */}
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;


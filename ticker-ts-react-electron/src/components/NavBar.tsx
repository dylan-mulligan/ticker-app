import React from 'react';
import { AppBar, Toolbar, Typography, Select, MenuItem, Box, IconButton } from '@mui/material';
import { ShowChart, Brightness4, Brightness7 } from '@mui/icons-material'; // Import icons
import { currencyIconMap } from '../utils/currencyIconMap'; // Import the map

interface NavBarProps {
  currency: string;
  setCurrency: (currency: string) => void;
  darkMode: boolean; // Add dark mode prop
  setDarkMode: (mode: boolean) => void; // Add dark mode setter prop
}

const NavBar: React.FC<NavBarProps> = ({ currency, setCurrency, darkMode, setDarkMode }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <ShowChart sx={{ marginRight: 1 }} /> {/* Add the stock logo */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Ticker App
        </Typography>

        <Box sx={{gap: 2, display: 'flex', alignItems: 'center' }}>
          <Select
            id="currency-select-navbar"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              minWidth: 120
            }}
          >
            {Object.entries(currencyIconMap).map(([key, symbol]) => (
              <MenuItem key={key} value={key}>
                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                  {symbol} {key.toUpperCase()}
                </Typography>
              </MenuItem>
            ))}
          </Select>
          <IconButton
            sx={{ color: 'white' }}
            onClick={() => setDarkMode(!darkMode)} // Toggle dark mode
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />} {/* Switch icons */}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;


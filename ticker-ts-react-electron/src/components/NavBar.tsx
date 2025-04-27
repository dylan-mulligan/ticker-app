import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Select,
  MenuItem, Box, IconButton
} from '@mui/material';
import { ShowChart, Brightness4, Brightness7 } from '@mui/icons-material';
import { currencyIconMap } from '../utils/currencyIconMap';
import SideNavMenu from "./SideNavMenu";

interface NavBarProps {
  currency: string;
  setCurrency: (currency: string) => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currency, setCurrency, darkMode, setDarkMode }) => {
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    setIsElectron(typeof window !== 'undefined' && (window as any).electronAPI?.isElectron);
  }, []);

  if (isElectron) return null; // Do not render in Electron

  return (
    <AppBar position="static">
      <Toolbar>
        <ShowChart sx={{ marginRight: 1 }} />
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
              backgroundColor: 'transparent',
              border: 'none',
              minWidth: 120,
              height: 45
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
          <IconButton sx={{ color: 'white' }} onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <SideNavMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;

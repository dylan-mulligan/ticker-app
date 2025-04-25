import React from 'react';
import { AppBar, Toolbar, Typography, Select, MenuItem, Box } from '@mui/material';

interface NavBarProps {
  currency: string;
  setCurrency: (currency: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currency, setCurrency }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Ticker App
        </Typography>
        <Box>
          <Select
            id="currency-select-navbar"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            sx={{ color: 'white', borderColor: 'white', minWidth: 120 }}
          >
            <MenuItem value="usd">USD</MenuItem>
            <MenuItem value="eur">EUR</MenuItem>
          </Select>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;

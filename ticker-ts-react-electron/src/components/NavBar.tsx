import React from 'react';
import { AppBar, Toolbar, Typography, Select, MenuItem, Box } from '@mui/material';

interface NavBarProps {
  currency: string;
  setCurrency: (currency: string) => void;
}

const currencyIconMap: { [key: string]: string } = {
  usd: '$',
  eur: '€',
  gbp: '£',
};

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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;


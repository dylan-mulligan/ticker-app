import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import TickerChartContainer from './TickerChartContainer';

function App() {
  const [currency, setCurrency] = useState('usd');
  const tickers = ['bitcoin'];

  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Ticker App
        </Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Select
          id="currency-select"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="usd">USD</MenuItem>
          <MenuItem value="eur">EUR</MenuItem>
        </Select>
      </Box>
      <Box>
        {tickers.map((ticker, index) => (
          <TickerChartContainer
            key={ticker}
            ticker={ticker}
            currency={currency}
            fetchData={index === 0} // Only the first chart fetches data
          />
        ))}
      </Box>
    </Box>
  );
}

export default App;

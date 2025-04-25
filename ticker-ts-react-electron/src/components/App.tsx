import React, { useState } from 'react';
import { Box, Typography, FormGroup } from '@mui/material';
import TickerChartContainer from './TickerChartContainer';
import NavBar from './NavBar';
import TickerCheckbox from './TickerCheckbox'; // Import the new component

function App() {
  const [currency, setCurrency] = useState('usd');
  const [selectedTickers, setSelectedTickers] = useState<string[]>(['bitcoin']);
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);

  const handleTickerChange = (ticker: string) => {
    setSelectedTickers((prev) =>
      prev.includes(ticker) ? prev.filter((t) => t !== ticker) : [...prev, ticker]
    );
  };

  const handleStockChange = (stock: string) => {
    setSelectedStocks((prev) =>
      prev.includes(stock) ? prev.filter((s) => s !== stock) : [...prev, stock]
    );
  };

  return (
    <Box>
      <NavBar currency={currency} setCurrency={setCurrency} />
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <Box
          sx={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            p: 3,
            maxWidth: 600,
            margin: '0 auto',
            mb: 4,
          }}
        >
          <Typography variant="h6">
            Cryptocurrencies
          </Typography>
          <FormGroup row sx={{ justifyContent: 'center' }}>
            {['bitcoin', 'ethereum', 'dogecoin'].map((ticker) => (
              <TickerCheckbox
                key={ticker}
                label={ticker.charAt(0).toUpperCase() + ticker.slice(1)}
                checked={selectedTickers.includes(ticker)}
                onChange={() => handleTickerChange(ticker)}
              />
            ))}
          </FormGroup>
          <Typography variant="h6">
            Stocks
          </Typography>
          <FormGroup row sx={{ justifyContent: 'center' }}>
            {['AAPL', 'GOOGL', 'AMZN'].map((stock) => (
              <TickerCheckbox
                key={stock}
                label={stock}
                checked={selectedStocks.includes(stock)}
                onChange={() => handleStockChange(stock)}
              />
            ))}
          </FormGroup>
        </Box>
        <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {selectedTickers.map((ticker, index) => (
            <TickerChartContainer
              key={ticker}
              ticker={ticker}
              currency={currency}
              fetchData={true}
              delay={index * 2000}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default App;

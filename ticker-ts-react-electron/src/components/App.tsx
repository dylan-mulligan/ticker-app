import React, { useState } from 'react';
import { Box, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import TickerChartContainer from './TickerChartContainer';
import NavBar from './NavBar';

function App() {
  const [currency, setCurrency] = useState('usd');
  const [selectedTickers, setSelectedTickers] = useState<string[]>(['bitcoin']);

  const handleTickerChange = (ticker: string) => {
    setSelectedTickers((prev) =>
      prev.includes(ticker) ? prev.filter((t) => t !== ticker) : [...prev, ticker]
    );
  };

  return (
    <Box>
      <NavBar currency={currency} setCurrency={setCurrency} />
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <FormGroup row sx={{ justifyContent: 'center', mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedTickers.includes('bitcoin')}
                onChange={() => handleTickerChange('bitcoin')}
              />
            }
            label="Bitcoin"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedTickers.includes('ethereum')}
                onChange={() => handleTickerChange('ethereum')}
              />
            }
            label="Ethereum"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedTickers.includes('dogecoin')}
                onChange={() => handleTickerChange('dogecoin')}
              />
            }
            label="Dogecoin"
          />
        </FormGroup>
        <Box>
          {selectedTickers.map((ticker, index) => (
            <TickerChartContainer
              key={ticker}
              ticker={ticker}
              currency={currency}
              fetchData={true} // All charts fetch data
              delay={index * 2000} // Introduce a delay for subsequent charts
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default App;

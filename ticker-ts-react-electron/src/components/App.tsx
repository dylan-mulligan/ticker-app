import React, { useState } from 'react';
import { Box } from '@mui/material';
import TickerChartContainer from './TickerChartContainer';
import NavBar from './NavBar';
import ChartSelectionBox from './ChartSelectionBox'; // Import the new component

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
        <ChartSelectionBox
          selectedTickers={selectedTickers}
          selectedStocks={selectedStocks}
          onTickerChange={handleTickerChange}
          onStockChange={handleStockChange}
        />
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

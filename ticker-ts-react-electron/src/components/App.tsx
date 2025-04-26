import React, { useState } from 'react';
import { Box, CssBaseline, createTheme, ThemeProvider, Typography } from '@mui/material';
import TickerChartContainer from './TickerChartContainer';
import NavBar from './NavBar';
import ChartSelectionBox from './ChartSelectionBox'; // Import the new component

function App() {
  const [currency, setCurrency] = useState('usd');
  const [selectedTickers, setSelectedTickers] = useState<string[]>(['bitcoin']);
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false); // Add dark mode state
  const [daysToDisplay, setDaysToDisplay] = useState(14); // Add state for daysToDisplay

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light', // Use darkMode state for theme
    },
  });

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>
        <NavBar
          currency={currency}
          setCurrency={setCurrency}
          darkMode={darkMode}
          setDarkMode={setDarkMode} // Pass dark mode props to NavBar
        />
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
                daysToDisplay={daysToDisplay} // Pass daysToDisplay to TickerChartContainer
              />
            ))}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

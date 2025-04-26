import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import TickerChartContainer from './TickerChartContainer';
import NavBar from './NavBar';
import ChartSelectionBox from './ChartSelectionBox';

function App() {
  // State for selected currency
  const [currency, setCurrency] = useState('usd');

  // State for selected tickers, initialized from localStorage
  const [selectedTickers, setSelectedTickers] = useState<string[]>(() => {
    const savedTickers = localStorage.getItem('selectedTickers');
    return savedTickers ? JSON.parse(savedTickers) : ['bitcoin'];
  });

  // State for selected stocks, initialized from localStorage
  const [selectedStocks, setSelectedStocks] = useState<string[]>(() => {
    const savedStocks = localStorage.getItem('selectedStocks');
    return savedStocks ? JSON.parse(savedStocks) : [];
  });

  // State for dark mode toggle
  const [darkMode, setDarkMode] = useState(false);

  // State for the number of days to display in charts
  const [daysToDisplay, setDaysToDisplay] = useState(14);

  // State for managing the render queue of tickers
  const [renderQueue, setRenderQueue] = useState<string[]>([]);

  // Theme configuration based on dark mode
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  // Handle changes to selected tickers
  const handleTickerChange = (ticker: string) => {
    setSelectedTickers((prev) =>
      prev.includes(ticker) ? prev.filter((t) => t !== ticker) : [...prev, ticker]
    );
  };

  // Handle changes to selected stocks
  const handleStockChange = (stock: string) => {
    setSelectedStocks((prev) =>
      prev.includes(stock) ? prev.filter((s) => s !== stock) : [...prev, stock]
    );
  };

  // Persist selected tickers to localStorage
  useEffect(() => {
    localStorage.setItem('selectedTickers', JSON.stringify(selectedTickers));
  }, [selectedTickers]);

  // Persist selected stocks to localStorage
  useEffect(() => {
    localStorage.setItem('selectedStocks', JSON.stringify(selectedStocks));
  }, [selectedStocks]);

  // Manage the render queue with delays for smoother rendering
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (renderQueue.length < selectedTickers.length) {
      if (renderQueue.length === 0) {
        setRenderQueue([selectedTickers[0]]);
      } else {
        const nextTicker = selectedTickers[renderQueue.length];
        timeoutId = setTimeout(() => {
          setRenderQueue((prev) => [...prev, nextTicker]);
        }, 2000);
      }
    }
    return () => clearTimeout(timeoutId);
  }, [renderQueue, selectedTickers]);

  // Reset the render queue when selected tickers change
  useEffect(() => {
    setRenderQueue([]);
  }, [selectedTickers]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>
        <NavBar
          currency={currency}
          setCurrency={setCurrency}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <Box sx={{ textAlign: 'center', p: 2 }}>
          <ChartSelectionBox
            selectedTickers={selectedTickers}
            selectedStocks={selectedStocks}
            onTickerChange={handleTickerChange}
            onStockChange={handleStockChange}
          />
          <Box
            sx={{
              gap: 4,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {renderQueue.map((ticker) => (
              <TickerChartContainer
                key={ticker}
                ticker={ticker}
                currency={currency}
                fetchData={true}
                daysToDisplay={daysToDisplay}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

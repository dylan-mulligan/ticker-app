import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, createTheme, ThemeProvider, Typography } from '@mui/material';
import TickerChartContainer from './TickerChartContainer';
import NavBar from './NavBar';
import ChartSelectionBox from './ChartSelectionBox'; // Import the new component

function App() {
  const [currency, setCurrency] = useState('usd');
  const [selectedTickers, setSelectedTickers] = useState<string[]>(() => {
    const savedTickers = localStorage.getItem('selectedTickers');
    return savedTickers ? JSON.parse(savedTickers) : ['bitcoin'];
  });
  const [selectedStocks, setSelectedStocks] = useState<string[]>(() => {
    const savedStocks = localStorage.getItem('selectedStocks');
    return savedStocks ? JSON.parse(savedStocks) : [];
  });
  const [darkMode, setDarkMode] = useState(false); // Add dark mode state
  const [daysToDisplay, setDaysToDisplay] = useState(14); // Add state for daysToDisplay
  const [renderQueue, setRenderQueue] = useState<string[]>([]); // Add state for render queue

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

  useEffect(() => {
    localStorage.setItem('selectedTickers', JSON.stringify(selectedTickers));
  }, [selectedTickers]);

  useEffect(() => {
    localStorage.setItem('selectedStocks', JSON.stringify(selectedStocks));
  }, [selectedStocks]);

  // Effect to manage the render queue with delays
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (renderQueue.length < selectedTickers.length) {
      if (renderQueue.length === 0) {
        // Immediately add the first ticker without delay
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

  useEffect(() => {
    setRenderQueue([]); // Reset the render queue when selectedTickers changes
  }, [selectedTickers]);

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
          <Box sx={{ gap: 4, display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
            {renderQueue.map((ticker, index) => (
              <TickerChartContainer
                key={ticker}
                ticker={ticker}
                currency={currency}
                fetchData={true}
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


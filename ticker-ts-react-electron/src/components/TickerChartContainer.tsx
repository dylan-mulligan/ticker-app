import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Slider, Typography } from '@mui/material'; // Import Slider and Typography
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AreaChartIcon from '@mui/icons-material/AreaChart';
import Chart from './Chart';
import PriceDisplay from './PriceDisplay';

interface TickerChartContainerProps {
  ticker: string;
  currency: string;
  fetchData: boolean;
  delay: number;
  daysToDisplay: number; // Add daysToDisplay prop
}

const TickerChartContainer: React.FC<TickerChartContainerProps> = ({
  ticker,
  currency,
  fetchData,
  delay,
  daysToDisplay, // Destructure daysToDisplay
}) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [prices, setPrices] = useState<number[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [localDaysToDisplay, setDaysToDisplay] = useState<number>(daysToDisplay); // Add local state for daysToDisplay

  const cycleChartType = () => {
    setChartType((prevType) => (prevType === 'line' ? 'bar' : prevType === 'bar' ? 'area' : 'line'));
  };

  const getChartIcon = () => {
    switch (chartType) {
      case 'bar':
        return <BarChartIcon />;
      case 'area':
        return <AreaChartIcon />;
      default:
        return <ShowChartIcon />;
    }
  };

  useEffect(() => {
    if (!fetchData) return;

    const timeoutId = setTimeout(() => {
      const fetchDataAsync = async () => {
        const days = 30; // Total days to query from the API
        try {
          const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${ticker}/market_chart`, {
            params: { vs_currency: currency, days },
          });
          const data = response.data;

          // Get the timestamp for `localDaysToDisplay` days ago
          const nDaysAgo = new Date();
          nDaysAgo.setDate(nDaysAgo.getDate() - localDaysToDisplay);
          const nDaysAgoTimestamp = nDaysAgo.getTime();

          // Filter data for the last `localDaysToDisplay` days
          const filteredData = data.prices.filter(
            (price: [number, number]) => price[0] >= nDaysAgoTimestamp
          );

          // Map filtered data to labels and prices
          const newLabels = filteredData.map((price: [number, number]) =>
            new Date(price[0]).toLocaleDateString()
          );
          const newPrices = filteredData.map((price: [number, number]) => price[1]);

          setLabels(newLabels);
          setPrices(newPrices);
          setCurrentPrice(newPrices[newPrices.length - 1]);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchDataAsync();
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [ticker, currency, fetchData, delay, localDaysToDisplay]); // Add localDaysToDisplay to dependencies

  return (
    <Box
      id={`chart-container-${ticker}`}
      sx={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        p: 3,
        maxWidth: 600,
        ml: 4,
        mr: 4,
        width: '500px'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <PriceDisplay
          ticker={ticker}
          currentPrice={currentPrice}
          currency={currency}
        />
        <Box sx={{ width: 200, marginTop: 0.5 }}>
          <Typography>Days to Display</Typography>
          <Slider
              value={localDaysToDisplay}
              onChange={(event, value) => setDaysToDisplay(value as number)} // Update localDaysToDisplay locally
              min={1}
              max={30}
              valueLabelDisplay="auto"
          />
        </Box>
        <Button variant="contained" onClick={cycleChartType} sx={{ marginBottom: 2 }}>
          {getChartIcon()}
        </Button>
      </Box>
      <Chart ticker={ticker} currency={currency} labels={labels} prices={prices} chartType={chartType} />
    </Box>
  );
};

export default TickerChartContainer;


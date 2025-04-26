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
  daysToDisplay: number; // Add daysToDisplay prop
}

// Shared request queue to manage API calls
const requestQueue: (() => Promise<void>)[] = [];
let isProcessingQueue = false;

const processQueue = async () => {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  while (requestQueue.length > 0) {
    const nextRequest = requestQueue.shift();
    if (nextRequest) {
      await nextRequest();
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay between requests
    }
  }

  isProcessingQueue = false;
};

const TickerChartContainer: React.FC<TickerChartContainerProps> = ({
  ticker,
  currency,
  fetchData,
  daysToDisplay,
}) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [prices, setPrices] = useState<number[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [localDaysToDisplay, setDaysToDisplay] = useState<number>(daysToDisplay);

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

  const fetchChartData = async () => {
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

  useEffect(() => {
    if (!fetchData) return;

    const request = async () => {
      await fetchChartData();
    };

    requestQueue.push(request);
    processQueue();
  }, [ticker, currency, fetchData]); // Trigger only when fetching new data

  useEffect(() => {
    // Update chart without delay when localDaysToDisplay changes
    fetchChartData();
  }, [localDaysToDisplay]);

  return (
    <Box
      id={`chart-container-${ticker}`}
      sx={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        p: 3,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <PriceDisplay ticker={ticker} currentPrice={currentPrice} currency={currency} />
        <Box sx={{ width: 175, marginTop: 0.5 }}>
          <Typography>Days to Display</Typography>
          <Slider
            value={localDaysToDisplay}
            onChange={(event, value) => setDaysToDisplay(value as number)}
            min={1}
            max={30}
            valueLabelDisplay="auto"
          />
        </Box>
        <Button variant="contained" onClick={cycleChartType} sx={{ marginBottom: 2, borderRadius: 2 }}>
          {getChartIcon()}
        </Button>
      </Box>
      <Chart ticker={ticker} currency={currency} labels={labels} prices={prices} chartType={chartType} />
    </Box>
  );
};

export default TickerChartContainer;

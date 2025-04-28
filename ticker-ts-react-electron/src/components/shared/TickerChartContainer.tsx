import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Box, Button, Slider, Typography} from '@mui/material';
import { IconCurrencyBitcoin, IconCurrencyEthereum, IconCurrencyDogecoin } from '@tabler/icons-react';
import Chart from '../chart/Chart';
import PriceDisplay from '../chart/PriceDisplay';
import MiniChartControls from '../minichart/MiniChartControls';
import { ChartType, ChartDisplayType } from '../../constants/globalConsts';
import { getChartIcon } from '../../utils/chartIconUtils';
import { getTickerColor } from '../../utils/tickerColorUtils';

interface TickerChartContainerProps {
  ticker: string;
  currency: string;
  fetchData: boolean;
  daysToDisplay: number;
  initialChartType?: ChartType;
  displayType?: ChartDisplayType;
  darkMode?: boolean; // Optional dark mode prop
}

// Shared request queue to manage API calls
const requestQueue: (() => Promise<void>)[] = [];
let isProcessingQueue = false;

// Function to process the request queue to avoid rate limiting issues
const processQueue = async () => {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  while (requestQueue.length > 0) {
    const nextRequest = requestQueue.shift();
    if (nextRequest) {
      await nextRequest();
      await new Promise((resolve) => setTimeout(resolve, 2100));
    }
  }

  isProcessingQueue = false;
};

// Get the appropriate cryptocurrency icon based on the ticker
const getCryptoIcon = (ticker: string) => {
  switch (ticker.toLowerCase()) {
    case 'bitcoin':
      return <IconCurrencyBitcoin size={28} />;
    case 'ethereum':
      return <IconCurrencyEthereum size={28} />;
    default:
      return <IconCurrencyDogecoin size={28} />;
  }
};

const TickerChartContainer: React.FC<TickerChartContainerProps> = ({
  ticker,
  currency,
  fetchData,
  daysToDisplay,
  initialChartType = 'line',
  displayType = 'default',
  darkMode = false, // Default to false if not provided
}) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [prices, setPrices] = useState<number[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  const [localDaysToDisplay, setDaysToDisplay] = useState<number>(daysToDisplay);

  const isMini = displayType === 'mini-electron' || displayType === 'mini-browser';
  const client = displayType.split('-')[1];

  // Cycle through chart types (line, bar, area)
  const cycleChartType = () => {
    setChartType((prevType) => (prevType === 'line' ? 'bar' : prevType === 'bar' ? 'area' : 'line'));
  };

  // Fetch chart data from the API
  const fetchChartData = async () => {
    // Total days to query from the API
    const days = 30;

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

  // Fetch data when the component mounts or dependencies change
  useEffect(() => {
    if (!fetchData) return;

    const request = async () => {
      await fetchChartData();
    };

    requestQueue.push(request);
    processQueue();
  }, [ticker, currency, fetchData]);

  // Update chart when `localDaysToDisplay` changes
  useEffect(() => {
    fetchChartData();
  }, [localDaysToDisplay]);

  const handleRangeChange = (days: number) => {
    setDaysToDisplay(days);
  };

  return (
    <Box
      id={`chart-container-${ticker}`}
      sx={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: client === 'browser' ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.15)',
        p: isMini ? 1 : 3,
        width: 'auto',
        height: isMini ? 'calc(100vh - 50px)' : 'auto',
        backgroundColor: 'rgba(161,161,161,0.35)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isMini ? 'space-between' : 'flex-start',
        margin: client === 'browser' ? 0 : 'inherit',
      }}
    >
      <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            gap: isMini ? 1 : 2,
            alignItems: isMini ? 'center' : 'flex-start',
            pl: isMini ? 1 : 0,
            pr: isMini ? 1 : 0,
            mb: 0.5
          }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
              variant={isMini ? 'subtitle1' : 'h6'}
              sx={{
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                marginBottom: isMini ? 0 : 2,
                width: 'max-content',
                color: getTickerColor(ticker, darkMode), // Apply color based on ticker
              }}
          >
            {getCryptoIcon(ticker)} {ticker.toUpperCase() + " (" + currency.toUpperCase() + ")"}
          </Typography>
        </Box>
        <PriceDisplay
            ticker={ticker}
            currentPrice={currentPrice}
            currency={currency}
            isMini={isMini}
        />
        {!isMini ? (
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
        ) : (
          <MiniChartControls
            onRangeChange={handleRangeChange}
            selectedRange={localDaysToDisplay}
            onCycleChartType={cycleChartType} // Pass cycleChartType to MiniChartControls
            currentChartType={chartType} // Pass current chart type
          />
        )}

        {!isMini && (
          <Button
            variant="contained"
            onClick={cycleChartType}
            sx={{
              marginBottom: isMini ? 0 : 2,
              borderRadius: 2,
              padding: isMini ? '4px' : '8px',
              minWidth: isMini ? 'auto' : undefined,
            }}
          >
            {getChartIcon(chartType, 24)}
          </Button>
        )}
      </Box>
      <Chart
        currency={currency}
        labels={labels}
        prices={prices}
        chartType={chartType}
        isMini={isMini}
      />
    </Box>
  );
};

export default TickerChartContainer;

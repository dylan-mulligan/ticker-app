import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Slider, Typography, IconButton } from '@mui/material';
import { BarChartRounded, ShowChartRounded, AreaChartRounded, OpenInNew } from '@mui/icons-material';
import { IconCurrencyBitcoin, IconCurrencyEthereum, IconCurrencyDogecoin } from '@tabler/icons-react';
import Chart from './Chart';
import PriceDisplay from './PriceDisplay';
import MiniChartControls from './MiniChartControls';
import { ChartType } from '../constants/globalConsts'; // Import ChartType

interface TickerChartContainerProps {
  ticker: string;
  currency: string;
  fetchData: boolean;
  daysToDisplay: number;
  initialChartType?: ChartType; // Use ChartType
  isMini?: boolean;
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
      await new Promise((resolve) => setTimeout(resolve, 2100)); // 2-second delay between requests
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
  isMini = false,
}) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [prices, setPrices] = useState<number[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [chartType, setChartType] = useState<ChartType>(initialChartType); // Use ChartType
  const [localDaysToDisplay, setDaysToDisplay] = useState<number>(daysToDisplay);

  // Cycle through chart types (line, bar, area)
  const cycleChartType = () => {
    setChartType((prevType) => (prevType === 'line' ? 'bar' : prevType === 'bar' ? 'area' : 'line'));
  };

  // Get the appropriate chart icon based on the chart type
  const getChartIcon = () => {
    switch (chartType) {
      case 'bar':
        return <BarChartRounded />;
      case 'area':
        return <AreaChartRounded />;
      default:
        return <ShowChartRounded />;
    }
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
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        p: isMini ? 1 : 3,
        width: 'auto',
        height: 'auto',
        backgroundColor: 'rgba(161,161,161,0.35)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isMini ? 'space-between' : 'flex-start',
      }}
    >
      {!isMini && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              marginBottom: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {getCryptoIcon(ticker)} {ticker.toUpperCase() + " (" + currency.toUpperCase() + ")"}
          </Typography>
        </Box>
      )}
      {!isMini && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 2,
            alignItems: isMini ? 'center' : 'flex-start',
            pl: isMini ? 1 : 0,
            pr: isMini ? 1 : 0,
          }}
        >
          <PriceDisplay
              ticker={ticker}
              currentPrice={currentPrice}
              currency={currency}
          />
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
            {getChartIcon()}
          </Button>
        </Box>
        )}
      <Chart
        currency={currency}
        labels={labels}
        prices={prices}
        chartType={chartType}
        isMini={isMini}
      />
      {isMini && (
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
            justifyContent: 'flex-start',
            mt: 0
          }}>
            <Typography
                variant="subtitle1"
                sx={{
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
            >
              {getCryptoIcon(ticker)} {ticker.toUpperCase() + " (" + currency.toUpperCase() + ")"}
            </Typography>
            <PriceDisplay
                ticker={ticker}
                currentPrice={currentPrice}
                currency={currency}
                isMini={isMini}
            />
            <MiniChartControls
              onRangeChange={handleRangeChange}
              selectedRange={localDaysToDisplay}
            />
            <Button
                variant="outlined"
                onClick={cycleChartType}
                sx={{
                  marginBottom: isMini ? 0 : 2,
                  borderRadius: 2,
                  padding: isMini ? '4px' : '8px',
                  minWidth: isMini ? 'auto' : undefined,
                  backgroundColor: 'rgba(147,163,255,0.13)',
                }}
            >
              {getChartIcon()}
            </Button>
          </Box>
      )}
    </Box>
  );
};

export default TickerChartContainer;


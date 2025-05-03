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

// Shared request queue to manage API calls and avoid rate limiting
const requestQueue: (() => Promise<void>)[] = [];
let isProcessingQueue = false;

const processQueue = async () => {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  while (requestQueue.length > 0) {
    const nextRequest = requestQueue.shift();
    if (nextRequest) {
      await nextRequest();
      await new Promise((resolve) => setTimeout(resolve, 2100)); // Delay to prevent rate limiting
    }
  }

  isProcessingQueue = false;
};

// Get the appropriate cryptocurrency icon based on the ticker
const getCryptoIcon = (ticker: string, size = 28) => {
  switch (ticker.toLowerCase()) {
    case 'bitcoin':
      return <IconCurrencyBitcoin size={size} />;
    case 'ethereum':
      return <IconCurrencyEthereum size={size} />;
    default:
      return <IconCurrencyDogecoin size={size} />;
  }
};

const TickerChartContainer: React.FC<TickerChartContainerProps> = ({
  ticker,
  currency,
  fetchData,
  daysToDisplay,
  initialChartType = 'line',
  displayType = 'default',
  darkMode = false,
}) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [prices, setPrices] = useState<number[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  const [localDaysToDisplay, setDaysToDisplay] = useState<number>(daysToDisplay);
  const [fullData, setFullData] = useState<{ labels: string[]; prices: number[] }>({ labels: [], prices: [] });

  const isMini = displayType === 'mini-electron' || displayType === 'mini-browser';
  const client = displayType.split('-')[1];

  // Cycle through chart types (line, bar, area)
  const cycleChartType = () => {
    setChartType((prevType) => (prevType === 'line' ? 'bar' : prevType === 'bar' ? 'area' : 'line'));
  };

  // Fetch chart data from the API (once)
  const fetchChartData = async () => {
    const days = 30; // Total days to query from the API

    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${ticker}/market_chart`, {
        params: { vs_currency: currency, days },
      });
      const data = response.data;

      // Map full data to labels and prices
      const allLabels = data.prices.map((price: [number, number]) => new Date(price[0]).toISOString());
      const allPrices = data.prices.map((price: [number, number]) => price[1]);

      setFullData({ labels: allLabels, prices: allPrices });
      setCurrentPrice(allPrices[allPrices.length - 1]);

      // Initialize displayed data based on `localDaysToDisplay`
      updateDisplayedData(allLabels, allPrices, localDaysToDisplay);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Update displayed data based on `localDaysToDisplay`
  const updateDisplayedData = (allLabels: string[], allPrices: number[], days: number) => {
    const nDaysAgoIndex = allLabels.findIndex((label) => {
      const date = new Date(label);
      const nDaysAgo = new Date();
      nDaysAgo.setDate(nDaysAgo.getDate() - days);
      return date >= nDaysAgo;
    });

    const filteredLabels = allLabels.slice(nDaysAgoIndex);
    const filteredPrices = allPrices.slice(nDaysAgoIndex);

    setLabels(filteredLabels);
    setPrices(filteredPrices);
  };

  // Fetch data once when the component mounts
  useEffect(() => {
    if (!fetchData) return;

    const request = async () => {
      await fetchChartData();
    };

    requestQueue.push(request);
    processQueue();
  }, [ticker, currency, fetchData]);

  // Update displayed data when `localDaysToDisplay` changes
  useEffect(() => {
    updateDisplayedData(fullData.labels, fullData.prices, localDaysToDisplay);
  }, [localDaysToDisplay, fullData]);

  const handleRangeChange = (days: number) => {
    setDaysToDisplay(days);
  };

  return (
    <Box
      id={`chart-container-${ticker}`}
      sx={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: (isMini || client === 'browser') ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.15)',
        p: isMini ? 1 : 2,
        width: 'auto',
        minWidth: isMini ? 'auto' : 700,
        height: (isMini && client === 'electron') ? 'calc(100vh - 50px)' : 'auto',
        backgroundColor: isMini ? (client === 'electron' ? 'rgba(161,161,161,0.35)' : '#ffffff') : 'transparent',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: client === 'browser' ? 0 : 'inherit',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: isMini ? 'flex-start' : 'space-between',
          gap: isMini ? 1 : 2,
          alignItems: 'center',
          pl: isMini ? 1 : 0,
          pr: isMini ? 1 : 0,
          mb: 0.5,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignSelf: isMini ? undefined : 'flex-start' }}>
          <Typography
            variant={isMini ? 'subtitle1' : 'h6'}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: 'max-content',
              height: '100%',
              color: getTickerColor(ticker, (darkMode || client === 'browser'))
            }}
          >
            {getCryptoIcon(ticker, 24)} {ticker.toUpperCase() + " (" + currency.toUpperCase() + ")"}
          </Typography>
        </Box>
        <PriceDisplay
          ticker={ticker}
          currentPrice={currentPrice}
          currency={currency}
          isMini={isMini}
        />
        {!isMini ? (
          <Box sx={{ width: 150, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            onCycleChartType={cycleChartType}
            currentChartType={chartType}
          />
        )}

        {!isMini && (
          <Button
            variant="contained"
            onClick={cycleChartType}
            sx={{
              marginBottom: 0,
              borderRadius: 2,
              padding: isMini ? '4px' : '8px',
              minWidth: isMini ? 'auto' : '50px',
              minHeight: isMini ? 'auto' : '50px',
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
        darkMode={darkMode}
        client={client}
      />
    </Box>
  );
};

export default TickerChartContainer;


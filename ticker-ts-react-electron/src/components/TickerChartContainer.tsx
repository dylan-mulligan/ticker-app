import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import Chart from './Chart';
import PriceDisplay from './PriceDisplay';

interface TickerChartContainerProps {
  ticker: string;
  currency: string;
  fetchData: boolean;
}

const TickerChartContainer: React.FC<TickerChartContainerProps> = ({ ticker, currency, fetchData }) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [prices, setPrices] = useState<number[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  useEffect(() => {
    if (!fetchData) return;

    const fetchDataAsync = async () => {
      const days = 7;
      try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${ticker}/market_chart`, {
          params: { vs_currency: currency, days },
        });
        const data = response.data;
        const newLabels = data.prices.map((price: [number, number]) =>
          new Date(price[0]).toLocaleDateString()
        );
        const newPrices = data.prices.map((price: [number, number]) => price[1]);
        setLabels(newLabels);
        setPrices(newPrices);
        setCurrentPrice(newPrices[newPrices.length - 1]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataAsync();
  }, [ticker, currency, fetchData]);

  return (
    <Box id={`chart-container-${ticker}`} sx={{ mb: 4 }}>
      <PriceDisplay ticker={ticker} currentPrice={currentPrice} />
      <Chart ticker={ticker} currency={currency} labels={labels} prices={prices} />
    </Box>
  );
};

export default TickerChartContainer;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import Chart from './Chart';
import PriceDisplay from './PriceDisplay';

interface TickerChartContainerProps {
  ticker: string;
  currency: string;
  fetchData: boolean;
  delay: number;
}

const TickerChartContainer: React.FC<TickerChartContainerProps> = ({ ticker, currency, fetchData, delay }) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [prices, setPrices] = useState<number[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  useEffect(() => {
    if (!fetchData) return;

    const timeoutId = setTimeout(() => {
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
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [ticker, currency, fetchData, delay]);

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
      <PriceDisplay ticker={ticker} currentPrice={currentPrice} currency={currency} />
      <Chart ticker={ticker} currency={currency} labels={labels} prices={prices} />
    </Box>
  );
};

export default TickerChartContainer;

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import Chart from './Chart';
import PriceDisplay from './PriceDisplay';

interface TickerChartContainerProps {
  ticker: string;
  currency: string;
  fetchData: boolean; // New prop to control data fetching
}

const TickerChartContainer: React.FC<TickerChartContainerProps> = ({ ticker, currency, fetchData }) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [prices, setPrices] = useState<number[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  useEffect(() => {
    if (!fetchData) return; // Skip fetching if fetchData is false

    const fetchDataAsync = async () => {
      const days = 7; // Example period (last 7 days)
      try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${ticker}/market_chart`, {
          params: { vs_currency: currency, days },
        });
        const data = response.data;
        console.dir(data);
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
    <div id={`chart-container-${ticker}`}>
      <PriceDisplay ticker={ticker} currentPrice={currentPrice} />
      <Chart ticker={ticker} currency={currency} labels={labels} prices={prices} />
    </div>
  );
};

export default TickerChartContainer;

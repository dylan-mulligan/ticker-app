import React from 'react';
import { Box, Tooltip as MuiTooltip } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

interface ChartProps {
  ticker: string;
  currency: string;
  labels: string[];
  prices: number[];
}

const currencySymbolMap: { [key: string]: string } = {
  usd: '$',
  eur: '€',
  gbp: '£',
};

const Chart: React.FC<ChartProps> = ({ ticker, currency, labels, prices }) => {
  const data = labels.map((label, index) => ({
    date: label,
    price: prices[index],
  }));

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis 
            domain={['auto', 'auto']} 
            tickFormatter={(value) => `${currencySymbolMap[currency] || ''}${value}`}
          />
          <MuiTooltip title={`Prices in ${currency.toUpperCase()}`} arrow>
            <Tooltip 
              formatter={(value: number) => `${currencySymbolMap[currency] || ''}${value}`} 
            />
          </MuiTooltip>
          <Line type="monotone" dataKey="price" stroke="#4bc0c0" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Chart;

import React from 'react';
import { Box, useTheme } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area,
} from 'recharts';
import { currencyIconMap } from '../../utils/currencyIconMap';
import { ChartType } from '../../constants/globalConsts'; // Import ChartType

interface ChartProps {
  currency: string;
  labels: string[];
  prices: number[];
  chartType: ChartType; // Use ChartType
  isMini?: boolean; // New prop to indicate mini mode or dark mode
}

const Chart: React.FC<ChartProps> = ({ currency, labels, prices, chartType, isMini }) => {
  const theme = useTheme(); // Access the theme object

  // Prepare data for the chart
  const data = labels.map((label, index) => ({
    date: label,
    price: prices[index],
  }));

  // Determine axis label color based on isMini or dark/light mode
  const axisLabelColor = (isMini || theme.palette.mode === 'dark') ? '#ffffff' : '#666666';

  // Determine the color of the main chart component (green or red)
  const isPriceIncreasing = prices[prices.length - 1] >= prices[0];
  const mainColor = isPriceIncreasing ? '#4caf50' : '#f44336'; // Green for increasing, red for decreasing

  // Render the appropriate chart based on the chartType prop
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke={axisLabelColor} />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(value) => `${currencyIconMap[currency] || ''}${value}`}
              stroke={axisLabelColor}
            />
            <Tooltip
              formatter={(value: number) => `${currencyIconMap[currency] || ''}${value.toFixed(2)}`}
              labelFormatter={(label: string) => `Date: ${label}`}
            />
            <Bar dataKey="price" fill={mainColor} />
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke={axisLabelColor} />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(value) => `${currencyIconMap[currency] || ''}${value}`}
              stroke={axisLabelColor}
            />
            <Tooltip
              formatter={(value: number) => `${currencyIconMap[currency] || ''}${value.toFixed(2)}`}
              labelFormatter={(label: string) => `Date: ${label}`}
            />
            <Area type="monotone" dataKey="price" stroke={mainColor} fill={mainColor} />
          </AreaChart>
        );
      default:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke={axisLabelColor} />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(value) => `${currencyIconMap[currency] || ''}${value}`}
              stroke={axisLabelColor}
            />
            <Tooltip
              formatter={(value: number) => `${currencyIconMap[currency] || ''}${value.toFixed(2)}`}
              labelFormatter={(label: string) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={mainColor}
              strokeWidth={3}
              dot={{ r: .75 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <Box sx={{ width: '100%', aspectRatio: '16/9', minHeight: '80px' }}>
      <ResponsiveContainer>
        {renderChart()}
      </ResponsiveContainer>
    </Box>
  );
};

export default Chart;

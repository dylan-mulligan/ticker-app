import React, { useRef, useEffect, useState } from 'react';
import { Box, useTheme, Typography } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area,
  TooltipProps,
} from 'recharts';
import { currencyIconMap } from '../../utils/currencyIconMap';
import { ChartType } from '../../constants/globalConsts';
import dayjs from 'dayjs';

interface ChartProps {
  currency: string;
  labels: string[];
  prices: number[];
  chartType: ChartType;
  isMini: boolean;
  darkMode: boolean;
}

const Chart: React.FC<ChartProps> = ({ currency, labels, prices, chartType, isMini, darkMode }) => {
  const containerRef = useRef<HTMLDivElement>(null); // Reference to the chart container
  const [containerWidth, setContainerWidth] = useState<number>(0); // State to store container width

  useEffect(() => {
    // Measure the container's width on mount and when resized
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Custom tooltip renderer
  const CustomTooltip: React.FC<TooltipProps<any, any> & { currency: string, darkMode: boolean; }> = ({
    active,
    payload,
    label,
    currency,
    coordinate,
    darkMode,
  }) => {
    const tooltipRef = useRef<HTMLDivElement>(null); // Reference for the tooltip element

    if (active && payload && payload.length && coordinate) {
      const price = payload[0].value as number;
      const formattedDate = dayjs(label).format('ddd, MMM D h:mm A'); // Format ISO date to 12-hour time
      const currencySymbol = currencyIconMap[currency] || '';

      // Dynamically calculate tooltip width
      const tooltipWidth = tooltipRef.current?.offsetWidth || 200; // Fallback to 200 if not yet rendered
      const constrainedLeft = Math.max(
        Math.min(coordinate.x! - (tooltipWidth / 3 - 2), containerWidth - (tooltipWidth + 20)),
        75 // Ensure it doesn't go beyond the left edge
      );

      return (
        <Box
          ref={tooltipRef} // Attach the ref to the tooltip container
          sx={{
            position: 'absolute',
            top: 10, // Constant Y position near the top
            left: constrainedLeft, // Centered X position
            pointerEvents: 'none',
            background: 'transparent',
            fontSize: '0.875rem',
            textAlign: 'center',
            width: 'max-content',
          }}
        >
          <Typography variant="body2" component="span" sx={{ color: darkMode ? '#ffffff' : '#303030' }}>
            {`${currencySymbol}${price.toFixed(2)}`}
          </Typography>
          <Typography variant="body2" component="span" sx={{ color: darkMode ? '#a8a8a8' : '#808080' }}>
            {`\u00A0\u00A0${formattedDate}`}
          </Typography>
        </Box>
      );
    }

    return null;
  };

  // Prepare data for the chart
  const data = labels.map((label, index) => ({
    date: label, // ISO string
    price: prices[index],
  }));

  const interval = Math.round(labels.length / 5);

  // Format function for X-axis labels
  const formatXAxis = (tick: string) => dayjs(tick).format('MMM D'); // Example: "Jan 1, 12:00"

  // Determine axis label color based on isMini or dark/light mode
  const axisLabelColor = (isMini || darkMode) ? '#ffffff' : '#666666';

  // Determine the color of the main chart component (green or red)
  const isPriceIncreasing = prices[prices.length - 1] >= prices[0];
  const mainColor = isPriceIncreasing ? '#4caf50' : '#f44336'; // Green for increasing, red for decreasing

  // Render the appropriate chart based on the chartType prop
  const renderChart = () => {
    const cursorMarginTop = 20; // Margin from the top of the chart for the cursor

    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
                dataKey="date"
                stroke={axisLabelColor}
                tickFormatter={formatXAxis}
                interval={interval}
            />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(value) => `${currencyIconMap[currency] || ''}${value}`}
              stroke={axisLabelColor}
            />
            <Tooltip
              content={<CustomTooltip currency={currency} darkMode={darkMode} />}
              cursor={{ fill: 'rgba(255, 255, 255, 0.1)', y: cursorMarginTop }}
            />
            <Bar dataKey="price" fill={mainColor} />
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
                dataKey="date"
                stroke={axisLabelColor}
                tickFormatter={formatXAxis}
                interval={interval}
            />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(value) => `${currencyIconMap[currency] || ''}${value}`}
              stroke={axisLabelColor}
            />
            <Tooltip
              content={<CustomTooltip currency={currency} darkMode={darkMode} />}
              cursor={{ stroke: '#bcbcbc' }}
            />
            <Area type="monotone" dataKey="price" stroke={mainColor} fill={mainColor} />
          </AreaChart>
        );
      default:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
                dataKey="date"
                stroke={axisLabelColor}
                tickFormatter={formatXAxis}
                interval={interval}
            />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(value) => `${currencyIconMap[currency] || ''}${value}`}
              stroke={axisLabelColor}
            />
            <Tooltip
              content={<CustomTooltip currency={currency} darkMode={darkMode} />}
              cursor={{ fill: 'rgba(255, 255, 255, 0.1)', y: cursorMarginTop }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={mainColor}
              strokeWidth={2.5}
              dot={{ r: 0 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <Box
      ref={containerRef} // Attach the ref to the container
      sx={{ width: '100%', aspectRatio: '16/9', minHeight: '80px' }}
    >
      <ResponsiveContainer>
        {renderChart()}
      </ResponsiveContainer>
    </Box>
  );
};

export default Chart;

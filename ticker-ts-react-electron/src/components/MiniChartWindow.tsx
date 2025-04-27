import React, { useState } from 'react';
import TickerChartContainer from './TickerChartContainer';
import ChartGrabBar from './ChartGrabBar';
import { Box } from "@mui/material";
import { ChartType } from '../constants/globalConsts'; // Import ChartType

const MiniChartWindow: React.FC<{
  ticker: string;
  currency: string;
  chartType: ChartType; // Use ChartType
}> = ({ ticker, currency, chartType }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ChartGrabBar ticker={ticker} currency={currency} isHovered={isHovered} />
      <TickerChartContainer
        ticker={ticker}
        currency={currency}
        fetchData={true}
        daysToDisplay={7}
        isMini={true}
        initialChartType={chartType}
      />
    </Box>
  );
};

export default MiniChartWindow;


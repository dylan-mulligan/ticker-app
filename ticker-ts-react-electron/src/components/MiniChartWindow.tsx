import React, { useState } from 'react';
import TickerChartContainer from './TickerChartContainer';
import ChartGrabBar from './ChartGrabBar';
import { Box } from "@mui/material";

const MiniChartWindow: React.FC<{ ticker: string; currency: string; chartType: string }> = ({ ticker, currency, chartType }) => {
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
      />
    </Box>
  );
};

export default MiniChartWindow;

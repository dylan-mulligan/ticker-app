import React, { useState } from 'react';
import TickerChartContainer from '../shared/TickerChartContainer';
import MiniChartGrabBar from '../minichart/MiniChartGrabBar';
import { Box } from "@mui/material";
import { ChartType, ChartDisplayType } from '../../constants/globalConsts';

const MiniChartWindow: React.FC<{
  ticker: string;
  currency: string;
  chartType: ChartType;
  type: ChartDisplayType; // Use ChartDisplayType
}> = ({ ticker, currency, chartType, type }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <MiniChartGrabBar ticker={ticker} currency={currency} isHovered={isHovered} />
      <TickerChartContainer
        ticker={ticker}
        currency={currency}
        fetchData={true}
        daysToDisplay={7}
        displayType={type}
        initialChartType={chartType}
      />
    </Box>
  );
};

export default MiniChartWindow;


import React, { useState } from 'react';
import { Box, Button, useMediaQuery } from '@mui/material';
import { getChartIcon } from '../../utils/chartIconUtils';

interface MiniChartControlsProps {
  onRangeChange: (days: number) => void;
  selectedRange: number;
  onCycleChartType: () => void; // New prop for cycling chart type
  currentChartType: string; // New prop for current chart type
}

const MiniChartControls: React.FC<MiniChartControlsProps> = ({
  onRangeChange,
  selectedRange,
  onCycleChartType,
  currentChartType,
}) => {
  const ranges = [3, 7, 14, 30];
  const isSmallScreen = useMediaQuery('(max-width: 472px)');
  const [currentRangeIndex, setCurrentRangeIndex] = useState(0);

  const cycleRange = () => {
    const nextIndex = (currentRangeIndex + 1) % ranges.length;
    setCurrentRangeIndex(nextIndex);
    onRangeChange(ranges[nextIndex]);
  };

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {isSmallScreen ? (
        <Button
          variant="outlined"
          onClick={cycleRange}
          sx={{
            minWidth: '25px',
            padding: '2px 6px',
            fontSize: '0.8rem',
            border: '1px solid',
          }}
        >
          {ranges[currentRangeIndex]}d
        </Button>
      ) : (
        ranges.map((range) => (
          <Button
            key={range}
            variant={'outlined'}
            onClick={() => onRangeChange(range)}
            sx={{
              minWidth: '30px',
              padding: '2px 6px',
              fontSize: '0.8rem',
              border: selectedRange === range ? '2px solid #009dff' : '1px solid',
            }}
          >
            {range}d
          </Button>
        ))
      )}
      <Button
        variant="outlined"
        onClick={onCycleChartType}
        sx={{
          m: 0,
          borderRadius: 1,
          padding: '4px',
          minWidth: 20,
          backgroundColor: 'rgba(147,163,255,0.13)',
        }}
      >
        {getChartIcon(currentChartType, 20)}
      </Button>
    </Box>
  );
};

export default MiniChartControls;


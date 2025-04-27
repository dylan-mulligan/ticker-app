import React from 'react';
import { Box, Button } from '@mui/material';

interface MiniChartControlsProps {
  onRangeChange: (days: number) => void;
  selectedRange: number;
}

const MiniChartControls: React.FC<MiniChartControlsProps> = ({ onRangeChange, selectedRange }) => {
  const ranges = [3, 7, 14, 30];

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {ranges.map((range) => (
        <Button
          key={range}
          variant={'outlined'}
          onClick={() => onRangeChange(range)}
          sx={{
            minWidth: '40px',
            padding: '4px 8px',
            fontSize: '0.8rem',
            border: selectedRange === range ? '2px solid #009dff' : '1px solid',
          }}
        >
          {range}d
        </Button>
      ))}
    </Box>
  );
};

export default MiniChartControls;

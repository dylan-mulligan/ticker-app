import React from 'react';
import { Box, Typography } from '@mui/material';

interface PriceDisplayProps {
  ticker: string;
  currentPrice: number;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ ticker, currentPrice }) => {
  return (
    <Box id={`price-${ticker}`} sx={{ mb: 2 }}>
      <Typography variant="h6" component="div">
        Current Price: 
        <Typography component="span" sx={{ fontWeight: 'bold' }}>
          ${currentPrice.toFixed(2)}
        </Typography>
      </Typography>
    </Box>
  );
};

export default PriceDisplay;

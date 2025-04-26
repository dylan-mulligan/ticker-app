import React from 'react';
import { Box, Typography } from '@mui/material';

interface PriceDisplayProps {
  ticker: string;
  currentPrice: number;
  currency: string; // Add currency prop
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ ticker, currentPrice, currency }) => {
  const currencySymbol = currency === 'usd' ? '$' : currency === 'eur' ? '€' : ''; // Determine symbol

  return (
    <Box id={`price-${ticker}`} sx={{ mb: 2 }}>
      <Typography variant="h6" component="div" sx={{ width: 'max-content' }}>
        Current Price:
      </Typography>
      <Typography component="span" sx={{ fontWeight: 'bold', color: '#33ac21' }}>
        {currencySymbol}{currentPrice.toFixed(2)}
      </Typography>
    </Box>
  );
};

export default PriceDisplay;

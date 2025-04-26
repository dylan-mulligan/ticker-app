import React from 'react';
import { Box, Typography } from '@mui/material';

interface PriceDisplayProps {
  ticker: string;
  currentPrice: number;
  currency: string;
  sx: {}
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ ticker, currentPrice, currency, sx }) => {
  // Determine the currency symbol based on the selected currency
  const currencySymbol = currency === 'usd' ? '$' : currency === 'eur' ? '€' : '';

  return (
    <Box id={`price-${ticker}`} sx={sx}>
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

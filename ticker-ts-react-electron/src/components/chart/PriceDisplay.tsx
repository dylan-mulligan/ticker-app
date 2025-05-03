import React from 'react';
import { Box, Typography } from '@mui/material';
import { currencyIconMap } from '../../utils/currencyIconMap'; // Import currencyIconMap

interface PriceDisplayProps {
  ticker: string;
  currentPrice: number;
  currency: string;
  isMini?: boolean;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ ticker, currentPrice, currency, isMini = false }) => {
  // Use currencyIconMap to determine the currency symbol
  const currencySymbol = currencyIconMap[currency] || '';

  return (
    <Box
      id={`price-${ticker}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: isMini ? .4 : 0,
      }}
    >
        {!isMini && (
            <Typography variant="subtitle1" sx={{ width: 'max-content', pb: isMini ? 0 : .25, }}>
                Current Price
            </Typography>
        )}
      <Typography component="span" sx={{ fontWeight: 'bold', color: '#33ac21' }}>
        {currencySymbol}{currentPrice.toFixed(2)}
      </Typography>
    </Box>
  );
};

export default PriceDisplay;

import React, { useState } from 'react';
import { Box, Typography, FormGroup, IconButton, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { FormControlLabel, Checkbox } from '@mui/material';

interface ChartSelectionBoxProps {
  selectedTickers: string[];
  selectedStocks: string[];
  onTickerChange: (ticker: string) => void;
  onStockChange: (stock: string) => void;
}

const ChartSelectionBox: React.FC<ChartSelectionBoxProps> = ({
  selectedTickers,
  selectedStocks,
  onTickerChange,
  onStockChange,
}) => {
  const [isSelectionBoxOpen, setIsSelectionBoxOpen] = useState(true);

  const toggleSelectionBox = () => {
    setIsSelectionBoxOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        p: 3,
        maxWidth: 600,
        margin: '0 auto',
        mb: 4,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Chart Selection</Typography>
        <IconButton onClick={toggleSelectionBox}>
          {isSelectionBoxOpen ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      <Collapse in={isSelectionBoxOpen}>
        <Typography variant="h6">Cryptocurrencies</Typography>
        <FormGroup row sx={{ justifyContent: 'center' }}>
          {['bitcoin', 'ethereum', 'dogecoin'].map((ticker) => (
            <FormControlLabel
              key={ticker}
              control={
                <Checkbox
                  checked={selectedTickers.includes(ticker)}
                  onChange={() => onTickerChange(ticker)}
                />
              }
              label={ticker.charAt(0).toUpperCase() + ticker.slice(1)}
            />
          ))}
        </FormGroup>
        <Typography variant="h6">Stocks</Typography>
        <FormGroup row sx={{ justifyContent: 'center' }}>
          {['AAPL', 'GOOGL', 'AMZN'].map((stock) => (
            <FormControlLabel
              key={stock}
              control={
                <Checkbox
                  checked={selectedStocks.includes(stock)}
                  onChange={() => onStockChange(stock)}
                />
              }
              label={stock}
            />
          ))}
        </FormGroup>
      </Collapse>
    </Box>
  );
};

export default ChartSelectionBox;

import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore, BarChart } from '@mui/icons-material';
import { IconCurrencyBitcoin, IconCurrencyEthereum, IconCurrencyDogecoin } from '@tabler/icons-react';
import SelectionBox from './SelectionBox'; // Import the generic SelectionBox component
import { SUPPORTED_CRYPTOS } from '../../constants/globalConsts'; // Import the shared list

interface ChartSelectionBoxProps {
  selectedTickers: string[];
  selectedStocks: string[];
  onTickerChange: (ticker: string) => void;
  onStockChange: (stock: string) => void;
}

const getCryptoIcon = (ticker: string) => {
  switch (ticker.toLowerCase()) {
    case 'bitcoin':
      return <IconCurrencyBitcoin size={24} />;
    case 'ethereum':
      return <IconCurrencyEthereum size={24} />;
    case 'dogecoin':
      return <IconCurrencyDogecoin size={24} />;
    default:
        return <IconCurrencyBitcoin size={24} />;
  }
};

const getStockIcon = (stock: string) => {
  switch (stock.toUpperCase()) {
    case 'AAPL':
      return <BarChart />;
    case 'GOOGL':
      return <BarChart />;
    case 'AMZN':
      return <BarChart />;
    default:
      return <BarChart />;
  }
};

const ChartSelectionBox: React.FC<ChartSelectionBoxProps> = ({
  selectedTickers,
  selectedStocks,
  onTickerChange,
  onStockChange,
}) => {
  const [isSelectionBoxOpen, setIsSelectionBoxOpen] = useState<boolean>(() => {
    const savedState = localStorage.getItem('chartSelectionBoxOpen');
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  useEffect(() => {
    localStorage.setItem('chartSelectionBoxOpen', JSON.stringify(isSelectionBoxOpen));
  }, [isSelectionBoxOpen]);

  const toggleSelectionBox = () => {
    setIsSelectionBoxOpen((prev) => !prev);
  };

  const openInNewWindow = (ticker: string, isCrypto: boolean) => {
    const currency = 'usd'; // Default currency for charts
    const chartType = 'line'; // Default chart type
    const type = isCrypto ? 'crypto' : 'stock';

    if ((window as any).electronAPI) {
      // Electron client
      (window as any).electronAPI.openChartWindow(ticker, currency, chartType);
    } else {
      // Browser client
      openPopoutWidget(ticker, currency, chartType);
    }
  };

  function openPopoutWidget(ticker: string, currency: string, chartType: string): void {
    const aspectRatio = 128 / 107;
    const initialWidth = 575;
    const initialHeight = initialWidth / aspectRatio;

    const newWindow: any = window.open(
      `${window.location.origin}/chart/${ticker}?currency=usd&chartType=${chartType}`,
      `${ticker} (${currency})`,
      `width=${initialWidth},height=${initialHeight},left=150,top=150,menubar=no,toolbar=no,location=no,status=no,scrollbars=no,resizable=no`
    );

    // Ensure the new window has a transparent background
    newWindow.onload = () => {
      newWindow.document.body.style.backgroundColor = 'transparent';
      newWindow.document.body.style.margin = '0'; // Optional: Remove default margin
    };
  }

  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        p: 3,
        maxWidth: 670,
        margin: '0 auto',
        mb: 4,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BarChart sx={{ mr: 1 }} />
          <Typography variant="h6">Chart Selection</Typography>
        </Box>
        <IconButton onClick={toggleSelectionBox}>
          {isSelectionBoxOpen ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      <Collapse in={isSelectionBoxOpen}>
        <SelectionBox
          items={SUPPORTED_CRYPTOS} // Use the shared list
          selectedItems={selectedTickers}
          onItemChange={onTickerChange}
          openInNewWindow={openInNewWindow}
          getItemIcon={getCryptoIcon}
          title="Cryptocurrencies"
          isCrypto={true}
        />
        <SelectionBox
          items={['AAPL', 'GOOGL', 'AMZN']}
          selectedItems={selectedStocks}
          onItemChange={onStockChange}
          openInNewWindow={openInNewWindow}
          getItemIcon={getStockIcon}
          title="Stocks"
          isCrypto={false}
        />
      </Collapse>
    </Box>
  );
};

export default ChartSelectionBox;

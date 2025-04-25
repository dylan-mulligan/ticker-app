import React from 'react';

interface PriceDisplayProps {
  ticker: string;
  currentPrice: number;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ ticker, currentPrice }) => {
  return (
    <div id={`price-${ticker}`} className="price">
      Current Price: $<span id={`current-price-${ticker}`}>{currentPrice.toFixed(2)}</span>
    </div>
  );
};

export default PriceDisplay;

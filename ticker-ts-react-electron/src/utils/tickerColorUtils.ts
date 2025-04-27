const TICKER_COLORS: Record<string, { light: string; dark: string }> = {
  bitcoin: { light: '#f7931a', dark: '#d67d0e' }, // Orange
  ethereum: { light: '#4e4e4e', dark: '#9e9e9e' }, // Dark Gray
  dogecoin: { light: '#c3a116', dark: '#a68f2b' }, // Gold
};

export const getTickerColor = (ticker: string, darkMode: boolean = false): string => {
  const colors = TICKER_COLORS[ticker.toLowerCase()];
  return colors ? (darkMode ? colors.dark : colors.light) : '#000000'; // Default to black
};

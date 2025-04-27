import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18
import { BrowserRouter as Router, Routes, Route, useParams, useSearchParams } from 'react-router-dom';
import App from './components/App';
import './css/index.css';
import reportWebVitals from './reportWebVitals';
import TickerChartContainer from "./components/TickerChartContainer";
import MiniChartWindow from "./components/MiniChartWindow";
import { SUPPORTED_CRYPTOS } from './constants/supportedCryptos'; // Import the shared list

if (typeof window !== 'undefined' && typeof window.require === 'undefined' && typeof require !== 'undefined') {
  window.require = require; // Expose require for Electron detection
}

const Account = () => <div>Account Page</div>;
const Settings = () => <div>Settings Page</div>;

const TickerChartRoute = () => {
  const { ticker } = useParams();
  const [searchParams] = useSearchParams();
  const currency = (searchParams.get('currency')) || 'usd';
  const chartType = (searchParams.get('chartType') as 'line' | 'bar' | 'area') || 'line';

  if (!ticker || !SUPPORTED_CRYPTOS.includes(ticker.toLowerCase())) {
    return <div>Error: Unsupported or invalid cryptocurrency ticker.</div>; // Validation
  }

  return (
    <MiniChartWindow ticker={ticker!} currency={currency!} chartType={chartType!}/>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!); // Use createRoot
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/account" element={<Account />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/chart/:ticker" element={<TickerChartRoute />} />
    </Routes>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

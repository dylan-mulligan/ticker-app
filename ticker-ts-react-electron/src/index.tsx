import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import TickerChartContainer from './components/TickerChartContainer';

if (typeof window !== 'undefined' && typeof window.require === 'undefined' && typeof require !== 'undefined') {
  window.require = require; // Expose require for Electron detection
}

const urlParams = new URLSearchParams(window.location.search);
const ticker = urlParams.get('ticker');
const currency = urlParams.get('currency');
const chartType = urlParams.get('chartType');

if (ticker && currency && chartType) {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <TickerChartContainer
        ticker={ticker}
        currency={currency}
        fetchData={true}
        daysToDisplay={14}
      />
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


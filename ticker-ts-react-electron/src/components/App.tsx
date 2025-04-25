import React, { useState } from 'react';
import logo from '../resources/logo.svg';
import '../css/App.css';
import TickerChartContainer from './TickerChartContainer';

function App() {
  const [currency, setCurrency] = useState('usd');
  const tickers = ['bitcoin'];

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <main>
          <select
              id="currency-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
          >
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
          </select>
        {tickers.map((ticker, index) => (
          <TickerChartContainer
            key={ticker}
            ticker={ticker}
            currency={currency}
            fetchData={index === 0} // Only the first chart fetches data
          />
        ))}
      </main>
    </div>
  );
}

export default App;

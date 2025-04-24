const { ipcRenderer } = require('electron');
const Chart = require('chart.js/auto'); // Import Chart.js

const { fetchHistoricalData } = require('./dataFetcher');
const { renderChart } = require('./chartRenderer');

async function updateUI() {
    const stockSelect = document.getElementById('stock-select');
    const currencySelect = document.getElementById('currency-select');
    const ticker = stockSelect.value;
    const currency = currencySelect.value;
    const days = 7; // Example period (last 7 days)

    const data = await fetchHistoricalData(ticker, days);
    if (!data) return;

    // Update current price
    const currentPrice = data.prices[data.prices.length - 1][1];
    document.getElementById('current-price').textContent = currentPrice.toFixed(2);

    // Prepare data for the chart
    const labels = data.prices.map(price => new Date(price[0]).toLocaleDateString());
    const prices = data.prices.map(price => price[1]);

    // Render the chart
    const ctx = document.getElementById('chart').getContext('2d');
    renderChart(ctx, `${ticker} (${currency.toUpperCase()})`, labels, prices);
}

// Add event listeners for dropdown changes
document.getElementById('stock-select').addEventListener('change', updateUI);
document.getElementById('currency-select').addEventListener('change', updateUI);

// Initialize the UI
updateUI();


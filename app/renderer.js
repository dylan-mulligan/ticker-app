const { ipcRenderer } = require('electron');
const Chart = require('chart.js/auto'); // Import Chart.js

const { fetchHistoricalData } = require('./dataFetcher');
const { renderChart } = require('./chartRenderer');

const charts = {}; // Object to store chart instances by ticker

async function updateChart(ticker, currency) {
    const days = 7; // Example period (last 7 days)
    const data = await fetchHistoricalData(ticker, days, currency); // Pass currency parameter
    if (!data) return;

    // Prepare data for the chart
    const labels = data.prices.map(price => new Date(price[0]).toLocaleDateString());
    const prices = data.prices.map(price => price[1]);

    // Update the current price
    const currentPrice = prices[prices.length - 1];
    const priceElement = document.getElementById(`current-price-${ticker}`);
    if (priceElement) {
        priceElement.textContent = currentPrice.toFixed(2);
    }

    // Render the chart
    const ctx = document.getElementById(`chart-${ticker}`).getContext('2d');
    if (charts[ticker]) {
        charts[ticker].destroy(); // Destroy the existing chart instance
    }
    charts[ticker] = renderChart(ctx, `${ticker} (${currency.toUpperCase()})`, labels, prices);
}

function createChartCanvas(ticker) {
    const chartContainer = document.createElement('div');
    chartContainer.id = `chart-container-${ticker}`;
    chartContainer.innerHTML = `
        <div id="price-${ticker}" class="price">
            Current Price: $<span id="current-price-${ticker}">0.00</span>
        </div>
        <canvas id="chart-${ticker}" width="400" height="200"></canvas>
    `;
    document.body.appendChild(chartContainer);
}

function removeChartCanvas(ticker) {
    const chartContainer = document.getElementById(`chart-container-${ticker}`);
    if (chartContainer) {
        chartContainer.remove();
    }
    if (charts[ticker]) {
        charts[ticker].destroy();
        delete charts[ticker];
    }
}

function updateAllCharts(currency) {
    const checkboxes = document.querySelectorAll('.stock-checkbox');
    const tickers = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    tickers.forEach((ticker, index) => {
        setTimeout(() => updateChart(ticker, currency), index * 2000); // Space updates at 2.5-second intervals
    });
}

function updateUI() {
    const currency = document.getElementById('currency-select').value;

    const checkboxes = document.querySelectorAll('.stock-checkbox');

    checkboxes.forEach(checkbox => {
        const ticker = checkbox.value;
        if (checkbox.checked) {
            if (!document.getElementById(`chart-container-${ticker}`)) {
                createChartCanvas(ticker); // Create chart immediately
                updateChart(ticker, currency); // Only fetch data when creating a new chart
            }
        } else {
            removeChartCanvas(ticker); // Remove chart without re-querying the API
        }
    });
}

// Add event listeners for checkbox and currency changes
document.querySelectorAll('.stock-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', updateUI);
});
document.getElementById('currency-select').addEventListener('change', () => {
    const currency = document.getElementById('currency-select').value;
    updateAllCharts(currency); // Ensure all charts are updated on currency change
});

// Initialize the UI
updateUI();

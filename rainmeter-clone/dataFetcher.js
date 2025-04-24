const { ipcRenderer } = require('electron');

async function fetchHistoricalData(ticker, days, currency) { // Add currency parameter
    try {
        const data = await ipcRenderer.invoke('fetch-historical-data', { ticker, days, currency }); // Include currency
        return data;
    } catch (error) {
        console.error('Error fetching historical data:', error);
    }
}

module.exports = { fetchHistoricalData };


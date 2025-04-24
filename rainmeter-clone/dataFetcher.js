const { ipcRenderer } = require('electron');

async function fetchHistoricalData(ticker, days) {
    try {
        const data = await ipcRenderer.invoke('fetch-historical-data', { ticker, days });
        return data;
    } catch (error) {
        console.error('Error fetching historical data:', error);
    }
}

module.exports = { fetchHistoricalData };

const Chart = require('chart.js/auto');

function renderChart(ctx, ticker, labels, prices) {
    return new Chart(ctx, { // Return the chart instance
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: ticker.toUpperCase(),
                data: prices,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}

module.exports = { renderChart };


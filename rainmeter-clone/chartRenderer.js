const Chart = require('chart.js/auto');

function renderChart(ctx, ticker, labels, prices) {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: `${ticker.toUpperCase()} Price (USD)`,
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

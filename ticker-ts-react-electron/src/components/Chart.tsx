import React, { useEffect, useRef } from 'react';
import ChartJS from 'chart.js/auto';

interface ChartProps {
  ticker: string;
  currency: string;
  labels: string[];
  prices: number[];
}

const Chart: React.FC<ChartProps> = ({ ticker, currency, labels, prices }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      chartInstanceRef.current = new ChartJS(chartRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: `${ticker.toUpperCase()} (${currency.toUpperCase()})`,
              data: prices,
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
            },
          },
        },
      });
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [ticker, currency, labels, prices]);

  return <canvas ref={chartRef} width="400" height="200"></canvas>;
};

export default Chart;

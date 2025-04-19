import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getQualityColor, getQualityLabel } from '../utils/apiUtils';

// Enregistrer les éléments nécessaires pour Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface QualityDistributionChartProps {
  data: {
    [key: string]: {
      count: number;
      percentage: number;
    };
  };
}

export const QualityDistributionChart: React.FC<QualityDistributionChartProps> = ({ data }) => {
  // Préparer les données pour le graphique
  const labels = Object.keys(data).map(key => getQualityLabel(key));
  const counts = Object.keys(data).map(key => data[key].count);
  const backgroundColor = Object.keys(data).map(key => getQualityColor(key));

  const chartData = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor,
        borderColor: backgroundColor.map(color => color + '80'),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="w-full h-64">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default QualityDistributionChart;

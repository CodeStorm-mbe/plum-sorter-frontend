import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const CategoryDistribution = () => {
    // Mock data - in a real app this would come from your API
    const chartData = {
        labels: ['Bonne Qualité', 'Non Mûre', 'Tachetée', 'Fissurée', 'Meurtrie', 'Pourrie'],
        datasets: [
            {
                data: [42, 18, 15, 10, 8, 7],
                backgroundColor: [
                    '#50C878', // emerald
                    '#90EE90', // light green
                    '#FFD700', // gold
                    '#FFA500', // orange
                    '#8A2BE2', // violet
                    '#B22222', // firebrick
                ],
                borderColor: 'rgba(30, 26, 43, 0.8)',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#ffffff',
                    font: {
                        size: 12,
                    },
                    padding: 15,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(30, 26, 43, 0.9)',
                titleFont: {
                    size: 14,
                },
                bodyFont: {
                    size: 13,
                },
                padding: 10,
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${percentage}% (${value} images)`;
                    }
                }
            },
        },
    };

    return (
        <div className="h-64">
            <Pie data={chartData} options={options} />
        </div>
    );
};

export default CategoryDistribution;

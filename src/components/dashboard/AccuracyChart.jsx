import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const AccuracyChart = () => {
    // Mock data - in a real app this would come from your API
    const chartData = {
        labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
        datasets: [
            {
                label: 'Précision (%)',
                data: [86.2, 87.8, 90.1, 92.5, 95.3, 96.4],
                borderColor: '#50C878', // accent-emerald
                backgroundColor: 'rgba(80, 200, 120, 0.1)',
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#ffffff',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(30, 26, 43, 0.9)',
                borderColor: '#50C878',
                borderWidth: 1,
            },
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 80,
                max: 100,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: '#ffffff',
                },
            },
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: '#ffffff',
                },
            },
        },
    };

    return (
        <div className="h-64">
            <Line data={chartData} options={options} />
        </div>
    );
};

export default AccuracyChart;

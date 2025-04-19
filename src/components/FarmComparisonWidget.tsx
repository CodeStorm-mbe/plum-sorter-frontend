import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardAnalyticsService } from '../services';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface FarmComparisonWidgetProps {
  title?: string;
  farmIds?: number[];
  metric?: 'quality_score' | 'efficiency' | 'volume';
  className?: string;
}

const FarmComparisonWidget: React.FC<FarmComparisonWidgetProps> = ({
  title = 'Comparaison des fermes',
  farmIds,
  metric = 'quality_score',
  className = ''
}) => {
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>(metric);

  useEffect(() => {
    const fetchComparisonData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Construire les paramètres de requête
        const params: any = { metric: selectedMetric };
        if (farmIds && farmIds.length > 0) {
          params.farm_ids = farmIds.join(',');
        }
        
        // Utiliser le nouveau service d'analyse avancée
        const data = await DashboardAnalyticsService.getFarmComparison(params);
        setComparisonData(data);
      } catch (err: any) {
        console.error('Erreur lors de la récupération des données de comparaison:', err);
        setError(err.message || 'Une erreur est survenue lors de la récupération des données');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchComparisonData();
  }, [farmIds, selectedMetric]);

  // Préparer les données pour le graphique
  const prepareChartData = () => {
    if (!comparisonData || !Array.isArray(comparisonData)) return null;
    
    const labels = comparisonData.map((farm: any) => farm.name);
    let data;
    let backgroundColor;
    let borderColor;
    
    switch (selectedMetric) {
      case 'quality_score':
        data = comparisonData.map((farm: any) => farm.quality_score);
        backgroundColor = 'rgba(16, 185, 129, 0.6)';
        borderColor = 'rgba(16, 185, 129, 1)';
        break;
      case 'efficiency':
        data = comparisonData.map((farm: any) => farm.efficiency);
        backgroundColor = 'rgba(59, 130, 246, 0.6)';
        borderColor = 'rgba(59, 130, 246, 1)';
        break;
      case 'volume':
        data = comparisonData.map((farm: any) => farm.volume);
        backgroundColor = 'rgba(245, 158, 11, 0.6)';
        borderColor = 'rgba(245, 158, 11, 1)';
        break;
      default:
        data = comparisonData.map((farm: any) => farm.quality_score);
        backgroundColor = 'rgba(16, 185, 129, 0.6)';
        borderColor = 'rgba(16, 185, 129, 1)';
    }
    
    return {
      labels,
      datasets: [
        {
          label: getMetricLabel(selectedMetric),
          data,
          backgroundColor,
          borderColor,
          borderWidth: 1
        }
      ]
    };
  };

  const getMetricLabel = (metricKey: string) => {
    switch (metricKey) {
      case 'quality_score':
        return 'Score de qualité';
      case 'efficiency':
        return 'Efficacité';
      case 'volume':
        return 'Volume de production';
      default:
        return 'Score';
    }
  };

  const chartData = prepareChartData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)'
        },
        beginAtZero: true
      }
    }
  };

  return (
    <div className={`card p-4 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h3 className="text-xl font-title font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-2 md:mb-0">
          {title}
        </h3>
        
        <div className="flex items-center">
          <select
            className="bg-background-light/50 border border-white/10 text-white rounded-md px-3 py-1 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-accent-primary"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            <option value="quality_score">Score de qualité</option>
            <option value="efficiency">Efficacité</option>
            <option value="volume">Volume de production</option>
          </select>
        </div>
      </div>
      
      <div className="h-80">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full flex-col">
            <p className="text-red-500 mb-2">{error}</p>
            <button 
              className="px-4 py-2 bg-accent-primary/20 hover:bg-accent-primary/30 text-accent-primary rounded-md transition-colors"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </button>
          </div>
        ) : !chartData || !chartData.datasets.length ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-white/60">Aucune donnée disponible pour la comparaison</p>
          </div>
        ) : (
          <motion.div 
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Bar data={chartData} options={chartOptions} />
          </motion.div>
        )}
      </div>
      
      {!isLoading && !error && comparisonData && (
        <div className="mt-4 text-sm text-white/60">
          <p>Comparaison basée sur {comparisonData.length} fermes</p>
          {comparisonData.length > 0 && (
            <p className="mt-1">
              Meilleure performance: {comparisonData.sort((a: any, b: any) => b[selectedMetric] - a[selectedMetric])[0].name}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FarmComparisonWidget;

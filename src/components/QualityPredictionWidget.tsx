import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardAnalyticsService } from '../services';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface QualityPredictionWidgetProps {
  title?: string;
  farmId?: number;
  className?: string;
}

const QualityPredictionWidget: React.FC<QualityPredictionWidgetProps> = ({
  title = 'Prédiction de qualité',
  farmId,
  className = ''
}) => {
  const [predictionData, setPredictionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictionData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Construire les paramètres de requête
        const params: any = {};
        if (farmId) {
          params.farm_id = farmId;
        }
        
        // Utiliser le nouveau service d'analyse avancée
        const data = await DashboardAnalyticsService.getQualityPrediction(params);
        setPredictionData(data);
      } catch (err: any) {
        console.error('Erreur lors de la récupération des prédictions de qualité:', err);
        setError(err.message || 'Une erreur est survenue lors de la récupération des données');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPredictionData();
  }, [farmId]);

  // Préparer les données pour le graphique
  const prepareChartData = () => {
    if (!predictionData || !predictionData.predicted_distribution) return null;
    
    const distribution = predictionData.predicted_distribution;
    const labels = Object.keys(distribution);
    const data = Object.values(distribution);
    
    // Couleurs pour les différentes qualités
    const backgroundColor = [
      'rgba(16, 185, 129, 0.8)',  // Excellente - vert
      'rgba(59, 130, 246, 0.8)',  // Bonne - bleu
      'rgba(245, 158, 11, 0.8)',  // Moyenne - orange
      'rgba(239, 68, 68, 0.8)'    // Faible - rouge
    ];
    
    const borderColor = [
      'rgba(16, 185, 129, 1)',
      'rgba(59, 130, 246, 1)',
      'rgba(245, 158, 11, 1)',
      'rgba(239, 68, 68, 1)'
    ];
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderColor,
          borderWidth: 1
        }
      ]
    };
  };

  const chartData = prepareChartData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value.toFixed(1)}%`;
          }
        }
      }
    },
    cutout: '60%'
  };

  return (
    <div className={`card p-4 ${className}`}>
      <h3 className="text-xl font-title font-semibold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
        {title}
      </h3>
      
      <div className="h-64">
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
            <p className="text-white/60">Aucune donnée de prédiction disponible</p>
          </div>
        ) : (
          <motion.div 
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Doughnut data={chartData} options={chartOptions} />
          </motion.div>
        )}
      </div>
      
      {!isLoading && !error && predictionData && (
        <div className="mt-4 text-sm">
          <div className="p-3 bg-background-light/30 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <p className="text-white/80 font-medium">Prédiction pour</p>
              <p className="text-white font-semibold">{new Date(predictionData.prediction_date).toLocaleDateString('fr-FR')}</p>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-white/80 font-medium">Confiance</p>
              <p className="text-white font-semibold">{(predictionData.confidence * 100).toFixed(1)}%</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-white/80 font-medium">Méthode</p>
              <p className="text-white font-semibold">{predictionData.method}</p>
            </div>
          </div>
          <p className="mt-3 text-white/60 text-xs">
            Ces prédictions sont basées sur les tendances historiques et les conditions actuelles.
            Elles sont fournies à titre indicatif et peuvent varier en fonction des conditions réelles.
          </p>
        </div>
      )}
    </div>
  );
};

export default QualityPredictionWidget;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from './UIComponents';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface QualityTrendsWidgetProps {
  title?: string;
  className?: string;
  dateRange?: string;
  farmId?: number;
}

const QualityTrendsWidget: React.FC<QualityTrendsWidgetProps> = ({
  title = "Tendances de qualité",
  className = "",
  dateRange = "month",
  farmId
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simuler un chargement de données
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Générer des données fictives basées sur la plage de dates
        const data = generateDemoData(dateRange);
        setChartData(data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dateRange, farmId]);

  const generateDemoData = (range: string) => {
    let labels: string[] = [];
    
    // Générer les labels en fonction de la plage de dates
    switch (range) {
      case 'day':
        labels = Array.from({ length: 24 }, (_, i) => `${i}h`);
        break;
      case 'week':
        labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        break;
      case 'month':
        labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
        break;
      case 'year':
        labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        break;
      default:
        labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
    }
    
    // Générer des données pour chaque qualité
    const datasets: any[] = [];
    
    // Modifier légèrement les données si un farmId est spécifié
    const farmFactor = farmId ? (farmId % 5) / 10 : 0;
    
    // Excellente qualité (tendance à la hausse)
    datasets.push({
      label: 'Excellente',
      data: labels.map((_, i) => 20 + Math.sin(i / 5) * 5 + i / 4 + farmFactor * 10),
      borderColor: 'rgba(34, 197, 94, 1)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4
    });
    
    // Bonne qualité (stable avec légère baisse)
    datasets.push({
      label: 'Bonne',
      data: labels.map((_, i) => 40 - Math.sin(i / 7) * 3 - i / 10 + farmFactor * 5),
      borderColor: 'rgba(59, 130, 246, 1)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    });
    
    // Moyenne qualité (en baisse)
    datasets.push({
      label: 'Moyenne',
      data: labels.map((_, i) => 30 - Math.cos(i / 6) * 4 - i / 5 - farmFactor * 8),
      borderColor: 'rgba(250, 204, 21, 1)',
      backgroundColor: 'rgba(250, 204, 21, 0.1)',
      tension: 0.4
    });
    
    // Faible qualité (stable à bas niveau)
    datasets.push({
      label: 'Faible',
      data: labels.map((_, i) => 10 + Math.sin(i / 8) * 2 - farmFactor * 3),
      borderColor: 'rgba(239, 68, 68, 1)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4
    });
    
    return {
      labels,
      datasets
    };
  };

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
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.7)',
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
        min: 0,
        max: 100
      }
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-xl font-semibold mb-4">{title}{farmId ? ` - Ferme #${farmId}` : ''}</h3>
      
      <div className="h-80">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-primary"></div>
          </div>
        ) : chartData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="flex justify-center items-center h-full text-white/60">
            Aucune donnée disponible
          </div>
        )}
      </div>
      
      <div className="mt-4 text-white/60 text-sm">
        <p>Ce graphique montre la répartition des qualités de prunes au fil du temps.</p>
        {farmId && <p>Filtré pour la ferme #{farmId}.</p>}
      </div>
    </Card>
  );
};

export default QualityTrendsWidget;

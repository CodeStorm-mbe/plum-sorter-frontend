import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { motion } from 'framer-motion';
import { Calendar, Filter, ArrowUpDown, Download } from 'lucide-react';
import Button from './Button';
import { ClassificationService } from '../services';
import { useToast } from '../hooks/use-toast';

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface QualityTrendsWidgetProps {
  title?: string;
  className?: string;
  dateRange: string;
  farmId?: number;
}

/**
 * Widget affichant les tendances de qualité des prunes au fil du temps
 */
const QualityTrendsWidget: React.FC<QualityTrendsWidgetProps> = ({
  title = "Tendances de qualité",
  className = "",
  dateRange = 'week',
  farmId
}) => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [qualityFilter, setQualityFilter] = useState<string>('all');

  // Charger les données de tendances
  useEffect(() => {
    const loadTrends = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Convertir la plage de dates en paramètres pour l'API
        const params: any = { period: dateRange };
        if (farmId) {
          params.farm_id = farmId;
        }
        
        const trendsData = await ClassificationService.getQualityTrends(params);
        setData(trendsData);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des tendances');
        console.error('Erreur lors du chargement des tendances:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTrends();
  }, [dateRange, farmId]);

  // Préparer les données pour le graphique
  const prepareChartData = () => {
    if (!data || !data.trends || !Array.isArray(data.trends)) return null;
    
    const labels = data.trends.map((item: any) => item.date);
    const datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
      tension: number;
      borderWidth: number;
      pointRadius: number;
      pointBackgroundColor: string;
    }> = [];
    
    // Couleurs pour chaque qualité
    const colors = {
      'bonne_qualite': 'rgba(5, 255, 161, 0.8)',
      'non_mure': 'rgba(255, 226, 2, 0.8)',
      'tachetee': 'rgba(255, 158, 0, 0.8)',
      'fissuree': 'rgba(255, 42, 109, 0.8)',
      'meurtrie': 'rgba(181, 55, 242, 0.8)',
      'pourrie': 'rgba(255, 56, 96, 0.8)'
    };
    
    // Libellés pour chaque qualité
    const qualityLabels = {
      'bonne_qualite': 'Bonne qualité',
      'non_mure': 'Non mûre',
      'tachetee': 'Tachetée',
      'fissuree': 'Fissurée',
      'meurtrie': 'Meurtrie',
      'pourrie': 'Pourrie'
    };
    
    // Ajouter un dataset pour chaque qualité
    if (data.quality_types && typeof data.quality_types === 'object') {
      Object.entries(data.quality_types).forEach(([key, label]: [string, any]) => {
        // Si un filtre est appliqué et que ce n'est pas "all" ou la qualité actuelle, ignorer
        if (qualityFilter !== 'all' && qualityFilter !== key) return;
        
        const values = Array.isArray(data.trends) ? data.trends.map((item: any) => 
          item.qualities && typeof item.qualities === 'object' ? (item.qualities[key] || 0) : 0
        ) : [];
        
        datasets.push({
          label: qualityLabels[key as keyof typeof qualityLabels] || key,
          data: values,
          borderColor: colors[key as keyof typeof colors] || 'rgba(255, 255, 255, 0.8)',
          backgroundColor: chartType === 'line' 
            ? colors[key as keyof typeof colors]?.replace('0.8', '0.2') || 'rgba(255, 255, 255, 0.2)'
            : colors[key as keyof typeof colors] || 'rgba(255, 255, 255, 0.8)',
          fill: chartType === 'line',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: colors[key as keyof typeof colors] || 'rgba(255, 255, 255, 0.8)',
        });
      });
    }
    
    return {
      labels,
      datasets
    };
  };

  // Options du graphique
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          boxWidth: 12,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.7)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('fr-FR', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(context.parsed.y / 100);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            family: "'Inter', sans-serif",
            size: 11
          },
          callback: function(value: any) {
            return value + '%';
          }
        }
      }
    }
  };

  // Obtenir les données formatées pour le graphique
  const chartData = prepareChartData();

  // Exporter les données
  const handleExport = () => {
    if (!data) return;
    
    try {
      // Créer un objet CSV
      let csv = 'Date,';
      
      // Ajouter les en-têtes pour chaque qualité
      if (data.quality_types && typeof data.quality_types === 'object') {
        Object.entries(data.quality_types).forEach(([key, label]: [string, any]) => {
          csv += `${label},`;
        });
      }
      csv += '\n';
      
      // Ajouter les données pour chaque jour
      if (Array.isArray(data.trends)) {
        data.trends.forEach((item: any) => {
          csv += `${item.date},`;
          if (data.quality_types && typeof data.quality_types === 'object' && item.qualities && typeof item.qualities === 'object') {
            Object.entries(data.quality_types).forEach(([key, _]: [string, any]) => {
              csv += `${item.qualities[key] || 0}%,`;
            });
          }
          csv += '\n';
        });
      }
      
      // Créer un blob et télécharger
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `tendances_qualite_${dateRange}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast({
        type: 'success',
        title: 'Exportation réussie',
        message: 'Les données ont été exportées avec succès'
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Erreur d\'exportation',
        message: 'Impossible d\'exporter les données'
      });
    }
  };

  return (
    <div className={`card p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-title font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          {title}
        </h3>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={qualityFilter}
              onChange={(e) => setQualityFilter(e.target.value)}
              className="bg-background-light/50 border border-white/10 text-white rounded-md px-3 py-1 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-accent-primary text-sm"
            >
              <option value="all">Toutes les qualités</option>
              <option value="bonne_qualite">Bonne qualité</option>
              <option value="non_mure">Non mûre</option>
              <option value="tachetee">Tachetée</option>
              <option value="fissuree">Fissurée</option>
              <option value="meurtrie">Meurtrie</option>
              <option value="pourrie">Pourrie</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-white/60 pointer-events-none" />
          </div>
          
          <div className="flex items-center bg-background-light/50 border border-white/10 rounded-md">
            <button
              className={`p-2 ${chartType === 'line' ? 'bg-accent-primary/20 text-accent-primary' : 'text-white/60 hover:text-white'}`}
              onClick={() => setChartType('line')}
              title="Graphique en ligne"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </button>
            <button
              className={`p-2 ${chartType === 'bar' ? 'bg-accent-primary/20 text-accent-primary' : 'text-white/60 hover:text-white'}`}
              onClick={() => setChartType('bar')}
              title="Graphique en barres"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="10" width="4" height="10" />
                <rect x="10" y="4" width="4" height="16" />
                <rect x="18" y="8" width="4" height="12" />
              </svg>
            </button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            icon={<Download className="h-4 w-4 mr-1" />}
            onClick={handleExport}
            disabled={isLoading || !data}
          >
            Exporter
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-primary"></div>
          <span className="ml-2 text-white/60">Chargement des tendances...</span>
        </div>
      ) : error ? (
        <div className="p-4 text-center h-64 flex flex-col justify-center items-center">
          <p className="text-red-500 mb-2">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </div>
      ) : !chartData || !chartData.datasets || chartData.datasets.length === 0 ? (
        <div className="p-4 text-center h-64 flex flex-col justify-center items-center">
          <p className="text-white/60">
            {qualityFilter !== 'all' 
              ? `Aucune donnée disponible pour la qualité sélectionnée.` 
              : `Aucune donnée de tendance disponible pour la période sélectionnée.`}
          </p>
          {qualityFilter !== 'all' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => setQualityFilter('all')}
            >
              Afficher toutes les qualités
            </Button>
          )}
        </div>
      ) : (
        <div className="h-64">
          {chartType === 'line' ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <Bar data={chartData} options={chartOptions} />
          )}
        </div>
      )}
      
      {data && data.insights && (
        <div className="mt-4 p-3 bg-background-light/30 rounded-lg">
          <h4 className="font-medium text-white mb-1">Analyse des tendances</h4>
          <p className="text-white/70 text-sm">{data.insights.summary}</p>
          
          {data.insights.recommendations && Array.isArray(data.insights.recommendations) && data.insights.recommendations.length > 0 && (
            <div className="mt-2">
              <h5 className="text-xs font-medium text-white/80">Recommandations :</h5>
              <ul className="list-disc list-inside text-white/70 text-xs mt-1">
                {data.insights.recommendations.map((rec: string, index: number) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QualityTrendsWidget;

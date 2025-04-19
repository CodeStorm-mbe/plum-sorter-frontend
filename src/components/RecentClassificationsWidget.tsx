import React from 'react';
import { useDashboard } from '../contexts/DashboardContext';
import { useAuth } from '../contexts/AuthContext';

interface RecentClassificationsWidgetProps {
  title?: string;
  className?: string;
  limit?: number;
}

/**
 * Widget affichant les classifications récentes
 */
const RecentClassificationsWidget: React.FC<RecentClassificationsWidgetProps> = ({
  title = "Classifications récentes",
  className = "",
  limit = 5
}) => {
  const { dashboardData, isLoading, error } = useDashboard();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className={`card p-4 ${className}`}>
        <h3 className="text-xl font-title font-semibold mb-4">{title}</h3>
        <div className="animate-pulse space-y-4">
          {[...Array(limit)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="rounded-md bg-background-light/50 h-16 w-16"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-background-light/50 rounded w-3/4"></div>
                <div className="h-4 bg-background-light/50 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className={`card p-4 ${className}`}>
        <h3 className="text-xl font-title font-semibold mb-4">{title}</h3>
        <p className="text-red-500">
          {error || "Aucune donnée disponible"}
        </p>
      </div>
    );
  }

  // Récupérer les classifications récentes
  const recentClassifications = dashboardData.recentClassifications || [];

  return (
    <div className={`card p-4 ${className}`}>
      <h3 className="text-xl font-title font-semibold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
        {title}
      </h3>
      
      {recentClassifications.length > 0 ? (
        <div className="space-y-4">
          {recentClassifications.slice(0, limit).map((classification, index) => (
            <div key={index} className="flex items-center p-3 bg-background-light/30 rounded-lg">
              <div className="h-16 w-16 rounded-md overflow-hidden mr-4">
                <img 
                  src={classification.image || `https://via.placeholder.com/80x80?text=Prune+${index+1}`} 
                  alt={`Classification ${index+1}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">
                  {getQualityLabel(classification.class_name)}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-white/60 text-sm">
                    Confiance: {(classification.confidence_score * 100).toFixed(1)}%
                  </p>
                  <p className="text-white/60 text-xs">
                    {formatDate(classification.created_at)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-32">
          <p className="text-white/60">Aucune classification récente</p>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <button className="text-accent-primary hover:text-accent-secondary transition-colors">
          Voir toutes les classifications
        </button>
      </div>
    </div>
  );
};

// Fonction pour obtenir le libellé d'une qualité à partir de sa clé
function getQualityLabel(key: string): string {
  const labels: Record<string, string> = {
    'bonne_qualite': 'Bonne qualité',
    'non_mure': 'Non mûre',
    'tachetee': 'Tachetée',
    'fissuree': 'Fissurée',
    'meurtrie': 'Meurtrie',
    'pourrie': 'Pourrie'
  };
  
  return labels[key] || key;
}

// Fonction pour formater une date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export default RecentClassificationsWidget;

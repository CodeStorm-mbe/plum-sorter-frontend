import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../contexts/DashboardContext';
import { Activity, AlertTriangle, Server } from 'lucide-react';

interface SystemStatusWidgetProps {
  title?: string;
  className?: string;
}

/**
 * Widget affichant l'état du système (spécifique aux administrateurs)
 */
const SystemStatusWidget: React.FC<SystemStatusWidgetProps> = ({
  title = "État du système",
  className = ""
}) => {
  const { dashboardData, isLoading, error } = useDashboard();
  const { user } = useAuth();

  // Vérifier si l'utilisateur est un administrateur
  if (user?.role !== 'admin') {
    return null; // Ne pas afficher ce widget pour les non-administrateurs
  }

  if (isLoading) {
    return (
      <div className={`card p-4 ${className}`}>
        <h3 className="text-xl font-title font-semibold mb-4">{title}</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-background-light/50 rounded w-3/4"></div>
          <div className="h-4 bg-background-light/50 rounded w-1/2"></div>
          <div className="h-4 bg-background-light/50 rounded w-5/6"></div>
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

  // Récupérer les données du système (pour les administrateurs)
  const adminData = dashboardData as any;
  const systemPerformance = adminData.systemPerformance || {};
  
  // Données du système
  const systemData = [
    {
      icon: <Server size={20} />,
      label: "Version du modèle",
      value: systemPerformance.modelVersion || "N/A",
      status: "normal"
    },
    {
      icon: <Activity size={20} />,
      label: "Temps de traitement moyen",
      value: `${(systemPerformance.averageProcessingTime || 0).toFixed(2)}s`,
      status: systemPerformance.averageProcessingTime > 1.5 ? "warning" : "normal"
    },
    {
      icon: <AlertTriangle size={20} />,
      label: "Temps de réponse API",
      value: `${(systemPerformance.apiResponseTime || 0).toFixed(2)}s`,
      status: systemPerformance.apiResponseTime > 0.5 ? "warning" : "normal"
    }
  ];

  return (
    <div className={`card p-4 ${className}`}>
      <h3 className="text-xl font-title font-semibold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
        {title}
      </h3>
      
      <div className="space-y-4">
        {systemData.map((item, index) => (
          <div key={index} className="flex items-center p-3 bg-background-light/30 rounded-lg">
            <div className={`p-2 rounded-full mr-4 ${
              item.status === "warning" ? "bg-yellow-500/20 text-yellow-500" : 
              item.status === "error" ? "bg-red-500/20 text-red-500" : 
              "bg-green-500/20 text-green-500"
            }`}>
              {item.icon}
            </div>
            <div className="flex-1">
              <p className="text-white/60 text-sm">{item.label}</p>
              <p className="font-semibold text-white">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <button className="text-accent-primary hover:text-accent-secondary transition-colors">
          Voir tous les paramètres système
        </button>
      </div>
    </div>
  );
};

export default SystemStatusWidget;

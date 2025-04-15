import React from 'react';
import { useDashboard } from '../contexts/DashboardContext';
import { useAuth } from '../contexts/AuthContext';

interface StatsSummaryWidgetProps {
  title?: string;
  className?: string;
}

/**
 * Widget affichant un résumé des statistiques principales adaptées au rôle de l'utilisateur
 */
const StatsSummaryWidget: React.FC<StatsSummaryWidgetProps> = ({
  title = "Résumé des statistiques",
  className = ""
}) => {
  const { dashboardData, isLoading, error } = useDashboard();
  const { user } = useAuth();

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

  // Statistiques communes à tous les rôles
  const commonStats = [
    {
      label: "Classifications totales",
      value: dashboardData.totalClassifications.toLocaleString(),
      color: "text-accent-primary"
    },
    {
      label: "Confiance moyenne",
      value: `${(dashboardData.averageConfidence * 100).toFixed(1)}%`,
      color: "text-accent-secondary"
    }
  ];

  // Statistiques spécifiques selon le rôle
  let roleSpecificStats: { label: string; value: string; color: string }[] = [];

  if (user?.role === 'admin' && 'totalUsers' in dashboardData) {
    const adminData = dashboardData as any;
    roleSpecificStats = [
      {
        label: "Utilisateurs actifs",
        value: adminData.activeUsers.toLocaleString(),
        color: "text-accent-tertiary"
      },
      {
        label: "Version du modèle",
        value: adminData.systemPerformance?.modelVersion || "N/A",
        color: "text-green-500"
      }
    ];
  } else if (user?.role === 'technician' && 'managedFarms' in dashboardData) {
    const technicianData = dashboardData as any;
    roleSpecificStats = [
      {
        label: "Fermes gérées",
        value: technicianData.managedFarms.toLocaleString(),
        color: "text-accent-tertiary"
      }
    ];
  } else if (user?.role === 'farmer' && 'farms' in dashboardData) {
    const farmerData = dashboardData as any;
    roleSpecificStats = [
      {
        label: "Nombre de lots",
        value: farmerData.totalBatches.toLocaleString(),
        color: "text-accent-tertiary"
      },
      {
        label: "Lots en attente",
        value: farmerData.pendingBatches.toLocaleString(),
        color: "text-yellow-500"
      }
    ];
  }

  // Combiner les statistiques communes et spécifiques au rôle
  const allStats = [...commonStats, ...roleSpecificStats];

  return (
    <div className={`card p-4 ${className}`}>
      <h3 className="text-xl font-title font-semibold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
        {title}
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {allStats.map((stat, index) => (
          <div key={index} className="p-3 bg-background-light/30 rounded-lg">
            <p className="text-white/60 text-sm">{stat.label}</p>
            <p className={`text-xl font-bold mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSummaryWidget;

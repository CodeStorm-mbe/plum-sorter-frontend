import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../contexts/DashboardContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface FarmPerformanceWidgetProps {
  title?: string;
  className?: string;
}

/**
 * Widget affichant les performances des fermes (spécifique aux techniciens et administrateurs)
 */
const FarmPerformanceWidget: React.FC<FarmPerformanceWidgetProps> = ({
  title = "Performance des fermes",
  className = ""
}) => {
  const { dashboardData, isLoading, error } = useDashboard();
  const { user } = useAuth();

  // Vérifier si l'utilisateur est un technicien ou un administrateur
  const isTechnicianOrAdmin = user?.role === 'technician' || user?.role === 'admin';

  if (!isTechnicianOrAdmin) {
    return null; // Ne pas afficher ce widget pour les agriculteurs
  }

  if (isLoading) {
    return (
      <div className={`card p-4 ${className}`}>
        <h3 className="text-xl font-title font-semibold mb-4">{title}</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-background-light/50 rounded w-3/4"></div>
          <div className="h-40 bg-background-light/50 rounded"></div>
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

  // Récupérer les données des fermes
  let farmData: any[] = [];
  
  if (user?.role === 'technician' && 'farmPerformance' in dashboardData) {
    const technicianData = dashboardData as any;
    farmData = technicianData.farmPerformance || [];
  } else if (user?.role === 'admin' && 'farms' in dashboardData) {
    const adminData = dashboardData as any;
    farmData = adminData.farms || [];
  }

  // Préparer les données pour le graphique
  const chartData = farmData.map(farm => {
    const goodQualityPercentage = farm.class_percentages?.bonne_qualite || 0;
    const otherQualityPercentage = 100 - goodQualityPercentage;
    
    return {
      name: farm.name,
      bonneQualite: goodQualityPercentage,
      autreQualite: otherQualityPercentage,
      totalClassifications: farm.total_classifications || 0
    };
  });

  return (
    <div className={`card p-4 ${className}`}>
      <h3 className="text-xl font-title font-semibold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
        {title}
      </h3>
      
      {chartData.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#ccc' }} 
                angle={-45} 
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: '#ccc' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
              />
              <Legend />
              <Bar 
                dataKey="bonneQualite" 
                name="Bonne qualité" 
                fill="#05ffa1" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="autreQualite" 
                name="Autre qualité" 
                fill="#ff9e00" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-white/60">Aucune donnée de performance disponible</p>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <button className="text-accent-primary hover:text-accent-secondary transition-colors">
          Voir toutes les statistiques
        </button>
      </div>
    </div>
  );
};

export default FarmPerformanceWidget;

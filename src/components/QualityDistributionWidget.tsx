import React from 'react';
import { useDashboard } from '../contexts/DashboardContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface QualityDistributionWidgetProps {
  title?: string;
  className?: string;
}

/**
 * Widget affichant la répartition des qualités de prunes sous forme de graphique circulaire
 */
const QualityDistributionWidget: React.FC<QualityDistributionWidgetProps> = ({
  title = "Répartition par qualité",
  className = ""
}) => {
  const { dashboardData, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className={`card p-4 ${className}`}>
        <h3 className="text-xl font-title font-semibold mb-4">{title}</h3>
        <div className="animate-pulse flex justify-center items-center h-64">
          <div className="rounded-full bg-background-light/50 h-40 w-40"></div>
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

  // Préparer les données pour le graphique
  const qualityData = Object.entries(dashboardData.classPercentages || {}).map(([key, value]) => ({
    name: getQualityLabel(key),
    value: value,
    color: getQualityColor(key)
  }));

  return (
    <div className={`card p-4 ${className}`}>
      <h3 className="text-xl font-title font-semibold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
        {title}
      </h3>
      
      {qualityData.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={qualityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {qualityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-white/60">Aucune donnée de qualité disponible</p>
        </div>
      )}
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

// Fonction pour obtenir la couleur d'une qualité à partir de sa clé
function getQualityColor(key: string): string {
  const colors: Record<string, string> = {
    'bonne_qualite': '#05ffa1',
    'non_mure': '#ffe202',
    'tachetee': '#ff9e00',
    'fissuree': '#ff2a6d',
    'meurtrie': '#b537f2',
    'pourrie': '#ff3860'
  };
  
  return colors[key] || '#cccccc';
}

export default QualityDistributionWidget;

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Text } from '@mantine/core';

interface ClassificationChartProps {
  data: Record<string, number>;
  height?: number;
}

// Couleurs pour les différentes classes de prunes
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B6B'];

export const ClassificationChart: React.FC<ClassificationChartProps> = ({ data, height = 300 }) => {
  // Transformer les données pour Recharts
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value
  }));

  // Si aucune donnée, afficher un message
  if (chartData.length === 0) {
    return <Text ta="center">Aucune donnée disponible</Text>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Pourcentage']}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

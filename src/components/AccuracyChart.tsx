import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AccuracyChartProps {
  data: Array<{
    name: string;
    accuracy: number;
  }>;
  className?: string;
}

const AccuracyChart: React.FC<AccuracyChartProps> = ({ data, className = '' }) => {
  return (
    <div className={`w-full h-80 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
          <YAxis stroke="rgba(255,255,255,0.7)" domain={[80, 100]} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#2d2d44', 
              borderColor: 'rgba(255,255,255,0.1)', 
              color: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            labelStyle={{ color: 'white' }}
          />
          <Legend 
            formatter={(value) => <span style={{ color: 'white' }}>{value}</span>}
          />
          <Bar 
            dataKey="accuracy" 
            name="Précision (%)" 
            fill="#50c878" 
            radius={[4, 4, 0, 0]} 
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AccuracyChart;

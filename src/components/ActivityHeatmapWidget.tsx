import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from './UIComponents';
import { HeatMapGrid } from 'react-grid-heatmap';

interface ActivityHeatmapWidgetProps {
  title?: string;
  className?: string;
  data?: number[][];
  xLabels?: string[];
  yLabels?: string[];
}

const ActivityHeatmapWidget: React.FC<ActivityHeatmapWidgetProps> = ({
  title = "Heatmap d'activité",
  className = "",
  data,
  xLabels,
  yLabels
}) => {
  const [activityData, setActivityData] = useState<number[][]>([]);
  const [xAxisLabels, setXAxisLabels] = useState<string[]>([]);
  const [yAxisLabels, setYAxisLabels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Si des données sont fournies en props, les utiliser
    if (data && xLabels && yLabels) {
      setActivityData(data);
      setXAxisLabels(xLabels);
      setYAxisLabels(yLabels);
      setIsLoading(false);
      return;
    }

    // Sinon, générer des données de démonstration
    const generateDemoData = () => {
      // Jours de la semaine
      const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      
      // Heures de la journée (de 6h à 22h)
      const hours = Array.from({ length: 17 }, (_, i) => `${i + 6}h`);
      
      // Générer des données aléatoires pour la heatmap
      const heatmapData = Array.from({ length: hours.length }, () => 
        Array.from({ length: days.length }, () => Math.random())
      );
      
      setXAxisLabels(days);
      setYAxisLabels(hours);
      setActivityData(heatmapData);
      setIsLoading(false);
    };

    generateDemoData();
  }, [data, xLabels, yLabels]);

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-primary"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <HeatMapGrid
            data={activityData}
            xLabels={xAxisLabels}
            yLabels={yAxisLabels}
            cellHeight="30px"
            cellStyle={(x: number, y: number, ratio: number) => ({
              background: `rgba(66, 153, 225, ${ratio})`,
              fontSize: '0.8rem',
              color: ratio > 0.5 ? '#fff' : '#000'
            })}
            cellRender={(x: number, y: number, value: number) => (
              <div title={`${value.toFixed(2)}`}>{value.toFixed(1)}</div>
            )}
            xLabelsStyle={() => ({
              color: 'white',
              fontSize: '0.8rem',
              textAlign: 'center'
            })}
            yLabelsStyle={() => ({
              color: 'white',
              fontSize: '0.8rem',
              textAlign: 'right',
              paddingRight: '10px'
            })}
          />
        </div>
      </div>
      
      <div className="mt-4 text-white/60 text-sm">
        <p>Cette heatmap montre l'activité des utilisateurs par jour et heure.</p>
        <p>Les couleurs plus foncées indiquent une activité plus intense.</p>
      </div>
    </Card>
  );
};

export default ActivityHeatmapWidget;
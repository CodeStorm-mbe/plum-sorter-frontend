import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock, BarChart2, Droplet, Thermometer, Wind, Sun } from 'lucide-react';
import Button from './Button';
import { formatDate, getQualityColor } from '../utils/apiUtils';

interface FarmCardProps {
  farm: any;
  className?: string;
}

/**
 * Carte améliorée pour l'affichage d'une ferme dans le dashboard
 */
const FarmDashboardCard: React.FC<FarmCardProps> = ({ farm, className = "" }) => {
  // Calculer le score de qualité moyen
  const qualityScore = farm.qualityScore || farm.quality_score || Math.floor(Math.random() * 100);
  
  // Déterminer la couleur du score de qualité
  let qualityColor = 'text-red-500';
  let qualityBg = 'bg-red-500/10';
  let qualityBorder = 'border-red-500/20';
  
  if (qualityScore >= 80) {
    qualityColor = 'text-green-500';
    qualityBg = 'bg-green-500/10';
    qualityBorder = 'border-green-500/20';
  } else if (qualityScore >= 60) {
    qualityColor = 'text-yellow-500';
    qualityBg = 'bg-yellow-500/10';
    qualityBorder = 'border-yellow-500/20';
  } else if (qualityScore >= 40) {
    qualityColor = 'text-orange-500';
    qualityBg = 'bg-orange-500/10';
    qualityBorder = 'border-orange-500/20';
  }

  // Obtenir les données météo (simulées ou réelles)
  const weather = farm.weather || {
    temperature: Math.floor(Math.random() * 15) + 15,
    humidity: Math.floor(Math.random() * 30) + 50,
    wind: Math.floor(Math.random() * 20) + 5,
    condition: ['Ensoleillé', 'Nuageux', 'Partiellement nuageux', 'Pluvieux'][Math.floor(Math.random() * 4)]
  };

  // Obtenir les statistiques des lots
  const batchStats = farm.batchStats || {
    total: farm.batchesCount || farm.batches_count || Math.floor(Math.random() * 10) + 1,
    pending: Math.floor(Math.random() * 3),
    completed: Math.floor(Math.random() * 5) + 1
  };

  return (
    <motion.div 
      className={`card p-5 border ${qualityBorder} ${className}`}
      whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{farm.name}</h3>
          <p className="text-white/60 text-sm">{farm.location}</p>
        </div>
        <div className={`px-3 py-1 rounded-full ${qualityBg} ${qualityColor} text-lg font-bold`}>
          {qualityScore}%
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 rounded-lg bg-background-light/30">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white/80 text-sm font-medium">Météo</h4>
            <Sun className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-white/70 text-xs">
                <Thermometer className="h-3 w-3 mr-1 text-red-400" />
                <span>Température</span>
              </div>
              <span className="text-white font-medium">{weather.temperature}°C</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-white/70 text-xs">
                <Droplet className="h-3 w-3 mr-1 text-blue-400" />
                <span>Humidité</span>
              </div>
              <span className="text-white font-medium">{weather.humidity}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-white/70 text-xs">
                <Wind className="h-3 w-3 mr-1 text-teal-400" />
                <span>Vent</span>
              </div>
              <span className="text-white font-medium">{weather.wind} km/h</span>
            </div>
          </div>
        </div>
        
        <div className="p-3 rounded-lg bg-background-light/30">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white/80 text-sm font-medium">Lots</h4>
            <BarChart2 className="h-4 w-4 text-accent-primary" />
          </div>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs">Total</span>
              <span className="text-white font-medium">{batchStats.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs">En attente</span>
              <span className="text-yellow-500 font-medium">{batchStats.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs">Terminés</span>
              <span className="text-green-500 font-medium">{batchStats.completed}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-white/50 mb-4">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>Mise à jour: {formatDate(farm.updatedAt || farm.updated_at || new Date().toISOString(), { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div>{farm.size} hectares</div>
      </div>
      
      <Link to={`/farms/${farm.id}`}>
        <Button 
          variant="ghost" 
          className="w-full justify-between hover:bg-background-light/30"
          size="sm"
        >
          <span>Voir les détails</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Link>
    </motion.div>
  );
};

export default FarmDashboardCard;

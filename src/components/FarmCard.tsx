import React from 'react';
import { Link } from 'react-router-dom';
import { Tractor, MapPin, Calendar, ArrowRight, Edit, Trash2 } from 'lucide-react';
import Button from './Button';
import { Farm } from '../types';

interface FarmCardProps {
  farm: Farm;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Carte représentant une ferme dans la vue en grille
 */
const FarmCard: React.FC<FarmCardProps> = ({ farm, onClick, onEdit, onDelete }) => {
  // Calculer le score de qualité moyen (exemple)
  const qualityScore = farm.quality_score || Math.floor(Math.random() * 100);
  
  // Déterminer la couleur du score de qualité
  let qualityColor = 'text-red-500';
  if (qualityScore >= 80) qualityColor = 'text-green-500';
  else if (qualityScore >= 60) qualityColor = 'text-yellow-500';
  else if (qualityScore >= 40) qualityColor = 'text-orange-500';
  
  return (
    <div className="card p-5 hover:bg-background-light/20 transition-all duration-300 border border-white/5 hover:border-accent-primary/20">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-accent-primary/20 mr-3">
            <Tractor className="h-5 w-5 text-accent-primary" />
          </div>
          <h3 className="font-semibold text-white text-lg">{farm.name}</h3>
        </div>
        <div className={`font-bold text-lg ${qualityColor}`}>
          {qualityScore}%
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-white/70">
          <MapPin className="h-4 w-4 mr-2 text-accent-primary" />
          {farm.location}
        </div>
        <div className="flex items-center text-white/70">
          <Calendar className="h-4 w-4 mr-2 text-accent-secondary" />
          {new Date(farm.created_at).toLocaleDateString('fr-FR')}
        </div>
      </div>
      
      <div className="text-white/60 text-sm mb-4 h-12 overflow-hidden">
        {farm.description || "Aucune description disponible."}
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-white/70 text-sm">
          <span className="font-medium">{farm.size}</span> hectares
          {farm.batches_count && (
            <span className="ml-3 px-2 py-1 bg-background-light/30 rounded-md">
              {farm.batches_count} lots
            </span>
          )}
        </div>
        
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4 text-white/60 hover:text-red-500" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Modifier"
          >
            <Edit className="h-4 w-4 text-white/60 hover:text-accent-primary" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClick}
            title="Voir les détails"
          >
            <ArrowRight className="h-4 w-4 text-white/60 hover:text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FarmCard;

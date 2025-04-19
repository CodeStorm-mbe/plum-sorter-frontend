import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, MapPin, ArrowRight, Plus } from 'lucide-react';
import Button from './Button';
import { Farm } from '../types';

interface FarmOverviewWidgetProps {
  title?: string;
  className?: string;
  farms: Farm[];
  selectedFarm: number | 'all';
  onSelectFarm: (farmId: number | 'all') => void;
}

/**
 * Widget affichant une vue d'ensemble des fermes de l'agriculteur
 */
const FarmOverviewWidget: React.FC<FarmOverviewWidgetProps> = ({
  title = "Mes fermes",
  className = "",
  farms = [],
  selectedFarm,
  onSelectFarm
}) => {
  if (!Array.isArray(farms) || farms.length === 0) {
    return (
      <div className={`card p-4 ${className}`}>
        <h3 className="text-xl font-title font-semibold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          {title}
        </h3>
        <div className="p-6 text-center">
          <p className="text-white/60 mb-4">Vous n'avez pas encore de fermes enregistrées.</p>
          <Link to="/farms/new">
            <Button variant="primary" icon={<Plus className="h-4 w-4 mr-2" />}>
              Ajouter une ferme
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`card p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-title font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          {title}
        </h3>
        <Link to="/farms/new">
          <Button variant="outline" size="sm" icon={<Plus className="h-4 w-4 mr-1" />}>
            Ajouter
          </Button>
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-white/60 font-medium">Nom</th>
              <th className="text-left py-3 px-4 text-white/60 font-medium">Localisation</th>
              <th className="text-left py-3 px-4 text-white/60 font-medium">Superficie</th>
              <th className="text-left py-3 px-4 text-white/60 font-medium">Lots</th>
              <th className="text-left py-3 px-4 text-white/60 font-medium">Qualité</th>
              <th className="text-right py-3 px-4 text-white/60 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(farms) && farms.map((farm) => {
              // Calculer le score de qualité moyen (exemple)
              const qualityScore = farm.quality_score || Math.floor(Math.random() * 100);
              
              // Déterminer la couleur du score de qualité
              let qualityColor = 'text-red-500';
              if (qualityScore >= 80) qualityColor = 'text-green-500';
              else if (qualityScore >= 60) qualityColor = 'text-yellow-500';
              else if (qualityScore >= 40) qualityColor = 'text-orange-500';
              
              return (
                <tr 
                  key={farm.id} 
                  className={`border-b border-white/5 hover:bg-background-light/20 transition-colors cursor-pointer ${
                    selectedFarm === farm.id ? 'bg-background-light/30' : ''
                  }`}
                  onClick={() => onSelectFarm(farm.id)}
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-white">{farm.name}</div>
                    <div className="text-white/60 text-xs">ID: {farm.id}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-white/80">
                      <MapPin className="h-4 w-4 mr-1 text-accent-primary" />
                      {farm.location}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white/80">
                    {farm.size} hectares
                  </td>
                  <td className="py-3 px-4 text-white/80">
                    {farm.batches_count || '0'} lots
                  </td>
                  <td className="py-3 px-4">
                    <div className={`font-medium ${qualityColor}`}>
                      {qualityScore}%
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link to={`/farms/${farm.id}`}>
                        <Button variant="ghost" size="icon" title="Voir les détails">
                          <ArrowRight className="h-4 w-4 text-white/60 hover:text-white" />
                        </Button>
                      </Link>
                      <Link to={`/farms/${farm.id}/edit`}>
                        <Button variant="ghost" size="icon" title="Modifier">
                          <Edit className="h-4 w-4 text-white/60 hover:text-accent-primary" />
                        </Button>
                      </Link>
                      <Link to={`/farms/${farm.id}/delete`}>
                        <Button variant="ghost" size="icon" title="Supprimer">
                          <Trash2 className="h-4 w-4 text-white/60 hover:text-red-500" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-center">
        <Link to="/farms">
          <Button variant="link" className="text-accent-primary hover:text-accent-secondary transition-colors">
            Voir toutes les fermes
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FarmOverviewWidget;

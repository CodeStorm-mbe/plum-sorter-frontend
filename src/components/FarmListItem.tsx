import React from 'react';
import { Edit, Trash2, ArrowRight, MapPin, Calendar } from 'lucide-react';
import Button from './Button';
import { Farm } from '../types';

interface FarmListItemProps {
  farm: Farm;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Élément de liste représentant une ferme dans la vue en liste
 */
const FarmListItem: React.FC<FarmListItemProps> = ({ farm, onClick, onEdit, onDelete }) => {
  return (
    <tr className="border-b border-white/5 hover:bg-background-light/20 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center">
          <div className="p-1 rounded-full bg-accent-primary/20 mr-2">
            <div className="h-2 w-2 rounded-full bg-accent-primary"></div>
          </div>
          <div>
            <div className="font-medium text-white">{farm.name}</div>
            <div className="text-white/60 text-xs">ID: {farm.id}</div>
          </div>
        </div>
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
        <div className="flex items-center text-white/70">
          <Calendar className="h-4 w-4 mr-1 text-accent-secondary" />
          {new Date(farm.created_at).toLocaleDateString('fr-FR')}
        </div>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end space-x-2">
          <Button variant="ghost" size="icon" onClick={onClick} title="Voir les détails">
            <ArrowRight className="h-4 w-4 text-white/60 hover:text-white" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onEdit} title="Modifier">
            <Edit className="h-4 w-4 text-white/60 hover:text-accent-primary" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} title="Supprimer">
            <Trash2 className="h-4 w-4 text-white/60 hover:text-red-500" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default FarmListItem;

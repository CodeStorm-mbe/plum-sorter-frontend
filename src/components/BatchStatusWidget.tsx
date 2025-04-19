import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Filter, Calendar, ArrowUpDown, Loader, Plus } from 'lucide-react';
import Button from './Button';
import { PlumBatch } from '../types';
import { BatchService } from '../services';
import { useToast } from '../hooks/use-toast';
import { Link } from 'react-router-dom';

interface BatchStatusWidgetProps {
  title?: string;
  className?: string;
  farmId?: number;
}

/**
 * Widget affichant le statut des lots de prunes
 */
const BatchStatusWidget: React.FC<BatchStatusWidgetProps> = ({
  title = "Statut des lots",
  className = "",
  farmId
}) => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [batches, setBatches] = useState<PlumBatch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Charger les lots
  useEffect(() => {
    const loadBatches = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let batchesData;
        if (farmId) {
          batchesData = await BatchService.getBatchesByFarm(farmId);
        } else {
          batchesData = await BatchService.getBatches();
        }
        
        setBatches(batchesData);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des lots');
        console.error('Erreur lors du chargement des lots:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBatches();
  }, [farmId]);

  // Filtrer les lots selon le statut
  const filteredBatches = Array.isArray(batches) 
    ? (statusFilter === 'all' 
        ? batches 
        : batches.filter(batch => batch.status === statusFilter))
    : [];

  // Obtenir le nombre de lots par statut
  const statusCounts = Array.isArray(batches) 
    ? batches.reduce((acc, batch) => {
        acc[batch.status] = (acc[batch.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    : {} as Record<string, number>;

  // Obtenir la couleur selon le statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'processing':
        return 'text-blue-500';
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-white/60';
    }
  };

  // Obtenir le libellé selon le statut
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'processing':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'failed':
        return 'Échoué';
      default:
        return status;
    }
  };

  return (
    <div className={`card p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-title font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          {title}
        </h3>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-background-light/50 border border-white/10 text-white rounded-md px-3 py-1 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-accent-primary text-sm"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="processing">En cours</option>
              <option value="completed">Terminés</option>
              <option value="failed">Échoués</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-white/60 pointer-events-none" />
          </div>
          
          <Link to="/batches/new">
            <Button variant="outline" size="sm" icon={<Plus className="h-4 w-4 mr-1" />}>
              Nouveau lot
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Indicateurs de statut */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="p-2 bg-background-light/30 rounded-lg text-center">
          <div className="text-xs text-white/60 mb-1">Total</div>
          <div className="text-lg font-bold text-white">{batches.length}</div>
        </div>
        <div className="p-2 bg-background-light/30 rounded-lg text-center">
          <div className="text-xs text-white/60 mb-1">En attente</div>
          <div className="text-lg font-bold text-yellow-500">{statusCounts['pending'] || 0}</div>
        </div>
        <div className="p-2 bg-background-light/30 rounded-lg text-center">
          <div className="text-xs text-white/60 mb-1">En cours</div>
          <div className="text-lg font-bold text-blue-500">{statusCounts['processing'] || 0}</div>
        </div>
        <div className="p-2 bg-background-light/30 rounded-lg text-center">
          <div className="text-xs text-white/60 mb-1">Terminés</div>
          <div className="text-lg font-bold text-green-500">{statusCounts['completed'] || 0}</div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader className="h-6 w-6 text-accent-primary animate-spin" />
          <span className="ml-2 text-white/60">Chargement des lots...</span>
        </div>
      ) : error ? (
        <div className="p-4 text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </div>
      ) : filteredBatches.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-white/60">
            {statusFilter === 'all' 
              ? 'Aucun lot disponible.' 
              : `Aucun lot avec le statut "${getStatusLabel(statusFilter)}".`}
          </p>
          <Link to="/batches/new">
            <Button 
              variant="primary" 
              size="sm" 
              className="mt-2"
              icon={<Plus className="h-4 w-4 mr-1" />}
            >
              Créer un lot
            </Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-3 text-white/60 font-medium text-sm">Nom du lot</th>
                <th className="text-left py-2 px-3 text-white/60 font-medium text-sm">Ferme</th>
                <th className="text-left py-2 px-3 text-white/60 font-medium text-sm">Date de création</th>
                <th className="text-left py-2 px-3 text-white/60 font-medium text-sm">Statut</th>
                <th className="text-right py-2 px-3 text-white/60 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredBatches) && filteredBatches.length > 0 && 
                filteredBatches.slice(0, 5).map((batch) => (
                <tr key={batch.id} className="border-b border-white/5 hover:bg-background-light/20 transition-colors">
                  <td className="py-2 px-3">
                    <div className="flex items-center">
                      <div className="p-1 rounded-full bg-accent-secondary/20 mr-2">
                        <Package className="h-3 w-3 text-accent-secondary" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{batch.name}</div>
                        <div className="text-white/60 text-xs">ID: {batch.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-white/80">
                    {batch.farm_details?.name || `Ferme #${batch.farm}`}
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center text-white/70 text-sm">
                      <Calendar className="h-3 w-3 mr-1 text-accent-primary" />
                      {new Date(batch.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.status)} bg-background-light/30`}>
                      {getStatusLabel(batch.status)}
                    </div>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <Link to={`/batches/${batch.id}`}>
                      <Button variant="ghost" size="sm">
                        Détails
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {Array.isArray(filteredBatches) && filteredBatches.length > 5 && (
        <div className="mt-4 text-center">
          <Link to="/batches">
            <Button variant="link" className="text-accent-primary hover:text-accent-secondary transition-colors">
              Voir tous les lots ({filteredBatches.length})
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default BatchStatusWidget;

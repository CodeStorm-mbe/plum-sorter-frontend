import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Map, List, Grid, Loader } from 'lucide-react';
import FarmerSidebar from '../components/FarmerSidebar';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import { FarmService } from '../services';
import { Farm } from '../types';
import { useToast } from '../hooks/use-toast';
import FarmCard from '../components/FarmCard';
import FarmListItem from '../components/FarmListItem';

const FarmsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Charger les fermes
  useEffect(() => {
    const loadFarms = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const farmsData = await FarmService.getFarms();
        setFarms(farmsData);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des fermes');
        showToast({
          type: 'error',
          title: 'Erreur',
          message: 'Impossible de charger les fermes'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFarms();
  }, [showToast]);

  // Filtrer les fermes selon le terme de recherche
  const filteredFarms = farms.filter(farm => 
    farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Trier les fermes
  const sortedFarms = [...filteredFarms].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'location') {
      comparison = a.location.localeCompare(b.location);
    } else if (sortBy === 'size') {
      comparison = a.size - b.size;
    } else if (sortBy === 'date') {
      comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Gérer le changement de tri
  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen bg-background">
        <FarmerSidebar />
        
        <div className="flex-1 ml-64">
          <div className="container mx-auto pt-24 pb-16 px-6">
            <motion.div
              className="flex flex-col md:flex-row items-center justify-between mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-title font-bold mb-2 bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                  Mes fermes
                </h1>
                <p className="text-white/60">
                  Gérez vos exploitations agricoles et suivez leurs performances
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
                <Button 
                  variant="primary" 
                  icon={<Plus className="h-4 w-4 mr-2" />} 
                  onClick={() => navigate('/farms/new')}
                >
                  Ajouter une ferme
                </Button>
                <Button 
                  variant="outline" 
                  icon={<Map className="h-4 w-4 mr-2" />} 
                  onClick={() => navigate('/farms/map')}
                >
                  Voir la carte
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="relative w-full md:w-auto flex-1">
                <input
                  type="text"
                  placeholder="Rechercher une ferme..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background-light/50 border border-white/10 rounded-md px-4 py-2 pl-10 text-white focus:outline-none focus:ring-1 focus:ring-accent-primary"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="bg-background-light/50 border border-white/10 text-white rounded-md px-4 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-accent-primary w-full"
                  >
                    <option value="name">Trier par nom</option>
                    <option value="location">Trier par localisation</option>
                    <option value="size">Trier par superficie</option>
                    <option value="date">Trier par date</option>
                  </select>
                  <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60 pointer-events-none" />
                </div>
                
                <div className="flex items-center bg-background-light/50 border border-white/10 rounded-md">
                  <button
                    className={`p-2 ${viewMode === 'grid' ? 'bg-accent-primary/20 text-accent-primary' : 'text-white/60 hover:text-white'}`}
                    onClick={() => setViewMode('grid')}
                    title="Vue en grille"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    className={`p-2 ${viewMode === 'list' ? 'bg-accent-primary/20 text-accent-primary' : 'text-white/60 hover:text-white'}`}
                    onClick={() => setViewMode('list')}
                    title="Vue en liste"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader className="h-8 w-8 text-accent-primary animate-spin" />
                <span className="ml-2 text-white/60">Chargement des fermes...</span>
              </div>
            ) : error ? (
              <div className="card p-6 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button 
                  variant="primary" 
                  onClick={() => window.location.reload()}
                >
                  Réessayer
                </Button>
              </div>
            ) : sortedFarms.length === 0 ? (
              <motion.div
                className="card p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {searchTerm ? (
                  <>
                    <p className="text-white/60 mb-4">Aucune ferme ne correspond à votre recherche.</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchTerm('')}
                    >
                      Effacer la recherche
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold mb-2">Vous n'avez pas encore de fermes</h3>
                    <p className="text-white/60 mb-6">Commencez par ajouter votre première exploitation agricole</p>
                    <Button 
                      variant="primary" 
                      icon={<Plus className="h-4 w-4 mr-2" />} 
                      onClick={() => navigate('/farms/new')}
                    >
                      Ajouter une ferme
                    </Button>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedFarms.map((farm) => (
                      <FarmCard 
                        key={farm.id} 
                        farm={farm} 
                        onClick={() => navigate(`/farms/${farm.id}`)}
                        onEdit={() => navigate(`/farms/${farm.id}/edit`)}
                        onDelete={async () => {
                          if (window.confirm('Êtes-vous sûr de vouloir supprimer cette ferme ?')) {
                            try {
                              await FarmService.deleteFarm(farm.id);
                              setFarms(farms.filter(f => f.id !== farm.id));
                              showToast({
                                type: 'success',
                                title: 'Succès',
                                message: 'Ferme supprimée avec succès'
                              });
                            } catch (err: any) {
                              showToast({
                                type: 'error',
                                title: 'Erreur',
                                message: 'Impossible de supprimer la ferme'
                              });
                            }
                          }
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="card overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-background-light/30">
                          <th className="text-left py-3 px-4 text-white/80 font-medium">Nom</th>
                          <th className="text-left py-3 px-4 text-white/80 font-medium">Localisation</th>
                          <th className="text-left py-3 px-4 text-white/80 font-medium">Superficie</th>
                          <th className="text-left py-3 px-4 text-white/80 font-medium">Lots</th>
                          <th className="text-left py-3 px-4 text-white/80 font-medium">Date de création</th>
                          <th className="text-right py-3 px-4 text-white/80 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedFarms.map((farm) => (
                          <FarmListItem 
                            key={farm.id} 
                            farm={farm}
                            onClick={() => navigate(`/farms/${farm.id}`)}
                            onEdit={() => navigate(`/farms/${farm.id}/edit`)}
                            onDelete={async () => {
                              if (window.confirm('Êtes-vous sûr de vouloir supprimer cette ferme ?')) {
                                try {
                                  await FarmService.deleteFarm(farm.id);
                                  setFarms(farms.filter(f => f.id !== farm.id));
                                  showToast({
                                    type: 'success',
                                    title: 'Succès',
                                    message: 'Ferme supprimée avec succès'
                                  });
                                } catch (err: any) {
                                  showToast({
                                    type: 'error',
                                    title: 'Erreur',
                                    message: 'Impossible de supprimer la ferme'
                                  });
                                }
                              }
                            }}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default FarmsPage;

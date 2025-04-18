import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, PageHeader, PageContainer, Section, Grid } from '../components/UIComponents';
import { useAuth } from '../contexts/AuthContext';
import { useRole, RoleBased } from '../contexts/RoleContext';
import { Calendar, Download, RefreshCw, Filter, FileText, Plus, Search, ArrowUpDown } from 'lucide-react';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import { FarmService } from '../services';
import { Farm } from '../types';
import { toast } from '../hooks/use-toast';

const FarmsPage: React.FC = () => {
  const { user } = useAuth();
  const { hasPermission } = useRole();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [farms, setFarms] = useState<Farm[]>([]);

  // Récupérer les données des fermes depuis l'API
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setIsLoading(true);
        const farmsData = await FarmService.getFarms();
        setFarms(farmsData);
      } catch (error) {
        console.error('Erreur lors de la récupération des fermes:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de récupérer la liste des fermes',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFarms();
  }, []);

  // Fonction pour gérer la recherche
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Fonction pour gérer le tri
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtrer et trier les fermes
  const filteredAndSortedFarms = farms
    .filter(farm => 
      farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farm.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (farm.owner_details?.username && farm.owner_details.username.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      let valueA, valueB;
      
      // Gérer les différents champs de tri
      if (sortField === 'owner') {
        valueA = a.owner_details?.username || '';
        valueB = b.owner_details?.username || '';
      } else if (sortField === 'qualityScore') {
        valueA = a.quality_score || 0;
        valueB = b.quality_score || 0;
      } else if (sortField === 'area') {
        valueA = a.size || 0;
        valueB = b.size || 0;
      } else {
        valueA = (a as any)[sortField] || '';
        valueB = (b as any)[sortField] || '';
      }
      
      if (valueA < valueB) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Navbar />

      <PageContainer>
        <PageHeader
          title="Gestion des Fermes"
          description="Consultez et gérez toutes les fermes enregistrées dans le système."
          actions={
            <>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="bg-background-light/50 border border-white/10 text-white rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-1 focus:ring-accent-primary w-64"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              </div>

              <RoleBased requiredPermission="create_farm">
                <Button 
                  variant="primary" 
                  icon={<Plus className="h-4 w-4 mr-2" />} 
                  size="md"
                  href="/farms/new"
                >
                  Nouvelle ferme
                </Button>
              </RoleBased>
            </>
          }
        />

        {/* Liste des fermes */}
        <Section>
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-white/90">
                <thead className="bg-background-light/30 text-white/70">
                  <tr>
                    <th className="p-4 text-left">
                      <button 
                        className="flex items-center focus:outline-none"
                        onClick={() => handleSort('name')}
                      >
                        Nom
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </button>
                    </th>
                    <th className="p-4 text-left">
                      <button 
                        className="flex items-center focus:outline-none"
                        onClick={() => handleSort('location')}
                      >
                        Localisation
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </button>
                    </th>
                    <th className="p-4 text-left">
                      <button 
                        className="flex items-center focus:outline-none"
                        onClick={() => handleSort('owner')}
                      >
                        Propriétaire
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </button>
                    </th>
                    <th className="p-4 text-left">
                      <button 
                        className="flex items-center focus:outline-none"
                        onClick={() => handleSort('area')}
                      >
                        Superficie (ha)
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </button>
                    </th>
                    <th className="p-4 text-left">
                      <button 
                        className="flex items-center focus:outline-none"
                        onClick={() => handleSort('qualityScore')}
                      >
                        Score qualité
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </button>
                    </th>
                    <th className="p-4 text-left">
                      <button 
                        className="flex items-center focus:outline-none"
                        onClick={() => handleSort('status')}
                      >
                        Statut
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </button>
                    </th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-accent-primary"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredAndSortedFarms.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-white/60">
                        Aucune ferme trouvée
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedFarms.map((farm) => (
                      <tr key={farm.id} className="border-b border-white/10 hover:bg-background-light/20">
                        <td className="p-4">
                          <a href={`/farms/${farm.id}`} className="text-accent-primary hover:underline">
                            {farm.name}
                          </a>
                        </td>
                        <td className="p-4">{farm.location}</td>
                        <td className="p-4">{farm.owner_details?.username || `Utilisateur #${farm.owner}`}</td>
                        <td className="p-4">{farm.size} ha</td>
                        <td className="p-4">
                          <div className={`px-2 py-1 rounded text-xs inline-block ${
                            (farm.quality_score || 0) >= 80 ? 'bg-green-500/20 text-green-400' :
                            (farm.quality_score || 0) >= 60 ? 'bg-blue-500/20 text-blue-400' :
                            (farm.quality_score || 0) >= 40 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {farm.quality_score || 0}%
                          </div>
                        </td>
                        <td className="p-4">
                          <div className={`px-2 py-1 rounded text-xs inline-block ${
                            farm.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {farm.is_active ? 'Actif' : 'Inactif'}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              href={`/farms/${farm.id}`}
                            >
                              Détails
                            </Button>
                            
                            <RoleBased requiredPermission="edit_farm">
                              <Button 
                                variant="outline" 
                                size="sm"
                                href={`/farms/${farm.id}/edit`}
                              >
                                Modifier
                              </Button>
                            </RoleBased>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </Section>

        {/* Statistiques des fermes */}
        <Section title="Statistiques des fermes">
          <Grid cols={3} gap={4}>
            <Card className="p-4 bg-gradient-to-br from-accent-primary/20 to-accent-primary/5 border border-accent-primary/20">
              <h3 className="text-lg font-semibold mb-3">Nombre total</h3>
              <p className="text-3xl font-bold">{farms.length}</p>
              <p className="text-white/60 text-sm mt-1">Fermes enregistrées</p>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-accent-secondary/20 to-accent-secondary/5 border border-accent-secondary/20">
              <h3 className="text-lg font-semibold mb-3">Score moyen</h3>
              <p className="text-3xl font-bold">
                {farms.length > 0 
                  ? (farms.reduce((sum, farm) => sum + (farm.quality_score || 0), 0) / farms.length).toFixed(1) 
                  : 0}%
              </p>
              <p className="text-white/60 text-sm mt-1">Qualité moyenne</p>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-accent-tertiary/20 to-accent-tertiary/5 border border-accent-tertiary/20">
              <h3 className="text-lg font-semibold mb-3">Superficie totale</h3>
              <p className="text-3xl font-bold">
                {farms.reduce((sum, farm) => sum + (farm.size || 0), 0).toFixed(1)} ha
              </p>
              <p className="text-white/60 text-sm mt-1">Surface cultivée</p>
            </Card>
          </Grid>
        </Section>

        <div className="text-center text-white/40 text-sm mt-8">
          {filteredAndSortedFarms.length} ferme(s) affichée(s) sur un total de {farms.length}
        </div>
      </PageContainer>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-8 lg:px-16 bg-background-light/50 backdrop-blur-md border-t border-white/5">
        <div className="container mx-auto text-center">
          <p className="text-white/60">© 2025 TriPrune - Système de classification des prunes</p>
        </div>
      </footer>
    </motion.div>
  );
};

export default FarmsPage;

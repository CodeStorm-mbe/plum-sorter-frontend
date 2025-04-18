import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, MapPin, Trash2 } from 'lucide-react';
import FarmerSidebar from '../components/FarmerSidebar';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import { FarmService } from '../services';
import { Farm } from '../types';
import { useToast } from '../hooks/use-toast';

const FarmFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [farm, setFarm] = useState<Partial<Farm>>({
    name: '',
    description: '',
    location: '',
    size: 0,
    latitude: undefined,
    longitude: undefined
  });

  // Charger les données de la ferme si on est en mode édition
  useEffect(() => {
    if (isEditMode) {
      const loadFarm = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const farmData = await FarmService.getFarm(parseInt(id));
          setFarm(farmData);
        } catch (err: any) {
          setError(err.message || 'Erreur lors du chargement des données de la ferme');
          showToast({
            type: 'error',
            title: 'Erreur',
            message: 'Impossible de charger les données de la ferme'
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      loadFarm();
    }
  }, [id, isEditMode, showToast]);

  // Gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Convertir les valeurs numériques
    if (name === 'size' || name === 'latitude' || name === 'longitude') {
      setFarm(prev => ({
        ...prev,
        [name]: value === '' ? undefined : parseFloat(value)
      }));
    } else {
      setFarm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setError(null);
      
      if (isEditMode) {
        await FarmService.updateFarm(parseInt(id), farm as Farm);
        showToast({
          type: 'success',
          title: 'Succès',
          message: 'Ferme mise à jour avec succès'
        });
      } else {
        await FarmService.createFarm(farm as Farm);
        showToast({
          type: 'success',
          title: 'Succès',
          message: 'Ferme créée avec succès'
        });
      }
      
      // Rediriger vers la liste des fermes
      navigate('/farms');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement de la ferme');
      showToast({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible d\'enregistrer la ferme'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Supprimer la ferme
  const handleDelete = async () => {
    if (!isEditMode) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette ferme ? Cette action est irréversible.')) {
      try {
        setIsLoading(true);
        await FarmService.deleteFarm(parseInt(id));
        showToast({
          type: 'success',
          title: 'Succès',
          message: 'Ferme supprimée avec succès'
        });
        navigate('/farms');
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la suppression de la ferme');
        showToast({
          type: 'error',
          title: 'Erreur',
          message: 'Impossible de supprimer la ferme'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen bg-background">
        <FarmerSidebar />
        
        <div className="flex-1 ml-64">
          <div className="container mx-auto pt-24 pb-16 px-6">
            <motion.div
              className="flex items-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/farms')}
                className="mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-title font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                {isEditMode ? 'Modifier la ferme' : 'Ajouter une ferme'}
              </h1>
              
              {isEditMode && (
                <Button 
                  variant="danger" 
                  size="sm"
                  icon={<Trash2 className="h-4 w-4 mr-1" />}
                  onClick={handleDelete}
                  disabled={isLoading || isSaving}
                  className="ml-auto"
                >
                  Supprimer
                </Button>
              )}
            </motion.div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary"></div>
              </div>
            ) : error ? (
              <div className="card p-6 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button variant="primary" onClick={() => navigate('/farms')}>Retour aux fermes</Button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <form onSubmit={handleSubmit} className="card p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-white/80 mb-2">
                          Nom de la ferme <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={farm.name}
                          onChange={handleChange}
                          required
                          className="w-full bg-background-light/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-accent-primary"
                          placeholder="Entrez le nom de votre ferme"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="location" className="block text-white/80 mb-2">
                          Localisation <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="location"
                            name="location"
                            value={farm.location}
                            onChange={handleChange}
                            required
                            className="w-full bg-background-light/50 border border-white/10 rounded-md px-4 py-2 pl-10 text-white focus:outline-none focus:ring-1 focus:ring-accent-primary"
                            placeholder="Adresse ou région"
                          />
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-primary" />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="size" className="block text-white/80 mb-2">
                          Superficie (hectares) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="size"
                          name="size"
                          value={farm.size === undefined ? '' : farm.size}
                          onChange={handleChange}
                          required
                          min="0"
                          step="0.01"
                          className="w-full bg-background-light/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-accent-primary"
                          placeholder="Superficie en hectares"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="description" className="block text-white/80 mb-2">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={farm.description}
                          onChange={handleChange}
                          rows={4}
                          className="w-full bg-background-light/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-accent-primary"
                          placeholder="Description de votre ferme (types de cultures, particularités, etc.)"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="latitude" className="block text-white/80 mb-2">
                            Latitude
                          </label>
                          <input
                            type="number"
                            id="latitude"
                            name="latitude"
                            value={farm.latitude === undefined ? '' : farm.latitude}
                            onChange={handleChange}
                            step="0.000001"
                            className="w-full bg-background-light/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-accent-primary"
                            placeholder="Ex: 48.8566"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="longitude" className="block text-white/80 mb-2">
                            Longitude
                          </label>
                          <input
                            type="number"
                            id="longitude"
                            name="longitude"
                            value={farm.longitude === undefined ? '' : farm.longitude}
                            onChange={handleChange}
                            step="0.000001"
                            className="w-full bg-background-light/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-accent-primary"
                            placeholder="Ex: 2.3522"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-8 space-x-4">
                    <Button 
                      variant="outline" 
                      type="button" 
                      onClick={() => navigate('/farms')}
                      disabled={isSaving}
                    >
                      Annuler
                    </Button>
                    <Button 
                      variant="primary" 
                      type="submit"
                      icon={<Save className="h-4 w-4 mr-2" />}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Enregistrement...' : isEditMode ? 'Mettre à jour' : 'Enregistrer'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default FarmFormPage;

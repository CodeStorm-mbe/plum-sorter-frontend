import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, PageHeader, PageContainer, Section, Grid } from '../components/UIComponents';
import { useAuth } from '../contexts/AuthContext';
import { useRole, RoleBased } from '../contexts/RoleContext';
import ModelManagementWidget from '../components/ModelManagementWidget';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import { RefreshCw, Download, Upload, Check, AlertTriangle } from 'lucide-react';

// Service pour la gestion des modèles
import { ModelService } from '../services';

const ModelManagementPage: React.FC = () => {
  const { user } = useAuth();
  const { hasPermission } = useRole();
  const [models, setModels] = useState<any[]>([]);
  const [activeModel, setActiveModel] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReloading, setIsReloading] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<any | null>(null);
  const [isActivating, setIsActivating] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    setIsLoading(true);
    try {
      // Dans un cas réel, nous utiliserions le service
      // const response = await ModelService.getModels();
      
      // Simuler un chargement de données
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données fictives pour la démonstration
      const demoModels = [
        {
          id: 'model-v1',
          name: 'PlumClassifier v1.0',
          version: '1.0.0',
          accuracy: 0.82,
          created_at: '2024-01-15',
          status: 'inactive',
          size: '24.5 MB',
          description: 'Premier modèle de classification des prunes basé sur ResNet-18.',
          metrics: {
            precision: 0.84,
            recall: 0.81,
            f1_score: 0.82
          }
        },
        {
          id: 'model-v2',
          name: 'PlumClassifier v2.0',
          version: '2.0.0',
          accuracy: 0.89,
          created_at: '2024-03-10',
          status: 'active',
          size: '32.1 MB',
          description: 'Version améliorée utilisant EfficientNet-B3 avec augmentation de données.',
          metrics: {
            precision: 0.90,
            recall: 0.88,
            f1_score: 0.89
          }
        },
        {
          id: 'model-exp',
          name: 'PlumClassifier Experimental',
          version: '2.1.0-beta',
          accuracy: 0.91,
          created_at: '2024-04-01',
          status: 'inactive',
          size: '35.7 MB',
          description: 'Version expérimentale avec architecture Vision Transformer.',
          metrics: {
            precision: 0.92,
            recall: 0.90,
            f1_score: 0.91
          }
        }
      ];
      
      setModels(demoModels);
      setActiveModel(demoModels.find(model => model.status === 'active') || null);
    } catch (error) {
      console.error('Erreur lors du chargement des modèles:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des modèles' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReloadModel = async () => {
    setIsReloading(true);
    setMessage(null);
    try {
      // Dans un cas réel, nous utiliserions le service
      // await ModelService.reloadModel();
      
      // Simuler un rechargement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage({ type: 'success', text: 'Modèle rechargé avec succès' });
    } catch (error) {
      console.error('Erreur lors du rechargement du modèle:', error);
      setMessage({ type: 'error', text: 'Erreur lors du rechargement du modèle' });
    } finally {
      setIsReloading(false);
    }
  };

  const handleSelectModel = (model: any) => {
    setSelectedModel(model);
  };

  const handleActivateModel = async () => {
    if (!selectedModel) return;
    
    setIsActivating(true);
    setMessage(null);
    try {
      // Dans un cas réel, nous utiliserions le service
      // await ModelService.activateModel(selectedModel.id);
      
      // Simuler une activation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mettre à jour l'état local
      const updatedModels = models.map(model => ({
        ...model,
        status: model.id === selectedModel.id ? 'active' : 'inactive'
      }));
      
      setModels(updatedModels);
      setActiveModel(selectedModel);
      setMessage({ type: 'success', text: `Modèle ${selectedModel.name} activé avec succès` });
    } catch (error) {
      console.error('Erreur lors de l\'activation du modèle:', error);
      setMessage({ type: 'error', text: 'Erreur lors de l\'activation du modèle' });
    } finally {
      setIsActivating(false);
    }
  };

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
          title="Gestion des modèles"
          description="Gérez les modèles de classification des prunes et leurs versions."
          actions={
            <>
              <Button 
                variant="outline" 
                icon={<RefreshCw className={`h-4 w-4 mr-2 ${isReloading ? 'animate-spin' : ''}`} />} 
                size="md"
                onClick={handleReloadModel}
                disabled={isReloading}
              >
                {isReloading ? 'Rechargement...' : 'Recharger le modèle'}
              </Button>

              <RoleBased requiredPermission="manage_models">
                <Button 
                  variant="primary" 
                  icon={<Upload className="h-4 w-4 mr-2" />} 
                  size="md"
                  href="/admin/models/upload"
                >
                  Téléverser un modèle
                </Button>
              </RoleBased>
            </>
          }
        />

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-start ${
            message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {message.type === 'success' ? (
              <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            )}
            <p>{message.text}</p>
          </div>
        )}

        <Grid cols={2} gap={8}>
          {/* Modèle actif */}
          <Section title="Modèle actif">
            <Card className="p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-primary"></div>
                </div>
              ) : activeModel ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{activeModel.name}</h3>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">Actif</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-white/60 text-sm">Version</p>
                      <p className="text-white">{activeModel.version}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Précision</p>
                      <p className="text-white">{(activeModel.accuracy * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Date de création</p>
                      <p className="text-white">{activeModel.created_at}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Taille</p>
                      <p className="text-white">{activeModel.size}</p>
                    </div>
                  </div>
                  
                  <p className="text-white/80 mb-4">{activeModel.description}</p>
                  
                  <div className="bg-background-light/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Métriques de performance</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-white/60 text-sm">Précision</p>
                        <p className="text-white">{(activeModel.metrics.precision * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Rappel</p>
                        <p className="text-white">{(activeModel.metrics.recall * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">F1-Score</p>
                        <p className="text-white">{(activeModel.metrics.f1_score * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-white/60 py-8">
                  Aucun modèle actif trouvé
                </div>
              )}
            </Card>
          </Section>

          {/* Sélection de modèle */}
          <Section title="Sélection de modèle">
            <Card className="p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-primary"></div>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <label htmlFor="modelSelect" className="block text-white/80 mb-2">
                      Sélectionner un modèle à activer
                    </label>
                    <select
                      id="modelSelect"
                      className="w-full bg-background-light/50 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-accent-primary"
                      value={selectedModel?.id || ''}
                      onChange={(e) => {
                        const selected = models.find(m => m.id === e.target.value);
                        handleSelectModel(selected || null);
                      }}
                    >
                      <option value="">Sélectionner un modèle</option>
                      {models.map((model) => (
                        <option key={model.id} value={model.id} disabled={model.status === 'active'}>
                          {model.name} (v{model.version}) {model.status === 'active' ? '- Actif' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedModel && (
                    <div className="bg-background-light/30 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold mb-2">{selectedModel.name}</h4>
                      <p className="text-white/80 mb-2">{selectedModel.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-white/60">Version: </span>
                          <span>{selectedModel.version}</span>
                        </div>
                        <div>
                          <span className="text-white/60">Précision: </span>
                          <span>{(selectedModel.accuracy * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleActivateModel}
                    disabled={!selectedModel || isActivating || selectedModel.status === 'active'}
                    className="w-full"
                  >
                    {isActivating ? 'Activation en cours...' : 'Activer le modèle sélectionné'}
                  </Button>
                </div>
              )}
            </Card>
          </Section>
        </Grid>

        {/* Liste des modèles */}
        <Section title="Tous les modèles" delay={0.2}>
          <ModelManagementWidget />
        </Section>

        {/* Informations sur les modèles */}
        <Section title="À propos des modèles" delay={0.3}>
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Comment fonctionnent les modèles ?</h3>
                <p className="text-white/60">
                  Nos modèles de classification utilisent des réseaux de neurones convolutifs (CNN) pour analyser les images
                  de prunes et déterminer leur qualité. Chaque modèle est entraîné sur des milliers d'images annotées
                  pour garantir une précision optimale.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Activation des modèles</h3>
                <p className="text-white/60">
                  Un seul modèle peut être actif à la fois. L'activation d'un nouveau modèle désactive automatiquement
                  le modèle précédemment actif. Le modèle actif est utilisé pour toutes les nouvelles classifications.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Téléversement de modèles</h3>
                <p className="text-white/60">
                  Les administrateurs peuvent téléverser de nouveaux modèles au format .pth (PyTorch). Assurez-vous que
                  le modèle est compatible avec l'architecture du système avant de le téléverser.
                </p>
              </div>
            </div>
          </Card>
        </Section>
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

export default ModelManagementPage;

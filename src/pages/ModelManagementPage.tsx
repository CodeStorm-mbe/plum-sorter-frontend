// ModelManagementPage.tsx - Page pour la gestion des versions de modèles (admin seulement)
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Check, AlertTriangle } from "lucide-react";
import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";
import { useAuth } from "../contexts/AuthContext";
import { ModelService, ModelVersion } from "../services";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { toast } from "../hooks/use-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const ModelManagementPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [models, setModels] = useState<ModelVersion[]>([]);
  const [activeModel, setActiveModel] = useState<ModelVersion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelVersion | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les droits d'accès à cette page",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Récupérer la liste des modèles
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
        const [modelsData, activeModelData] = await Promise.all([
          ModelService.getModels(),
          ModelService.getActiveModel()
        ]);
        setModels(modelsData);
        setActiveModel(activeModelData);
      } catch (error) {
        console.error("Erreur lors de la récupération des modèles:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer la liste des modèles",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === "admin") {
      fetchModels();
    }
  }, [user]);

  // Recharger le modèle actif
  const handleReloadModel = async () => {
    try {
      setIsReloading(true);
      await ModelService.reloadModel();
      toast({
        title: "Succès",
        description: "Le modèle a été rechargé avec succès",
      });
    } catch (error) {
      console.error("Erreur lors du rechargement du modèle:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du rechargement du modèle",
        variant: "destructive",
      });
    } finally {
      setIsReloading(false);
    }
  };

  // Ouvrir le dialogue de confirmation d'activation
  const openActivationDialog = (model: ModelVersion) => {
    setSelectedModel(model);
    setIsDialogOpen(true);
  };

  // Activer un modèle
  const handleActivateModel = async () => {
    if (!selectedModel) return;
    
    try {
      setIsActivating(true);
      await ModelService.activateModel(selectedModel.id);
      
      // Rafraîchir la liste des modèles
      const [modelsData, activeModelData] = await Promise.all([
        ModelService.getModels(),
        ModelService.getActiveModel()
      ]);
      setModels(modelsData);
      setActiveModel(activeModelData);
      
      toast({
        title: "Succès",
        description: `Le modèle ${selectedModel.name} v${selectedModel.version} a été activé avec succès`,
      });
      
      // Fermer le dialogue
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'activation du modèle:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'activation du modèle",
        variant: "destructive",
      });
    } finally {
      setIsActivating(false);
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Formater la durée en minutes
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        <motion.div
          className="container mx-auto pt-28 pb-16 px-4 md:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-4xl font-title font-bold">
              <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                Gestion des Modèles
              </span>
            </h1>
            <Button
              onClick={handleReloadModel}
              className="bg-accent-primary hover:bg-accent-primary/90"
              disabled={isReloading}
            >
              {isReloading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Recharger le modèle actif
            </Button>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              {/* Modèle actif */}
              {activeModel && (
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h2 className="text-xl font-title font-semibold mb-4">Modèle Actif</h2>
                  <Card className="bg-background-light/50 border border-accent-primary/30">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl font-title">
                            {activeModel.name} <span className="text-accent-primary">v{activeModel.version}</span>
                          </CardTitle>
                          <CardDescription className="text-white/60">
                            Type: {activeModel.model_type} • Classes: {activeModel.num_classes}
                          </CardDescription>
                        </div>
                        <div className="flex items-center bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs">
                          <Check className="h-3 w-3 mr-1" /> Actif
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h3 className="text-sm font-semibold text-white/80 mb-2">Informations</h3>
                          <div className="space-y-1 text-sm text-white/70">
                            <p>Taille d'entrée: {activeModel.input_shape.join(' × ')}</p>
                            <p>Seuil de confiance: {(activeModel.confidence_threshold * 100).toFixed(0)}%</p>
                            <p>Date d'entraînement: {formatDate(activeModel.training_date)}</p>
                            <p>Durée d'entraînement: {formatDuration(activeModel.training_duration)}</p>
                            <p>Taille du dataset: {activeModel.dataset_size} images</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white/80 mb-2">Performances</h3>
                          <div className="space-y-1 text-sm text-white/70">
                            <p>Précision: {(activeModel.precision * 100).toFixed(2)}%</p>
                            <p>Rappel: {(activeModel.recall * 100).toFixed(2)}%</p>
                            <p>Score F1: {(activeModel.f1_score * 100).toFixed(2)}%</p>
                            <p>Exactitude: {(activeModel.accuracy * 100).toFixed(2)}%</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Liste des modèles */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-xl font-title font-semibold mb-4">Tous les Modèles</h2>
                <div className="space-y-4">
                  {models.length === 0 ? (
                    <div className="text-center py-16 bg-background-light/30 rounded-lg border border-white/10">
                      <p className="text-white/70">Aucun modèle disponible.</p>
                    </div>
                  ) : (
                    models.map((model) => (
                      <Card
                        key={model.id}
                        className={`bg-background-light/50 border ${
                          model.is_active
                            ? "border-accent-primary/30"
                            : "border-white/10 hover:border-white/20"
                        } transition-all duration-300`}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg font-title">
                                {model.name} <span className={model.is_active ? "text-accent-primary" : "text-white/80"}>v{model.version}</span>
                              </CardTitle>
                              <CardDescription className="text-white/60">
                                Type: {model.model_type} • Classes: {model.num_classes}
                              </CardDescription>
                            </div>
                            {model.is_active ? (
                              <div className="flex items-center bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs">
                                <Check className="h-3 w-3 mr-1" /> Actif
                              </div>
                            ) : model.is_production ? (
                              <div className="flex items-center bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs">
                                Production
                              </div>
                            ) : (
                              <div className="flex items-center bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" /> Inactif
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <h3 className="text-sm font-semibold text-white/80 mb-2">Informations</h3>
                              <div className="space-y-1 text-sm text-white/70">
                                <p>Date d'entraînement: {formatDate(model.training_date)}</p>
                                <p>Taille du dataset: {model.dataset_size} images</p>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-white/80 mb-2">Performances</h3>
                              <div className="space-y-1 text-sm text-white/70">
                                <p>Exactitude: {(model.accuracy * 100).toFixed(2)}%</p>
                                <p>Score F1: {(model.f1_score * 100).toFixed(2)}%</p>
                              </div>
                            </div>
                            <div className="flex items-end justify-end">
                              {!model.is_active && (
                                <Button
                                  onClick={() => openActivationDialog(model)}
                                  className="bg-accent-primary hover:bg-accent-primary/90"
                                >
                                  Activer ce modèle
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Dialogue de confirmation d'activation */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-background-light border border-white/10 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-title">Confirmer l'activation</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-white/80 mb-4">
                Êtes-vous sûr de vouloir activer le modèle "{selectedModel?.name} v{selectedModel?.version}" ?
              </p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-md p-4">
                <p className="text-yellow-300 flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    Cette action désactivera le modèle actuellement actif et pourrait affecter les classifications en cours.
                    Assurez-vous qu'aucune classification importante n'est en cours avant de continuer.
                  </span>
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-white/10"
              >
                Annuler
              </Button>
              <Button
                type="button"
                onClick={handleActivateModel}
                className="bg-accent-primary hover:bg-accent-primary/90"
                disabled={isActivating}
              >
                {isActivating ? <LoadingSpinner size="sm" /> : "Activer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Footer */}
        <footer className="py-8 px-4 md:px-8 lg:px-16 bg-background-light/50 backdrop-blur-md border-t border-white/5">
          <div className="container mx-auto text-center">
            <p className="text-white/60">© 2025 TriPrune - Projet JCIA Hackathon</p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default ModelManagementPage;

// BatchClassificationPage.tsx - Page pour ajouter des images à un lot et les classifier
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, ArrowLeft, Info, BarChart2 } from "lucide-react";
import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";
import ImageUpload from "../components/ImageUpload";
import { BatchService, ClassificationService, FarmService } from "../services";
import { PlumBatch, Farm } from "../types";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { toast } from "../hooks/use-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const BatchClassificationPage = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<PlumBatch | null>(null);
  const [farm, setFarm] = useState<Farm | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useTTA, setUseTTA] = useState(false);
  const [useGeoLocation, setUseGeoLocation] = useState(false);
  const [geoLocation, setGeoLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Récupérer les informations du lot
  useEffect(() => {
    const fetchBatchData = async () => {
      if (!batchId) return;
      
      try {
        setIsLoading(true);
        const batchData = await BatchService.getBatch(parseInt(batchId));
        setBatch(batchData);
        
        // Récupérer les informations de la ferme
        const farmData = await FarmService.getFarm(batchData.farm);
        setFarm(farmData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données du lot:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les informations du lot",
          variant: "destructive",
        });
        navigate("/batches");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBatchData();
  }, [batchId, navigate]);

  // Gérer la sélection d'images
  const handleImagesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    
    // Créer des URL pour les aperçus
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  // Gérer l'activation de la géolocalisation
  const handleGeoLocationChange = (checked: boolean) => {
    setUseGeoLocation(checked);
    
    if (checked && !geoLocation) {
      // Demander la géolocalisation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setGeoLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Erreur de géolocalisation:", error);
            toast({
              title: "Erreur de géolocalisation",
              description: "Impossible d'obtenir votre position actuelle",
              variant: "destructive",
            });
            setUseGeoLocation(false);
          }
        );
      } else {
        toast({
          title: "Géolocalisation non supportée",
          description: "Votre navigateur ne supporte pas la géolocalisation",
          variant: "destructive",
        });
        setUseGeoLocation(false);
      }
    }
  };

  // Classifier les images
  const classifyImages = async () => {
    if (!batch || !farm || files.length === 0 || !batchId) return;
    
    try {
      setIsProcessing(true);
      
      // Créer un FormData pour l'envoi des fichiers
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
      
      
      // Ajouter les autres données
      formData.append('farm_id', farm.id.toString());
      formData.append('batch_id', batch.id.toString());
      formData.append('use_tta', useTTA.toString());
      
      if (useGeoLocation && geoLocation) {
        formData.append('latitude', geoLocation.latitude.toString());
        formData.append('longitude', geoLocation.longitude.toString());
      }
      
      const result = await ClassificationService.classifyBatch(batch.id, formData);
      
      toast({
        title: "Classification terminée",
        description: `${result.total_processed} images ont été classifiées avec succès`,
      });
      
      // Rediriger vers la page de détails du lot
      navigate(`/batches/${batch.id}`);
    } catch (error) {
      console.error("Erreur lors de la classification des images:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la classification des images",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Nettoyer les URL des aperçus lors du démontage du composant
  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [previews]);

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
            className="flex items-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/batches")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-3xl md:text-4xl font-title font-bold">
              <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                Classifier des Images
              </span>
            </h1>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : batch ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="mb-8">
                <Card className="bg-background-light/50 border border-white/10">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h2 className="text-xl font-title font-semibold mb-2">{batch.name}</h2>
                        <p className="text-white/70 mb-4">{batch.description}</p>
                        <div className="text-sm text-white/60">
                          <p>Ferme: {farm?.name}</p>
                          <p>Nombre d'images: {batch.total_plums || 0}</p>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="tta"
                            checked={useTTA}
                            onCheckedChange={(checked) => setUseTTA(checked as boolean)}
                          />
                          <Label htmlFor="tta" className="text-white/80">
                            Utiliser TTA (Test Time Augmentation)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="geolocation"
                            checked={useGeoLocation}
                            onCheckedChange={(checked) => handleGeoLocationChange(checked as boolean)}
                          />
                          <Label htmlFor="geolocation" className="text-white/80">
                            Inclure la géolocalisation
                          </Label>
                        </div>
                        {useGeoLocation && geoLocation && (
                          <div className="text-xs text-white/60 pl-6">
                            Latitude: {geoLocation.latitude.toFixed(6)}, Longitude: {geoLocation.longitude.toFixed(6)}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mb-8">
                <Card className="bg-background-light/50 border border-white/10">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-title font-semibold mb-4 flex items-center">
                      <Upload className="h-5 w-5 mr-2 text-accent-primary" />
                      <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                        Téléchargez des images de prunes
                      </span>
                    </h2>
                    <ImageUpload onImageSelected={handleImagesSelected} multiple={true} />
                  </CardContent>
                </Card>
              </div>

              {previews.length > 0 && (
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-xl font-title font-semibold mb-4">
                    Aperçu des images ({previews.length})
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {previews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-md overflow-hidden border border-white/10"
                      >
                        <img
                          src={preview}
                          alt={`Aperçu ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={classifyImages}
                      className="bg-accent-primary hover:bg-accent-primary/90"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Classification en cours...
                        </>
                      ) : (
                        <>Classifier les images</>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-background-light/30 rounded-lg border border-white/10">
              <p className="text-white/70 mb-4">Lot non trouvé ou supprimé.</p>
              <Button onClick={() => navigate("/batches")} className="bg-accent-primary hover:bg-accent-primary/90">
                Retour à la liste des lots
              </Button>
            </div>
          )}
        </motion.div>

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

export default BatchClassificationPage;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, PageHeader, PageContainer, Section, Grid } from '../components/UIComponents';
import { useAuth } from '../contexts/AuthContext';
import { useRole, RoleBased } from '../contexts/RoleContext';
import { ClassificationService, OptimizationService } from '../services';
import { Upload, Image, Check, AlertTriangle, Info, RefreshCw } from 'lucide-react';
import Button from '../components/Button';
import Navbar from '../components/Navbar';

const PredictionPage: React.FC = () => {
  const { user } = useAuth();
  const { hasPermission } = useRole();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Réinitialiser la prévisualisation lorsque le fichier change
  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // Nettoyer l'URL de l'objet lorsque le composant est démonté
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  // Gérer la sélection de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }

    const file = e.target.files[0];
    setSelectedFile(file);
    setResult(null);
    setError(null);
  };

  // Gérer le glisser-déposer
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) {
      return;
    }

    const file = e.dataTransfer.files[0];
    setSelectedFile(file);
    setResult(null);
    setError(null);
  };

  // Empêcher le comportement par défaut du navigateur
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Soumettre l'image pour classification
  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Veuillez sélectionner une image à classifier.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Simuler une progression d'upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      // Utiliser le service d'optimisation pour l'upload
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Dans un cas réel, nous utiliserions le service
      // const response = await ClassificationService.classifyImage(formData);
      
      // Simuler une réponse pour la démonstration
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      const mockResponse = {
        id: Math.floor(Math.random() * 1000),
        class_name: "Excellente",
        confidence_score: 0.92,
        quality_score: 87,
        processing_time: 1.23,
        image_url: preview,
        created_at: new Date().toISOString(),
        details: {
          color_score: 0.95,
          shape_score: 0.89,
          size_score: 0.92,
          texture_score: 0.85
        }
      };
      
      setResult(mockResponse);
    } catch (err: any) {
      console.error('Erreur lors de la classification:', err);
      setError(err.message || "Une erreur est survenue lors de la classification de l'image.");
    } finally {
      setIsLoading(false);
    }
  };

  // Réinitialiser le formulaire
  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setUploadProgress(0);
  };

  // Obtenir la couleur en fonction de la classe
  const getClassColor = (className: string) => {
    switch (className.toLowerCase()) {
      case 'excellente':
        return 'text-green-400 bg-green-500/20';
      case 'bonne':
        return 'text-blue-400 bg-blue-500/20';
      case 'moyenne':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'faible':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-white/80 bg-white/10';
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
          title="Classification d'image"
          description="Téléchargez une image de prune pour obtenir une classification automatique de sa qualité."
        />

        <Grid cols={2} gap={8}>
          {/* Zone de téléchargement */}
          <Section>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Télécharger une image</h2>
              
              {/* Zone de glisser-déposer */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 transition-colors ${
                  selectedFile ? 'border-accent-primary/50 bg-accent-primary/5' : 'border-white/20 hover:border-white/40'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {preview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={preview}
                      alt="Aperçu"
                      className="max-h-64 max-w-full rounded-lg mb-4"
                    />
                    <p className="text-white/60 text-sm">
                      {selectedFile?.name} ({selectedFile && (selectedFile.size / 1024).toFixed(1)} KB)
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-white/40 mb-4" />
                    <p className="text-white/80 mb-2">Glissez et déposez une image ici</p>
                    <p className="text-white/60 text-sm mb-4">ou</p>
                    <label className="cursor-pointer bg-accent-primary/20 hover:bg-accent-primary/30 text-accent-primary px-4 py-2 rounded-md transition-colors">
                      Parcourir les fichiers
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSubmit}
                  disabled={!selectedFile || isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Classification en cours...' : 'Classifier l\'image'}
                </Button>
                
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleReset}
                  disabled={isLoading}
                >
                  Réinitialiser
                </Button>
              </div>

              {/* Barre de progression */}
              {isLoading && (
                <div className="mt-4">
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-white/60 text-sm mt-2 text-center">
                    {uploadProgress < 100 ? 'Téléchargement en cours...' : 'Analyse en cours...'}
                  </p>
                </div>
              )}

              {/* Message d'erreur */}
              {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
            </Card>
          </Section>

          {/* Résultats de classification */}
          <Section>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Résultats de classification</h2>
              
              {!result && !isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-white/60">
                  <Image className="h-16 w-16 mb-4 text-white/40" />
                  <p>Téléchargez une image pour voir les résultats de classification</p>
                </div>
              ) : isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary mb-4"></div>
                  <p className="text-white/60">Analyse de l'image en cours...</p>
                </div>
              ) : result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Résultat principal */}
                  <div className="flex items-center justify-between mb-6 p-4 bg-background-light/30 rounded-lg">
                    <div>
                      <p className="text-white/60 mb-1">Qualité détectée</p>
                      <div className="flex items-center">
                        <span className={`text-2xl font-bold px-3 py-1 rounded ${getClassColor(result.class_name)}`}>
                          {result.class_name}
                        </span>
                        <span className="ml-3 text-white/60">
                          ({(result.confidence_score * 100).toFixed(1)}% de confiance)
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-white/60 mb-1">Score de qualité</p>
                      <p className="text-3xl font-bold">{result.quality_score}/100</p>
                    </div>
                  </div>

                  {/* Détails de l'analyse */}
                  <h3 className="text-lg font-semibold mb-3">Détails de l'analyse</h3>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 bg-background-light/30 rounded-lg">
                      <p className="text-white/60 text-sm">Couleur</p>
                      <div className="flex justify-between items-center mt-1">
                        <div className="w-full bg-white/10 rounded-full h-2 mr-3">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${result.details.color_score * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-medium">{(result.details.color_score * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="p-3 bg-background-light/30 rounded-lg">
                      <p className="text-white/60 text-sm">Forme</p>
                      <div className="flex justify-between items-center mt-1">
                        <div className="w-full bg-white/10 rounded-full h-2 mr-3">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${result.details.shape_score * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-medium">{(result.details.shape_score * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="p-3 bg-background-light/30 rounded-lg">
                      <p className="text-white/60 text-sm">Taille</p>
                      <div className="flex justify-between items-center mt-1">
                        <div className="w-full bg-white/10 rounded-full h-2 mr-3">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${result.details.size_score * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-medium">{(result.details.size_score * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="p-3 bg-background-light/30 rounded-lg">
                      <p className="text-white/60 text-sm">Texture</p>
                      <div className="flex justify-between items-center mt-1">
                        <div className="w-full bg-white/10 rounded-full h-2 mr-3">
                          <div
                            className="bg-amber-500 h-2 rounded-full"
                            style={{ width: `${result.details.texture_score * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-medium">{(result.details.texture_score * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Informations supplémentaires */}
                  <div className="p-3 bg-background-light/20 border border-white/10 rounded-lg text-white/80 flex items-start mb-4">
                    <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-accent-primary" />
                    <p className="text-sm">
                      Cette classification a été réalisée en {result.processing_time.toFixed(2)} secondes. 
                      Les résultats sont basés sur l'analyse de la couleur, de la forme, de la taille et de la texture de la prune.
                    </p>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      size="md"
                      icon={<RefreshCw className="h-4 w-4 mr-2" />}
                      onClick={handleReset}
                    >
                      Nouvelle classification
                    </Button>
                    
                    <Button
                      variant="primary"
                      size="md"
                      href={`/classifications/${result.id}`}
                    >
                      Voir les détails complets
                    </Button>
                  </div>
                </motion.div>
              )}
            </Card>
          </Section>
        </Grid>

        {/* Informations sur la classification */}
        <Section title="À propos de la classification" delay={0.2}>
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Comment ça marche ?</h3>
                <p className="text-white/60">
                  Notre système utilise un modèle d'intelligence artificielle avancé pour analyser les images de prunes
                  et déterminer leur qualité. Le modèle a été entraîné sur des milliers d'images de prunes de différentes
                  qualités pour garantir une précision optimale.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Critères d'évaluation</h3>
                <p className="text-white/60">
                  La classification est basée sur plusieurs critères : la couleur, la forme, la taille et la texture de la prune.
                  Chaque critère contribue au score global de qualité, qui détermine la classe finale (Excellente, Bonne, Moyenne, Faible).
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Conseils pour de meilleurs résultats</h3>
                <p className="text-white/60">
                  Pour obtenir les meilleurs résultats, assurez-vous que l'image est bien éclairée, que la prune est centrée
                  dans l'image et qu'il n'y a pas d'autres objets qui pourraient perturber l'analyse.
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

export default PredictionPage;

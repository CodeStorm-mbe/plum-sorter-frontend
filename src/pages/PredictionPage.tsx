import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import ImageUpload from '../components/ImageUpload';
import ImagePreview from '../components/ImagePreview';

interface ResultProps {
  category: string;
  confidence: number;
  showHeatmap: boolean;
  onToggleHeatmap: () => void;
}

const ResultDisplay: React.FC<ResultProps> = ({ 
  category, 
  confidence, 
  showHeatmap, 
  onToggleHeatmap 
}) => {
  // Fonction pour obtenir la couleur de la catégorie
  const getCategoryColor = (category: string) => {
    const categoryMap: Record<string, string> = {
      'bonne qualité': 'bg-plum-good',
      'non mûre': 'bg-plum-unripe',
      'tachetée': 'bg-plum-spotted',
      'fissurée': 'bg-plum-cracked',
      'meurtrie': 'bg-plum-bruised',
      'pourrie': 'bg-plum-rotten'
    };
    
    return categoryMap[category] || 'bg-accent-gold';
  };

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-title font-semibold mb-6">Résultats de l'analyse</h2>
      
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-full md:w-1/2">
          <div className="mb-4">
            <p className="text-white/70 mb-1">Catégorie détectée:</p>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full ${getCategoryColor(category)} mr-2`}></div>
              <span className="text-xl font-medium capitalize">{category}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-white/70 mb-1">Score de confiance:</p>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xl font-semibold inline-block text-accent-gold">
                    {confidence}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-background-DEFAULT">
                <div 
                  style={{ width: `${confidence}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-accent-gold"
                ></div>
              </div>
            </div>
          </div>
          
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showHeatmap 
                ? 'bg-background-DEFAULT text-white/90 hover:bg-background-light' 
                : 'bg-accent-emerald text-white hover:bg-opacity-90'
            }`}
            onClick={onToggleHeatmap}
          >
            {showHeatmap ? 'Masquer l\'explication' : 'Voir l\'explication'}
          </button>
        </div>
        
        <div className="w-full md:w-1/2">
          <div className="bg-background-DEFAULT p-4 rounded-lg">
            <h3 className="font-medium mb-2">Caractéristiques de cette catégorie:</h3>
            <ul className="space-y-2 text-white/80">
              {category === 'bonne qualité' && (
                <>
                  <li>• Couleur uniforme et vibrante</li>
                  <li>• Surface lisse sans défauts</li>
                  <li>• Forme régulière et symétrique</li>
                </>
              )}
              {category === 'non mûre' && (
                <>
                  <li>• Couleur plus claire que la normale</li>
                  <li>• Texture ferme</li>
                  <li>• Manque de développement complet</li>
                </>
              )}
              {category === 'tachetée' && (
                <>
                  <li>• Présence de taches sur la surface</li>
                  <li>• Motifs irréguliers de décoloration</li>
                  <li>• Texture potentiellement inégale</li>
                </>
              )}
              {category === 'fissurée' && (
                <>
                  <li>• Présence de fissures visibles</li>
                  <li>• Ruptures dans la peau du fruit</li>
                  <li>• Possible exposition de la chair</li>
                </>
              )}
              {category === 'meurtrie' && (
                <>
                  <li>• Zones de décoloration sombre</li>
                  <li>• Dépressions sur la surface</li>
                  <li>• Signes d'impact ou de pression</li>
                </>
              )}
              {category === 'pourrie' && (
                <>
                  <li>• Zones de décomposition avancée</li>
                  <li>• Couleur brune ou noirâtre</li>
                  <li>• Texture molle et détériorée</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PredictionPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    category: string;
    confidence: number;
    showHeatmap: boolean;
  } | null>(null);

  // Fonction pour gérer la sélection d'image
  const handleImageSelected = useCallback((file: File, preview: string) => {
    setFile(file);
    setPreview(preview);
    setResult(null);
  }, []);

  // Fonction pour analyser l'image
  const analyzeImage = useCallback(() => {
    if (!file) return;
    
    setIsAnalyzing(true);
    
    // Simuler un appel API (à remplacer par un vrai appel API)
    setTimeout(() => {
      // Résultats fictifs pour la démonstration
      const categories = ['bonne qualité', 'non mûre', 'tachetée', 'fissurée', 'meurtrie', 'pourrie'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomConfidence = 70 + Math.floor(Math.random() * 30); // Entre 70% et 99%
      
      setResult({
        category: randomCategory,
        confidence: randomConfidence,
        showHeatmap: false
      });
      
      setIsAnalyzing(false);
    }, 2000);
  }, [file]);

  // Fonction pour afficher/masquer la heatmap
  const toggleHeatmap = useCallback(() => {
    if (result) {
      setResult({
        ...result,
        showHeatmap: !result.showHeatmap
      });
    }
  }, [result]);

  // Fonction pour réinitialiser
  const resetImage = useCallback(() => {
    setFile(null);
    setPreview(null);
    setResult(null);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gradient-start to-gradient-end">
      <Navbar />
      
      <motion.div 
        className="container mx-auto pt-28 pb-16 px-4 md:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 
          className="text-3xl md:text-4xl font-title font-bold text-center mb-8"
          variants={itemVariants}
        >
          Analyse de prunes
        </motion.h1>
        
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="card mb-8"
            variants={itemVariants}
          >
            <h2 className="text-xl font-title font-semibold mb-4">Téléchargez une image de prune</h2>
            
            {!preview ? (
              <ImageUpload onImageSelected={handleImageSelected} />
            ) : (
              <ImagePreview 
                preview={preview}
                onReset={resetImage}
                onAnalyze={analyzeImage}
                isAnalyzing={isAnalyzing}
                showHeatmap={result?.showHeatmap || false}
              />
            )}
          </motion.div>
          
          {/* Résultats */}
          {result && (
            <ResultDisplay 
              category={result.category}
              confidence={result.confidence}
              showHeatmap={result.showHeatmap}
              onToggleHeatmap={toggleHeatmap}
            />
          )}
        </div>
      </motion.div>
      
      {/* Footer */}
      <footer className="py-8 px-4 md:px-8 lg:px-16 bg-background-DEFAULT">
        <div className="container mx-auto text-center">
          <p className="text-white/60">© 2025 TriPrune - Projet JCIA Hackathon</p>
        </div>
      </footer>
    </div>
  );
};

export default PredictionPage;

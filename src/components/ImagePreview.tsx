import React from 'react';
import { X, Play } from 'lucide-react';

interface ImagePreviewProps {
  preview: string;
  onReset: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  showHeatmap: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  preview, 
  onReset, 
  onAnalyze, 
  isAnalyzing,
  showHeatmap
}) => {
  return (
    <div className="relative">
      <div className="relative rounded-lg overflow-hidden">
        <img 
          src={preview} 
          alt="Aperçu de la prune" 
          className="w-full h-auto max-h-[400px] object-contain"
        />
        
        {/* Heatmap overlay (simulé) */}
        {showHeatmap && (
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/40 to-blue-500/40 mix-blend-overlay"></div>
        )}
      </div>
      
      <button 
        className="absolute top-2 right-2 p-2 bg-background-DEFAULT rounded-full text-white/70 hover:text-white"
        onClick={onReset}
      >
        <X className="h-5 w-5" />
      </button>
      
      {!isAnalyzing && (
        <div className="mt-4 flex justify-center">
          <button 
            className="btn-primary flex items-center"
            onClick={onAnalyze}
          >
            <Play className="mr-2 h-5 w-5" />
            Analyser
          </button>
        </div>
      )}
      
      {isAnalyzing && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-accent-emerald"></div>
          <p className="mt-2 text-white/70">Analyse en cours...</p>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;

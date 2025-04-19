import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from './UIComponents';
import { DashboardService } from '../services';

interface DashboardPreferencesWidgetProps {
  title?: string;
  className?: string;
}

const DashboardPreferencesWidget: React.FC<DashboardPreferencesWidgetProps> = ({
  title = "Préférences du tableau de bord",
  className = ""
}) => {
  const [preferences, setPreferences] = useState({
    showQualityTrends: true,
    showActivityHeatmap: true,
    showFarmComparison: true,
    showQualityPrediction: true,
    refreshInterval: 30
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const loadPreferences = async () => {
      setIsLoading(true);
      try {
        // Dans un cas réel, nous utiliserions le service
        // const response = await dashboardService.getPreferences();
        // setPreferences(response.data);
        
        // Simuler un chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Utiliser des préférences fictives pour la démonstration
        setPreferences({
          showQualityTrends: true,
          showActivityHeatmap: true,
          showFarmComparison: true,
          showQualityPrediction: true,
          refreshInterval: 30
        });
      } catch (error) {
        console.error('Erreur lors du chargement des préférences:', error);
        setMessage({ type: 'error', text: 'Impossible de charger les préférences' });
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Dans un cas réel, nous utiliserions le service
      // await dashboardService.savePreferences(preferences);
      
      // Simuler une sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Préférences enregistrées avec succès' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences:', error);
      setMessage({ type: 'error', text: 'Impossible de sauvegarder les préférences' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-primary"></div>
        </div>
      ) : (
        <div>
          <div className="space-y-4 mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showQualityTrends"
                name="showQualityTrends"
                checked={preferences.showQualityTrends}
                onChange={handleChange}
                className="h-4 w-4 rounded border-white/30 bg-background-light/50 text-accent-primary focus:ring-accent-primary/50"
              />
              <label htmlFor="showQualityTrends" className="ml-2 text-white/80">
                Afficher les tendances de qualité
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showActivityHeatmap"
                name="showActivityHeatmap"
                checked={preferences.showActivityHeatmap}
                onChange={handleChange}
                className="h-4 w-4 rounded border-white/30 bg-background-light/50 text-accent-primary focus:ring-accent-primary/50"
              />
              <label htmlFor="showActivityHeatmap" className="ml-2 text-white/80">
                Afficher la heatmap d'activité
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showFarmComparison"
                name="showFarmComparison"
                checked={preferences.showFarmComparison}
                onChange={handleChange}
                className="h-4 w-4 rounded border-white/30 bg-background-light/50 text-accent-primary focus:ring-accent-primary/50"
              />
              <label htmlFor="showFarmComparison" className="ml-2 text-white/80">
                Afficher la comparaison des fermes
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showQualityPrediction"
                name="showQualityPrediction"
                checked={preferences.showQualityPrediction}
                onChange={handleChange}
                className="h-4 w-4 rounded border-white/30 bg-background-light/50 text-accent-primary focus:ring-accent-primary/50"
              />
              <label htmlFor="showQualityPrediction" className="ml-2 text-white/80">
                Afficher la prédiction de qualité
              </label>
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="refreshInterval" className="mb-1 text-white/80">
                Intervalle de rafraîchissement (secondes)
              </label>
              <input
                type="number"
                id="refreshInterval"
                name="refreshInterval"
                value={preferences.refreshInterval}
                onChange={handleChange}
                min="10"
                max="300"
                className="rounded border-white/30 bg-background-light/50 text-white focus:ring-accent-primary/50 focus:border-accent-primary/50 w-full"
              />
            </div>
          </div>
          
          {message && (
            <div className={`p-3 rounded-md mb-4 ${
              message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {message.text}
            </div>
          )}
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-accent-primary hover:bg-accent-primary/80 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Enregistrement...' : 'Enregistrer les préférences'}
          </button>
        </div>
      )}
    </Card>
  );
};

export default DashboardPreferencesWidget;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Eye, EyeOff, Layout, Palette } from 'lucide-react';
import Button from './Button';
import { useToast } from '../hooks/use-toast';
import { dashboardService } from '../services';

interface DashboardPreferencesWidgetProps {
  title?: string;
  className?: string;
  onPreferencesChange?: (preferences: any) => void;
}

/**
 * Widget permettant de personnaliser les préférences du dashboard
 */
const DashboardPreferencesWidget: React.FC<DashboardPreferencesWidgetProps> = ({
  title = "Personnalisation du dashboard",
  className = "",
  onPreferencesChange
}) => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<any>({
    layout: 'default',
    theme: 'dark',
    visibleWidgets: {
      farmOverview: true,
      batchStatus: true,
      qualityTrends: true,
      recentClassifications: true,
      weather: true
    },
    refreshInterval: 30
  });
  const [error, setError] = useState<string | null>(null);

  // Charger les préférences de l'utilisateur
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const userPreferences = await dashboardService.getDashboardPreferences();
        if (userPreferences) {
          // Normaliser les noms de propriétés (camelCase vs snake_case)
          const normalizedPreferences = {
            layout: userPreferences.layout || 'default',
            theme: userPreferences.theme || 'dark',
            visibleWidgets: {
              farmOverview: userPreferences.visible_widgets?.farm_overview ?? true,
              batchStatus: userPreferences.visible_widgets?.batch_status ?? true,
              qualityTrends: userPreferences.visible_widgets?.quality_trends ?? true,
              recentClassifications: userPreferences.visible_widgets?.recent_classifications ?? true,
              weather: userPreferences.visible_widgets?.weather ?? true
            },
            refreshInterval: userPreferences.refresh_interval || 30
          };
          
          setPreferences(normalizedPreferences);
          
          // Notifier le parent si nécessaire
          if (onPreferencesChange) {
            onPreferencesChange(normalizedPreferences);
          }
        }
      } catch (err: any) {
        console.error('Erreur lors du chargement des préférences:', err);
        setError(err.message || 'Erreur lors du chargement des préférences');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPreferences();
  }, [onPreferencesChange]);

  // Gérer les changements de préférences
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      const [category, item] = name.split('.');
      
      if (category === 'visibleWidgets') {
        setPreferences((prev: any) => ({
          ...prev,
          visibleWidgets: {
            ...prev.visibleWidgets,
            [item]: checkbox.checked
          }
        }));
      }
    } else {
      setPreferences((prev: any) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Enregistrer les préférences
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      // Convertir les préférences au format attendu par l'API (snake_case)
      const apiPreferences = {
        layout: preferences.layout,
        theme: preferences.theme,
        visible_widgets: {
          farm_overview: preferences.visibleWidgets.farmOverview,
          batch_status: preferences.visibleWidgets.batchStatus,
          quality_trends: preferences.visibleWidgets.qualityTrends,
          recent_classifications: preferences.visibleWidgets.recentClassifications,
          weather: preferences.visibleWidgets.weather
        },
        refresh_interval: preferences.refreshInterval
      };
      
      await dashboardService.updateDashboardPreferences(apiPreferences);
      
      showToast({
        type: 'success',
        title: 'Préférences enregistrées',
        message: 'Vos préférences de dashboard ont été mises à jour avec succès'
      });
      
      // Notifier le parent si nécessaire
      if (onPreferencesChange) {
        onPreferencesChange(preferences);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement des préférences');
      showToast({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible d\'enregistrer vos préférences'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`card p-4 ${className}`}>
      <div className="flex items-center mb-4">
        <Settings className="h-5 w-5 mr-2 text-accent-primary" />
        <h3 className="text-xl font-title font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          {title}
        </h3>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-primary"></div>
          <span className="ml-2 text-white/60">Chargement des préférences...</span>
        </div>
      ) : error ? (
        <div className="p-4 text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Disposition */}
            <div className="space-y-3">
              <div className="flex items-center mb-2">
                <Layout className="h-4 w-4 mr-2 text-accent-secondary" />
                <h4 className="font-medium text-white">Disposition</h4>
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-1">
                  Type de disposition
                </label>
                <select
                  name="layout"
                  value={preferences.layout}
                  onChange={handleChange}
                  className="w-full bg-background-light/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-accent-primary"
                >
                  <option value="default">Standard</option>
                  <option value="compact">Compact</option>
                  <option value="expanded">Étendu</option>
                  <option value="focus">Mode focus</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-1">
                  Intervalle de rafraîchissement (minutes)
                </label>
                <select
                  name="refreshInterval"
                  value={preferences.refreshInterval}
                  onChange={handleChange}
                  className="w-full bg-background-light/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-accent-primary"
                >
                  <option value="5">5 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 heure</option>
                  <option value="0">Manuel uniquement</option>
                </select>
              </div>
            </div>
            
            {/* Thème et widgets visibles */}
            <div className="space-y-3">
              <div className="flex items-center mb-2">
                <Palette className="h-4 w-4 mr-2 text-accent-tertiary" />
                <h4 className="font-medium text-white">Apparence</h4>
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-1">
                  Thème
                </label>
                <select
                  name="theme"
                  value={preferences.theme}
                  onChange={handleChange}
                  className="w-full bg-background-light/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-accent-primary"
                >
                  <option value="dark">Sombre</option>
                  <option value="light">Clair</option>
                  <option value="system">Système</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Widgets visibles
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="visibleWidgets.farmOverview"
                      checked={preferences.visibleWidgets.farmOverview}
                      onChange={handleChange}
                      className="rounded border-white/20 text-accent-primary focus:ring-accent-primary/20 bg-background-light/50"
                    />
                    <span className="ml-2 text-white/80 text-sm">Vue d'ensemble des fermes</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="visibleWidgets.batchStatus"
                      checked={preferences.visibleWidgets.batchStatus}
                      onChange={handleChange}
                      className="rounded border-white/20 text-accent-primary focus:ring-accent-primary/20 bg-background-light/50"
                    />
                    <span className="ml-2 text-white/80 text-sm">Statut des lots</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="visibleWidgets.qualityTrends"
                      checked={preferences.visibleWidgets.qualityTrends}
                      onChange={handleChange}
                      className="rounded border-white/20 text-accent-primary focus:ring-accent-primary/20 bg-background-light/50"
                    />
                    <span className="ml-2 text-white/80 text-sm">Tendances de qualité</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="visibleWidgets.recentClassifications"
                      checked={preferences.visibleWidgets.recentClassifications}
                      onChange={handleChange}
                      className="rounded border-white/20 text-accent-primary focus:ring-accent-primary/20 bg-background-light/50"
                    />
                    <span className="ml-2 text-white/80 text-sm">Classifications récentes</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="visibleWidgets.weather"
                      checked={preferences.visibleWidgets.weather}
                      onChange={handleChange}
                      className="rounded border-white/20 text-accent-primary focus:ring-accent-primary/20 bg-background-light/50"
                    />
                    <span className="ml-2 text-white/80 text-sm">Météo et conditions</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button 
              variant="primary" 
              icon={<Save className="h-4 w-4 mr-2" />}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Enregistrement...' : 'Enregistrer les préférences'}
            </Button>
          </div>
          
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPreferencesWidget;

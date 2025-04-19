import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import DashboardService, { DashboardData, AdminDashboardData, TechnicianDashboardData, FarmerDashboardData } from '../services/dashboardService';

// Type pour le contexte du dashboard
interface DashboardContextType {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  lastUpdated: Date | null;
}

// Créer le contexte du dashboard
const DashboardContext = createContext<DashboardContextType>({
  dashboardData: null,
  isLoading: false,
  error: null,
  refreshData: async () => {},
  lastUpdated: null
});

// Hook personnalisé pour utiliser le contexte du dashboard
export const useDashboard = () => useContext(DashboardContext);

// Fournisseur du contexte du dashboard
export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fonction pour charger les données du dashboard
  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Utiliser le service mis à jour pour récupérer les données du dashboard
      let data;
      
      // Récupérer les données spécifiques au rôle
      if (user.role === 'admin') {
        data = await DashboardService.getAdminDashboardData();
      } else if (user.role === 'technician') {
        data = await DashboardService.getTechnicianDashboardData();
      } else {
        data = await DashboardService.getFarmerDashboardData();
      }
      
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Erreur lors du chargement des données du dashboard:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des données du dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les données au montage du composant et lorsque l'utilisateur change
  useEffect(() => {
    if (user) {
      loadDashboardData();
    } else {
      setDashboardData(null);
    }
  }, [user]);

  // Fonction pour rafraîchir les données
  const refreshData = async () => {
    await loadDashboardData();
  };

  return (
    <DashboardContext.Provider
      value={{
        dashboardData,
        isLoading,
        error,
        refreshData,
        lastUpdated
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;

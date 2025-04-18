import api from './api';
import { StatisticsResponse, FarmStatistics, BatchStatistics, User } from '../types';

// Types pour les données du dashboard
export interface DashboardData {
  totalClassifications: number;
  averageConfidence: number;
  classDistribution: Record<string, number>;
  classPercentages: Record<string, number>;
  recentClassifications: any[];
  userRole: string;
}

export interface AdminDashboardData extends DashboardData {
  totalUsers: number;
  usersByRole: Record<string, number>;
  activeUsers: number;
  systemPerformance: {
    averageProcessingTime: number;
    apiResponseTime: number;
    modelVersion: string;
    modelAccuracy: number;
  };
}

export interface TechnicianDashboardData extends DashboardData {
  managedFarms: number;
  farmPerformance: FarmStatistics[];
  qualityTrends: any[];
}

export interface FarmerDashboardData extends DashboardData {
  farms: FarmStatistics[];
  totalBatches: number;
  pendingBatches: number;
}

// Service pour le dashboard
class DashboardService {
  // Obtenir les données du dashboard adaptées au rôle de l'utilisateur
  static async getDashboardData(role: string): Promise<DashboardData> {
    try {
      // Utiliser le nouvel endpoint dashboard/user qui retourne les données adaptées au rôle
      const response = await api.get('/dashboard/user/');
      
      // Ajouter le rôle de l'utilisateur aux données
      return {
        ...response.data,
        userRole: role
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des données du dashboard:', error);
      throw error;
    }
  }

  // Obtenir les données spécifiques pour le dashboard administrateur
  static async getAdminDashboardData(): Promise<AdminDashboardData> {
    try {
      const response = await api.get('/dashboard/admin/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données admin:', error);
      throw error;
    }
  }

  // Obtenir les données spécifiques pour le dashboard technicien
  static async getTechnicianDashboardData(): Promise<TechnicianDashboardData> {
    try {
      const response = await api.get('/dashboard/technician/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données technicien:', error);
      throw error;
    }
  }

  // Obtenir les données spécifiques pour le dashboard agriculteur
  static async getFarmerDashboardData(): Promise<FarmerDashboardData> {
    try {
      const response = await api.get('/dashboard/farmer/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données agriculteur:', error);
      throw error;
    }
  }

  // Obtenir les préférences de dashboard de l'utilisateur
  static async getDashboardPreferences(): Promise<any> {
    try {
      const response = await api.get('/dashboard/preferences/my_preferences/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des préférences du dashboard:', error);
      throw error;
    }
  }

  // Mettre à jour les préférences de dashboard de l'utilisateur
  static async updateDashboardPreferences(preferences: any): Promise<any> {
    try {
      const response = await api.put('/dashboard/preferences/update_preferences/', preferences);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences du dashboard:', error);
      throw error;
    }
  }

  // Obtenir les statistiques globales
  static async getGlobalStatistics(): Promise<StatisticsResponse> {
    try {
      const response = await api.get<StatisticsResponse>('plum-classifier/classifications/stats/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques globales:', error);
      throw error;
    }
  }

  // Obtenir les statistiques d'une ferme spécifique
  static async getFarmStatistics(farmId: number): Promise<FarmStatistics> {
    try {
      const response = await api.get<FarmStatistics>(`farms/${farmId}/stats/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des statistiques de la ferme ${farmId}:`, error);
      throw error;
    }
  }

  // Obtenir les statistiques d'un lot spécifique
  static async getBatchStatistics(batchId: number): Promise<BatchStatistics> {
    try {
      const response = await api.get<BatchStatistics>(`batches/${batchId}/classifications/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des statistiques du lot ${batchId}:`, error);
      throw error;
    }
  }
}

export default DashboardService;

import api from './api';
import { normalizeResponse } from '../utils/apiUtils';

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
  farmPerformance: any[];
  qualityTrends: any[];
}

export interface FarmerDashboardData extends DashboardData {
  farms: any[];
  totalBatches: number;
  pendingBatches: number;
  alerts?: any[];
  weatherData?: any;
  qualityTrends?: any;
}

// Service pour le dashboard
class DashboardService {
  // Obtenir les données du dashboard adaptées au rôle de l'utilisateur
  static async getDashboardData(role: string): Promise<DashboardData> {
    try {
      // Utiliser le nouvel endpoint dashboard/user qui retourne les données adaptées au rôle
      const response = await api.get('/dashboard/user/');
      
      // Normaliser la réponse pour gérer les problèmes de camelCase vs snake_case
      const normalizedData = normalizeResponse(response.data);
      
      // Ajouter le rôle de l'utilisateur aux données
      return {
        ...normalizedData,
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
      return normalizeResponse(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données admin:', error);
      throw error;
    }
  }

  // Obtenir les données spécifiques pour le dashboard technicien
  static async getTechnicianDashboardData(): Promise<TechnicianDashboardData> {
    try {
      const response = await api.get('/dashboard/technician/');
      return normalizeResponse(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données technicien:', error);
      throw error;
    }
  }

  // Obtenir les données spécifiques pour le dashboard agriculteur
  static async getFarmerDashboardData(): Promise<FarmerDashboardData> {
    try {
      const response = await api.get('/dashboard/farmer/');
      
      // Normaliser la réponse pour gérer les problèmes de camelCase vs snake_case
      const data = normalizeResponse(response.data);
      
      // Convertir les propriétés spécifiques qui pourraient être en snake_case
      return {
        ...data,
        totalBatches: data.totalBatches || data.totalBatches || 0,
        pendingBatches: data.pendingBatches || data.pendingBatches || 0,
        farms: data.farms || [],
        alerts: data.alerts || [],
        weatherData: data.weatherData || data.weather_data,
        qualityTrends: data.qualityTrends || data.quality_trends
      };
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

  // Obtenir les tendances de qualité
  static async getQualityTrends(params: any): Promise<any> {
    try {
      const response = await api.get('/classifications/quality-trends/', { params });
      return normalizeResponse(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des tendances de qualité:', error);
      throw error;
    }
  }

  // Obtenir les alertes pour l'agriculteur
  static async getFarmerAlerts(): Promise<any[]> {
    try {
      const response = await api.get('/dashboard/farmer/alerts/');
      return normalizeResponse(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des alertes:', error);
      throw error;
    }
  }

  // Exporter les données du dashboard
  static async exportDashboardData(format: string = 'csv', params: any = {}): Promise<Blob> {
    try {
      const response = await api.get(`/dashboard/export/?format=${format}`, {
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'exportation des données:', error);
      throw error;
    }
  }
}

export default DashboardService;

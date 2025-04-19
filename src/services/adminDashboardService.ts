// adminDashboardService.ts - Service pour le dashboard administrateur
import api from './api';
import { normalizeResponse } from '../utils/apiUtils';

// Types pour le dashboard administrateur
export interface AdminDashboardData {
  totalUsers: number;
  activeUsers: number;
  usersByRole: Record<string, number>;
  newUsersThisMonth: number;
  totalClassifications: number;
  classificationsToday: number;
  averageConfidence: number;
  classDistribution: Record<string, number>;
  systemPerformance: {
    averageProcessingTime: number;
    apiResponseTime: number;
    modelVersion: string;
    modelAccuracy: number;
    serverLoad: number;
    memoryUsage: number;
  };
  recentActivity: Array<{
    id: number;
    user: string;
    action: string;
    timestamp: string;
    details?: string;
  }>;
}

// Service pour le dashboard administrateur
class AdminDashboardService {
  // Obtenir les données du dashboard administrateur
  static async getAdminDashboardData(params = {}) {
    try {
      const response = await api.get('/dashboard/admin/', { params });
      return normalizeResponse(response.data) as AdminDashboardData;
    } catch (error) {
      console.error('Erreur lors de la récupération des données du dashboard admin:', error);
      throw error;
    }
  }

  // Obtenir les statistiques des utilisateurs
  static async getUserStatistics(params = {}) {
    try {
      const response = await api.get('/dashboard/admin/user-statistics/', { params });
      return normalizeResponse(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques utilisateurs:', error);
      throw error;
    }
  }

  // Obtenir les statistiques du système
  static async getSystemStatistics(params = {}) {
    try {
      const response = await api.get('/dashboard/admin/system-statistics/', { params });
      return normalizeResponse(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques système:', error);
      throw error;
    }
  }

  // Obtenir l'activité récente du système
  static async getRecentActivity(params = {}) {
    try {
      const response = await api.get('/dashboard/admin/recent-activity/', { params });
      return normalizeResponse(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'activité récente:', error);
      throw error;
    }
  }

  // Obtenir les statistiques de performance du modèle
  static async getModelPerformanceStats(params = {}) {
    try {
      const response = await api.get('/dashboard/admin/model-performance/', { params });
      return normalizeResponse(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques de performance du modèle:', error);
      throw error;
    }
  }

  // Obtenir les statistiques d'utilisation de l'API
  static async getApiUsageStats(params = {}) {
    try {
      const response = await api.get('/dashboard/admin/api-usage/', { params });
      return normalizeResponse(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques d\'utilisation de l\'API:', error);
      throw error;
    }
  }
}

export default AdminDashboardService;

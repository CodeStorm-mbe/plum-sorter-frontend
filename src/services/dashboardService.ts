// dashboardService.ts - Service pour la gestion des données du dashboard
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
      // Données de base pour tous les rôles
      const statsResponse = await api.get<StatisticsResponse>('/plum-classifier/classifications/stats/');
      const baseData: DashboardData = {
        totalClassifications: statsResponse.data.total_classifications,
        averageConfidence: statsResponse.data.average_confidence,
        classDistribution: statsResponse.data.class_counts,
        classPercentages: statsResponse.data.class_percentages,
        recentClassifications: statsResponse.data.recent_classifications || [],
        userRole: role
      };

      // Données spécifiques selon le rôle
      switch (role) {
        case 'admin':
          return await this.getAdminDashboardData(baseData);
        case 'technician':
          return await this.getTechnicianDashboardData(baseData);
        case 'farmer':
          return await this.getFarmerDashboardData(baseData);
        default:
          return baseData;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données du dashboard:', error);
      throw error;
    }
  }

  // Obtenir les données spécifiques pour le dashboard administrateur
  private static async getAdminDashboardData(baseData: DashboardData): Promise<AdminDashboardData> {
    try {
      // Récupérer les statistiques des utilisateurs
      const userStatsResponse = await api.get('users/stats/');
      
      // Récupérer les informations sur le modèle actif
      const modelInfoResponse = await api.get('models/info/');
      
      return {
        ...baseData,
        totalUsers: userStatsResponse.data.total_users || 0,
        usersByRole: userStatsResponse.data.role_distribution || {},
        activeUsers: userStatsResponse.data.active_users || 0,
        systemPerformance: {
          averageProcessingTime: modelInfoResponse.data.average_processing_time || 0,
          apiResponseTime: modelInfoResponse.data.api_response_time || 0,
          modelVersion: modelInfoResponse.data.version || 'Inconnue'
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des données admin:', error);
      // En cas d'erreur, retourner les données de base
      return baseData as AdminDashboardData;
    }
  }

  // Obtenir les données spécifiques pour le dashboard technicien
  private static async getTechnicianDashboardData(baseData: DashboardData): Promise<TechnicianDashboardData> {
    try {
      // Récupérer les fermes gérées par le technicien
      const farmsResponse = await api.get('farms/');
      const farms = farmsResponse.data.results || [];
      
      // Récupérer les statistiques pour chaque ferme
      const farmStats: FarmStatistics[] = [];
      for (const farm of farms) {
        try {
          const farmStatsResponse = await api.get(`farms/${farm.id}/stats/`);
          farmStats.push(farmStatsResponse.data);
        } catch (error) {
          console.error(`Erreur lors de la récupération des statistiques pour la ferme ${farm.id}:`, error);
        }
      }
      
      // Calculer les tendances de qualité (exemple simplifié)
      const qualityTrends = this.calculateQualityTrends(farmStats);
      
      return {
        ...baseData,
        managedFarms: farms.length,
        farmPerformance: farmStats,
        qualityTrends
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des données technicien:', error);
      // En cas d'erreur, retourner les données de base
      return baseData as TechnicianDashboardData;
    }
  }

  // Obtenir les données spécifiques pour le dashboard agriculteur
  private static async getFarmerDashboardData(baseData: DashboardData): Promise<FarmerDashboardData> {
    try {
      // Récupérer les fermes de l'agriculteur
      const farmsResponse = await api.get('farms/');
      const farms = farmsResponse.data.results || [];
      
      // Récupérer les statistiques pour chaque ferme
      const farmStats: FarmStatistics[] = [];
      let totalBatches = 0;
      let pendingBatches = 0;
      
      for (const farm of farms) {
        try {
          const farmStatsResponse = await api.get(`farms/${farm.id}/stats/`);
          farmStats.push(farmStatsResponse.data);
          
          // Récupérer les lots de la ferme
          const batchesResponse = await api.get(`farms/${farm.id}/batches/`);
          const batches = batchesResponse.data || [];
          
          totalBatches += batches.length;
          pendingBatches += batches.filter((batch: any) => batch.status === 'pending').length;
        } catch (error) {
          console.error(`Erreur lors de la récupération des données pour la ferme ${farm.id}:`, error);
        }
      }
      
      return {
        ...baseData,
        farms: farmStats,
        totalBatches,
        pendingBatches
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des données agriculteur:', error);
      // En cas d'erreur, retourner les données de base
      return baseData as FarmerDashboardData;
    }
  }

  // Méthode utilitaire pour calculer les tendances de qualité
  private static calculateQualityTrends(farmStats: FarmStatistics[]): any[] {
    // Exemple simplifié - dans une implémentation réelle, cela serait plus complexe
    const trends: any[] = [];
    
    // Regrouper les données par catégorie de qualité
    const categories = ['bonne_qualite', 'non_mure', 'tachetee', 'fissuree', 'meurtrie', 'pourrie'];
    
    categories.forEach(category => {
      const trend = {
        category,
        data: farmStats.map(farm => {
          const percentage = farm.class_percentages?.[category] || 0;
          return {
            farmId: farm.id,
            farmName: farm.name,
            percentage
          };
        })
      };
      
      trends.push(trend);
    });
    
    return trends;
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

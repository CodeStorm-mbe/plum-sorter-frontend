// technicianDashboardService.ts - Service pour le dashboard technicien
import api from './api';
import { normalizeResponse } from '../utils/apiUtils';

// Types pour le dashboard technicien
export interface TechnicianDashboardData {
  totalClassifications: number;
  averageConfidence: number;
  classDistribution: Record<string, number>;
  managedFarms: number;
  farmPerformance: Array<{
    id: number;
    name: string;
    location: string;
    qualityScore: number;
    totalClassifications: number;
    recentTrend: 'up' | 'down' | 'stable';
    lastUpdate: string;
  }>;
  qualityTrends: Record<string, Array<{
    date: string;
    value: number;
  }>>;
  recentClassifications: Array<{
    id: number;
    image: string;
    className: string;
    confidenceScore: number;
    farm: {
      id: number;
      name: string;
    };
    createdAt: string;
  }>;
  alerts: Array<{
    id: number;
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'error';
    farmId?: number;
    createdAt: string;
  }>;
}

// Service pour le dashboard technicien
class TechnicianDashboardService {
  // Obtenir les données du dashboard technicien
  static async getTechnicianDashboardData(params = {}) {
    try {
      const response = await api.get('/dashboard/technician/', { params });
      return normalizeResponse(response.data) as TechnicianDashboardData;
    } catch (error) {
      console.error('Erreur lors de la récupération des données du dashboard technicien:', error);
      throw error;
    }
  }

  // Obtenir les performances des fermes gérées
  static async getManagedFarmsPerformance(params = {}) {
    try {
      const response = await api.get('/dashboard/technician/farms-performance/', { params });
      return normalizeResponse(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des performances des fermes:', error);
      throw error;
    }
  }

  // Obtenir les alertes pour le technicien
  static async getTechnicianAlerts(params = {}) {
    try {
      const response = await api.get('/dashboard/technician/alerts/', { params });
      return normalizeResponse(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des alertes technicien:', error);
      throw error;
    }
  }

  // Obtenir les tendances de qualité pour toutes les fermes gérées
  static async getQualityTrendsForManagedFarms(params = {}) {
    try {
      const response = await api.get('/dashboard/technician/quality-trends/', { params });
      return normalizeResponse(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des tendances de qualité:', error);
      throw error;
    }
  }

  // Obtenir les recommandations pour améliorer la qualité
  static async getQualityRecommendations(farmId: number) {
    try {
      const response = await api.get(`/dashboard/technician/farms/${farmId}/recommendations/`);
      return normalizeResponse(response.data);
    } catch (error) {
      console.error(`Erreur lors de la récupération des recommandations pour la ferme ${farmId}:`, error);
      throw error;
    }
  }

  // Générer un rapport pour une ferme
  static async generateFarmReport(farmId: number, params = {}) {
    try {
      const response = await api.get(`/dashboard/technician/farms/${farmId}/report/`, {
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la génération du rapport pour la ferme ${farmId}:`, error);
      throw error;
    }
  }
}

export default TechnicianDashboardService;

// dashboardAnalyticsService.ts - Service pour les fonctionnalités d'analyse avancée du dashboard
import api from './api';
import { normalizeResponse } from '../utils/apiUtils';

// Types pour les données d'analyse
export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface QualityTrend {
  [category: string]: TimeSeriesData[];
}

export interface FarmComparison {
  id: number;
  name: string;
  location: string;
  total_classifications: number;
  quality_score: number;
  efficiency: number;
  volume: number;
}

export interface QualityPrediction {
  prediction_date: string;
  predicted_distribution: Record<string, number>;
  confidence: number;
  method: string;
}

export interface ActivityHeatmap {
  data: number[][];
  days: string[];
  hours: string[];
  max_value: number;
}

export interface ClassificationAccuracy {
  average_confidence: number;
  confidence_by_class: Record<string, number>;
  confidence_distribution: Record<string, number>;
  total_classifications: number;
}

// Service pour les analyses avancées du dashboard
class DashboardAnalyticsService {
  // Obtenir des données de séries temporelles
  static async getTimeSeriesData(params = {}) {
    try {
      const response = await api.get('/dashboard/analytics/time_series_data/', { params });
      return normalizeResponse(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données de séries temporelles:', error);
      throw error;
    }
  }

  // Obtenir les tendances de qualité
  static async getQualityTrends(params = {}) {
    try {
      const response = await api.get('/dashboard/analytics/quality_trends/', { params });
      return normalizeResponse(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des tendances de qualité:', error);
      throw error;
    }
  }

  // Obtenir la comparaison des fermes
  static async getFarmComparison(params = {}) {
    try {
      const response = await api.get('/dashboard/analytics/farm_comparison/', { params });
      return normalizeResponse(response.data) as FarmComparison[];
    } catch (error) {
      console.error('Erreur lors de la récupération de la comparaison des fermes:', error);
      throw error;
    }
  }

  // Obtenir une prédiction de qualité
  static async getQualityPrediction(params = {}) {
    try {
      const response = await api.get('/dashboard/analytics/quality_prediction/', { params });
      return normalizeResponse(response.data) as QualityPrediction;
    } catch (error) {
      console.error('Erreur lors de la récupération de la prédiction de qualité:', error);
      throw error;
    }
  }

  // Obtenir un heatmap d'activité utilisateur
  static async getActivityHeatmap(params = {}) {
    try {
      const response = await api.get('/dashboard/analytics/activity_heatmap/', { params });
      return normalizeResponse(response.data) as ActivityHeatmap;
    } catch (error) {
      console.error('Erreur lors de la récupération du heatmap d\'activité:', error);
      throw error;
    }
  }

  // Obtenir les métriques d'exactitude de classification
  static async getClassificationAccuracy(params = {}) {
    try {
      const response = await api.get('/dashboard/analytics/classification_accuracy/', { params });
      return normalizeResponse(response.data) as ClassificationAccuracy;
    } catch (error) {
      console.error('Erreur lors de la récupération des métriques d\'exactitude:', error);
      throw error;
    }
  }
}

export default DashboardAnalyticsService;

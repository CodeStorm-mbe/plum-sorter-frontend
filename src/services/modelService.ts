// modelService.ts - Service pour la gestion des modèles ML
import api from './api';
import { ModelVersion } from '../types';
import { normalizeResponse } from '../utils/apiUtils';

// Types pour les modèles ML
export interface ModelPerformance {
  id: number;
  name: string;
  version: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  confusion_matrix: number[][];
  training_date: string;
}

export interface ModelActivationRequest {
  is_active: boolean;
  is_production?: boolean;
}

// Service pour la gestion des modèles ML
class ModelService {
  // Obtenir la liste des versions de modèles
  static async getModelVersions(params = {}) {
    try {
      const response = await api.get('/plum-classifier/models/', { params });
      return normalizeResponse(response.data.results);
    } catch (error) {
      console.error('Erreur lors de la récupération des versions de modèles:', error);
      throw error;
    }
  }

  // Obtenir une version de modèle spécifique
  static async getModelVersion(id: number) {
    try {
      const response = await api.get(`/plum-classifier/models/${id}/`);
      return normalizeResponse(response.data) as ModelVersion;
    } catch (error) {
      console.error(`Erreur lors de la récupération du modèle ${id}:`, error);
      throw error;
    }
  }

  // Obtenir le modèle actif
  static async getActiveModel() {
    try {
      const response = await api.get('/plum-classifier/models/active/');
      return normalizeResponse(response.data) as ModelVersion;
    } catch (error) {
      console.error('Erreur lors de la récupération du modèle actif:', error);
      throw error;
    }
  }

  // Activer/désactiver un modèle
  static async updateModelActivation(id: number, data: ModelActivationRequest) {
    try {
      const response = await api.patch(`/plum-classifier/models/${id}/update_activation/`, data);
      return normalizeResponse(response.data) as ModelVersion;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'activation du modèle ${id}:`, error);
      throw error;
    }
  }

  // Obtenir les performances d'un modèle
  static async getModelPerformance(id: number) {
    try {
      const response = await api.get(`/plum-classifier/models/${id}/performance/`);
      return normalizeResponse(response.data) as ModelPerformance;
    } catch (error) {
      console.error(`Erreur lors de la récupération des performances du modèle ${id}:`, error);
      throw error;
    }
  }

  // Comparer les performances de plusieurs modèles
  static async compareModels(modelIds: number[]) {
    try {
      const response = await api.get('/plum-classifier/models/compare/', {
        params: { model_ids: modelIds.join(',') }
      });
      return normalizeResponse(response.data) as ModelPerformance[];
    } catch (error) {
      console.error('Erreur lors de la comparaison des modèles:', error);
      throw error;
    }
  }

  // Obtenir l'historique des performances d'un modèle
  static async getModelHistory(id: number) {
    try {
      const response = await api.get(`/plum-classifier/models/${id}/history/`);
      return normalizeResponse(response.data);
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'historique du modèle ${id}:`, error);
      throw error;
    }
  }
}

export default ModelService;

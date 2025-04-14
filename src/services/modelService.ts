// modelService.ts - Service pour la gestion des versions de modèles
import ApiService from './api';

// Types pour les modèles
export interface ModelVersion {
  id: number;
  name: string;
  version: string;
  file_path: string;
  metadata_path: string;
  model_type: string;
  num_classes: number;
  input_shape: number[];
  confidence_threshold: number;
  accuracy: number;
  f1_score: number;
  precision: number;
  recall: number;
  training_date: string;
  training_duration: number;
  dataset_size: number;
  is_active: boolean;
  is_production: boolean;
  created_at: string;
  updated_at: string;
}

export interface ModelInfo {
  id: number;
  name: string;
  version: string;
  model_type: string;
  num_classes: number;
  input_shape: number[];
  confidence_threshold: number;
  is_active: boolean;
  loaded_at: string;
  performance_metrics: {
    accuracy: number;
    f1_score: number;
    precision: number;
    recall: number;
  };
}

// Service de gestion des modèles
class ModelService {
  // Obtenir la liste des versions de modèles (admin seulement)
  static async getModels(): Promise<ModelVersion[]> {
    try {
      const response = await ApiService.get<ModelVersion[]>('models/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des modèles:', error);
      throw error;
    }
  }
  
  // Obtenir un modèle par ID (admin seulement)
  static async getModelById(id: number): Promise<ModelVersion> {
    try {
      const response = await ApiService.get<ModelVersion>(`models/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du modèle ${id}:`, error);
      throw error;
    }
  }
  
  // Obtenir le modèle actif
  static async getActiveModel(): Promise<ModelVersion> {
    try {
      const response = await ApiService.get<ModelVersion>('models/active/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du modèle actif:', error);
      throw error;
    }
  }
  
  // Activer un modèle (admin seulement)
  static async activateModel(id: number): Promise<any> {
    try {
      const response = await ApiService.post<any>(`models/${id}/activate/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'activation du modèle ${id}:`, error);
      throw error;
    }
  }
  
  // Recharger le modèle actif (admin seulement)
  static async reloadModel(): Promise<any> {
    try {
      const response = await ApiService.post<any>('models/reload/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du rechargement du modèle:', error);
      throw error;
    }
  }
  
  // Obtenir les informations sur le modèle chargé
  static async getModelInfo(): Promise<ModelInfo> {
    try {
      const response = await ApiService.get<ModelInfo>('models/info/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations du modèle:', error);
      throw error;
    }
  }
}

export default ModelService;

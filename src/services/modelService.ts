import { ModelVersion } from '../types';
import api from './api';
import { handlePaginatedResponse } from '../utils/apiUtils';

// Service pour la gestion des modèles de classification
class ModelService {
  // Obtenir la liste des versions de modèle
  static async getModelVersions(params = {}) {
    try {
      const response = await api.get('plum-classifier/models/', { params });
      return handlePaginatedResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des versions de modèle:', error);
      throw error;
    }
  }

  // Alias pour getModelVersions pour compatibilité
  static async getModels(params = {}) {
    return this.getModelVersions(params);
  }

  // Obtenir une version de modèle spécifique
  static async getModelVersion(id: number) {
    try {
      const response = await api.get(`plum-classifier/models/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la version de modèle ${id}:`, error);
      throw error;
    }
  }

  // Obtenir le modèle actif
  static async getActiveModel() {
    try {
      const response = await api.get('plum-classifier/models/active/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du modèle actif:', error);
      throw error;
    }
  }

  // Activer une version de modèle
  static async activateModel(id: number) {
    try {
      const response = await api.post(`plum-classifier/models/${id}/activate/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'activation de la version de modèle ${id}:`, error);
      throw error;
    }
  }

  // Télécharger un nouveau modèle
  static async uploadModel(formData: FormData) {
    try {
      const response = await api.post('plum-classifier/models/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du téléchargement du modèle:', error);
      throw error;
    }
  }

  // Alias pour uploadModel pour compatibilité
  static async reloadModel(formData?: FormData) {
    if (formData) {
      return this.uploadModel(formData);
    }
    
    // Si aucun formData n'est fourni, simplement recharger le modèle actif
    try {
      const response = await api.post('plum-classifier/models/reload/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du rechargement du modèle:', error);
      throw error;
    }
  }

  // Mettre à jour les métadonnées d'un modèle
  static async updateModelMetadata(id: number, metadata: Partial<ModelVersion>) {
    try {
      const response = await api.patch(`plum-classifier/models/${id}/`, metadata);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour des métadonnées du modèle ${id}:`, error);
      throw error;
    }
  }

  // Supprimer une version de modèle
  static async deleteModelVersion(id: number) {
    try {
      const response = await api.delete(`plum-classifier/models/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la version de modèle ${id}:`, error);
      throw error;
    }
  }

  // Obtenir les performances du modèle
  static async getModelPerformance(id: number) {
    try {
      const response = await api.get(`plum-classifier/models/${id}/performance/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des performances du modèle ${id}:`, error);
      throw error;
    }
  }

  // Obtenir l'historique des modèles
  static async getModelHistory(params = {}) {
    try {
      const response = await api.get('plum-classifier/models/history/', { params });
      return handlePaginatedResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique des modèles:', error);
      throw error;
    }
  }
}

export default ModelService;

import { PlumClassification } from '../types';
import api from './api';

// Service pour la gestion des classifications
class ClassificationService {
  // Obtenir la liste des classifications
  static async getClassifications(params = {}) {
    try {
      const response = await api.get('plum-classifier/classifications/', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des classifications:', error);
      throw error;
    }
  }

  // Obtenir une classification spécifique
  static async getClassification(id: number) {
    try {
      const response = await api.get(`plum-classifier/classifications/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la classification ${id}:`, error);
      throw error;
    }
  }

  // Classifier une image
  static async classifyImage(formData: FormData) {
    try {
      const response = await api.post('plum-classifier/classify/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la classification de l\'image:', error);
      throw error;
    }
  }

  // Supprimer une classification
  static async deleteClassification(id: number) {
    try {
      const response = await api.delete(`plum-classifier/classifications/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la classification ${id}:`, error);
      throw error;
    }
  }

  // Obtenir les statistiques globales des classifications
  static async getClassificationStats() {
    try {
      const response = await api.get('plum-classifier/classifications/stats/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques de classification:', error);
      throw error;
    }
  }

  // Classifier un lot entier (plusieurs images)
  static async classifyBatch(batchId: number, formData: FormData) {
    try {
      const response = await api.post(`batches/${batchId}/classify_batch/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la classification du lot ${batchId}:`, error);
      throw error;
    }
  }
}

export default ClassificationService;

import { Batch } from '../types';
import api from './api';

// Service pour la gestion des lots de prunes
class BatchService {
  // Obtenir la liste des lots
  static async getBatches(params = {}) {
    try {
      const response = await api.get('batches/', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des lots:', error);
      throw error;
    }
  }

  // Obtenir un lot spécifique
  static async getBatch(id: number) {
    try {
      const response = await api.get(`batches/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du lot ${id}:`, error);
      throw error;
    }
  }

  // Créer un nouveau lot
  static async createBatch(batchData: Partial<Batch>) {
    try {
      const response = await api.post('batches/', batchData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du lot:', error);
      throw error;
    }
  }

  // Mettre à jour un lot existant
  static async updateBatch(id: number, batchData: Partial<Batch>) {
    try {
      const response = await api.patch(`batches/${id}/`, batchData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du lot ${id}:`, error);
      throw error;
    }
  }

  // Supprimer un lot
  static async deleteBatch(id: number) {
    try {
      const response = await api.delete(`batches/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du lot ${id}:`, error);
      throw error;
    }
  }

  // Obtenir les classifications d'un lot
  static async getBatchClassifications(id: number) {
    try {
      const response = await api.get(`batches/${id}/classifications/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des classifications du lot ${id}:`, error);
      throw error;
    }
  }

  // Classifier un lot entier
  static async classifyBatch(id: number, data: any) {
    try {
      const response = await api.post(`batches/${id}/classify_batch/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la classification du lot ${id}:`, error);
      throw error;
    }
  }
}

export default BatchService;

import { PlumBatch } from '../types';
import api from './api';
import { handlePaginatedResponse } from '../utils/apiUtils';

// Service pour la gestion des lots de prunes
class BatchService {
  // Obtenir la liste des lots
  static async getBatches(params = {}) {
    try {
      const response = await api.get('batches/', { params });
      return handlePaginatedResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des lots:', error);
      throw error;
    }
  }

  // Obtenir les lots d'une ferme spécifique
  static async getBatchesByFarm(farmId: number, params = {}) {
    try {
      const response = await api.get(`farms/${farmId}/batches/`, { params });
      return handlePaginatedResponse(response);
    } catch (error) {
      console.error(`Erreur lors de la récupération des lots de la ferme ${farmId}:`, error);
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
  static async createBatch(batchData: Partial<PlumBatch>) {
    try {
      const response = await api.post('batches/', batchData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du lot:', error);
      throw error;
    }
  }

  // Mettre à jour un lot existant
  static async updateBatch(id: number, batchData: Partial<PlumBatch>) {
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
  static async getBatchClassifications(id: number, params = {}) {
    try {
      const response = await api.get(`batches/${id}/classifications/`, { params });
      return handlePaginatedResponse(response);
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

  // Ajouter une image à un lot
  static async addImageToBatch(id: number, imageFile: File, metadata: any = {}) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      // Ajouter les métadonnées si nécessaire
      Object.keys(metadata).forEach(key => {
        formData.append(key, metadata[key]);
      });
      
      const response = await api.post(`batches/${id}/add_image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'ajout de l'image au lot ${id}:`, error);
      throw error;
    }
  }

  // Obtenir les images d'un lot
  static async getBatchImages(id: number, params = {}) {
    try {
      const response = await api.get(`batches/${id}/images/`, { params });
      return handlePaginatedResponse(response);
    } catch (error) {
      console.error(`Erreur lors de la récupération des images du lot ${id}:`, error);
      throw error;
    }
  }
}

export default BatchService;

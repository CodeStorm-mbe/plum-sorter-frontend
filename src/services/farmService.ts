import { Farm } from '../types';
import api from './api';

// Service pour la gestion des fermes
class FarmService {
  // Obtenir la liste des fermes
  static async getFarms(params = {}) {
    try {
      const response = await api.get('farms/', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des fermes:', error);
      throw error;
    }
  }

  // Obtenir une ferme spécifique
  static async getFarm(id: number) {
    try {
      const response = await api.get(`farms/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la ferme ${id}:`, error);
      throw error;
    }
  }

  // Créer une nouvelle ferme
  static async createFarm(farmData: Partial<Farm>) {
    try {
      const response = await api.post('farms/', farmData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la ferme:', error);
      throw error;
    }
  }

  // Mettre à jour une ferme existante
  static async updateFarm(id: number, farmData: Partial<Farm>) {
    try {
      const response = await api.patch(`farms/${id}/`, farmData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la ferme ${id}:`, error);
      throw error;
    }
  }

  // Supprimer une ferme
  static async deleteFarm(id: number) {
    try {
      const response = await api.delete(`farms/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la ferme ${id}:`, error);
      throw error;
    }
  }

  // Obtenir les statistiques d'une ferme
  static async getFarmStats(id: number) {
    try {
      const response = await api.get(`farms/${id}/stats/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des statistiques de la ferme ${id}:`, error);
      throw error;
    }
  }

  // Obtenir les lots d'une ferme
  static async getFarmBatches(id: number) {
    try {
      const response = await api.get(`farms/${id}/batches/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des lots de la ferme ${id}:`, error);
      throw error;
    }
  }

  // Obtenir les fermes à proximité
  static async getNearbyFarms(latitude: number, longitude: number, radius: number = 50) {
    try {
      const response = await api.get('farms/nearby/', {
        params: { latitude, longitude, radius }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des fermes à proximité:', error);
      throw error;
    }
  }
}

export default FarmService;

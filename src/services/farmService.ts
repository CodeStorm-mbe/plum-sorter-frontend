// farmService.ts - Service pour la gestion des fermes
import ApiService from './api';

// Types pour les fermes
export interface Farm {
  id: number;
  name: string;
  description: string;
  location: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  size: number;
  owner: number;
  created_at: string;
  updated_at: string;
}

export interface FarmCreateRequest {
  name: string;
  description: string;
  location: string;
  geo_coordinates?: {
    latitude: number;
    longitude: number;
  };
  size?: number;
}

export interface FarmUpdateRequest {
  name?: string;
  description?: string;
  location?: string;
  geo_coordinates?: {
    latitude: number;
    longitude: number;
  };
  size?: number;
}

export interface FarmStats {
  total_batches: number;
  total_classifications: number;
  quality_distribution: {
    [key: string]: number;
  };
  monthly_stats: {
    month: string;
    count: number;
    quality_avg: number;
  }[];
}

export interface NearbyFarmsRequest {
  latitude: number;
  longitude: number;
  radius?: number; // en kilomètres
}

// Service ferme
class FarmService {
  // Obtenir la liste des fermes
  static async getFarms(): Promise<Farm[]> {
    try {
      return await ApiService.get<Farm[]>('farms/');
    } catch (error) {
      console.error('Erreur lors de la récupération des fermes:', error);
      throw error;
    }
  }
  
  // Obtenir une ferme par ID
  static async getFarmById(id: number): Promise<Farm> {
    try {
      return await ApiService.get<Farm>(`farms/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la récupération de la ferme ${id}:`, error);
      throw error;
    }
  }
  
  // Créer une nouvelle ferme
  static async createFarm(farmData: FarmCreateRequest): Promise<Farm> {
    try {
      return await ApiService.post<Farm>('farms/', farmData);
    } catch (error) {
      console.error('Erreur lors de la création de la ferme:', error);
      throw error;
    }
  }
  
  // Mettre à jour une ferme
  static async updateFarm(id: number, farmData: FarmUpdateRequest): Promise<Farm> {
    try {
      return await ApiService.patch<Farm>(`farms/${id}/`, farmData);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la ferme ${id}:`, error);
      throw error;
    }
  }
  
  // Supprimer une ferme
  static async deleteFarm(id: number): Promise<void> {
    try {
      await ApiService.delete(`farms/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la ferme ${id}:`, error);
      throw error;
    }
  }
  
  // Obtenir les statistiques d'une ferme
  static async getFarmStats(id: number): Promise<FarmStats> {
    try {
      return await ApiService.get<FarmStats>(`farms/${id}/stats/`);
    } catch (error) {
      console.error(`Erreur lors de la récupération des statistiques de la ferme ${id}:`, error);
      throw error;
    }
  }
  
  // Obtenir les lots d'une ferme
  static async getFarmBatches(id: number): Promise<any[]> {
    try {
      return await ApiService.get<any[]>(`farms/${id}/batches/`);
    } catch (error) {
      console.error(`Erreur lors de la récupération des lots de la ferme ${id}:`, error);
      throw error;
    }
  }
  
  // Trouver des fermes à proximité
  static async getNearbyFarms(params: NearbyFarmsRequest): Promise<Farm[]> {
    try {
      return await ApiService.get<Farm[]>('farms/nearby/', { params });
    } catch (error) {
      console.error('Erreur lors de la recherche de fermes à proximité:', error);
      throw error;
    }
  }
}

export default FarmService;

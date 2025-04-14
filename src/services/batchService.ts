// batchService.ts - Service pour la gestion des lots de prunes
import ApiService from './api';
import { PlumClassification } from './classificationService';

// Types pour les lots
export interface PlumBatch {
  id: number;
  name: string;
  description: string;
  farm: number;
  farm_details?: any;
  created_by: number;
  created_by_details?: any;
  status: string;
  status_display: string;
  classification_summary: any;
  total_plums: number;
  quality_distribution: {
    [key: string]: number;
  };
  classifications_count: number;
  created_at: string;
  updated_at: string;
}

export interface BatchCreateRequest {
  name: string;
  description: string;
  farm: number;
}

export interface BatchUpdateRequest {
  name?: string;
  description?: string;
  status?: string;
}

// Service de gestion des lots
class BatchService {
  // Obtenir la liste des lots
  static async getBatches(): Promise<PlumBatch[]> {
    try {
      const response = await ApiService.get<PlumBatch[]>('batches/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des lots:', error);
      throw error;
    }
  }
  
  // Obtenir un lot par ID
  static async getBatchById(id: number): Promise<PlumBatch> {
    try {
      const response = await ApiService.get<PlumBatch>(`batches/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du lot ${id}:`, error);
      throw error;
    }
  }
  
  // Créer un nouveau lot
  static async createBatch(batchData: BatchCreateRequest): Promise<PlumBatch> {
    try {
      const response = await ApiService.post<PlumBatch>('batches/', batchData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du lot:', error);
      throw error;
    }
  }
  
  // Mettre à jour un lot
  static async updateBatch(id: number, batchData: BatchUpdateRequest): Promise<PlumBatch> {
    try {
      const response = await ApiService.patch<PlumBatch>(`batches/${id}/`, batchData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du lot ${id}:`, error);
      throw error;
    }
  }
  
  // Supprimer un lot
  static async deleteBatch(id: number): Promise<void> {
    try {
      await ApiService.delete(`batches/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du lot ${id}:`, error);
      throw error;
    }
  }
  
  // Obtenir les classifications d'un lot
  static async getBatchClassifications(id: number): Promise<PlumClassification[]> {
    try {
      const response = await ApiService.get<PlumClassification[]>(`batches/${id}/classifications/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des classifications du lot ${id}:`, error);
      throw error;
    }
  }
}

export default BatchService;

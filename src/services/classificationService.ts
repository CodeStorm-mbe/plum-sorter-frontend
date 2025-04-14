// classificationService.ts - Service pour la classification des prunes
import ApiService from './api';

// Types pour les classifications
export interface PlumClassification {
  id: number;
  image_path: string;
  original_filename: string;
  uploaded_by: number;
  farm: number;
  batch?: number;
  classification_result: any;
  class_name: string;
  class_name_display: string;
  confidence_score: number;
  is_plum: boolean;
  processing_time: number;
  device_info?: string;
  geo_location?: {
    latitude: number;
    longitude: number;
  };
  created_at: string;
}

export interface ClassificationRequest {
  image: File;
  farm_id: number;
  batch_id?: number;
  use_tta?: boolean;
  geo_location?: {
    latitude: number;
    longitude: number;
  };
}

export interface BatchClassificationRequest {
  images: File[];
  farm_id: number;
  batch_id?: number;
  batch_name?: string;
  batch_description?: string;
  use_tta?: boolean;
  geo_location?: {
    latitude: number;
    longitude: number;
  };
}

export interface BatchClassificationResponse {
  batch_id: number;
  total_processed: number;
  total_images: number;
  status: string;
  summary: any;
}

// Service de classification
class ClassificationService {
  // Obtenir la liste des classifications
  static async getClassifications(): Promise<PlumClassification[]> {
    try {
      const response = await ApiService.get<PlumClassification[]>('classifications/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des classifications:', error);
      throw error;
    }
  }
  
  // Obtenir une classification par ID
  static async getClassificationById(id: number): Promise<PlumClassification> {
    try {
      const response = await ApiService.get<PlumClassification>(`classifications/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la classification ${id}:`, error);
      throw error;
    }
  }
  
  // Classifier une image
  static async classifyImage(data: ClassificationRequest): Promise<PlumClassification> {
    try {
      const formData = new FormData();
      formData.append('image', data.image);
      formData.append('farm_id', data.farm_id.toString());
      
      if (data.batch_id) {
        formData.append('batch_id', data.batch_id.toString());
      }
      
      if (data.use_tta !== undefined) {
        formData.append('use_tta', data.use_tta.toString());
      }
      
      if (data.geo_location) {
        formData.append('geo_location', JSON.stringify(data.geo_location));
      }
      
      const response = await ApiService.post<PlumClassification>('plum-classifier/classify/', formData, {
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
  
  // Classifier un lot d'images
  static async classifyBatch(data: BatchClassificationRequest): Promise<BatchClassificationResponse> {
    try {
      const formData = new FormData();
      
      // Ajouter chaque image au formData
      data.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
      
      formData.append('farm_id', data.farm_id.toString());
      
      if (data.batch_id) {
        formData.append('batch_id', data.batch_id.toString());
      }
      
      if (data.batch_name) {
        formData.append('batch_name', data.batch_name);
      }
      
      if (data.batch_description) {
        formData.append('batch_description', data.batch_description);
      }
      
      if (data.use_tta !== undefined) {
        formData.append('use_tta', data.use_tta.toString());
      }
      
      if (data.geo_location) {
        formData.append('geo_location', JSON.stringify(data.geo_location));
      }
      
      const response = await ApiService.post<BatchClassificationResponse>('plum-classifier/classify-batch/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la classification du lot d\'images:', error);
      throw error;
    }
  }
  
  // Supprimer une classification
  static async deleteClassification(id: number): Promise<void> {
    try {
      await ApiService.delete(`classifications/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la classification ${id}:`, error);
      throw error;
    }
  }
}

export default ClassificationService;

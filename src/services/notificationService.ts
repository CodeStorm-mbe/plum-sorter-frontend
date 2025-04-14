// notificationService.ts - Service pour la gestion des notifications
import ApiService from './api';

// Types pour les notifications
export interface Notification {
  id: number;
  user: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  content_type?: string;
  object_id?: number;
  created_at: string;
}

export interface NotificationCreateRequest {
  title: string;
  message: string;
  type: string;
  content_type?: string;
  object_id?: number;
}

// Service de gestion des notifications
class NotificationService {
  // Obtenir la liste des notifications de l'utilisateur
  static async getNotifications(): Promise<Notification[]> {
    try {
      return await ApiService.get<Notification[]>('plum-classifier/notifications/');
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      throw error;
    }
  }
  
  // Obtenir une notification par ID
  static async getNotificationById(id: number): Promise<Notification> {
    try {
      return await ApiService.get<Notification>(`plum-classifier/notifications/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la récupération de la notification ${id}:`, error);
      throw error;
    }
  }
  
  // Marquer une notification comme lue
  static async markAsRead(id: number): Promise<Notification> {
    try {
      return await ApiService.patch<Notification>(`plum-classifier/notifications/${id}/`, {
        is_read: true
      });
    } catch (error) {
      console.error(`Erreur lors du marquage de la notification ${id} comme lue:`, error);
      throw error;
    }
  }
  
  // Marquer toutes les notifications comme lues
  static async markAllAsRead(): Promise<void> {
    try {
      await ApiService.post('plum-classifier/notifications/mark-all-read/');
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
      throw error;
    }
  }
  
  // Créer une notification (admin seulement)
  static async createNotification(data: NotificationCreateRequest): Promise<Notification> {
    try {
      return await ApiService.post<Notification>('plum-classifier/notifications/', data);
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
      throw error;
    }
  }
  
  // Supprimer une notification
  static async deleteNotification(id: number): Promise<void> {
    try {
      await ApiService.delete(`plum-classifier/notifications/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la notification ${id}:`, error);
      throw error;
    }
  }
}

export default NotificationService;

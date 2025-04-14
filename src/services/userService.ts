// userService.ts - Service pour la gestion des utilisateurs
import ApiService from './api';
import { User } from './authService';

// Types pour les utilisateurs
export interface UserUpdateRequest {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface UserSettings {
  id: number;
  user: number;
  language: string;
  theme: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  privacy_settings: {
    share_data: boolean;
    public_profile: boolean;
  };
  security_settings: {
    two_factor_auth: boolean;
    login_notifications: boolean;
  };
}

// Service utilisateur
class UserService {
  // Obtenir la liste des utilisateurs (admin seulement)
  static async getUsers(): Promise<User[]> {
    try {
      const response = await ApiService.get<User[]>('users/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  }
  
  // Obtenir un utilisateur par ID
  static async getUserById(id: number): Promise<User> {
    try {
      const response = await ApiService.get<User>(`users/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
      throw error;
    }
  }
  
  // Mettre à jour le profil utilisateur
  static async updateProfile(userData: UserUpdateRequest): Promise<User> {
    try {
      const response = await ApiService.patch<User>('users/me/', userData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  }
  
  // Télécharger un avatar
  static async uploadAvatar(file: File): Promise<User> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      // Utiliser post au lieu de uploadFile qui n'existe pas
      const response = await ApiService.post<User>('users/me/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'avatar:', error);
      throw error;
    }
  }
  
  // Obtenir les statistiques de l'utilisateur
  static async getUserStats(): Promise<any> {
    try {
      const response = await ApiService.get('users/stats/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques utilisateur:', error);
      throw error;
    }
  }
  
  // Obtenir les paramètres de l'utilisateur
  static async getUserSettings(): Promise<UserSettings> {
    try {
      const response = await ApiService.get<UserSettings>('users/settings/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres utilisateur:', error);
      throw error;
    }
  }
  
  // Mettre à jour les paramètres de l'utilisateur
  static async updateUserSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    try {
      const response = await ApiService.patch<UserSettings>('users/settings/', settings);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres utilisateur:', error);
      throw error;
    }
  }
}

export default UserService;

// authService.ts - Service pour l'authentification
import ApiService from './api';

// Types pour l'authentification
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  is_verified: boolean;
  created_at: string;
}

export interface PasswordChangeRequest {
  old_password: string;
  new_password: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

// Service d'authentification
class AuthService {
  // Connexion utilisateur
  static async login(credentials: LoginRequest): Promise<User> {
    try {
      // Obtenir les tokens
      const tokenResponse = await ApiService.post<TokenResponse>('auth/token/', credentials);
      
      // Stocker les tokens
      localStorage.setItem('auth_token', tokenResponse.data.access);
      localStorage.setItem('refresh_token', tokenResponse.data.refresh);
      
      // Obtenir les informations de l'utilisateur
      const user = await this.getCurrentUser();
      
      return user;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  }
  
  // Inscription utilisateur
  static async register(userData: RegisterRequest): Promise<User> {
    try {
      // Enregistrer l'utilisateur
      await ApiService.post('auth/register/', userData);
      
      // Connecter l'utilisateur avec les identifiants fournis
      return await this.login({
        username: userData.email,
        password: userData.password
      });
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  }
  
  // Déconnexion
  static async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await ApiService.post('auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    } finally {
      // Supprimer les tokens et les données utilisateur même en cas d'erreur
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }
  
  // Obtenir l'utilisateur courant
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await ApiService.get<User>('users/me/');
      // Stocker l'utilisateur dans le localStorage pour un accès hors ligne
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      throw error;
    }
  }
  
  // Vérifier si l'utilisateur est connecté
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
  
  // Changer le mot de passe
  static async changePassword(passwordData: PasswordChangeRequest): Promise<void> {
    try {
      await ApiService.post('auth/change-password/', passwordData);
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      throw error;
    }
  }
  
  // Demander une réinitialisation de mot de passe
  static async requestPasswordReset(email: string): Promise<void> {
    try {
      await ApiService.post('auth/password-reset/', { email });
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation de mot de passe:', error);
      throw error;
    }
  }
  
  // Confirmer la réinitialisation de mot de passe
  static async confirmPasswordReset(data: PasswordResetConfirmRequest): Promise<void> {
    try {
      await ApiService.post('auth/password-reset/confirm/', data);
    } catch (error) {
      console.error('Erreur lors de la confirmation de réinitialisation de mot de passe:', error);
      throw error;
    }
  }
  
  // Vérifier l'email
  static async verifyEmail(token: string): Promise<void> {
    try {
      await ApiService.post('auth/verify-email/', { token });
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error);
      throw error;
    }
  }
  
  // Renvoyer l'email de vérification
  static async resendVerificationEmail(email: string): Promise<void> {
    try {
      await ApiService.post('auth/resend-verification-email/', { email });
    } catch (error) {
      console.error('Erreur lors du renvoi de l\'email de vérification:', error);
      throw error;
    }
  }
}

export default AuthService;

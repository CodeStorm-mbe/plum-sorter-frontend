// api.ts - Service de base pour les appels API
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Définition de l'URL de base de l'API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

// Configuration par défaut pour axios
const axiosConfig: AxiosRequestConfig = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Création de l'instance axios
const apiClient: AxiosInstance = axios.create(axiosConfig);

// Intercepteur pour ajouter le token d'authentification à chaque requête
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si l'erreur est 401 (non autorisé) et que ce n'est pas une tentative de rafraîchissement de token
    if (error.response?.status === 401 && !originalRequest._retry && 
        originalRequest.url !== 'auth/token/refresh/' && 
        originalRequest.url !== 'auth/token/') {
      
      originalRequest._retry = true;
      
      try {
        // Tenter de rafraîchir le token
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // Si pas de refresh token, déconnecter l'utilisateur
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Appel pour rafraîchir le token
        const response = await axios.post(
          `${API_URL}auth/token/refresh/`,
          { refresh: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        if (response.data.access) {
          // Mettre à jour le token dans le localStorage
          localStorage.setItem('auth_token', response.data.access);
          
          // Mettre à jour le header d'autorisation pour la requête originale
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          
          // Réessayer la requête originale avec le nouveau token
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // En cas d'échec du rafraîchissement, déconnecter l'utilisateur
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Classe de service API de base
export class ApiService {
  // Méthode GET générique
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.get(url, config);
    return response.data;
  }
  
  // Méthode POST générique
  static async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.post(url, data, config);
    return response.data;
  }
  
  // Méthode PUT générique
  static async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.put(url, data, config);
    return response.data;
  }
  
  // Méthode PATCH générique
  static async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.patch(url, data, config);
    return response.data;
  }
  
  // Méthode DELETE générique
  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.delete(url, config);
    return response.data;
  }
  
  // Méthode pour télécharger des fichiers
  static async uploadFile<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const uploadConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    };
    const response: AxiosResponse<T> = await apiClient.post(url, formData, uploadConfig);
    return response.data;
  }
}

export default ApiService;

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AuthTokens, ApiError } from '@/types';

// Créer une instance axios avec une configuration de base
const api = axios.create({
  baseURL: 'https://plum-api.onrender.com/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification aux requêtes
api.interceptors.request.use(
  (config) => {
    const tokens = localStorage.getItem('auth_tokens');
    if (tokens) {
      const { access } = JSON.parse(tokens) as AuthTokens;
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Si l'erreur est 401 (non autorisé) et que nous n'avons pas déjà essayé de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const tokens = localStorage.getItem('auth_tokens');
        if (tokens) {
          const { refresh } = JSON.parse(tokens) as AuthTokens;
          
          // Tenter de rafraîchir le token
          const response = await axios.post('/api/auth/token/refresh/', { refresh });
          const newTokens = response.data as AuthTokens;
          
          // Sauvegarder les nouveaux tokens
          localStorage.setItem('auth_tokens', JSON.stringify(newTokens));
          
          // Mettre à jour le header et réessayer la requête
          api.defaults.headers.common.Authorization = `Bearer ${newTokens.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si le rafraîchissement échoue, déconnecter l'utilisateur
        localStorage.removeItem('auth_tokens');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Formater l'erreur pour une utilisation plus facile dans l'application
    const apiError: ApiError = {
      status: error.response?.status || 500,
      message: error.response?.data?.detail || 'Une erreur est survenue',
      errors: error.response?.data || {},
    };
    
    return Promise.reject(apiError);
  }
);

export default api;

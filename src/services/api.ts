import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://plum-api.onrender.com/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs et le rafraîchissement du token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si l'erreur est 401 (non autorisé) et que nous n'avons pas déjà essayé de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // Si pas de refresh token, déconnexion
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Appel pour rafraîchir le token
        // Correction: La route doit être 'api/auth/token/refresh/'
        const baseUrl = import.meta.env.VITE_API_URL || 'https://plum-api.onrender.com/api/';
        const response = await axios.post(
          `${baseUrl}auth/token/refresh/`,
          { refresh: refreshToken }
        );
        
        if (response.data.access) {
          localStorage.setItem('token', response.data.access);
          // Mettre à jour le token dans la requête originale et la renvoyer
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si le rafraîchissement échoue, déconnexion
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

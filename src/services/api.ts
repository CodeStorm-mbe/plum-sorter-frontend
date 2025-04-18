import axios from 'axios';
import { prepareApiRequest } from '../utils/apiUtils';

// Créer une instance axios avec la configuration de base
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://plum-api.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Convertir les données de la requête de camelCase à snake_case
    if (config.data) {
      config.data = prepareApiRequest(config.data);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gérer les erreurs d'authentification
    if (error.response && error.response.status === 401) {
      // Rediriger vers la page de connexion si le token est expiré
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Formater l'erreur pour une meilleure gestion
    const formattedError = {
      message: error.response?.data?.detail || error.message || 'Une erreur est survenue',
      status: error.response?.status,
      details: error.response?.data
    };
    
    return Promise.reject(formattedError);
  }
);

export default api;

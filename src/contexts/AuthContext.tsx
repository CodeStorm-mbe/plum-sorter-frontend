import { useContext, createContext, ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, AuthContextType } from '../types';
import api from '../services/api';
import { notifications } from '../utils/notifications';

// Créer le contexte d'authentification
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  verifyEmail: async () => {},
  resendVerificationEmail: async () => {},
  updateProfile: async () => {},
  changePassword: async () => {},
});

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Vérifier si l'utilisateur est authentifié au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        if (token) {
          // Vérifier la validité du token
          const response = await api.get('/users/me/');
          setUser(response.data);
        }
      } catch (error) {
        // Token invalide ou expiré
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Connexion
  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/token/', { username, password });
      const { access, refresh, user: userData } = response.data;
      
      // Stocker les tokens
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      
      // Mettre à jour l'état
      setUser(userData);
      
      // Rediriger vers la page précédente ou la page d'accueil
      const origin = location.state?.from || '/dashboard';
      navigate(origin);
      
      notifications.show({
        title: 'Connexion réussie',
        message: `Bienvenue, ${userData.username} !`,
        color: 'green',
      });
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Identifiants incorrects';
      notifications.show({
        title: 'Erreur de connexion',
        message,
        color: 'red',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Inscription
  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      await api.post('/auth/register/', userData);
      
      notifications.show({
        title: 'Inscription réussie',
        message: 'Veuillez vérifier votre email pour activer votre compte.',
        color: 'green',
      });
      
      navigate('/login');
    } catch (error: any) {
      const message = error.response?.data?.email?.[0] || 
                     error.response?.data?.username?.[0] || 
                     error.response?.data?.password?.[0] || 
                     'Une erreur est survenue lors de l\'inscription';
      
      notifications.show({
        title: 'Erreur d\'inscription',
        message,
        color: 'red',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      setIsLoading(true);
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Supprimer les tokens et l'utilisateur
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsLoading(false);
      navigate('/login');
      
      notifications.show({
        title: 'Déconnexion',
        message: 'Vous avez été déconnecté avec succès.',
        color: 'blue',
      });
    }
  };

  // Réinitialisation du mot de passe
  const resetPassword = async (token: string, password: string) => {
    try {
      setIsLoading(true);
      await api.post('/auth/reset-password-confirm/', { token, password });
      
      notifications.show({
        title: 'Mot de passe réinitialisé',
        message: 'Votre mot de passe a été réinitialisé avec succès.',
        color: 'green',
      });
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Une erreur est survenue lors de la réinitialisation du mot de passe';
      notifications.show({
        title: 'Erreur',
        message,
        color: 'red',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Vérification de l'email
  const verifyEmail = async (token: string) => {
    try {
      setIsLoading(true);
      await api.post('/auth/verify-email/', { token });
      
      notifications.show({
        title: 'Email vérifié',
        message: 'Votre email a été vérifié avec succès. Vous pouvez maintenant vous connecter.',
        color: 'green',
      });
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Une erreur est survenue lors de la vérification de l\'email';
      notifications.show({
        title: 'Erreur',
        message,
        color: 'red',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Renvoyer l'email de vérification
  const resendVerificationEmail = async (email: string) => {
    try {
      setIsLoading(true);
      await api.post('/auth/resend-verification/', { email });
      
      notifications.show({
        title: 'Email envoyé',
        message: 'Un nouvel email de vérification a été envoyé à votre adresse.',
        color: 'green',
      });
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Une erreur est survenue lors de l\'envoi de l\'email de vérification';
      notifications.show({
        title: 'Erreur',
        message,
        color: 'red',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mise à jour du profil
  const updateProfile = async (userData: any) => {
    try {
      setIsLoading(true);
      const response = await api.patch('/users/me/', userData);
      setUser(response.data);
      
      notifications.show({
        title: 'Profil mis à jour',
        message: 'Votre profil a été mis à jour avec succès.',
        color: 'green',
      });
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Une erreur est survenue lors de la mise à jour du profil';
      notifications.show({
        title: 'Erreur',
        message,
        color: 'red',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Changement de mot de passe
  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      await api.post('/auth/change-password/', { old_password: oldPassword, new_password: newPassword });
      
      notifications.show({
        title: 'Mot de passe changé',
        message: 'Votre mot de passe a été changé avec succès.',
        color: 'green',
      });
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Une erreur est survenue lors du changement de mot de passe';
      notifications.show({
        title: 'Erreur',
        message,
        color: 'red',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        resetPassword,
        verifyEmail,
        resendVerificationEmail,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

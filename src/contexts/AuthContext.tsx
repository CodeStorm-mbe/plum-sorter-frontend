import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { User, AuthTokens, ApiError } from '@/types';
import api from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmResetPassword: (token: string, password: string) => Promise<void>;
  error: ApiError | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  role: 'farmer' | 'technician';
  phone_number?: string;
}

interface JwtPayload {
  user_id: number;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est déjà authentifié au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const tokens = localStorage.getItem('auth_tokens');
      if (!tokens) {
        setIsLoading(false);
        return;
      }

      try {
        const { access } = JSON.parse(tokens) as AuthTokens;
        
        // Vérifier si le token est expiré
        const decoded = jwtDecode<JwtPayload>(access);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expiré, essayer de le rafraîchir
          await refreshToken();
        } else {
          // Token valide, charger les informations de l'utilisateur
          await fetchUserData();
        }
      } catch (err) {
        console.error('Erreur lors de la vérification de l\'authentification:', err);
        localStorage.removeItem('auth_tokens');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const refreshToken = async () => {
    try {
      const tokens = localStorage.getItem('auth_tokens');
      if (!tokens) {
        throw new Error('Aucun token disponible');
      }

      const { refresh } = JSON.parse(tokens) as AuthTokens;
      const response = await api.post('/auth/token/refresh/', { refresh });
      const newTokens = response.data as AuthTokens;
      
      localStorage.setItem('auth_tokens', JSON.stringify(newTokens));
      await fetchUserData();
    } catch (err) {
      console.error('Erreur lors du rafraîchissement du token:', err);
      localStorage.removeItem('auth_tokens');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await api.get('/users/me/');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Erreur lors de la récupération des données utilisateur:', err);
      localStorage.removeItem('auth_tokens');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/token/', { username, password });
      const tokens = response.data as AuthTokens;
      
      localStorage.setItem('auth_tokens', JSON.stringify(tokens));
      await fetchUserData();
      navigate('/dashboard');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await api.post('/auth/register/', userData);
      // Rediriger vers une page de confirmation
      navigate('/verify-email', { state: { email: userData.email } });
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    const tokens = localStorage.getItem('auth_tokens');
    if (tokens) {
      const { refresh } = JSON.parse(tokens) as AuthTokens;
      // Blacklister le token de rafraîchissement
      api.post('/auth/logout/', { refresh }).catch(console.error);
    }
    
    localStorage.removeItem('auth_tokens');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const verifyEmail = async (token: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await api.post('/auth/verify-email/', { token });
      navigate('/login', { state: { emailVerified: true } });
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await api.post('/auth/resend-verification-email/', { email });
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await api.post('/auth/password-reset/', { email });
      navigate('/login', { state: { passwordResetRequested: true } });
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmResetPassword = async (token: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await api.post('/auth/password-reset/confirm/', { token, password });
      navigate('/login', { state: { passwordReset: true } });
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        verifyEmail,
        resendVerificationEmail,
        resetPassword,
        confirmResetPassword,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};

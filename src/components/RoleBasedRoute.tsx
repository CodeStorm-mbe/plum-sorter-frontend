import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RolePermissionService } from '../services/rolePermissionService';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  fallbackPath?: string;
}

/**
 * Composant pour contrôler l'accès aux routes en fonction du rôle de l'utilisateur
 * et des permissions associées.
 */
const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  requiredPermission,
  fallbackPath = '/dashboard'
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Si l'authentification est en cours de chargement, afficher un indicateur de chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary"></div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  if (!isAuthenticated) {
    navigate('/login', { state: { from: window.location.pathname } });
    return null;
  }

  // Si une permission spécifique est requise, vérifier si l'utilisateur la possède
  if (requiredPermission && !RolePermissionService.hasPermission(user, requiredPermission)) {
    // Rediriger vers la page par défaut si l'utilisateur n'a pas la permission requise
    navigate(fallbackPath);
    return null;
  }

  // Si l'utilisateur a les permissions nécessaires, afficher le contenu
  return <>{children}</>;
};

export default RoleBasedRoute;

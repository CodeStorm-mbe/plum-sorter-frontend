import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { RolePermissionService, PERMISSIONS } from '../services';
import { Navigate, useLocation } from 'react-router-dom';

// Types pour le contexte de rôle
interface RoleContextType {
  hasPermission: (permission: string) => boolean;
  userRole: string | null;
  isAdmin: boolean;
  isTechnician: boolean;
  isFarmer: boolean;
  availableRoutes: string[];
  menuItems: any[];
}

// Création du contexte
const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Props pour le provider
interface RoleProviderProps {
  children: ReactNode;
}

// Composant Provider
export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [availableRoutes, setAvailableRoutes] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  // Mettre à jour le rôle et les routes disponibles lorsque l'utilisateur change
  useEffect(() => {
    if (user) {
      setUserRole(user.role);
      setMenuItems(RolePermissionService.getMenuItemsForRole(user.role));
      
      // Routes publiques accessibles à tous les utilisateurs authentifiés
      const publicRoutes = ['/dashboard', '/profile', '/settings'];
      
      // Routes spécifiques aux rôles
      const roleRoutes: Record<string, string[]> = {
        farmer: [
          '/farmer-dashboard', 
          '/farms', 
          '/batches', 
          '/classifications',
          '/farms/new',
          '/batches/new',
          '/classifications/new'
        ],
        technician: [
          '/technician-dashboard', 
          '/farms', 
          '/batches', 
          '/classifications', 
          '/statistics',
          '/reports',
          '/classifications/new'
        ],
        admin: [
          '/admin-dashboard', 
          '/admin/users', 
          '/admin/models', 
          '/admin/system',
          '/farms', 
          '/batches', 
          '/classifications', 
          '/statistics'
        ],
      };
      
      // Combiner les routes publiques et spécifiques au rôle
      const routes = [...publicRoutes, ...(roleRoutes[user.role] || [])];
      setAvailableRoutes(routes);
    } else {
      setUserRole(null);
      setAvailableRoutes([]);
      setMenuItems([]);
    }
  }, [user]);

  // Vérifier si l'utilisateur a une permission spécifique
  const hasPermission = (permission: string): boolean => {
    return RolePermissionService.hasPermission(user, permission);
  };

  // Valeurs exposées par le contexte
  const value = {
    hasPermission,
    userRole,
    isAdmin: userRole === 'admin',
    isTechnician: userRole === 'technician',
    isFarmer: userRole === 'farmer',
    availableRoutes,
    menuItems
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

// Hook personnalisé pour utiliser le contexte
export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

// Composant de protection de route basé sur le rôle
interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredRole?: string | string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole
}) => {
  const { user } = useAuth();
  const { hasPermission } = useRole();
  const location = useLocation();

  // Vérifier si l'utilisateur est connecté
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Vérifier si l'utilisateur a le rôle requis
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.role)) {
      // Rediriger vers le dashboard approprié en fonction du rôle
      switch (user.role) {
        case 'admin':
          return <Navigate to="/admin-dashboard" replace />;
        case 'technician':
          return <Navigate to="/technician-dashboard" replace />;
        case 'farmer':
          return <Navigate to="/farmer-dashboard" replace />;
        default:
          return <Navigate to="/dashboard" replace />;
      }
    }
  }

  // Vérifier si l'utilisateur a la permission requise
  if (requiredPermission && !hasPermission(requiredPermission)) {
    // Rediriger vers le dashboard approprié en fonction du rôle
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin-dashboard" replace />;
      case 'technician':
        return <Navigate to="/technician-dashboard" replace />;
      case 'farmer':
        return <Navigate to="/farmer-dashboard" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  // Si toutes les vérifications sont passées, afficher le contenu protégé
  return <>{children}</>;
};

// Composant conditionnel basé sur le rôle
interface RoleBasedProps {
  children: ReactNode;
  requiredRole?: string | string[];
  requiredPermission?: string;
  fallback?: ReactNode;
}

export const RoleBased: React.FC<RoleBasedProps> = ({
  children,
  requiredRole,
  requiredPermission,
  fallback = null
}) => {
  const { user } = useAuth();
  const { hasPermission } = useRole();

  // Vérifier si l'utilisateur est connecté
  if (!user) {
    return <>{fallback}</>;
  }

  // Vérifier si l'utilisateur a le rôle requis
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.role)) {
      return <>{fallback}</>;
    }
  }

  // Vérifier si l'utilisateur a la permission requise
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>;
  }

  // Si toutes les vérifications sont passées, afficher le contenu
  return <>{children}</>;
};

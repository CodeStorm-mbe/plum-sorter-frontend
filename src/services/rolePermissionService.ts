// rolePermissionService.ts - Service pour la gestion des permissions basées sur les rôles
import { User } from '../types';

// Types pour les permissions
export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface RolePermissions {
  role: string;
  permissions: string[];
}

// Définition des permissions disponibles
const PERMISSIONS = {
  // Permissions générales
  VIEW_DASHBOARD: 'view_dashboard',
  EDIT_PROFILE: 'edit_profile',
  
  // Permissions liées aux fermes
  VIEW_FARMS: 'view_farms',
  CREATE_FARM: 'create_farm',
  EDIT_FARM: 'edit_farm',
  DELETE_FARM: 'delete_farm',
  
  // Permissions liées aux lots
  VIEW_BATCHES: 'view_batches',
  CREATE_BATCH: 'create_batch',
  EDIT_BATCH: 'edit_batch',
  DELETE_BATCH: 'delete_batch',
  
  // Permissions liées aux classifications
  VIEW_CLASSIFICATIONS: 'view_classifications',
  CREATE_CLASSIFICATION: 'create_classification',
  
  // Permissions liées aux statistiques
  VIEW_STATISTICS: 'view_statistics',
  EXPORT_STATISTICS: 'export_statistics',
  
  // Permissions administratives
  MANAGE_USERS: 'manage_users',
  MANAGE_MODELS: 'manage_models',
  VIEW_SYSTEM_STATUS: 'view_system_status',
};

// Mappage des rôles aux permissions
const ROLE_PERMISSIONS: Record<string, string[]> = {
  farmer: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_FARMS,
    PERMISSIONS.CREATE_FARM,
    PERMISSIONS.EDIT_FARM,
    PERMISSIONS.VIEW_BATCHES,
    PERMISSIONS.CREATE_BATCH,
    PERMISSIONS.EDIT_BATCH,
    PERMISSIONS.VIEW_CLASSIFICATIONS,
    PERMISSIONS.CREATE_CLASSIFICATION,
    PERMISSIONS.VIEW_STATISTICS,
    PERMISSIONS.EXPORT_STATISTICS,
  ],
  
  technician: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_FARMS,
    PERMISSIONS.VIEW_BATCHES,
    PERMISSIONS.EDIT_BATCH,
    PERMISSIONS.VIEW_CLASSIFICATIONS,
    PERMISSIONS.CREATE_CLASSIFICATION,
    PERMISSIONS.VIEW_STATISTICS,
    PERMISSIONS.EXPORT_STATISTICS,
  ],
  
  admin: [
    // Les administrateurs ont toutes les permissions
    ...Object.values(PERMISSIONS),
  ],
};

// Service pour les permissions basées sur les rôles
class RolePermissionService {
  // Vérifier si un utilisateur a une permission spécifique
  static hasPermission(user: User | null, permission: string): boolean {
    if (!user) return false;
    
    const role = user.role;
    const permissions = ROLE_PERMISSIONS[role] || [];
    
    // Les administrateurs ont toutes les permissions
    if (role === 'admin') return true;
    
    return permissions.includes(permission);
  }
  
  // Obtenir toutes les permissions pour un rôle spécifique
  static getPermissionsForRole(role: string): string[] {
    return ROLE_PERMISSIONS[role] || [];
  }
  
  // Vérifier si un utilisateur a accès à une route spécifique
  static canAccessRoute(user: User | null, route: string): boolean {
    if (!user) return false;
    
    // Routes accessibles à tous les utilisateurs authentifiés
    const publicRoutes = ['/dashboard', '/profile', '/settings'];
    if (publicRoutes.includes(route)) return true;
    
    // Routes spécifiques aux rôles
    const roleRoutes: Record<string, string[]> = {
      farmer: ['/farms', '/batches', '/classifications'],
      technician: ['/farms', '/batches', '/classifications', '/statistics'],
      admin: ['/admin', '/users', '/models', '/system'],
    };
    
    const allowedRoutes = roleRoutes[user.role] || [];
    
    // Vérifier si la route commence par l'une des routes autorisées
    return allowedRoutes.some(allowedRoute => route.startsWith(allowedRoute));
  }
  
  // Obtenir les éléments de menu disponibles pour un rôle spécifique
  static getMenuItemsForRole(role: string): any[] {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
      { id: 'profile', label: 'Profil', path: '/profile', icon: 'user' },
      { id: 'settings', label: 'Paramètres', path: '/settings', icon: 'settings' },
    ];
    
    const roleItems: Record<string, any[]> = {
      farmer: [
        { id: 'farms', label: 'Mes Fermes', path: '/farms', icon: 'farm' },
        { id: 'batches', label: 'Mes Lots', path: '/batches', icon: 'batch' },
        { id: 'classifications', label: 'Classifications', path: '/classifications', icon: 'classification' },
      ],
      
      technician: [
        { id: 'farms', label: 'Fermes', path: '/farms', icon: 'farm' },
        { id: 'batches', label: 'Lots', path: '/batches', icon: 'batch' },
        { id: 'classifications', label: 'Classifications', path: '/classifications', icon: 'classification' },
        { id: 'statistics', label: 'Statistiques', path: '/statistics', icon: 'chart' },
      ],
      
      admin: [
        { id: 'farms', label: 'Fermes', path: '/farms', icon: 'farm' },
        { id: 'batches', label: 'Lots', path: '/batches', icon: 'batch' },
        { id: 'classifications', label: 'Classifications', path: '/classifications', icon: 'classification' },
        { id: 'statistics', label: 'Statistiques', path: '/statistics', icon: 'chart' },
        { id: 'users', label: 'Utilisateurs', path: '/admin/users', icon: 'users' },
        { id: 'models', label: 'Modèles', path: '/admin/models', icon: 'model' },
        { id: 'system', label: 'Système', path: '/admin/system', icon: 'system' },
      ],
    };
    
    return [...baseItems, ...(roleItems[role] || [])];
  }
}

export { PERMISSIONS, RolePermissionService };

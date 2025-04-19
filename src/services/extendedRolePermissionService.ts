import { RolePermissionService as BaseRolePermissionService, PERMISSIONS } from './rolePermissionService';

// Types pour les permissions
export interface Permission {
  id: string;
  description: string;
}

// Types pour les rôles
export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

// Permissions étendues
const EXTENDED_PERMISSIONS = {
  ...PERMISSIONS,
  
  // Permissions pour les modèles ML
  VIEW_MODELS: 'view_models',
  MANAGE_MODELS: 'manage_models',
  ACTIVATE_MODEL: 'activate_model',
  
  // Permissions pour les statistiques avancées
  VIEW_ADVANCED_ANALYTICS: 'view_advanced_analytics',
  EXPORT_REPORTS: 'export_reports',
  
  // Permissions pour la gestion système
  VIEW_SYSTEM_STATUS: 'view_system_status',
  MANAGE_SYSTEM: 'manage_system',
  
  // Permissions pour les comparaisons
  COMPARE_FARMS: 'compare_farms',
  VIEW_PREDICTIONS: 'view_predictions'
};

// Définition des rôles et leurs permissions
const ROLES: Record<string, Role> = {
  admin: {
    id: 'admin',
    name: 'Administrateur',
    permissions: [
      EXTENDED_PERMISSIONS.VIEW_DASHBOARD,
      EXTENDED_PERMISSIONS.VIEW_FARMS,
      EXTENDED_PERMISSIONS.CREATE_FARM,
      EXTENDED_PERMISSIONS.EDIT_FARM,
      EXTENDED_PERMISSIONS.DELETE_FARM,
      EXTENDED_PERMISSIONS.VIEW_BATCHES,
      EXTENDED_PERMISSIONS.CREATE_BATCH,
      EXTENDED_PERMISSIONS.EDIT_BATCH,
      EXTENDED_PERMISSIONS.DELETE_BATCH,
      EXTENDED_PERMISSIONS.VIEW_CLASSIFICATIONS,
      EXTENDED_PERMISSIONS.CREATE_CLASSIFICATION,
      EXTENDED_PERMISSIONS.VIEW_STATISTICS,
      EXTENDED_PERMISSIONS.MANAGE_USERS,
      EXTENDED_PERMISSIONS.VIEW_MODELS,
      EXTENDED_PERMISSIONS.MANAGE_MODELS,
      EXTENDED_PERMISSIONS.ACTIVATE_MODEL,
      EXTENDED_PERMISSIONS.VIEW_ADVANCED_ANALYTICS,
      EXTENDED_PERMISSIONS.EXPORT_REPORTS,
      EXTENDED_PERMISSIONS.VIEW_SYSTEM_STATUS,
      EXTENDED_PERMISSIONS.MANAGE_SYSTEM,
      EXTENDED_PERMISSIONS.COMPARE_FARMS,
      EXTENDED_PERMISSIONS.VIEW_PREDICTIONS
    ]
  },
  technician: {
    id: 'technician',
    name: 'Technicien',
    permissions: [
      EXTENDED_PERMISSIONS.VIEW_DASHBOARD,
      EXTENDED_PERMISSIONS.VIEW_FARMS,
      EXTENDED_PERMISSIONS.EDIT_FARM,
      EXTENDED_PERMISSIONS.VIEW_BATCHES,
      EXTENDED_PERMISSIONS.CREATE_BATCH,
      EXTENDED_PERMISSIONS.EDIT_BATCH,
      EXTENDED_PERMISSIONS.VIEW_CLASSIFICATIONS,
      EXTENDED_PERMISSIONS.CREATE_CLASSIFICATION,
      EXTENDED_PERMISSIONS.VIEW_STATISTICS,
      EXTENDED_PERMISSIONS.VIEW_MODELS,
      EXTENDED_PERMISSIONS.VIEW_ADVANCED_ANALYTICS,
      EXTENDED_PERMISSIONS.EXPORT_REPORTS,
      EXTENDED_PERMISSIONS.COMPARE_FARMS,
      EXTENDED_PERMISSIONS.VIEW_PREDICTIONS
    ]
  },
  farmer: {
    id: 'farmer',
    name: 'Agriculteur',
    permissions: [
      EXTENDED_PERMISSIONS.VIEW_DASHBOARD,
      EXTENDED_PERMISSIONS.VIEW_FARMS,
      EXTENDED_PERMISSIONS.CREATE_FARM,
      EXTENDED_PERMISSIONS.EDIT_FARM,
      EXTENDED_PERMISSIONS.VIEW_BATCHES,
      EXTENDED_PERMISSIONS.CREATE_BATCH,
      EXTENDED_PERMISSIONS.VIEW_CLASSIFICATIONS,
      EXTENDED_PERMISSIONS.CREATE_CLASSIFICATION,
      EXTENDED_PERMISSIONS.VIEW_STATISTICS,
      EXTENDED_PERMISSIONS.VIEW_PREDICTIONS
    ]
  }
};

// Éléments de menu pour chaque rôle
const MENU_ITEMS = {
  admin: [
    { id: 'dashboard', label: 'Dashboard', path: '/admin-dashboard', icon: 'dashboard' },
    { id: 'farms', label: 'Fermes', path: '/farms', icon: 'farm' },
    { id: 'classifications', label: 'Classifications', path: '/classifications', icon: 'classification' },
    { id: 'statistics', label: 'Statistiques', path: '/statistics', icon: 'chart' },
    { id: 'users', label: 'Utilisateurs', path: '/admin/users', icon: 'users' },
    { id: 'models', label: 'Modèles', path: '/admin/models', icon: 'model' },
    { id: 'system', label: 'Système', path: '/admin/system', icon: 'system' }
  ],
  technician: [
    { id: 'dashboard', label: 'Dashboard', path: '/technician-dashboard', icon: 'dashboard' },
    { id: 'farms', label: 'Fermes', path: '/farms', icon: 'farm' },
    { id: 'classifications', label: 'Classifications', path: '/classifications', icon: 'classification' },
    { id: 'statistics', label: 'Statistiques', path: '/statistics', icon: 'chart' },
    { id: 'reports', label: 'Rapports', path: '/reports', icon: 'chart' }
  ],
  farmer: [
    { id: 'dashboard', label: 'Dashboard', path: '/farmer-dashboard', icon: 'dashboard' },
    { id: 'farms', label: 'Mes Fermes', path: '/farms', icon: 'farm' },
    { id: 'batches', label: 'Mes Lots', path: '/batches', icon: 'batch' },
    { id: 'classifications', label: 'Classifications', path: '/classifications', icon: 'classification' }
  ]
};

// Service étendu pour la gestion des rôles et permissions
class ExtendedRolePermissionService extends BaseRolePermissionService {
  // Vérifier si un utilisateur a une permission spécifique
  static hasPermission(user: any, permission: string): boolean {
    if (!user) return false;
    
    const role = ROLES[user.role];
    if (!role) return false;
    
    return role.permissions.includes(permission);
  }
  
  // Obtenir les éléments de menu pour un rôle spécifique
  static getMenuItemsForRole(role: string): any[] {
    return MENU_ITEMS[role as keyof typeof MENU_ITEMS] || [];
  }
  
  // Obtenir toutes les permissions disponibles
  static getAllPermissions(): Permission[] {
    return Object.entries(EXTENDED_PERMISSIONS).map(([key, value]) => ({
      id: value,
      description: this.getPermissionDescription(value)
    }));
  }
  
  // Obtenir la description d'une permission
  static getPermissionDescription(permission: string): string {
    const descriptions: Record<string, string> = {
      'view_dashboard': 'Voir le tableau de bord',
      'view_farms': 'Voir les fermes',
      'create_farm': 'Créer une ferme',
      'edit_farm': 'Modifier une ferme',
      'delete_farm': 'Supprimer une ferme',
      'view_batches': 'Voir les lots',
      'create_batch': 'Créer un lot',
      'edit_batch': 'Modifier un lot',
      'delete_batch': 'Supprimer un lot',
      'view_classifications': 'Voir les classifications',
      'create_classification': 'Créer une classification',
      'view_statistics': 'Voir les statistiques',
      'manage_users': 'Gérer les utilisateurs',
      'view_models': 'Voir les modèles',
      'manage_models': 'Gérer les modèles',
      'activate_model': 'Activer/désactiver un modèle',
      'view_advanced_analytics': 'Voir les analyses avancées',
      'export_reports': 'Exporter des rapports',
      'view_system_status': 'Voir l\'état du système',
      'manage_system': 'Gérer le système',
      'compare_farms': 'Comparer les fermes',
      'view_predictions': 'Voir les prédictions'
    };
    
    return descriptions[permission] || permission;
  }
  
  // Obtenir tous les rôles disponibles
  static getAllRoles(): Role[] {
    return Object.values(ROLES);
  }
  
  // Obtenir les permissions d'un rôle spécifique
  static getPermissionsForRole(role: string): string[] {
    const roleObj = ROLES[role as keyof typeof ROLES];
    if (!roleObj) return [];
    
    return roleObj.permissions;
  }
}

export { ExtendedRolePermissionService as RolePermissionService, EXTENDED_PERMISSIONS as PERMISSIONS };

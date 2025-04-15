import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { RolePermissionService } from '../services/rolePermissionService';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Settings, Farm, Package, Image, BarChart2, Users, Database, Activity } from 'lucide-react';

interface SidebarProps {
  className?: string;
}

/**
 * Composant Sidebar adapté au rôle de l'utilisateur
 */
const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) return null;
  
  // Obtenir les éléments de menu en fonction du rôle
  const getMenuItems = () => {
    // Éléments de base pour tous les utilisateurs
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
      { id: 'profile', label: 'Profil', path: '/profile', icon: <User size={20} /> },
      { id: 'settings', label: 'Paramètres', path: '/settings', icon: <Settings size={20} /> },
    ];
    
    // Éléments spécifiques selon le rôle
    const roleItems: Record<string, any[]> = {
      farmer: [
        { id: 'farms', label: 'Mes Fermes', path: '/farms', icon: <Farm size={20} /> },
        { id: 'batches', label: 'Mes Lots', path: '/batches', icon: <Package size={20} /> },
        { id: 'classifications', label: 'Classifications', path: '/classifications', icon: <Image size={20} /> },
      ],
      
      technician: [
        { id: 'farms', label: 'Fermes', path: '/farms', icon: <Farm size={20} /> },
        { id: 'batches', label: 'Lots', path: '/batches', icon: <Package size={20} /> },
        { id: 'classifications', label: 'Classifications', path: '/classifications', icon: <Image size={20} /> },
        { id: 'statistics', label: 'Statistiques', path: '/statistics', icon: <BarChart2 size={20} /> },
      ],
      
      admin: [
        { id: 'farms', label: 'Fermes', path: '/farms', icon: <Farm size={20} /> },
        { id: 'batches', label: 'Lots', path: '/batches', icon: <Package size={20} /> },
        { id: 'classifications', label: 'Classifications', path: '/classifications', icon: <Image size={20} /> },
        { id: 'statistics', label: 'Statistiques', path: '/statistics', icon: <BarChart2 size={20} /> },
        { id: 'users', label: 'Utilisateurs', path: '/admin/users', icon: <Users size={20} /> },
        { id: 'models', label: 'Modèles', path: '/admin/models', icon: <Database size={20} /> },
        { id: 'system', label: 'Système', path: '/admin/system', icon: <Activity size={20} /> },
      ],
    };
    
    return [...baseItems, ...(roleItems[user.role] || [])];
  };
  
  const menuItems = getMenuItems();
  
  return (
    <div className={`bg-background-light/50 backdrop-blur-md border-r border-white/5 h-full py-8 ${className}`}>
      <div className="px-4 mb-8">
        <h2 className="text-xl font-title font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
          TriPrune
        </h2>
        <p className="text-white/60 text-sm mt-1">
          {user.role === 'admin' ? 'Administrateur' : 
           user.role === 'technician' ? 'Technicien' : 'Agriculteur'}
        </p>
      </div>
      
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm transition-colors ${
                    isActive 
                      ? 'bg-accent-primary/10 text-accent-primary border-l-2 border-accent-primary' 
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="mt-auto px-4 pt-8">
        <div className="p-4 rounded-lg bg-background-light/30 border border-white/5">
          <h3 className="font-semibold text-sm mb-2">Besoin d'aide ?</h3>
          <p className="text-white/60 text-xs mb-3">
            Consultez notre documentation ou contactez le support.
          </p>
          <Link 
            to="/help" 
            className="text-accent-primary text-xs hover:text-accent-secondary transition-colors"
          >
            Centre d'aide →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Warehouse, 
  Package, 
  BarChart2, 
  FileText, 
  Settings, 
  Image, 
  HelpCircle, 
  ChevronDown, 
  ChevronRight,
  Users,
  Database,
  Server,
  Shield,
  AlertTriangle,
  Activity,
  Globe,
  Cpu
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  hasSubmenu?: boolean;
  isSubmenuOpen?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  to, 
  icon, 
  label, 
  isActive, 
  hasSubmenu = false,
  isSubmenuOpen = false,
  onClick 
}) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-accent-primary/20 text-accent-primary' 
          : 'text-white/70 hover:bg-background-light/30 hover:text-white'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`mr-3 ${isActive ? 'text-accent-primary' : 'text-white/60'}`}>
          {icon}
        </div>
        <span className="font-medium">{label}</span>
      </div>
      {hasSubmenu && (
        <div className="text-white/60">
          {isSubmenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      )}
    </Link>
  );
};

interface SubmenuItemProps {
  to: string;
  label: string;
  isActive: boolean;
}

const SubmenuItem: React.FC<SubmenuItemProps> = ({ to, label, isActive }) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center pl-10 pr-4 py-2 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-accent-primary/10 text-accent-primary' 
          : 'text-white/60 hover:bg-background-light/20 hover:text-white/80'
      }`}
    >
      <span className="text-sm">{label}</span>
    </Link>
  );
};

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    farms: false,
    batches: false,
    classifications: false,
    reports: false,
    users: true,
    system: true,
    models: true
  });

  const toggleSubmenu = (menu: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isInPath = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 h-screen bg-background-light/30 backdrop-blur-md border-r border-white/5 fixed left-0 top-0 pt-20 pb-6 overflow-y-auto">
      <div className="px-4 mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-accent-tertiary/20 flex items-center justify-center">
            <Shield className="h-5 w-5 text-accent-tertiary" />
          </div>
          <div>
            <h3 className="font-semibold text-white">
              {user?.first_name} {user?.last_name}
            </h3>
            <p className="text-xs text-white/60">Administrateur</p>
          </div>
        </div>
      </div>

      <div className="space-y-1 px-3">
        <SidebarItem 
          to="/dashboard" 
          icon={<Home size={18} />} 
          label="Tableau de bord" 
          isActive={isActive('/dashboard')} 
        />

        {/* Utilisateurs avec sous-menu */}
        <div>
          <SidebarItem 
            to="/admin/users" 
            icon={<Users size={18} />} 
            label="Utilisateurs" 
            isActive={isInPath('/admin/users')} 
            hasSubmenu={true}
            isSubmenuOpen={openMenus.users}
            onClick={() => toggleSubmenu('users')}
          />
          
          {openMenus.users && (
            <motion.div 
              className="mt-1 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SubmenuItem 
                to="/admin/users" 
                label="Tous les utilisateurs" 
                isActive={isActive('/admin/users')} 
              />
              <SubmenuItem 
                to="/admin/users/new" 
                label="Ajouter un utilisateur" 
                isActive={isActive('/admin/users/new')} 
              />
              <SubmenuItem 
                to="/admin/users/roles" 
                label="Gestion des rôles" 
                isActive={isActive('/admin/users/roles')} 
              />
              <SubmenuItem 
                to="/admin/users/permissions" 
                label="Permissions" 
                isActive={isActive('/admin/users/permissions')} 
              />
            </motion.div>
          )}
        </div>

        {/* Modèles avec sous-menu */}
        <div>
          <SidebarItem 
            to="/admin/models" 
            icon={<Database size={18} />} 
            label="Modèles" 
            isActive={isInPath('/admin/models')} 
            hasSubmenu={true}
            isSubmenuOpen={openMenus.models}
            onClick={() => toggleSubmenu('models')}
          />
          
          {openMenus.models && (
            <motion.div 
              className="mt-1 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SubmenuItem 
                to="/admin/models" 
                label="Tous les modèles" 
                isActive={isActive('/admin/models')} 
              />
              <SubmenuItem 
                to="/admin/models/training" 
                label="Entraînement" 
                isActive={isActive('/admin/models/training')} 
              />
              <SubmenuItem 
                to="/admin/models/deployment" 
                label="Déploiement" 
                isActive={isActive('/admin/models/deployment')} 
              />
              <SubmenuItem 
                to="/admin/models/performance" 
                label="Performance" 
                isActive={isActive('/admin/models/performance')} 
              />
            </motion.div>
          )}
        </div>

        {/* Système avec sous-menu */}
        <div>
          <SidebarItem 
            to="/admin/system" 
            icon={<Server size={18} />} 
            label="Système" 
            isActive={isInPath('/admin/system')} 
            hasSubmenu={true}
            isSubmenuOpen={openMenus.system}
            onClick={() => toggleSubmenu('system')}
          />
          
          {openMenus.system && (
            <motion.div 
              className="mt-1 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SubmenuItem 
                to="/admin/system" 
                label="État du système" 
                isActive={isActive('/admin/system')} 
              />
              <SubmenuItem 
                to="/admin/system/logs" 
                label="Journaux" 
                isActive={isActive('/admin/system/logs')} 
              />
              <SubmenuItem 
                to="/admin/system/backup" 
                label="Sauvegarde" 
                isActive={isActive('/admin/system/backup')} 
              />
              <SubmenuItem 
                to="/admin/system/settings" 
                label="Configuration" 
                isActive={isActive('/admin/system/settings')} 
              />
            </motion.div>
          )}
        </div>

        {/* Fermes avec sous-menu */}
        <div>
          <SidebarItem 
            to="/farms" 
            icon={<Warehouse size={18} />} 
            label="Fermes" 
            isActive={isInPath('/farms')} 
            hasSubmenu={true}
            isSubmenuOpen={openMenus.farms}
            onClick={() => toggleSubmenu('farms')}
          />
          
          {openMenus.farms && (
            <motion.div 
              className="mt-1 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SubmenuItem 
                to="/farms" 
                label="Toutes les fermes" 
                isActive={isActive('/farms')} 
              />
              <SubmenuItem 
                to="/farms/map" 
                label="Carte des fermes" 
                isActive={isActive('/farms/map')} 
              />
              <SubmenuItem 
                to="/farms/analytics" 
                label="Analytique" 
                isActive={isActive('/farms/analytics')} 
              />
            </motion.div>
          )}
        </div>

        {/* Lots avec sous-menu */}
        <div>
          <SidebarItem 
            to="/batches" 
            icon={<Package size={18} />} 
            label="Lots" 
            isActive={isInPath('/batches')} 
            hasSubmenu={true}
            isSubmenuOpen={openMenus.batches}
            onClick={() => toggleSubmenu('batches')}
          />
          
          {openMenus.batches && (
            <motion.div 
              className="mt-1 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SubmenuItem 
                to="/batches" 
                label="Tous les lots" 
                isActive={isActive('/batches')} 
              />
              <SubmenuItem 
                to="/batches/analytics" 
                label="Analytique" 
                isActive={isActive('/batches/analytics')} 
              />
            </motion.div>
          )}
        </div>

        {/* Classifications avec sous-menu */}
        <div>
          <SidebarItem 
            to="/classifications" 
            icon={<Image size={18} />} 
            label="Classifications" 
            isActive={isInPath('/classifications')} 
            hasSubmenu={true}
            isSubmenuOpen={openMenus.classifications}
            onClick={() => toggleSubmenu('classifications')}
          />
          
          {openMenus.classifications && (
            <motion.div 
              className="mt-1 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SubmenuItem 
                to="/classifications" 
                label="Historique" 
                isActive={isActive('/classifications')} 
              />
              <SubmenuItem 
                to="/classifications/analytics" 
                label="Analytique" 
                isActive={isActive('/classifications/analytics')} 
              />
            </motion.div>
          )}
        </div>

        <SidebarItem 
          to="/statistics" 
          icon={<BarChart2 size={18} />} 
          label="Statistiques" 
          isActive={isInPath('/statistics')} 
        />

        {/* Rapports avec sous-menu */}
        <div>
          <SidebarItem 
            to="/reports" 
            icon={<FileText size={18} />} 
            label="Rapports" 
            isActive={isInPath('/reports')} 
            hasSubmenu={true}
            isSubmenuOpen={openMenus.reports}
            onClick={() => toggleSubmenu('reports')}
          />
          
          {openMenus.reports && (
            <motion.div 
              className="mt-1 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SubmenuItem 
                to="/reports/generate" 
                label="Générer un rapport" 
                isActive={isActive('/reports/generate')} 
              />
              <SubmenuItem 
                to="/reports/saved" 
                label="Rapports sauvegardés" 
                isActive={isActive('/reports/saved')} 
              />
              <SubmenuItem 
                to="/reports/templates" 
                label="Modèles de rapports" 
                isActive={isActive('/reports/templates')} 
              />
            </motion.div>
          )}
        </div>

        <SidebarItem 
          to="/settings" 
          icon={<Settings size={18} />} 
          label="Paramètres" 
          isActive={isInPath('/settings')} 
        />
      </div>

      <div className="px-4 mt-8">
        <div className="p-4 rounded-lg bg-accent-tertiary/10 border border-accent-tertiary/20">
          <h4 className="text-accent-tertiary font-medium mb-2 flex items-center">
            <AlertTriangle size={16} className="mr-2" /> État du système
          </h4>
          <p className="text-white/70 text-sm">
            Tous les systèmes sont opérationnels. Charge serveur: 23%. Espace disque: 68% libre.
          </p>
        </div>
      </div>

      <div className="px-4 mt-6">
        <div className="flex items-center justify-between text-white/40 text-xs">
          <span>TriPrune v1.2.0</span>
          <span>© 2025</span>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;

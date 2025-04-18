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
  Calendar,
  Tool,
  AlertTriangle,
  Activity,
  Sliders,
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

const TechnicianSidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    farms: false,
    batches: false,
    classifications: false,
    reports: true,
    maintenance: true
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
          <div className="w-10 h-10 rounded-full bg-accent-secondary/20 flex items-center justify-center">
            <Tool className="h-5 w-5 text-accent-secondary" />
          </div>
          <div>
            <h3 className="font-semibold text-white">
              {user?.first_name} {user?.last_name}
            </h3>
            <p className="text-xs text-white/60">Technicien</p>
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
                to="/farms/monitoring" 
                label="Surveillance" 
                isActive={isActive('/farms/monitoring')} 
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
                to="/batches/calendar" 
                label="Calendrier des lots" 
                isActive={isActive('/batches/calendar')} 
              />
              <SubmenuItem 
                to="/batches/quality" 
                label="Contrôle qualité" 
                isActive={isActive('/batches/quality')} 
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
                to="/classifications/new" 
                label="Nouvelle classification" 
                isActive={isActive('/classifications/new')} 
              />
              <SubmenuItem 
                to="/classifications/batch" 
                label="Classification par lot" 
                isActive={isActive('/classifications/batch')} 
              />
              <SubmenuItem 
                to="/classifications/analysis" 
                label="Analyse avancée" 
                isActive={isActive('/classifications/analysis')} 
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
                to="/reports/export" 
                label="Exporter les données" 
                isActive={isActive('/reports/export')} 
              />
              <SubmenuItem 
                to="/reports/templates" 
                label="Modèles de rapports" 
                isActive={isActive('/reports/templates')} 
              />
            </motion.div>
          )}
        </div>

        {/* Maintenance avec sous-menu */}
        <div>
          <SidebarItem 
            to="/maintenance" 
            icon={<Sliders size={18} />} 
            label="Maintenance" 
            isActive={isInPath('/maintenance')} 
            hasSubmenu={true}
            isSubmenuOpen={openMenus.maintenance}
            onClick={() => toggleSubmenu('maintenance')}
          />
          
          {openMenus.maintenance && (
            <motion.div 
              className="mt-1 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SubmenuItem 
                to="/maintenance/equipment" 
                label="Équipements" 
                isActive={isActive('/maintenance/equipment')} 
              />
              <SubmenuItem 
                to="/maintenance/calibration" 
                label="Calibration" 
                isActive={isActive('/maintenance/calibration')} 
              />
              <SubmenuItem 
                to="/maintenance/logs" 
                label="Journaux système" 
                isActive={isActive('/maintenance/logs')} 
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

        <SidebarItem 
          to="/help" 
          icon={<HelpCircle size={18} />} 
          label="Aide & Support" 
          isActive={isInPath('/help')} 
        />
      </div>

      <div className="px-4 mt-8">
        <div className="p-4 rounded-lg bg-accent-secondary/10 border border-accent-secondary/20">
          <h4 className="text-accent-secondary font-medium mb-2 flex items-center">
            <Activity size={16} className="mr-2" /> État du système
          </h4>
          <p className="text-white/70 text-sm">
            Tous les systèmes fonctionnent normalement. Dernière maintenance: il y a 3 jours.
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

export default TechnicianSidebar;

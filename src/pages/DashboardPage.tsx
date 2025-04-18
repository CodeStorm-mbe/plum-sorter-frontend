import React from 'react';
import { motion } from 'framer-motion';
import { useRole, RoleBased } from '../contexts/RoleContext';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Users, Database, Server, Layers, Image } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  color: string;
  delay?: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  description, 
  icon, 
  to, 
  color,
  delay = 0 
}) => {
  return (
    <motion.div
      className={`card p-6 border ${color} hover:shadow-lg transition-all duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color.replace('border-', 'bg-').replace('/20', '/10')}`}>
          {icon}
        </div>
        <Link to={to} className="text-white/60 hover:text-white transition-colors">
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-white/60 mb-4">{description}</p>
      <Link 
        to={to} 
        className={`inline-flex items-center text-sm font-medium ${color.replace('border-', 'text-').replace('/20', '')} hover:underline`}
      >
        Accéder
        <ArrowRight className="h-4 w-4 ml-1" />
      </Link>
    </motion.div>
  );
};

const DashboardPage: React.FC = () => {
  const { isAdmin, isTechnician, isFarmer } = useRole();

  // Rediriger vers le dashboard spécifique au rôle
  React.useEffect(() => {
    if (isAdmin) {
      window.location.href = '/admin-dashboard';
    } else if (isTechnician) {
      window.location.href = '/technician-dashboard';
    } else if (isFarmer) {
      window.location.href = '/farmer-dashboard';
    }
  }, [isAdmin, isTechnician, isFarmer]);

  return (
    <div className="container mx-auto pt-28 pb-16 px-4 md:px-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-title font-bold mb-4 bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
          Tableau de bord
        </h1>
        <p className="text-white/60 max-w-3xl">
          Bienvenue sur le tableau de bord de TriPrune. Accédez à toutes les fonctionnalités du système de classification des prunes.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <RoleBased requiredRole={['admin', 'technician']}>
          <DashboardCard
            title="Statistiques"
            description="Consultez les statistiques détaillées sur les classifications et les performances."
            icon={<BarChart2 className="h-6 w-6 text-blue-500" />}
            to="/statistics"
            color="border-blue-500/20"
            delay={0.1}
          />
        </RoleBased>

        <RoleBased requiredRole="admin">
          <DashboardCard
            title="Gestion des utilisateurs"
            description="Gérez les utilisateurs, leurs rôles et leurs permissions."
            icon={<Users className="h-6 w-6 text-purple-500" />}
            to="/admin/users"
            color="border-purple-500/20"
            delay={0.2}
          />
        </RoleBased>

        <DashboardCard
          title="Fermes"
          description="Consultez et gérez les fermes enregistrées dans le système."
          icon={<Layers className="h-6 w-6 text-green-500" />}
          to="/farms"
          color="border-green-500/20"
          delay={0.3}
        />

        <DashboardCard
          title="Classifications"
          description="Accédez aux classifications existantes ou créez-en de nouvelles."
          icon={<Image className="h-6 w-6 text-amber-500" />}
          to="/classifications"
          color="border-amber-500/20"
          delay={0.4}
        />

        <RoleBased requiredRole="admin">
          <DashboardCard
            title="Gestion des modèles"
            description="Gérez les modèles de classification et leurs versions."
            icon={<Database className="h-6 w-6 text-rose-500" />}
            to="/admin/models"
            color="border-rose-500/20"
            delay={0.5}
          />
        </RoleBased>

        <RoleBased requiredRole="admin">
          <DashboardCard
            title="État du système"
            description="Consultez l'état et les performances du système."
            icon={<Server className="h-6 w-6 text-cyan-500" />}
            to="/admin/system"
            color="border-cyan-500/20"
            delay={0.6}
          />
        </RoleBased>
      </div>

      <motion.div
        className="card p-6 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/5 border border-accent-primary/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Accès rapide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RoleBased requiredRole={['admin', 'technician', 'farmer']}>
            <Link 
              to="/classifications/new" 
              className="p-4 bg-background-light/30 rounded-lg hover:bg-background-light/50 transition-colors"
            >
              <h3 className="font-semibold mb-2">Nouvelle classification</h3>
              <p className="text-white/60 text-sm">Classifier de nouvelles images de prunes.</p>
            </Link>
          </RoleBased>

          <RoleBased requiredRole={['admin', 'technician']}>
            <Link 
              to="/reports" 
              className="p-4 bg-background-light/30 rounded-lg hover:bg-background-light/50 transition-colors"
            >
              <h3 className="font-semibold mb-2">Rapports</h3>
              <p className="text-white/60 text-sm">Générer et exporter des rapports détaillés.</p>
            </Link>
          </RoleBased>

          <RoleBased requiredRole={['admin', 'farmer']}>
            <Link 
              to="/farms/new" 
              className="p-4 bg-background-light/30 rounded-lg hover:bg-background-light/50 transition-colors"
            >
              <h3 className="font-semibold mb-2">Nouvelle ferme</h3>
              <p className="text-white/60 text-sm">Enregistrer une nouvelle ferme dans le système.</p>
            </Link>
          </RoleBased>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;

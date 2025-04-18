import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../contexts/DashboardContext';
import { RolePermissionService, PERMISSIONS } from '../services/rolePermissionService';
import Navbar from '../components/Navbar';
import StatsSummaryWidget from '../components/StatsSummaryWidget';
import QualityDistributionWidget from '../components/QualityDistributionWidget';
import RecentClassificationsWidget from '../components/RecentClassificationsWidget';
import PageTransition from '../components/PageTransition';
import { Calendar, Download, RefreshCw } from 'lucide-react';
import Button from '../components/Button';
import { Navigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { dashboardData, isLoading, error, refreshData, lastUpdated } = useDashboard();
  
  // Rediriger les utilisateurs de type "farmer" vers le tableau de bord spécifique
  if (user && user.role === 'farmer') {
    return <Navigate to="/farmer-dashboard" replace />;
  }
  const [dateRange, setDateRange] = useState('week');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fonction pour rafraîchir les données du dashboard
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  // Titre du dashboard adapté au rôle
  const getDashboardTitle = () => {
    if (!user) return 'Dashboard';
    
    switch (user.role) {
      case 'admin':
        return 'Dashboard Administrateur';
      case 'technician':
        return 'Dashboard Technicien';
      case 'farmer':
        return 'Dashboard Agriculteur';
      default:
        return 'Dashboard';
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />

        <div className="container mx-auto pt-28 pb-16 px-4 md:px-8">
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-title font-bold mb-4 md:mb-0 bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              {getDashboardTitle()}
            </h1>

            <div className="flex flex-wrap gap-4">
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <select
                  className="bg-background-light/50 border border-white/10 text-white rounded-md px-4 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-accent-primary"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="day">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="year">Cette année</option>
                </select>
                <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-primary pointer-events-none" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button 
                  variant="outline" 
                  icon={<RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />} 
                  size="md"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? 'Actualisation...' : 'Actualiser'}
                </Button>
              </motion.div>

              {RolePermissionService.hasPermission(user, PERMISSIONS.EXPORT_STATISTICS) && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Button variant="outline" icon={<Download className="h-4 w-4 mr-2" />} size="md">
                    Exporter
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary"></div>
            </div>
          ) : error ? (
            <div className="card p-6 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button variant="primary" onClick={handleRefresh}>Réessayer</Button>
            </div>
          ) : (
            <>
              {/* Widgets du dashboard adaptés au rôle */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <StatsSummaryWidget />
                <QualityDistributionWidget />
              </div>

              {/* Classifications récentes */}
              <div className="mb-8">
                <RecentClassificationsWidget />
              </div>

              {/* Widgets spécifiques au rôle */}
              {user?.role === 'admin' && (
                <div className="mb-8">
                  {/* Widgets spécifiques à l'administrateur */}
                  <div className="card p-4">
                    <h3 className="text-xl font-title font-semibold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      Administration du système
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-background-light/30 rounded-lg">
                        <h4 className="font-semibold mb-2">Gestion des utilisateurs</h4>
                        <p className="text-white/60 mb-4">Gérez les utilisateurs et leurs permissions.</p>
                        <Button variant="primary" size="sm" href="/admin/users">
                          Gérer les utilisateurs
                        </Button>
                      </div>
                      <div className="p-4 bg-background-light/30 rounded-lg">
                        <h4 className="font-semibold mb-2">Gestion des modèles</h4>
                        <p className="text-white/60 mb-4">Configurez les modèles de classification.</p>
                        <Button variant="primary" size="sm" href="/admin/models">
                          Gérer les modèles
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {user?.role === 'technician' && (
                <div className="mb-8">
                  {/* Widgets spécifiques au technicien */}
                  <div className="card p-4">
                    <h3 className="text-xl font-title font-semibold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      Suivi des fermes
                    </h3>
                    <p className="text-white/60 mb-4">
                      Visualisez et analysez les performances des fermes que vous gérez.
                    </p>
                    <Button variant="primary" href="/farms">
                      Voir toutes les fermes
                    </Button>
                  </div>
                </div>
              )}

              {user?.role === 'farmer' && (
                <div className="mb-8">
                  {/* Widgets spécifiques à l'agriculteur */}
                  <div className="card p-4">
                    <h3 className="text-xl font-title font-semibold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      Mes fermes et lots
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-background-light/30 rounded-lg">
                        <h4 className="font-semibold mb-2">Nouvelle classification</h4>
                        <p className="text-white/60 mb-4">Classifiez de nouvelles images de prunes.</p>
                        <Button variant="primary" size="sm" href="/classifications/new">
                          Classifier une image
                        </Button>
                      </div>
                      <div className="p-4 bg-background-light/30 rounded-lg">
                        <h4 className="font-semibold mb-2">Gérer mes lots</h4>
                        <p className="text-white/60 mb-4">Consultez et gérez vos lots de prunes.</p>
                        <Button variant="primary" size="sm" href="/batches">
                          Voir mes lots
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {lastUpdated && (
            <div className="text-center text-white/40 text-sm mt-8">
              Dernière mise à jour: {new Date(lastUpdated).toLocaleString('fr-FR')}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="py-8 px-4 md:px-8 lg:px-16 bg-background-light/50 backdrop-blur-md border-t border-white/5">
          <div className="container mx-auto text-center">
            <p className="text-white/60">© 2025 TriPrune - Projet JCIA Hackathon</p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default DashboardPage;

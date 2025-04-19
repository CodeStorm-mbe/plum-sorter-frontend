import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { AdminDashboardService } from '../services';
import StatsSummaryWidget from '../components/StatsSummaryWidget';
import QualityDistributionWidget from '../components/QualityDistributionWidget';
import RecentClassificationsWidget from '../components/RecentClassificationsWidget';
import ActivityHeatmapWidget from '../components/ActivityHeatmapWidget';
import ModelManagementWidget from '../components/ModelManagementWidget';
import PageTransition from '../components/PageTransition';
import { Calendar, Download, RefreshCw, Users, Database, Server } from 'lucide-react';
import Button from '../components/Button';
import Navbar from '../components/Navbar';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('month');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await AdminDashboardService.getAdminDashboardData({ date_range: dateRange });
      setDashboardData(data);
    } catch (err: any) {
      console.error('Erreur lors de la récupération des données du dashboard admin:', err);
      setError(err.message || 'Une erreur est survenue lors de la récupération des données');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour rafraîchir les données du dashboard
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setIsRefreshing(false);
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
              Dashboard Administrateur
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

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button variant="outline" icon={<Download className="h-4 w-4 mr-2" />} size="md">
                  Exporter
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {isLoading && !dashboardData ? (
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
              {/* Statistiques système */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="card p-4 bg-gradient-to-br from-accent-primary/20 to-accent-primary/5 border border-accent-primary/20">
                    <div className="flex items-center mb-2">
                      <Users className="h-5 w-5 mr-2 text-accent-primary" />
                      <h3 className="text-lg font-semibold">Utilisateurs</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/60 text-sm">Total</p>
                        <p className="text-2xl font-bold">{dashboardData?.totalUsers || 0}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Actifs</p>
                        <p className="text-2xl font-bold">{dashboardData?.activeUsers || 0}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-white/60 text-sm">Nouveaux ce mois</p>
                      <p className="text-lg font-semibold">{dashboardData?.newUsersThisMonth || 0}</p>
                    </div>
                  </div>
                  
                  <div className="card p-4 bg-gradient-to-br from-accent-secondary/20 to-accent-secondary/5 border border-accent-secondary/20">
                    <div className="flex items-center mb-2">
                      <Database className="h-5 w-5 mr-2 text-accent-secondary" />
                      <h3 className="text-lg font-semibold">Classifications</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/60 text-sm">Total</p>
                        <p className="text-2xl font-bold">{dashboardData?.totalClassifications || 0}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Aujourd'hui</p>
                        <p className="text-2xl font-bold">{dashboardData?.classificationsToday || 0}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-white/60 text-sm">Confiance moyenne</p>
                      <p className="text-lg font-semibold">{dashboardData?.averageConfidence ? `${(dashboardData.averageConfidence * 100).toFixed(1)}%` : 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="card p-4 bg-gradient-to-br from-accent-tertiary/20 to-accent-tertiary/5 border border-accent-tertiary/20">
                    <div className="flex items-center mb-2">
                      <Server className="h-5 w-5 mr-2 text-accent-tertiary" />
                      <h3 className="text-lg font-semibold">Système</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/60 text-sm">Temps de traitement</p>
                        <p className="text-xl font-bold">{dashboardData?.systemPerformance?.averageProcessingTime?.toFixed(2) || 0} ms</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Charge serveur</p>
                        <p className="text-xl font-bold">{dashboardData?.systemPerformance?.serverLoad?.toFixed(2) || 0}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-white/60 text-sm">Version du modèle</p>
                      <p className="text-lg font-semibold">{dashboardData?.systemPerformance?.modelVersion || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Widgets principaux */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <StatsSummaryWidget title="Statistiques globales" />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <QualityDistributionWidget title="Répartition par qualité" />
                </motion.div>
              </div>

              {/* Heatmap d'activité */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <ActivityHeatmapWidget title="Activité utilisateur" />
              </motion.div>

              {/* Gestion des modèles */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <ModelManagementWidget title="Gestion des modèles" />
              </motion.div>

              {/* Classifications récentes */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <RecentClassificationsWidget title="Classifications récentes" />
              </motion.div>

              {/* Widgets spécifiques à l'administrateur */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="card p-4">
                  <h3 className="text-xl font-title font-semibold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    Administration du système
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <div className="p-4 bg-background-light/30 rounded-lg">
                      <h4 className="font-semibold mb-2">État du système</h4>
                      <p className="text-white/60 mb-4">Consultez l'état et les performances du système.</p>
                      <Button variant="primary" size="sm" href="/admin/system">
                        Voir l'état du système
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {dashboardData && (
            <div className="text-center text-white/40 text-sm mt-8">
              Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="py-8 px-4 md:px-8 lg:px-16 bg-background-light/50 backdrop-blur-md border-t border-white/5">
          <div className="container mx-auto text-center">
            <p className="text-white/60">© 2025 TriPrune - Système de classification des prunes</p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default AdminDashboardPage;

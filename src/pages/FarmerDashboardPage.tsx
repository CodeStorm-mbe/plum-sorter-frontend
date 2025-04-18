import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../contexts/DashboardContext';
import FarmerSidebar from '../components/FarmerSidebar';
import StatsSummaryWidget from '../components/StatsSummaryWidget';
import QualityDistributionWidget from '../components/QualityDistributionWidget';
import RecentClassificationsWidget from '../components/RecentClassificationsWidget';
import FarmOverviewWidget from '../components/FarmOverviewWidget';
import BatchStatusWidget from '../components/BatchStatusWidget';
import WeatherWidget from '../components/WeatherWidget';
import QualityTrendsWidget from '../components/QualityTrendsWidget';
import PageTransition from '../components/PageTransition';
import { Calendar, Download, RefreshCw, Filter, Tractor, Package, AlertTriangle } from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const FarmerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { dashboardData, isLoading, error, refreshData, lastUpdated } = useDashboard();
  const [dateRange, setDateRange] = useState('week');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<number | 'all'>('all');

  // Fonction pour rafraîchir les données du dashboard
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  // Récupérer la liste des fermes de l'agriculteur
  const farmerData = dashboardData as any;
  const farms = farmerData?.farms || [];

  return (
    <PageTransition>
      <div className="flex min-h-screen bg-background">
        <FarmerSidebar />
        
        <div className="flex-1 ml-64">
          <div className="container mx-auto pt-24 pb-16 px-6">
            <motion.div
              className="flex flex-col md:flex-row items-center justify-between mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-title font-bold mb-2 bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                  Bienvenue, {user?.first_name}
                </h1>
                <p className="text-white/60">
                  Voici un aperçu de vos fermes et de la qualité de vos prunes
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
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
                  className="relative"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <select
                    className="bg-background-light/50 border border-white/10 text-white rounded-md px-4 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-accent-primary"
                    value={selectedFarm.toString()}
                    onChange={(e) => setSelectedFarm(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                  >
                    <option value="all">Toutes les fermes</option>
                    {farms.map((farm: any) => (
                      <option key={farm.id} value={farm.id}>{farm.name}</option>
                    ))}
                  </select>
                  <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-primary pointer-events-none" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
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
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Button 
                    variant="outline" 
                    icon={<Download className="h-4 w-4 mr-2" />} 
                    size="md"
                    href="/reports/export"
                  >
                    Exporter
                  </Button>
                </motion.div>
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
                {/* Alertes et notifications */}
                {farmerData?.alerts && farmerData.alerts.length > 0 && (
                  <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="card p-4 border border-yellow-500/30 bg-yellow-500/10">
                      <h3 className="text-xl font-title font-semibold mb-4 flex items-center text-yellow-500">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        Alertes et notifications
                      </h3>
                      <div className="space-y-2">
                        {farmerData.alerts.map((alert: any, index: number) => (
                          <div key={index} className="p-3 bg-background-light/30 rounded-lg flex items-center">
                            <div className="mr-3 text-yellow-500">
                              <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{alert.title}</p>
                              <p className="text-white/60 text-sm">{alert.message}</p>
                            </div>
                            <Button 
                              variant="link" 
                              size="sm" 
                              href={alert.action_url} 
                              className="ml-auto text-accent-primary"
                            >
                              {alert.action_text}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Actions rapides */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/farms/new" className="card p-4 bg-gradient-to-br from-accent-primary/20 to-accent-primary/5 hover:from-accent-primary/30 hover:to-accent-primary/10 transition-all duration-300 border border-accent-primary/20 flex items-center">
                      <div className="mr-4 p-3 rounded-full bg-accent-primary/20">
                        <Tractor className="h-6 w-6 text-accent-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Ajouter une ferme</h3>
                        <p className="text-white/60 text-sm">Enregistrer une nouvelle exploitation</p>
                      </div>
                    </Link>
                    
                    <Link to="/batches/new" className="card p-4 bg-gradient-to-br from-accent-secondary/20 to-accent-secondary/5 hover:from-accent-secondary/30 hover:to-accent-secondary/10 transition-all duration-300 border border-accent-secondary/20 flex items-center">
                      <div className="mr-4 p-3 rounded-full bg-accent-secondary/20">
                        <Package className="h-6 w-6 text-accent-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Créer un lot</h3>
                        <p className="text-white/60 text-sm">Ajouter un nouveau lot de prunes</p>
                      </div>
                    </Link>
                    
                    <Link to="/classifications/new" className="card p-4 bg-gradient-to-br from-accent-tertiary/20 to-accent-tertiary/5 hover:from-accent-tertiary/30 hover:to-accent-tertiary/10 transition-all duration-300 border border-accent-tertiary/20 flex items-center">
                      <div className="mr-4 p-3 rounded-full bg-accent-tertiary/20">
                        <Calendar className="h-6 w-6 text-accent-tertiary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Classifier des prunes</h3>
                        <p className="text-white/60 text-sm">Analyser la qualité de vos prunes</p>
                      </div>
                    </Link>
                  </div>
                </motion.div>

                {/* Widgets principaux */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <StatsSummaryWidget title="Statistiques globales" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <QualityDistributionWidget title="Répartition par qualité" />
                  </motion.div>
                </div>

                {/* Vue d'ensemble des fermes */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <FarmOverviewWidget 
                    title="Mes fermes" 
                    farms={farms} 
                    selectedFarm={selectedFarm}
                    onSelectFarm={setSelectedFarm}
                  />
                </motion.div>

                {/* Statut des lots */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <BatchStatusWidget 
                    title="Statut des lots" 
                    farmId={selectedFarm === 'all' ? undefined : selectedFarm} 
                  />
                </motion.div>

                {/* Tendances de qualité */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <QualityTrendsWidget 
                    title="Tendances de qualité" 
                    dateRange={dateRange}
                    farmId={selectedFarm === 'all' ? undefined : selectedFarm}
                  />
                </motion.div>

                {/* Classifications récentes */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <RecentClassificationsWidget 
                    title="Classifications récentes" 
                    limit={5} 
                  />
                </motion.div>

                {/* Météo et conditions */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <WeatherWidget 
                    title="Météo et conditions" 
                    farmId={selectedFarm === 'all' ? undefined : selectedFarm}
                  />
                </motion.div>
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
              <p className="text-white/60">© 2025 TriPrune - Système de classification des prunes</p>
            </div>
          </footer>
        </div>
      </div>
    </PageTransition>
  );
};

export default FarmerDashboardPage;

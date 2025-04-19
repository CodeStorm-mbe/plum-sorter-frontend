import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { TechnicianDashboardService } from '../services';
import StatsSummaryWidget from '../components/StatsSummaryWidget';
import QualityDistributionWidget from '../components/QualityDistributionWidget';
import RecentClassificationsWidget from '../components/RecentClassificationsWidget';
import FarmComparisonWidget from '../components/FarmComparisonWidget';
import QualityTrendsWidget from '../components/QualityTrendsWidget';
import QualityPredictionWidget from '../components/QualityPredictionWidget';
import PageTransition from '../components/PageTransition';
import { Calendar, Download, RefreshCw, Filter, FileText } from 'lucide-react';
import Button from '../components/Button';
import Navbar from '../components/Navbar';

const TechnicianDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('month');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<number | null>(null);
  const [managedFarms, setManagedFarms] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await TechnicianDashboardService.getTechnicianDashboardData({ date_range: dateRange });
      setDashboardData(data);
      
      // Extraire les fermes gérées
      if (data.farmPerformance && Array.isArray(data.farmPerformance)) {
        setManagedFarms(data.farmPerformance);
      }
    } catch (err: any) {
      console.error('Erreur lors de la récupération des données du dashboard technicien:', err);
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

  // Fonction pour générer un rapport pour une ferme
  const handleGenerateReport = async (farmId: number) => {
    try {
      const blob = await TechnicianDashboardService.generateFarmReport(farmId, { date_range: dateRange });
      
      // Créer un URL pour le blob et déclencher le téléchargement
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_ferme_${farmId}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error(`Erreur lors de la génération du rapport pour la ferme ${farmId}:`, err);
      alert(`Erreur: ${err.message || 'Une erreur est survenue lors de la génération du rapport'}`);
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
              Dashboard Technicien
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

              {managedFarms.length > 0 && (
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <select
                    className="bg-background-light/50 border border-white/10 text-white rounded-md px-4 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-accent-primary"
                    value={selectedFarm?.toString() || ''}
                    onChange={(e) => setSelectedFarm(e.target.value ? parseInt(e.target.value) : null)}
                  >
                    <option value="">Toutes les fermes</option>
                    {managedFarms.map((farm) => (
                      <option key={farm.id} value={farm.id}>{farm.name}</option>
                    ))}
                  </select>
                  <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-primary pointer-events-none" />
                </motion.div>
              )}

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
              {/* Statistiques des fermes gérées */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="card p-4">
                  <h3 className="text-xl font-title font-semibold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    Fermes gérées
                  </h3>
                  
                  {managedFarms.length === 0 ? (
                    <p className="text-white/60 text-center py-4">Aucune ferme gérée</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {managedFarms.map((farm) => (
                        <div 
                          key={farm.id} 
                          className={`p-4 rounded-lg border transition-all duration-300 ${
                            selectedFarm === farm.id 
                              ? 'bg-accent-primary/20 border-accent-primary/40' 
                              : 'bg-background-light/30 border-white/10 hover:border-white/30'
                          }`}
                          onClick={() => setSelectedFarm(farm.id === selectedFarm ? null : farm.id)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{farm.name}</h4>
                            <div className={`px-2 py-1 rounded text-xs ${
                              farm.qualityScore >= 80 ? 'bg-green-500/20 text-green-400' :
                              farm.qualityScore >= 60 ? 'bg-blue-500/20 text-blue-400' :
                              farm.qualityScore >= 40 ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              Score: {farm.qualityScore}
                            </div>
                          </div>
                          <p className="text-white/60 text-sm mb-3">{farm.location}</p>
                          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div>
                              <p className="text-white/60">Classifications</p>
                              <p className="font-medium">{farm.totalClassifications}</p>
                            </div>
                            <div>
                              <p className="text-white/60">Tendance</p>
                              <p className={`font-medium flex items-center ${
                                farm.recentTrend === 'up' ? 'text-green-400' :
                                farm.recentTrend === 'down' ? 'text-red-400' :
                                'text-white/60'
                              }`}>
                                {farm.recentTrend === 'up' ? '↑' : farm.recentTrend === 'down' ? '↓' : '→'}
                                <span className="ml-1">
                                  {farm.recentTrend === 'up' ? 'Hausse' : farm.recentTrend === 'down' ? 'Baisse' : 'Stable'}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <Button 
                              variant="link" 
                              size="sm" 
                              href={`/farms/${farm.id}`}
                            >
                              Voir détails
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              icon={<FileText className="h-4 w-4 mr-1" />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleGenerateReport(farm.id);
                              }}
                            >
                              Rapport
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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

              {/* Comparaison des fermes */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <FarmComparisonWidget 
                  title="Comparaison des fermes" 
                  farmIds={managedFarms.map(farm => farm.id)}
                />
              </motion.div>

              {/* Tendances de qualité */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <QualityTrendsWidget 
                  title="Tendances de qualité" 
                  dateRange={dateRange}
                  farmId={selectedFarm || undefined}
                />
              </motion.div>

              {/* Prédiction de qualité */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <QualityPredictionWidget 
                  title="Prédiction de qualité" 
                  farmId={selectedFarm || undefined}
                />
              </motion.div>

              {/* Classifications récentes */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <RecentClassificationsWidget title="Classifications récentes" />
              </motion.div>

              {/* Actions rapides */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="card p-4">
                  <h3 className="text-xl font-title font-semibold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    Actions rapides
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-background-light/30 rounded-lg">
                      <h4 className="font-semibold mb-2">Classifier des prunes</h4>
                      <p className="text-white/60 mb-4">Analyser de nouvelles images de prunes.</p>
                      <Button variant="primary" size="sm" href="/classifications/new">
                        Nouvelle classification
                      </Button>
                    </div>
                    <div className="p-4 bg-background-light/30 rounded-lg">
                      <h4 className="font-semibold mb-2">Gérer les fermes</h4>
                      <p className="text-white/60 mb-4">Voir et gérer toutes les fermes.</p>
                      <Button variant="primary" size="sm" href="/farms">
                        Voir les fermes
                      </Button>
                    </div>
                    <div className="p-4 bg-background-light/30 rounded-lg">
                      <h4 className="font-semibold mb-2">Générer des rapports</h4>
                      <p className="text-white/60 mb-4">Créer des rapports détaillés.</p>
                      <Button variant="primary" size="sm" href="/reports">
                        Rapports
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

export default TechnicianDashboardPage;

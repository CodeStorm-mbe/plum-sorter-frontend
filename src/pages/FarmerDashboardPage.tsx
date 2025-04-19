import React from 'react';
import { motion } from 'framer-motion';
import { Card, PageHeader, PageContainer, Section, Grid } from '../components/UIComponents';
import { useAuth } from '../contexts/AuthContext';
import { useRole, RoleBased } from '../contexts/RoleContext';
import QualityTrendsWidget from '../components/QualityTrendsWidget';
import QualityDistributionWidget from '../components/QualityDistributionWidget';
import ActivityHeatmapWidget from '../components/ActivityHeatmapWidget';
import FarmComparisonWidget from '../components/FarmComparisonWidget';
import QualityPredictionWidget from '../components/QualityPredictionWidget';
import RecentClassificationsWidget from '../components/RecentClassificationsWidget';
import Navbar from '../components/Navbar';
import { Calendar, Download, RefreshCw, Filter, FileText, Plus } from 'lucide-react';
import Button from '../components/Button';

const FarmerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { hasPermission } = useRole();
  const [isLoading, setIsLoading] = React.useState(false);
  const [dateRange, setDateRange] = React.useState('month');
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Fonction pour rafraîchir les données du dashboard
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simuler un chargement
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Navbar />

      <PageContainer>
        <PageHeader
          title="Dashboard Agriculteur"
          description="Bienvenue sur votre tableau de bord. Consultez les statistiques de vos fermes et gérez vos classifications."
          actions={
            <>
              <div className="relative">
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
              </div>

              <Button 
                variant="outline" 
                icon={<RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />} 
                size="md"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? 'Actualisation...' : 'Actualiser'}
              </Button>

              <RoleBased requiredPermission="create_farm">
                <Button 
                  variant="primary" 
                  icon={<Plus className="h-4 w-4 mr-2" />} 
                  size="md"
                  href="/farms/new"
                >
                  Nouvelle ferme
                </Button>
              </RoleBased>
            </>
          }
        />

        {/* Statistiques résumées */}
        <Section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-accent-primary/20 to-accent-primary/5 border border-accent-primary/20">
              <h3 className="text-lg font-semibold mb-3">Mes fermes</h3>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">3</p>
                  <p className="text-white/60 text-sm">Fermes actives</p>
                </div>
                <Button variant="outline" size="sm" href="/farms">
                  Voir toutes
                </Button>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-accent-secondary/20 to-accent-secondary/5 border border-accent-secondary/20">
              <h3 className="text-lg font-semibold mb-3">Classifications</h3>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">127</p>
                  <p className="text-white/60 text-sm">Ce mois</p>
                </div>
                <Button variant="outline" size="sm" href="/classifications">
                  Voir toutes
                </Button>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-accent-tertiary/20 to-accent-tertiary/5 border border-accent-tertiary/20">
              <h3 className="text-lg font-semibold mb-3">Qualité moyenne</h3>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">78%</p>
                  <p className="text-white/60 text-sm">Score global</p>
                </div>
                <div className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">
                  +5% ce mois
                </div>
              </div>
            </Card>
          </div>
        </Section>

        {/* Widgets principaux */}
        <Grid cols={2} gap={8}>
          <QualityTrendsWidget 
            title="Tendances de qualité" 
            dateRange={dateRange}
          />
          
          <QualityDistributionWidget 
            title="Répartition par qualité" 
          />
        </Grid>

        {/* Prédiction de qualité */}
        <Section delay={0.2}>
          <QualityPredictionWidget 
            title="Prédiction de qualité" 
          />
        </Section>

        {/* Classifications récentes */}
        <Section delay={0.3}>
          <RecentClassificationsWidget 
            title="Classifications récentes" 
          />
        </Section>

        {/* Actions rapides */}
        <Section title="Actions rapides" delay={0.4}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4" hover={true}>
              <h4 className="font-semibold mb-2">Classifier des prunes</h4>
              <p className="text-white/60 mb-4">Analyser de nouvelles images de prunes.</p>
              <Button variant="primary" size="sm" href="/classifications/new">
                Nouvelle classification
              </Button>
            </Card>
            
            <Card className="p-4" hover={true}>
              <h4 className="font-semibold mb-2">Gérer mes fermes</h4>
              <p className="text-white/60 mb-4">Voir et gérer toutes vos fermes.</p>
              <Button variant="primary" size="sm" href="/farms">
                Voir mes fermes
              </Button>
            </Card>
            
            <Card className="p-4" hover={true}>
              <h4 className="font-semibold mb-2">Gérer mes lots</h4>
              <p className="text-white/60 mb-4">Voir et gérer tous vos lots de prunes.</p>
              <Button variant="primary" size="sm" href="/batches">
                Voir mes lots
              </Button>
            </Card>
          </div>
        </Section>

        <div className="text-center text-white/40 text-sm mt-8">
          Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
        </div>
      </PageContainer>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-8 lg:px-16 bg-background-light/50 backdrop-blur-md border-t border-white/5">
        <div className="container mx-auto text-center">
          <p className="text-white/60">© 2025 TriPrune - Système de classification des prunes</p>
        </div>
      </footer>
    </motion.div>
  );
};

export default FarmerDashboardPage;

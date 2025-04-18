import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Download, ChevronRight, Calendar, BarChart2 } from 'lucide-react';
import Button from '../components/Button';

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  className?: string;
}

/**
 * Carte pour les différents types de rapports disponibles
 */
const ReportCard: React.FC<ReportCardProps> = ({ 
  title, 
  description, 
  icon, 
  to, 
  className = "" 
}) => {
  return (
    <motion.div 
      className={`card p-5 hover:bg-background-light/20 transition-all duration-300 border border-white/5 hover:border-accent-primary/20 ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start mb-4">
        <div className="p-3 rounded-full bg-accent-primary/20 mr-4">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-white text-lg">{title}</h3>
          <p className="text-white/60 text-sm mt-1">{description}</p>
        </div>
      </div>
      
      <Link to={to}>
        <Button 
          variant="ghost" 
          className="w-full justify-between hover:bg-background-light/30 mt-2"
          size="sm"
        >
          <span>Générer ce rapport</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Link>
    </motion.div>
  );
};

interface ReportsPageProps {
  className?: string;
}

/**
 * Page de génération de rapports pour les agriculteurs
 */
const ReportsPage: React.FC<ReportsPageProps> = ({ className = "" }) => {
  return (
    <div className={`container mx-auto pt-24 pb-16 px-6 ${className}`}>
      <motion.div
        className="flex flex-col md:flex-row items-center justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-title font-bold mb-2 bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
            Rapports et analyses
          </h1>
          <p className="text-white/60">
            Générez des rapports détaillés sur vos fermes et la qualité de vos prunes
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            icon={<Download className="h-4 w-4 mr-2" />} 
            href="/reports/export"
          >
            Exporter les données
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <ReportCard 
          title="Rapport de qualité" 
          description="Analyse détaillée de la qualité des prunes par ferme et par lot" 
          icon={<BarChart2 className="h-6 w-6 text-accent-primary" />} 
          to="/reports/generate?type=quality" 
        />
        
        <ReportCard 
          title="Rapport périodique" 
          description="Évolution de la qualité sur une période spécifique" 
          icon={<Calendar className="h-6 w-6 text-accent-secondary" />} 
          to="/reports/generate?type=periodic" 
        />
        
        <ReportCard 
          title="Rapport de performance" 
          description="Comparaison des performances entre vos différentes fermes" 
          icon={<BarChart2 className="h-6 w-6 text-accent-tertiary" />} 
          to="/reports/generate?type=performance" 
        />
        
        <ReportCard 
          title="Rapport de prévision" 
          description="Prévisions de qualité basées sur les tendances historiques" 
          icon={<BarChart2 className="h-6 w-6 text-green-500" />} 
          to="/reports/generate?type=forecast" 
        />
        
        <ReportCard 
          title="Rapport d'anomalies" 
          description="Détection des anomalies et problèmes potentiels" 
          icon={<BarChart2 className="h-6 w-6 text-yellow-500" />} 
          to="/reports/generate?type=anomalies" 
        />
        
        <ReportCard 
          title="Rapport personnalisé" 
          description="Créez un rapport sur mesure selon vos besoins spécifiques" 
          icon={<FileText className="h-6 w-6 text-blue-500" />} 
          to="/reports/generate?type=custom" 
        />
      </div>

      <motion.div
        className="card p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-title font-semibold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          Rapports sauvegardés
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white/60 font-medium">Nom du rapport</th>
                <th className="text-left py-3 px-4 text-white/60 font-medium">Type</th>
                <th className="text-left py-3 px-4 text-white/60 font-medium">Date de création</th>
                <th className="text-right py-3 px-4 text-white/60 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5 hover:bg-background-light/20 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-medium text-white">Rapport qualité T1 2025</div>
                  <div className="text-white/60 text-xs">Toutes les fermes</div>
                </td>
                <td className="py-3 px-4 text-white/80">
                  Rapport de qualité
                </td>
                <td className="py-3 px-4 text-white/80">
                  15/04/2025
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="sm">
                      Voir
                    </Button>
                    <Button variant="ghost" size="sm">
                      Télécharger
                    </Button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-background-light/20 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-medium text-white">Comparaison fermes 2025</div>
                  <div className="text-white/60 text-xs">Fermes Provence et Aquitaine</div>
                </td>
                <td className="py-3 px-4 text-white/80">
                  Rapport de performance
                </td>
                <td className="py-3 px-4 text-white/80">
                  10/04/2025
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="sm">
                      Voir
                    </Button>
                    <Button variant="ghost" size="sm">
                      Télécharger
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-center">
          <Link to="/reports/saved">
            <Button variant="link" className="text-accent-primary hover:text-accent-secondary transition-colors">
              Voir tous les rapports sauvegardés
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-title font-semibold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          Exportation de données
        </h2>
        
        <p className="text-white/70 mb-4">
          Exportez vos données brutes dans différents formats pour une analyse externe ou une sauvegarde.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            icon={<Download className="h-4 w-4 mr-2" />}
            className="justify-center"
            href="/reports/export?format=csv"
          >
            Exporter en CSV
          </Button>
          <Button 
            variant="outline" 
            icon={<Download className="h-4 w-4 mr-2" />}
            className="justify-center"
            href="/reports/export?format=excel"
          >
            Exporter en Excel
          </Button>
          <Button 
            variant="outline" 
            icon={<Download className="h-4 w-4 mr-2" />}
            className="justify-center"
            href="/reports/export?format=json"
          >
            Exporter en JSON
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportsPage;

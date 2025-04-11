import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { Calendar, Filter, Download } from 'lucide-react';
import AccuracyChart from '../components/AccuracyChart';
import CategoryDistribution from '../components/CategoryDistribution';
import RecentImagesTable from '../components/RecentImagesTable';

const DashboardPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [dateRange, setDateRange] = useState('week');

  // Données fictives pour les graphiques
  const accuracyData = [
    { name: 'Lun', accuracy: 92 },
    { name: 'Mar', accuracy: 94 },
    { name: 'Mer', accuracy: 93 },
    { name: 'Jeu', accuracy: 95 },
    { name: 'Ven', accuracy: 97 },
    { name: 'Sam', accuracy: 96 },
    { name: 'Dim', accuracy: 98 },
  ];

  const categoryData = [
    { name: 'Bonne qualité', value: 45, color: '#50c878' },
    { name: 'Non mûre', value: 20, color: '#ffd700' },
    { name: 'Tachetée', value: 15, color: '#ff7f50' },
    { name: 'Fissurée', value: 10, color: '#ff4500' },
    { name: 'Meurtrie', value: 7, color: '#9932cc' },
    { name: 'Pourrie', value: 3, color: '#8b0000' },
  ];

  const recentImages = [
    { id: 1, thumbnail: 'https://via.placeholder.com/80x80?text=Prune+1', category: 'Bonne qualité', confidence: 98, date: '10/04/2025' },
    { id: 2, thumbnail: 'https://via.placeholder.com/80x80?text=Prune+2', category: 'Non mûre', confidence: 95, date: '10/04/2025' },
    { id: 3, thumbnail: 'https://via.placeholder.com/80x80?text=Prune+3', category: 'Tachetée', confidence: 92, date: '09/04/2025' },
    { id: 4, thumbnail: 'https://via.placeholder.com/80x80?text=Prune+4', category: 'Fissurée', confidence: 97, date: '09/04/2025' },
    { id: 5, thumbnail: 'https://via.placeholder.com/80x80?text=Prune+5', category: 'Meurtrie', confidence: 91, date: '08/04/2025' },
    { id: 6, thumbnail: 'https://via.placeholder.com/80x80?text=Prune+6', category: 'Pourrie', confidence: 99, date: '08/04/2025' },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gradient-start to-gradient-end">
      <Navbar />
      
      <motion.div 
        className="container mx-auto pt-28 pb-16 px-4 md:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between mb-8"
          variants={itemVariants}
        >
          <h1 className="text-3xl md:text-4xl font-title font-bold mb-4 md:mb-0">Dashboard</h1>
          
          <div className="flex space-x-4">
            <div className="relative">
              <select 
                className="bg-background-card border border-white/20 text-white rounded-md px-4 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-accent-gold"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="day">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="year">Cette année</option>
              </select>
              <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70 pointer-events-none" />
            </div>
            
            <button className="bg-background-card border border-white/20 text-white rounded-md px-4 py-2 flex items-center hover:bg-background-light transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </button>
          </div>
        </motion.div>
        
        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div 
            className="card"
            variants={itemVariants}
          >
            <h2 className="text-xl font-title font-semibold mb-4">Évolution de la précision</h2>
            <AccuracyChart data={accuracyData} />
          </motion.div>
          
          <motion.div 
            className="card"
            variants={itemVariants}
          >
            <h2 className="text-xl font-title font-semibold mb-4">Répartition par catégorie</h2>
            <CategoryDistribution data={categoryData} />
          </motion.div>
        </div>
        
        {/* Tableau des dernières images */}
        <motion.div 
          className="card"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <h2 className="text-xl font-title font-semibold mb-4 md:mb-0">Dernières images traitées</h2>
            
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-white/70 mr-2" />
              <span className="text-white/70 mr-2">Filtrer:</span>
            </div>
          </div>
          
          <RecentImagesTable 
            images={recentImages} 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
          />
        </motion.div>
      </motion.div>
      
      {/* Footer */}
      <footer className="py-8 px-4 md:px-8 lg:px-16 bg-background-DEFAULT">
        <div className="container mx-auto text-center">
          <p className="text-white/60">© 2025 TriPrune - Projet JCIA Hackathon</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;

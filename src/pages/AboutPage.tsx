import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { Github, ExternalLink, Code, Database, Award } from 'lucide-react';

const AboutPage: React.FC = () => {
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
        <motion.h1 
          className="text-3xl md:text-4xl font-title font-bold text-center mb-8"
          variants={itemVariants}
        >
          À propos du projet
        </motion.h1>
        
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="card mb-8"
            variants={itemVariants}
          >
            <h2 className="text-xl font-title font-semibold mb-4">Le Hackathon JCIA 2025</h2>
            <p className="text-white/80 mb-4">
              Ce projet a été développé dans le cadre de la Journée Internationale de l'Intelligence Artificielle (JCIA), 
              organisée au Cameroun du 22 au 24 avril 2025. Le hackathon national est ouvert à tous les étudiants 
              passionnés d'intelligence artificielle et de machine learning.
            </p>
            <p className="text-white/80 mb-4">
              L'événement s'inscrit dans le thème « Intelligence Artificielle et Développement Économique : 
              Innover pour transformer », avec pour objectif de mettre en avant des solutions innovantes 
              capables de résoudre des problématiques réelles.
            </p>
            <div className="flex items-center space-x-2 text-accent-gold">
              <Award className="h-5 w-5" />
              <span className="font-medium">Date limite de soumission : 17 avril 2025 à 23H</span>
            </div>
          </motion.div>
          
          <motion.div 
            className="card mb-8"
            variants={itemVariants}
          >
            <h2 className="text-xl font-title font-semibold mb-4">Le projet de tri automatique des prunes</h2>
            <p className="text-white/80 mb-4">
              Le projet central de ce hackathon repose sur le tri automatique des prunes en six catégories 
              (de bonne qualité, non mûre, tachetée, fissurée, meurtrie et pourrie), à l'aide de techniques 
              avancées de vision par ordinateur et d'apprentissage profond.
            </p>
            <p className="text-white/80 mb-4">
              Le défi principal consiste à concevoir un modèle d'intelligence artificielle atteignant la 
              meilleure précision (accuracy) possible pour la classification des images des prunes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-background-DEFAULT p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center">
                  <Code className="h-5 w-5 mr-2 text-accent-gold" />
                  Technologies utilisées
                </h3>
                <ul className="space-y-2 text-white/80">
                  <li>• React avec TypeScript</li>
                  <li>• Tailwind CSS pour le styling</li>
                  <li>• Framer Motion pour les animations</li>
                  <li>• Recharts pour les visualisations</li>
                  <li>• React Router pour la navigation</li>
                </ul>
              </div>
              <div className="bg-background-DEFAULT p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center">
                  <Database className="h-5 w-5 mr-2 text-accent-gold" />
                  Données et modèle
                </h3>
                <ul className="space-y-2 text-white/80">
                  <li>• Dataset: African Plums Dataset (Kaggle)</li>
                  <li>• Classification en 6 catégories</li>
                  <li>• Techniques de vision par ordinateur</li>
                  <li>• Apprentissage profond (CNN)</li>
                  <li>• Visualisation Grad-CAM pour l'explicabilité</li>
                </ul>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="card mb-8"
            variants={itemVariants}
          >
            <h2 className="text-xl font-title font-semibold mb-4">Ressources et liens</h2>
            <div className="space-y-4">
              <a 
                href="https://github.com/username/plum-sorter" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-background-DEFAULT rounded-lg hover:bg-background-light transition-colors"
              >
                <Github className="h-6 w-6 mr-3 text-accent-gold" />
                <div>
                  <h3 className="font-medium">Code source</h3>
                  <p className="text-white/70 text-sm">Accéder au repository GitHub du projet</p>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto text-white/50" />
              </a>
              
              <a 
                href="https://www.kaggle.com/datasets/african-plums" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-background-DEFAULT rounded-lg hover:bg-background-light transition-colors"
              >
                <Database className="h-6 w-6 mr-3 text-accent-gold" />
                <div>
                  <h3 className="font-medium">Dataset</h3>
                  <p className="text-white/70 text-sm">African Plums Dataset sur Kaggle</p>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto text-white/50" />
              </a>
              
              <a 
                href="https://forms.gle/Ufce6tWdij58V8Pi7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-background-DEFAULT rounded-lg hover:bg-background-light transition-colors"
              >
                <Award className="h-6 w-6 mr-3 text-accent-gold" />
                <div>
                  <h3 className="font-medium">Formulaire d'inscription</h3>
                  <p className="text-white/70 text-sm">S'inscrire au hackathon JCIA 2025</p>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto text-white/50" />
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            className="card"
            variants={itemVariants}
          >
            <h2 className="text-xl font-title font-semibold mb-4">Contact et crédits</h2>
            <p className="text-white/80 mb-6">
              Ce projet a été développé par l'équipe TriPrune pour le hackathon JCIA 2025. 
              Pour toute question ou suggestion, n'hésitez pas à nous contacter.
            </p>
            
            <div className="bg-background-DEFAULT p-4 rounded-lg">
              <h3 className="font-medium mb-2">Équipe TriPrune</h3>
              <ul className="space-y-2 text-white/80">
                <li>• Chef d'équipe: [Nom du chef d'équipe]</li>
                <li>• Développeur Frontend: [Nom du développeur frontend]</li>
                <li>• Développeur Backend: [Nom du développeur backend]</li>
                <li>• Data Scientist: [Nom du data scientist]</li>
                <li>• Designer UX/UI: [Nom du designer]</li>
              </ul>
            </div>
          </motion.div>
        </div>
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

export default AboutPage;

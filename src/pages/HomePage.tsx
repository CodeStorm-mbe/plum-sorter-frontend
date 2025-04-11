import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight, Upload, BarChart2, Info } from 'lucide-react';

const HomePage: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gradient-start to-gradient-end">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        className="pt-28 pb-16 px-4 md:px-8 lg:px-16 container mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div className="md:w-1/2" variants={itemVariants}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-title font-bold text-white leading-tight mb-4">
              Tri automatique des prunes
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8">
              Une solution innovante utilisant l'intelligence artificielle pour classifier les prunes en six catégories distinctes avec une précision exceptionnelle.
            </p>
            <Link to="/prediction" className="btn-primary inline-flex items-center">
              Tester maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
          
          <motion.div className="md:w-1/2 flex justify-center" variants={itemVariants}>
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-accent-emerald rounded-full blur-3xl opacity-20"></div>
              <img 
                src="/plum-3d.png" 
                alt="Illustration 3D de prune" 
                className="relative z-10 w-full h-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/500x500?text=Prune+3D";
                }}
              />
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* How it works section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-background-light bg-opacity-30">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-title font-bold mb-4">Comment ça marche</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Notre système utilise des algorithmes avancés de vision par ordinateur pour analyser et classifier les prunes avec une grande précision.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Upload className="h-10 w-10 text-accent-gold" />,
                title: "Upload",
                description: "Téléchargez simplement une image de prune via notre interface intuitive."
              },
              {
                icon: <BarChart2 className="h-10 w-10 text-accent-emerald" />,
                title: "Prédiction",
                description: "Notre modèle d'IA analyse l'image et détermine la catégorie de la prune."
              },
              {
                icon: <Info className="h-10 w-10 text-accent-gold" />,
                title: "Résultat",
                description: "Obtenez instantanément le résultat avec le score de confiance et une explication visuelle."
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="card flex flex-col items-center text-center p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="mb-4 p-4 bg-background-DEFAULT rounded-full">
                  {step.icon}
                </div>
                <h3 className="text-xl font-title font-bold mb-2">{step.title}</h3>
                <p className="text-white/80">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Statistics Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 container mx-auto">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {[
            { label: "Images traitées", value: "10,000+" },
            { label: "Précision globale", value: "97.8%" },
            { label: "Catégories", value: "6" },
            { label: "Temps de traitement", value: "<1s" }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              className="card text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <h3 className="text-4xl font-title font-bold text-accent-gold mb-2">{stat.value}</h3>
              <p className="text-white/80">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 md:px-8 lg:px-16 bg-background-DEFAULT">
        <div className="container mx-auto text-center">
          <p className="text-white/60">© 2025 TriPrune - Projet JCIA Hackathon</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

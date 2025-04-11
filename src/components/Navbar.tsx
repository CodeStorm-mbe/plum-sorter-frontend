import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Grape } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background-DEFAULT bg-opacity-90 backdrop-blur-sm shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Grape className="h-8 w-8 text-accent-gold" />
          <span className="text-xl font-title font-bold">TriPrune</span>
        </Link>
        
        <div className="hidden md:flex space-x-8">
          {[
            { path: '/', label: 'Accueil' },
            { path: '/prediction', label: 'Prédiction' },
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/about', label: 'À propos' }
          ].map(({ path, label }) => (
            <Link 
              key={path} 
              to={path} 
              className="relative"
            >
              <span className={`font-medium ${isActive(path) ? 'text-accent-emerald' : 'text-white hover:text-accent-gold'} transition-colors`}>
                {label}
              </span>
              {isActive(path) && (
                <motion.div 
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-emerald"
                  layoutId="navbar-indicator"
                />
              )}
            </Link>
          ))}
        </div>
        
        <div className="md:hidden">
          {/* Menu mobile à implémenter si nécessaire */}
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

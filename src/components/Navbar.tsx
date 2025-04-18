import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRole } from '../contexts/RoleContext';
import { Menu, X, ChevronDown, User, Settings, LogOut, Home, BarChart2, Layers, Image, Users, Database, Server, Info } from 'lucide-react';
import Button from './Button';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { menuItems, isAdmin, isTechnician, isFarmer } = useRole();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Gérer le défilement pour changer l'apparence de la navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Gérer la déconnexion
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Obtenir l'icône correspondant au nom
  const getIcon = (iconName: string, className: string = 'h-5 w-5') => {
    switch (iconName) {
      case 'dashboard':
        return <Home className={className} />;
      case 'user':
        return <User className={className} />;
      case 'settings':
        return <Settings className={className} />;
      case 'farm':
        return <Layers className={className} />;
      case 'batch':
        return <Database className={className} />;
      case 'classification':
        return <Image className={className} />;
      case 'chart':
        return <BarChart2 className={className} />;
      case 'users':
        return <Users className={className} />;
      case 'model':
        return <Database className={className} />;
      case 'system':
        return <Server className={className} />;
      default:
        return <Home className={className} />;
    }
  };

  // Déterminer le lien du dashboard en fonction du rôle
  const getDashboardLink = () => {
    if (isAdmin) return '/admin-dashboard';
    if (isTechnician) return '/technician-dashboard';
    if (isFarmer) return '/farmer-dashboard';
    return '/dashboard';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to={user ? getDashboardLink() : '/'} className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-2xl font-title font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                TriPrune
              </span>
            </motion.div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {/* Menu items basés sur le rôle */}
                {menuItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className="text-white/80 hover:text-white transition-colors flex items-center"
                    >
                      {getIcon(item.icon, 'h-4 w-4 mr-2')}
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Menu profil */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <button
                    className="flex items-center text-white/80 hover:text-white transition-colors"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center mr-2">
                      <User className="h-4 w-4 text-accent-primary" />
                    </div>
                    <span>{user.name || user.email}</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-background-light/90 backdrop-blur-md rounded-md shadow-lg py-1 z-50 border border-white/10">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-white/80 hover:bg-white/10 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Profil
                        </div>
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-white/80 hover:bg-white/10 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Paramètres
                        </div>
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 transition-colors"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          handleLogout();
                        }}
                      >
                        <div className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          Déconnexion
                        </div>
                      </button>
                    </div>
                  )}
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Link to="/about" className="text-white/80 hover:text-white transition-colors">
                    À propos
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Button variant="outline" size="sm" href="/login">
                    Connexion
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Button variant="primary" size="sm" href="/register">
                    Inscription
                  </Button>
                </motion.div>
              </>
            )}
          </nav>

          {/* Menu burger - Mobile */}
          <div className="md:hidden">
            <button
              className="text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden bg-background-light/90 backdrop-blur-md border-t border-white/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-4">
            {user ? (
              <>
                <div className="flex items-center mb-4 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-accent-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{user.name || user.email}</p>
                    <p className="text-white/60 text-sm">{user.role}</p>
                  </div>
                </div>

                <nav className="space-y-3">
                  {menuItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className="flex items-center text-white/80 hover:text-white py-2 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {getIcon(item.icon, 'h-5 w-5 mr-3')}
                      {item.label}
                    </Link>
                  ))}

                  <div className="pt-4 mt-4 border-t border-white/10">
                    <Link
                      to="/profile"
                      className="flex items-center text-white/80 hover:text-white py-2 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5 mr-3" />
                      Profil
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center text-white/80 hover:text-white py-2 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-5 w-5 mr-3" />
                      Paramètres
                    </Link>
                    <button
                      className="flex items-center text-white/80 hover:text-white py-2 transition-colors w-full text-left"
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Déconnexion
                    </button>
                  </div>
                </nav>
              </>
            ) : (
              <nav className="space-y-3">
                <Link
                  to="/"
                  className="flex items-center text-white/80 hover:text-white py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="h-5 w-5 mr-3" />
                  Accueil
                </Link>
                <Link
                  to="/about"
                  className="flex items-center text-white/80 hover:text-white py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Info className="h-5 w-5 mr-3" />
                  À propos
                </Link>
                <div className="pt-4 mt-4 border-t border-white/10 flex flex-col space-y-3">
                  <Button
                    variant="outline"
                    size="md"
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full"
                  >
                    Connexion
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full"
                  >
                    Inscription
                  </Button>
                </div>
              </nav>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;

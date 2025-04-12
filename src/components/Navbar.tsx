"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Grape, Menu, X, Home, Activity, BarChart2, Info, LogIn, UserPlus, LogOut, User } from "lucide-react"
import Button from "./Button"
import { useAuth } from "../contexts/AuthContext"

const Navbar: React.FC = () => {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()

  // Check if the page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => {
    return location.pathname === path
  }

  // Définir les liens de navigation en fonction de l'état d'authentification
  const navLinks = [
    { path: "/", label: "Accueil", icon: <Home className="h-4 w-4" />, requiresAuth: false },
    { path: "/prediction", label: "Prédiction", icon: <Activity className="h-4 w-4" />, requiresAuth: true },
    { path: "/dashboard", label: "Dashboard", icon: <BarChart2 className="h-4 w-4" />, requiresAuth: true },
    { path: "/about", label: "À propos", icon: <Info className="h-4 w-4" />, requiresAuth: false },
  ]

  // Filtrer les liens en fonction de l'état d'authentification
  const filteredNavLinks = navLinks.filter((link) => !link.requiresAuth || isAuthenticated)

  const handleLogout = () => {
    logout()
    setIsProfileMenuOpen(false)
    setIsMobileMenuOpen(false)
  }

  return (
      <motion.nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
              isScrolled ? "bg-background/80 backdrop-blur-md" : "bg-transparent"
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="relative">
              <Grape className="h-8 w-8 text-accent-primary relative z-10" />
              <motion.div
                  className="absolute inset-0 bg-accent-primary rounded-full opacity-20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.div>
            <div className="flex flex-col">
            <span className="text-xl font-title font-bold bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary bg-clip-text text-transparent animate-text-shimmer bg-[length:200%]">
              TriPrune
            </span>
              <span className="text-xs text-white/60 font-light">IA Futuriste</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center">
            <div className="flex space-x-8 mr-8">
              {filteredNavLinks.map(({ path, label, icon }) => (
                  <Link key={path} to={path} className="relative group">
                    <div className="flex items-center space-x-2">
                      <motion.span
                          className={`font-medium transition-colors flex items-center ${
                              isActive(path) ? "text-accent-primary" : "text-white/70 group-hover:text-white"
                          }`}
                          whileHover={{ y: -2 }}
                          transition={{ type: "spring", stiffness: 300 }}
                      >
                        <span className="mr-1">{icon}</span>
                        {label}
                      </motion.span>
                    </div>
                    {isActive(path) && (
                        <motion.div
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary"
                            layoutId="navbar-indicator"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                  </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex space-x-3">
              {isAuthenticated ? (
                  <div className="relative">
                    <Button
                        variant="outline"
                        size="sm"
                        icon={<User className="h-4 w-4" />}
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    >
                      {user?.name.split(" ")[0] || "Profil"}
                    </Button>

                    {/* Profile Dropdown Menu */}
                    <AnimatePresence>
                      {isProfileMenuOpen && (
                          <motion.div
                              className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background-light border border-white/10 overflow-hidden z-50"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                          >
                            <div className="py-1">
                              <Link
                                  to="/profile"
                                  className="block px-4 py-2 text-sm text-white hover:bg-background-light/50 transition-colors"
                                  onClick={() => setIsProfileMenuOpen(false)}
                              >
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-2 text-accent-primary" />
                                  Mon profil
                                </div>
                              </Link>
                              <button
                                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-background-light/50 transition-colors"
                                  onClick={handleLogout}
                              >
                                <div className="flex items-center">
                                  <LogOut className="h-4 w-4 mr-2 text-accent-tertiary" />
                                  Déconnexion
                                </div>
                              </button>
                            </div>
                          </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
              ) : (
                  <>
                    <Link to="/login">
                      <Button
                          variant="outline"
                          size="sm"
                          icon={<LogIn className="h-4 w-4" />}
                          className={isActive("/login") ? "border-accent-primary text-accent-primary" : ""}
                      >
                        Connexion
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button
                          variant="primary"
                          size="sm"
                          icon={<UserPlus className="h-4 w-4" />}
                          className={isActive("/register") ? "bg-accent-secondary" : ""}
                      >
                        Inscription
                      </Button>
                    </Link>
                  </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
              className="md:hidden text-white p-2 rounded-full bg-background-light/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-accent-primary" />
            ) : (
                <Menu className="h-6 w-6 text-accent-primary" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
              <motion.div
                  className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-md pt-20"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.3 }}
              >
                <div className="container mx-auto px-4 py-8 flex flex-col space-y-6">
                  {filteredNavLinks.map(({ path, label, icon }, index) => (
                      <motion.div
                          key={path}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                      >
                        <Link
                            to={path}
                            className={`flex items-center space-x-4 p-4 rounded-lg ${
                                isActive(path)
                                    ? "bg-background-light text-accent-primary"
                                    : "text-white/70 hover:bg-background-light/50"
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="p-2 rounded-full bg-background-light/50">{icon}</div>
                          <span className="font-medium">{label}</span>
                          {isActive(path) && (
                              <motion.div
                                  className="ml-auto h-2 w-2 rounded-full bg-accent-primary"
                                  layoutId="mobile-indicator"
                              />
                          )}
                        </Link>
                      </motion.div>
                  ))}

                  {/* Mobile Auth Buttons */}
                  <div className="border-t border-white/10 pt-6 mt-4 space-y-4">
                    {isAuthenticated ? (
                        <>
                          <Link
                              to="/profile"
                              className="flex items-center space-x-4 p-4 rounded-lg text-white/70 hover:bg-background-light/50"
                              onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="p-2 rounded-full bg-background-light/50">
                              <User className="h-4 w-4 text-accent-primary" />
                            </div>
                            <span className="font-medium">Mon profil</span>
                          </Link>
                          <button
                              className="flex items-center space-x-4 p-4 rounded-lg text-white/70 hover:bg-background-light/50 w-full"
                              onClick={handleLogout}
                          >
                            <div className="p-2 rounded-full bg-background-light/50">
                              <LogOut className="h-4 w-4 text-accent-tertiary" />
                            </div>
                            <span className="font-medium">Déconnexion</span>
                          </button>
                        </>
                    ) : (
                        <>
                          <Link
                              to="/login"
                              className="flex items-center space-x-4 p-4 rounded-lg text-white/70 hover:bg-background-light/50"
                              onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="p-2 rounded-full bg-background-light/50">
                              <LogIn className="h-4 w-4 text-accent-primary" />
                            </div>
                            <span className="font-medium">Connexion</span>
                          </Link>

                          <Link
                              to="/register"
                              className="flex items-center space-x-4 p-4 rounded-lg text-white/70 hover:bg-background-light/50"
                              onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="p-2 rounded-full bg-background-light/50">
                              <UserPlus className="h-4 w-4 text-accent-secondary" />
                            </div>
                            <span className="font-medium">Inscription</span>
                          </Link>
                        </>
                    )}
                  </div>
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
  )
}

export default Navbar

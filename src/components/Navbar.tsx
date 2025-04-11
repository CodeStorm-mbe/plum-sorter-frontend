"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Grape, Menu, X, Home, Activity, BarChart2, Info } from "lucide-react"

const Navbar: React.FC = () => {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  const navLinks = [
    { path: "/", label: "Accueil", icon: <Home className="h-4 w-4" /> },
    { path: "/prediction", label: "Prédiction", icon: <Activity className="h-4 w-4" /> },
    { path: "/dashboard", label: "Dashboard", icon: <BarChart2 className="h-4 w-4" /> },
    { path: "/about", label: "À propos", icon: <Info className="h-4 w-4" /> },
  ]

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
          <div className="hidden md:flex space-x-8">
            {navLinks.map(({ path, label, icon }) => (
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
                  {navLinks.map(({ path, label, icon }, index) => (
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
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
  )
}

export default Navbar

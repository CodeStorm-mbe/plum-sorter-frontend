"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { User, Settings, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
// Importer le hook useLanguage
import { useLanguage } from "../contexts/LanguageContext"

// Ajouter l'utilisation du hook dans le composant UserMenu
const UserMenu: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth()
    const { t } = useLanguage()
    const [isOpen, setIsOpen] = useState(false)

    if (!isAuthenticated || !user) return null

    return (
        <div className="relative">
            <motion.button
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-background-light/50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
            >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                    <img
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <span className="hidden md:block text-sm font-medium">{user.name}</span>
                <ChevronDown className="h-4 w-4 text-white/70" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-background-light/90 backdrop-blur-md border border-white/10 z-50"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="py-2 px-4 border-b border-white/10">
                            <p className="text-sm font-medium text-white">{user.name}</p>
                            <p className="text-xs text-white/60">{user.email}</p>
                        </div>
                        <div className="py-1">
                            <Link
                                to="/profile"
                                className="flex items-center px-4 py-2 text-sm text-white/80 hover:bg-background-light hover:text-white transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <User className="h-4 w-4 mr-2 text-accent-primary" />
                                {t("nav.profile")}
                            </Link>
                            <Link
                                to="/settings"
                                className="flex items-center px-4 py-2 text-sm text-white/80 hover:bg-background-light hover:text-white transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Settings className="h-4 w-4 mr-2 text-accent-secondary" />
                                {t("nav.settings")}
                            </Link>
                        </div>
                        <div className="py-1 border-t border-white/10">
                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    logout()
                                }}
                                className="flex w-full items-center px-4 py-2 text-sm text-white/80 hover:bg-background-light hover:text-white transition-colors"
                            >
                                <LogOut className="h-4 w-4 mr-2 text-accent-tertiary" />
                                {t("nav.logout")}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default UserMenu

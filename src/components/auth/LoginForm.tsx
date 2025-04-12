"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { AtSign, Lock, LogIn, AlertCircle } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../Button"

// Importer le hook useLanguage
import { useLanguage } from "../../contexts/LanguageContext"

// Ajouter l'utilisation du hook dans le composant LoginForm
const LoginForm: React.FC = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login, isLoading, error, clearError } = useAuth()
    const { t } = useLanguage()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await login(email, password)
    }

    // Mettre à jour les textes pour utiliser les traductions
    return (
        <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="card">
                <h2 className="text-2xl font-title font-bold mb-6 text-center bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                    {t("auth.login.title")}
                </h2>

                {error && (
                    <motion.div
                        className="mb-6 p-3 bg-accent-tertiary/20 border border-accent-tertiary/30 rounded-md flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AlertCircle className="h-5 w-5 text-accent-tertiary mr-2" />
                        <p className="text-white/90 text-sm">{error}</p>
                        <button onClick={clearError} className="ml-auto text-white/50 hover:text-white" aria-label="Fermer">
                            &times;
                        </button>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-white/70">
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <AtSign className="h-5 w-5 text-white/40" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="block w-full pl-10 pr-3 py-2 bg-background-light/50 border border-white/10 rounded-md focus:ring-1 focus:ring-accent-primary focus:border-accent-primary text-white placeholder-white/30"
                                placeholder="votre@email.com"
                            />
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-[1px] bg-accent-primary/50"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: email ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-white/70">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-white/40" />
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="block w-full pl-10 pr-3 py-2 bg-background-light/50 border border-white/10 rounded-md focus:ring-1 focus:ring-accent-primary focus:border-accent-primary text-white placeholder-white/30"
                                placeholder="••••••••"
                            />
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-[1px] bg-accent-primary/50"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: password ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 bg-background-light border-white/30 rounded focus:ring-accent-primary"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-white/70">
                                Se souvenir de moi
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link
                                to="/forgot-password"
                                className="text-accent-primary hover:text-accent-primary/80 transition-colors"
                            >
                                Mot de passe oublié?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={isLoading}
                            icon={<LogIn className="h-5 w-5" />}
                            withGlow
                        >
                            {isLoading ? "Connexion en cours..." : "Se connecter"}
                        </Button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-white/60">
                        Pas encore de compte?{" "}
                        <Link to="/register" className="text-accent-primary hover:text-accent-primary/80 transition-colors">
                            S'inscrire
                        </Link>
                    </p>
                </div>

                {/* Démo info */}
                <motion.div
                    className="mt-6 p-3 bg-background-light/30 rounded-md text-sm text-white/70"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <p className="font-medium mb-1 text-accent-primary">Compte de démonstration:</p>
                    <p>Email: demo@triprune.com</p>
                    <p>Mot de passe: password</p>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default LoginForm

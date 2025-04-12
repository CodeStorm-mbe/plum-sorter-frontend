"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { AtSign, Lock, User, UserPlus, AlertCircle } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../Button"

const RegisterForm: React.FC = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const { register, isLoading, error, clearError } = useAuth()

    const validatePassword = () => {
        if (password !== confirmPassword) {
            setPasswordError("Les mots de passe ne correspondent pas")
            return false
        }
        if (password.length < 6) {
            setPasswordError("Le mot de passe doit contenir au moins 6 caractères")
            return false
        }
        setPasswordError(null)
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validatePassword()) {
            await register(name, email, password)
        }
    }

    return (
        <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="card">
                <h2 className="text-2xl font-title font-bold mb-6 text-center bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                    Créer un compte
                </h2>

                {(error || passwordError) && (
                    <motion.div
                        className="mb-6 p-3 bg-accent-tertiary/20 border border-accent-tertiary/30 rounded-md flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AlertCircle className="h-5 w-5 text-accent-tertiary mr-2" />
                        <p className="text-white/90 text-sm">{error || passwordError}</p>
                        <button onClick={clearError} className="ml-auto text-white/50 hover:text-white" aria-label="Fermer">
                            &times;
                        </button>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-white/70">
                            Nom complet
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-white/40" />
                            </div>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="block w-full pl-10 pr-3 py-2 bg-background-light/50 border border-white/10 rounded-md focus:ring-1 focus:ring-accent-primary focus:border-accent-primary text-white placeholder-white/30"
                                placeholder="Votre nom"
                            />
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-[1px] bg-accent-primary/50"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: name ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>

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

                    <div className="space-y-2">
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-white/70">
                            Confirmer le mot de passe
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-white/40" />
                            </div>
                            <input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="block w-full pl-10 pr-3 py-2 bg-background-light/50 border border-white/10 rounded-md focus:ring-1 focus:ring-accent-primary focus:border-accent-primary text-white placeholder-white/30"
                                placeholder="••••••••"
                            />
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-[1px] bg-accent-primary/50"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: confirmPassword ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                            className="h-4 w-4 bg-background-light border-white/30 rounded focus:ring-accent-primary"
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-white/70">
                            J'accepte les{" "}
                            <Link to="/terms" className="text-accent-primary hover:text-accent-primary/80 transition-colors">
                                conditions d'utilisation
                            </Link>
                        </label>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={isLoading}
                            icon={<UserPlus className="h-5 w-5" />}
                            withGlow
                        >
                            {isLoading ? "Création en cours..." : "Créer un compte"}
                        </Button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-white/60">
                        Déjà un compte?{" "}
                        <Link to="/login" className="text-accent-primary hover:text-accent-primary/80 transition-colors">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

export default RegisterForm

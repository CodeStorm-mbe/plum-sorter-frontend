"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react"
import Navbar from "../components/Navbar"
import Button from "../components/Button"
import FormInput from "../components/FormInput"
import FormCheckbox from "../components/FormCheckbox"
import PageTransition from "../components/PageTransition"
import { useAuth } from "../contexts/AuthContext"

const LoginPage: React.FC = () => {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    })

    const [errors, setErrors] = useState<{
        email?: string
        password?: string
        form?: string
    }>({})

    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))

        // Clear error when user types
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }))
        }
    }

    const validateForm = () => {
        const newErrors: {
            email?: string
            password?: string
        } = {}

        if (!formData.email) {
            newErrors.email = "L'email est requis"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Format d'email invalide"
        }

        if (!formData.password) {
            newErrors.password = "Le mot de passe est requis"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (validateForm()) {
            setIsLoading(true)

            try {
                await login(formData.email, formData.password)
                navigate("/") // Rediriger vers la page d'accueil après connexion
            } catch (error) {
                setErrors({
                    form: "Échec de la connexion. Veuillez vérifier vos identifiants.",
                })
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <PageTransition>
            <div className="min-h-screen">
                <Navbar />

                <div className="container mx-auto pt-28 pb-16 px-4 md:px-8">
                    <div className="max-w-md mx-auto">
                        <motion.div
                            className="card overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Header */}
                            <div className="text-center mb-8">
                                <motion.div
                                    className="inline-block p-3 rounded-full bg-accent-primary/20 mb-4"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <LogIn className="h-6 w-6 text-accent-primary" />
                                </motion.div>

                                <h1 className="text-2xl font-title font-bold mb-2 bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                                    Connexion
                                </h1>

                                <p className="text-white/60">Accédez à votre compte TriPrune</p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit}>
                                {errors.form && (
                                    <motion.div
                                        className="mb-4 p-3 bg-accent-tertiary/20 border border-accent-tertiary/30 rounded-md text-white"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        {errors.form}
                                    </motion.div>
                                )}

                                <FormInput
                                    id="email"
                                    name="email"
                                    label="Email"
                                    type="email"
                                    placeholder="votre@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    error={errors.email}
                                    icon={<Mail className="h-4 w-4" />}
                                    autoComplete="email"
                                />

                                <FormInput
                                    id="password"
                                    name="password"
                                    label="Mot de passe"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    error={errors.password}
                                    icon={<Lock className="h-4 w-4" />}
                                    autoComplete="current-password"
                                />

                                <div className="flex items-center justify-between mb-6">
                                    <FormCheckbox
                                        id="rememberMe"
                                        name="rememberMe"
                                        label="Se souvenir de moi"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                    />

                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-accent-primary hover:text-accent-primary/80 transition-colors"
                                    >
                                        Mot de passe oublié?
                                    </Link>
                                </div>

                                <Button type="submit" variant="primary" className="w-full mb-4" withGlow disabled={isLoading}>
                                    {isLoading ? "Connexion en cours..." : "Se connecter"}
                                </Button>

                                <div className="text-center">
                                    <p className="text-white/60 text-sm">
                                        Vous n'avez pas de compte?{" "}
                                        <Link
                                            to="/register"
                                            className="text-accent-primary hover:text-accent-primary/80 transition-colors inline-flex items-center"
                                        >
                                            S'inscrire
                                            <ArrowRight className="h-3 w-3 ml-1" />
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="py-8 px-4 md:px-8 lg:px-16 bg-background-light/50 backdrop-blur-md border-t border-white/5">
                    <div className="container mx-auto text-center">
                        <p className="text-white/60">© 2025 TriPrune - Projet JCIA Hackathon</p>
                    </div>
                </footer>
            </div>
        </PageTransition>
    )
}

export default LoginPage

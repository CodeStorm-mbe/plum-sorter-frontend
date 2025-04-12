"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Mail, Lock, User, ArrowLeft, UserPlus } from "lucide-react"
import Navbar from "../components/Navbar"
import Button from "../components/Button"
import FormInput from "../components/FormInput"
import FormCheckbox from "../components/FormCheckbox"
import PageTransition from "../components/PageTransition"
import { useAuth } from "../contexts/AuthContext"

const RegisterPage: React.FC = () => {
    const navigate = useNavigate()
    const { register } = useAuth()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
    })

    const [errors, setErrors] = useState<{
        name?: string
        email?: string
        password?: string
        confirmPassword?: string
        agreeTerms?: string
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
            name?: string
            email?: string
            password?: string
            confirmPassword?: string
            agreeTerms?: string
        } = {}

        if (!formData.name.trim()) {
            newErrors.name = "Le nom est requis"
        }

        if (!formData.email) {
            newErrors.email = "L'email est requis"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Format d'email invalide"
        }

        if (!formData.password) {
            newErrors.password = "Le mot de passe est requis"
        } else if (formData.password.length < 8) {
            newErrors.password = "Le mot de passe doit contenir au moins 8 caractères"
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
        }

        if (!formData.agreeTerms) {
            newErrors.agreeTerms = "Vous devez accepter les conditions d'utilisation"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (validateForm()) {
            setIsLoading(true)

            try {
                await register(formData.name, formData.email, formData.password)
                navigate("/") // Rediriger vers la page d'accueil après inscription
            } catch (error) {
                setErrors({
                    form: "Échec de l'inscription. Veuillez réessayer.",
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
                                    className="inline-block p-3 rounded-full bg-accent-secondary/20 mb-4"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <UserPlus className="h-6 w-6 text-accent-secondary" />
                                </motion.div>

                                <h1 className="text-2xl font-title font-bold mb-2 bg-gradient-to-r from-accent-secondary to-accent-tertiary bg-clip-text text-transparent">
                                    Créer un compte
                                </h1>

                                <p className="text-white/60">Rejoignez la communauté TriPrune</p>
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
                                    id="name"
                                    name="name"
                                    label="Nom complet"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    error={errors.name}
                                    icon={<User className="h-4 w-4" />}
                                    autoComplete="name"
                                />

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
                                    autoComplete="new-password"
                                />

                                <FormInput
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    label="Confirmer le mot de passe"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    error={errors.confirmPassword}
                                    icon={<Lock className="h-4 w-4" />}
                                    autoComplete="new-password"
                                />

                                <FormCheckbox
                                    id="agreeTerms"
                                    name="agreeTerms"
                                    label={
                                        <span>
                      J'accepte les{" "}
                                            <Link to="/terms" className="text-accent-secondary hover:underline">
                        conditions d'utilisation
                      </Link>
                    </span>
                                    }
                                    checked={formData.agreeTerms}
                                    onChange={handleChange}
                                    required
                                />

                                {errors.agreeTerms && <p className="mt-1 mb-4 text-sm text-accent-tertiary">{errors.agreeTerms}</p>}

                                <Button type="submit" variant="secondary" className="w-full mb-4" withGlow disabled={isLoading}>
                                    {isLoading ? "Inscription en cours..." : "S'inscrire"}
                                </Button>

                                <div className="text-center">
                                    <p className="text-white/60 text-sm">
                                        Vous avez déjà un compte?{" "}
                                        <Link
                                            to="/login"
                                            className="text-accent-secondary hover:text-accent-secondary/80 transition-colors inline-flex items-center"
                                        >
                                            <ArrowLeft className="h-3 w-3 mr-1" />
                                            Se connecter
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

export default RegisterPage

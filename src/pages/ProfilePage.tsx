"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { User, Mail, Lock, Save, AlertCircle } from "lucide-react"
import Navbar from "../components/Navbar"
import Button from "../components/Button"
import FormInput from "../components/FormInput"
import PageTransition from "../components/PageTransition"
import AnimatedCard from "../components/AnimatedCard"
import { useAuth } from "../contexts/AuthContext"

const ProfilePage: React.FC = () => {
    const { user, updateProfile, updatePassword } = useAuth()

    // État pour les informations du profil
    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        email: user?.email || "",
    })

    // État pour le changement de mot de passe
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    // États pour les erreurs et les messages de succès
    const [profileErrors, setProfileErrors] = useState<{ name?: string; email?: string }>({})
    const [passwordErrors, setPasswordErrors] = useState<{
        currentPassword?: string
        newPassword?: string
        confirmPassword?: string
    }>({})
    const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)

    // États pour les chargements
    const [isProfileLoading, setIsProfileLoading] = useState(false)
    const [isPasswordLoading, setIsPasswordLoading] = useState(false)

    // Gestionnaire de changement pour les champs du profil
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Effacer l'erreur lorsque l'utilisateur tape
        if (profileErrors[name as keyof typeof profileErrors]) {
            setProfileErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }))
        }

        // Effacer le message de succès
        if (profileSuccess) {
            setProfileSuccess(null)
        }
    }

    // Gestionnaire de changement pour les champs de mot de passe
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Effacer l'erreur lorsque l'utilisateur tape
        if (passwordErrors[name as keyof typeof passwordErrors]) {
            setPasswordErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }))
        }

        // Effacer le message de succès
        if (passwordSuccess) {
            setPasswordSuccess(null)
        }
    }

    // Validation du formulaire de profil
    const validateProfileForm = () => {
        const newErrors: { name?: string; email?: string } = {}

        if (!profileData.name.trim()) {
            newErrors.name = "Le nom est requis"
        }

        if (!profileData.email) {
            newErrors.email = "L'email est requis"
        } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
            newErrors.email = "Format d'email invalide"
        }

        setProfileErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Validation du formulaire de mot de passe
    const validatePasswordForm = () => {
        const newErrors: {
            currentPassword?: string
            newPassword?: string
            confirmPassword?: string
        } = {}

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = "Le mot de passe actuel est requis"
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = "Le nouveau mot de passe est requis"
        } else if (passwordData.newPassword.length < 8) {
            newErrors.newPassword = "Le mot de passe doit contenir au moins 8 caractères"
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
        }

        setPasswordErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Soumission du formulaire de profil
    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (validateProfileForm()) {
            setIsProfileLoading(true)

            try {
                await updateProfile({
                    name: profileData.name,
                    email: profileData.email,
                })
                setProfileSuccess("Profil mis à jour avec succès")
            } catch (error) {
                setProfileErrors({
                    name: "Erreur lors de la mise à jour du profil",
                })
            } finally {
                setIsProfileLoading(false)
            }
        }
    }

    // Soumission du formulaire de mot de passe
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (validatePasswordForm()) {
            setIsPasswordLoading(true)

            try {
                await updatePassword(passwordData.currentPassword, passwordData.newPassword)
                setPasswordSuccess("Mot de passe mis à jour avec succès")
                // Réinitialiser les champs de mot de passe
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                })
            } catch (error) {
                setPasswordErrors({
                    currentPassword: "Erreur lors de la mise à jour du mot de passe",
                })
            } finally {
                setIsPasswordLoading(false)
            }
        }
    }

    return (
        <PageTransition>
            <div className="min-h-screen">
                <Navbar />

                <div className="container mx-auto pt-28 pb-16 px-4 md:px-8">
                    <motion.h1
                        className="text-3xl md:text-4xl font-title font-bold text-center mb-2"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
            <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              Mon Profil
            </span>
                    </motion.h1>

                    <motion.p
                        className="text-center text-white/70 mb-8 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        Gérez vos informations personnelles et vos préférences
                    </motion.p>

                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Informations du profil */}
                            <AnimatedCard delay={0.1}>
                                <div className="flex items-center mb-6">
                                    <User className="h-5 w-5 text-accent-primary mr-2" />
                                    <h2 className="text-xl font-title font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                        Informations personnelles
                                    </h2>
                                </div>

                                <form onSubmit={handleProfileSubmit}>
                                    {profileSuccess && (
                                        <motion.div
                                            className="mb-4 p-3 bg-plum-good/20 border border-plum-good/30 rounded-md text-white"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <div className="flex items-center">
                                                <AlertCircle className="h-4 w-4 text-plum-good mr-2" />
                                                {profileSuccess}
                                            </div>
                                        </motion.div>
                                    )}

                                    <FormInput
                                        id="name"
                                        name="name"
                                        label="Nom complet"
                                        type="text"
                                        placeholder="John Doe"
                                        value={profileData.name}
                                        onChange={handleProfileChange}
                                        required
                                        error={profileErrors.name}
                                        icon={<User className="h-4 w-4" />}
                                    />

                                    <FormInput
                                        id="email"
                                        name="email"
                                        label="Email"
                                        type="email"
                                        placeholder="votre@email.com"
                                        value={profileData.email}
                                        onChange={handleProfileChange}
                                        required
                                        error={profileErrors.email}
                                        icon={<Mail className="h-4 w-4" />}
                                    />

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="mt-4"
                                        icon={<Save className="h-4 w-4" />}
                                        disabled={isProfileLoading}
                                    >
                                        {isProfileLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                                    </Button>
                                </form>
                            </AnimatedCard>

                            {/* Changement de mot de passe */}
                            <AnimatedCard delay={0.2}>
                                <div className="flex items-center mb-6">
                                    <Lock className="h-5 w-5 text-accent-secondary mr-2" />
                                    <h2 className="text-xl font-title font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                        Changer de mot de passe
                                    </h2>
                                </div>

                                <form onSubmit={handlePasswordSubmit}>
                                    {passwordSuccess && (
                                        <motion.div
                                            className="mb-4 p-3 bg-plum-good/20 border border-plum-good/30 rounded-md text-white"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <div className="flex items-center">
                                                <AlertCircle className="h-4 w-4 text-plum-good mr-2" />
                                                {passwordSuccess}
                                            </div>
                                        </motion.div>
                                    )}

                                    <FormInput
                                        id="currentPassword"
                                        name="currentPassword"
                                        label="Mot de passe actuel"
                                        type="password"
                                        placeholder="••••••••"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        error={passwordErrors.currentPassword}
                                        icon={<Lock className="h-4 w-4" />}
                                    />

                                    <FormInput
                                        id="newPassword"
                                        name="newPassword"
                                        label="Nouveau mot de passe"
                                        type="password"
                                        placeholder="••••••••"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        error={passwordErrors.newPassword}
                                        icon={<Lock className="h-4 w-4" />}
                                    />

                                    <FormInput
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        label="Confirmer le nouveau mot de passe"
                                        type="password"
                                        placeholder="••••••••"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        error={passwordErrors.confirmPassword}
                                        icon={<Lock className="h-4 w-4" />}
                                    />

                                    <Button
                                        type="submit"
                                        variant="secondary"
                                        className="mt-4"
                                        icon={<Save className="h-4 w-4" />}
                                        disabled={isPasswordLoading}
                                    >
                                        {isPasswordLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
                                    </Button>
                                </form>
                            </AnimatedCard>
                        </div>
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

export default ProfilePage

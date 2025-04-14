"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { User, Mail, Camera, Save, AlertCircle } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../Button"

const UserProfileForm: React.FC = () => {
    const { user, updateProfile, isLoading, error, clearError } = useAuth()
    const [name, setName] = useState(user?.name || "")
    const [email, setEmail] = useState(user?.email || "")
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        await updateProfile({ name, email })
        setSuccessMessage("Profil mis à jour avec succès")
        setTimeout(() => setSuccessMessage(null), 3000)
    }

    if (!user) return null

    return (
        <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="card">
                <h2 className="text-2xl font-title font-bold mb-6 bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                    Mon Profil
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

                {successMessage && (
                    <motion.div
                        className="mb-6 p-3 bg-plum-good/20 border border-plum-good/30 rounded-md flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AlertCircle className="h-5 w-5 text-plum-good mr-2" />
                        <p className="text-white/90 text-sm">{successMessage}</p>
                    </motion.div>
                )}

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3 flex flex-col items-center">
                        <div className="relative">
                            <motion.div
                                className="w-32 h-32 rounded-full overflow-hidden border-2 border-accent-primary/50 p-1 bg-background-light/30"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                    alt={user.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </motion.div>
                            <motion.button
                                className="absolute bottom-0 right-0 p-2 bg-accent-primary rounded-full text-background"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Camera className="h-4 w-4" />
                            </motion.button>
                        </div>

                        <div className="mt-4 text-center">
                            <h3 className="text-lg font-medium text-white">{user.name}</h3>
                            <p className="text-white/60">{user.email}</p>
                            <p className="text-accent-primary text-sm mt-1 capitalize">{user.role}</p>
                        </div>

                        <div className="mt-6 w-full">
                            <div className="card bg-background-light/30 p-4">
                                <h4 className="font-medium mb-3 text-white/80">Informations du compte</h4>
                                <div className="space-y-2 text-sm">
                                    <p className="text-white/60">
                                        <span className="text-white/80">Membre depuis:</span>{" "}
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date(user.date_joined).toLocaleDateString()}
                                    </p>
                                    <p className="text-white/60">
                                        <span className="text-white/80">Dernière connexion:</span> Aujourd'hui
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-2/3">
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                        <Mail className="h-5 w-5 text-white/40" />
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

                            <div>
                                <Button type="submit" variant="primary" disabled={isLoading} icon={<Save className="h-5 w-5" />}>
                                    {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default UserProfileForm

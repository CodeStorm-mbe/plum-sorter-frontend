"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Type pour l'utilisateur
export interface User {
    id: string
    name: string
    email: string
    // Vous pouvez ajouter d'autres propriétés selon vos besoins
}

// Type pour le contexte d'authentification
interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
    updateProfile: (data: Partial<User>) => Promise<void>
    updatePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
    }
    return context
}

// Provider du contexte d'authentification
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

    // Vérifier si l'utilisateur est déjà connecté au chargement
    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser)
                setUser(parsedUser)
                setIsAuthenticated(true)
            } catch (error) {
                console.error("Erreur lors de la récupération des données utilisateur:", error)
                localStorage.removeItem("user")
            }
        }
    }, [])

    // Fonction de connexion
    const login = async (email: string, password: string) => {
        // Dans une application réelle, vous feriez un appel API ici
        // Simulation d'une connexion réussie
        const mockUser: User = {
            id: "user-123",
            name: "Utilisateur Test",
            email: email,
        }

        // Stocker l'utilisateur dans le localStorage
        localStorage.setItem("user", JSON.stringify(mockUser))

        // Mettre à jour l'état
        setUser(mockUser)
        setIsAuthenticated(true)
    }

    // Fonction d'inscription
    const register = async (name: string, email: string, password: string) => {
        // Dans une application réelle, vous feriez un appel API ici
        // Simulation d'une inscription réussie
        const mockUser: User = {
            id: "user-" + Math.floor(Math.random() * 1000),
            name: name,
            email: email,
        }

        // Stocker l'utilisateur dans le localStorage
        localStorage.setItem("user", JSON.stringify(mockUser))

        // Mettre à jour l'état
        setUser(mockUser)
        setIsAuthenticated(true)
    }

    // Fonction de déconnexion
    const logout = () => {
        // Supprimer l'utilisateur du localStorage
        localStorage.removeItem("user")

        // Mettre à jour l'état
        setUser(null)
        setIsAuthenticated(false)
    }

    // Fonction de mise à jour du profil
    const updateProfile = async (data: Partial<User>) => {
        if (!user) return

        // Dans une application réelle, vous feriez un appel API ici
        // Simulation d'une mise à jour réussie
        const updatedUser = { ...user, ...data }

        // Mettre à jour le localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser))

        // Mettre à jour l'état
        setUser(updatedUser)
    }

    // Fonction de mise à jour du mot de passe
    const updatePassword = async (currentPassword: string, newPassword: string) => {
        // Dans une application réelle, vous feriez un appel API ici
        // Simulation d'une mise à jour réussie
        console.log("Mot de passe mis à jour avec succès")
        // Pas besoin de mettre à jour l'état ici car le mot de passe n'est pas stocké dans l'état
    }

    // Valeur du contexte
    const value = {
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

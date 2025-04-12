"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// Types pour les utilisateurs et l'authentification
export interface User {
    id: string
    email: string
    name: string
    role: "user" | "admin"
    avatar?: string
    createdAt: string
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
    updateProfile: (userData: Partial<User>) => Promise<void>
    error: string | null
    clearError: () => void
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

// Simulation d'une API d'authentification
const authAPI = {
    login: async (email: string, password: string): Promise<User> => {
        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Vérifier les identifiants (simulation)
        if (email === "demo@triprune.com" && password === "password") {
            return {
                id: "user-1",
                email: "demo@triprune.com",
                name: "Utilisateur Démo",
                role: "user",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
                createdAt: new Date().toISOString(),
            }
        }

        // Vérifier si l'utilisateur existe dans le localStorage
        const users = JSON.parse(localStorage.getItem("triprune_users") || "[]")
        const user = users.find((u: any) => u.email === email)

        if (user && user.password === password) {
            // Ne pas renvoyer le mot de passe
            const { password, ...userWithoutPassword } = user
            return userWithoutPassword
        }

        throw new Error("Identifiants invalides")
    },

    register: async (name: string, email: string, password: string): Promise<User> => {
        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Vérifier si l'email est déjà utilisé
        const users = JSON.parse(localStorage.getItem("triprune_users") || "[]")
        if (users.some((u: any) => u.email === email)) {
            throw new Error("Cet email est déjà utilisé")
        }

        // Créer un nouvel utilisateur
        const newUser = {
            id: `user-${Date.now()}`,
            email,
            name,
            password, // Dans une vraie application, le mot de passe serait haché
            role: "user" as const,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            createdAt: new Date().toISOString(),
        }

        // Sauvegarder l'utilisateur
        users.push(newUser)
        localStorage.setItem("triprune_users", JSON.stringify(users))

        // Ne pas renvoyer le mot de passe
        const { password: _, ...userWithoutPassword } = newUser
        return userWithoutPassword
    },

    updateProfile: async (userId: string, userData: Partial<User>): Promise<User> => {
        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mettre à jour l'utilisateur dans le localStorage
        const users = JSON.parse(localStorage.getItem("triprune_users") || "[]")
        const userIndex = users.findIndex((u: any) => u.id === userId)

        if (userIndex === -1) {
            throw new Error("Utilisateur non trouvé")
        }

        // Mettre à jour les données de l'utilisateur
        users[userIndex] = { ...users[userIndex], ...userData }
        localStorage.setItem("triprune_users", JSON.stringify(users))

        // Ne pas renvoyer le mot de passe
        const { password, ...userWithoutPassword } = users[userIndex]
        return userWithoutPassword
    },
}

// Provider du contexte d'authentification
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    // Vérifier si l'utilisateur est déjà connecté au chargement
    useEffect(() => {
        const storedUser = localStorage.getItem("triprune_current_user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setIsLoading(false)
    }, [])

    // Fonction de connexion
    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true)
            setError(null)
            const userData = await authAPI.login(email, password)
            setUser(userData)
            localStorage.setItem("triprune_current_user", JSON.stringify(userData))
            navigate("/dashboard")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la connexion")
        } finally {
            setIsLoading(false)
        }
    }

    // Fonction d'inscription
    const register = async (name: string, email: string, password: string) => {
        try {
            setIsLoading(true)
            setError(null)
            const userData = await authAPI.register(name, email, password)
            setUser(userData)
            localStorage.setItem("triprune_current_user", JSON.stringify(userData))
            navigate("/dashboard")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'inscription")
        } finally {
            setIsLoading(false)
        }
    }

    // Fonction de déconnexion
    const logout = () => {
        setUser(null)
        localStorage.removeItem("triprune_current_user")
        navigate("/")
    }

    // Fonction de mise à jour du profil
    const updateProfile = async (userData: Partial<User>) => {
        if (!user) return

        try {
            setIsLoading(true)
            setError(null)
            const updatedUser = await authAPI.updateProfile(user.id, userData)
            setUser(updatedUser)
            localStorage.setItem("triprune_current_user", JSON.stringify(updatedUser))
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la mise à jour du profil")
        } finally {
            setIsLoading(false)
        }
    }

    // Fonction pour effacer les erreurs
    const clearError = () => setError(null)

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        error,
        clearError,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

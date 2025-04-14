"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthService } from "../services"

// Types pour les utilisateurs et l'authentification
export interface User {
    id: number
    email: string
    name: string
    role: "user" | "admin"
    avatar?: string
    is_verified: boolean
    created_at: string
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
    verifyEmail: (token: string) => Promise<void>
    resendVerificationEmail: (email: string) => Promise<void>
    requestPasswordReset: (email: string) => Promise<void>
    confirmPasswordReset: (token: string, password: string) => Promise<void>
    changePassword: (oldPassword: string, newPassword: string) => Promise<void>
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
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    // Vérifier si l'utilisateur est déjà connecté au chargement
    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (AuthService.isAuthenticated()) {
                    const userData = await AuthService.getCurrentUser();
                    setUser(userData);
                }
            } catch (err) {
                console.error("Erreur lors de la vérification de l'authentification:", err);
                // En cas d'erreur, déconnecter l'utilisateur
                AuthService.logout();
            } finally {
                setIsLoading(false);
            }
        };
        
        checkAuth();
    }, [])

    // Fonction de connexion
    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true)
            setError(null)
            const userData = await AuthService.login({ email, password })
            setUser(userData)
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
            const userData = await AuthService.register({ name, email, password })
            setUser(userData)
            navigate("/dashboard")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'inscription")
        } finally {
            setIsLoading(false)
        }
    }

    // Fonction de déconnexion
    const logout = async () => {
        try {
            setIsLoading(true)
            await AuthService.logout()
            setUser(null)
            navigate("/")
        } catch (err) {
            console.error("Erreur lors de la déconnexion:", err)
        } finally {
            setIsLoading(false)
        }
    }

    // Fonction de mise à jour du profil
    const updateProfile = async (userData: Partial<User>) => {
        if (!user) return

        try {
            setIsLoading(true)
            setError(null)
            const updatedUser = await AuthService.updateProfile(userData)
            setUser(updatedUser)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la mise à jour du profil")
        } finally {
            setIsLoading(false)
        }
    }

    // Fonction pour vérifier l'email
    const verifyEmail = async (token: string) => {
        try {
            setIsLoading(true)
            setError(null)
            await AuthService.verifyEmail(token)
            // Mettre à jour l'utilisateur après vérification
            if (user) {
                const updatedUser = await AuthService.getCurrentUser()
                setUser(updatedUser)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la vérification de l'email")
        } finally {
            setIsLoading(false)
        }
    }

    // Fonction pour renvoyer l'email de vérification
    const resendVerificationEmail = async (email: string) => {
        try {
            setIsLoading(true)
            setError(null)
            await AuthService.resendVerificationEmail(email)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue lors du renvoi de l'email de vérification")
        } finally {
            setIsLoading(false)
        }
    }

    // Fonction pour demander une réinitialisation de mot de passe
    const requestPasswordReset = async (email: string) => {
        try {
            setIsLoading(true)
            setError(null)
            await AuthService.requestPasswordReset(email)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la demande de réinitialisation de mot de passe")
        } finally {
            setIsLoading(false)
        }
    }

    // Fonction pour confirmer la réinitialisation de mot de passe
    const confirmPasswordReset = async (token: string, password: string) => {
        try {
            setIsLoading(true)
            setError(null)
            await AuthService.confirmPasswordReset({ token, password })
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la confirmation de réinitialisation de mot de passe")
        } finally {
            setIsLoading(false)
        }
    }

    // Fonction pour changer le mot de passe
    const changePassword = async (oldPassword: string, newPassword: string) => {
        try {
            setIsLoading(true)
            setError(null)
            await AuthService.changePassword({ old_password: oldPassword, new_password: newPassword })
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue lors du changement de mot de passe")
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
        verifyEmail,
        resendVerificationEmail,
        requestPasswordReset,
        confirmPasswordReset,
        changePassword
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

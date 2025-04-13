"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"

// Interface pour la session active
export interface ActiveSession {
    id: string
    browser: string
    device: string
    location: string
    isCurrentSession: boolean
    lastActive: string
}

// Interface pour le contexte de sécurité
interface SecurityContextType {
    twoFactorEnabled: boolean
    toggleTwoFactor: () => Promise<void>
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>
    activeSessions: ActiveSession[]
    logoutAllSessions: () => Promise<void>
}

// Création du contexte
const SecurityContext = createContext<SecurityContextType | undefined>(undefined)

// Provider du contexte de sécurité
export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth()

    // État pour stocker l'état de l'authentification à deux facteurs
    const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(() => {
        // Récupérer l'état de l'authentification à deux facteurs depuis le localStorage ou utiliser false par défaut
        return localStorage.getItem("triprune_two_factor_enabled") === "true"
    })

    // État pour stocker les sessions actives
    const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([
        {
            id: "session-1",
            browser: "Chrome",
            device: "Windows",
            location: "Paris, France",
            isCurrentSession: true,
            lastActive: new Date().toISOString(),
        },
    ])

    // Fonction pour basculer l'état de l'authentification à deux facteurs
    const toggleTwoFactor = async () => {
        // Simuler un appel API
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                const newState = !twoFactorEnabled
                setTwoFactorEnabled(newState)
                localStorage.setItem("triprune_two_factor_enabled", String(newState))
                resolve()
            }, 500)
        })
    }

    // Fonction pour changer le mot de passe
    const changePassword = async (currentPassword: string, newPassword: string) => {
        // Vérifier si le mot de passe actuel est correct (simulation)
        if (currentPassword !== "password" && user?.email !== "demo@triprune.com") {
            throw new Error("Le mot de passe actuel est incorrect")
        }

        // Vérifier si le nouveau mot de passe est valide
        if (newPassword.length < 8) {
            throw new Error("Le mot de passe doit contenir au moins 8 caractères")
        }

        // Simuler un appel API
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                // Dans une vraie application, on enverrait le nouveau mot de passe au serveur
                resolve()
            }, 1000)
        })
    }

    // Fonction pour se déconnecter de toutes les sessions
    const logoutAllSessions = async () => {
        // Simuler un appel API
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                // Dans une vraie application, on enverrait une requête au serveur pour invalider toutes les sessions
                // Ici, on ne garde que la session courante
                setActiveSessions(activeSessions.filter((session) => session.isCurrentSession))
                resolve()
            }, 1000)
        })
    }

    // Effet pour initialiser les données de sécurité
    useEffect(() => {
        // Récupérer l'état de l'authentification à deux facteurs depuis le localStorage
        const savedTwoFactorEnabled = localStorage.getItem("triprune_two_factor_enabled")
        if (savedTwoFactorEnabled !== null) {
            setTwoFactorEnabled(savedTwoFactorEnabled === "true")
        }

        // Simuler la récupération des sessions actives
        // Dans une vraie application, on ferait un appel API pour récupérer les sessions actives
    }, [])

    const value = {
        twoFactorEnabled,
        toggleTwoFactor,
        changePassword,
        activeSessions,
        logoutAllSessions,
    }

    return <SecurityContext.Provider value={value}>{children}</SecurityContext.Provider>
}

// Hook personnalisé pour utiliser le contexte de sécurité
export const useSecurity = () => {
    const context = useContext(SecurityContext)
    if (context === undefined) {
        throw new Error("useSecurity doit être utilisé à l'intérieur d'un SecurityProvider")
    }
    return context
}

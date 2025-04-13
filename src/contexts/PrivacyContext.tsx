"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Interface pour les options de confidentialité
export interface PrivacyOption {
    id: string
    enabled: boolean
}

// Interface pour le contexte de confidentialité
interface PrivacyContextType {
    privacyOptions: PrivacyOption[]
    togglePrivacyOption: (id: string) => void
    savePrivacyPreferences: () => Promise<void>
    exportUserData: () => Promise<Blob>
    deleteUserAccount: () => Promise<void>
}

// Création du contexte
const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined)

// Options de confidentialité par défaut
const defaultPrivacyOptions: PrivacyOption[] = [
    { id: "data_collection", enabled: true },
    { id: "usage_analytics", enabled: true },
    { id: "third_party_sharing", enabled: false },
]

// Provider du contexte de confidentialité
export const PrivacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // État pour stocker les options de confidentialité
    const [privacyOptions, setPrivacyOptions] = useState<PrivacyOption[]>(() => {
        // Récupérer les options de confidentialité depuis le localStorage ou utiliser les options par défaut
        const savedOptions = localStorage.getItem("triprune_privacy_options")
        return savedOptions ? JSON.parse(savedOptions) : defaultPrivacyOptions
    })

    // Fonction pour basculer l'état d'une option de confidentialité
    const togglePrivacyOption = (id: string) => {
        setPrivacyOptions(
            privacyOptions.map((option) => (option.id === id ? { ...option, enabled: !option.enabled } : option)),
        )
    }

    // Fonction pour sauvegarder les préférences de confidentialité
    const savePrivacyPreferences = async () => {
        // Sauvegarder les options de confidentialité dans le localStorage
        localStorage.setItem("triprune_privacy_options", JSON.stringify(privacyOptions))

        // Simuler un appel API
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve()
            }, 500)
        })
    }

    // Fonction pour exporter les données utilisateur
    const exportUserData = async () => {
        // Simuler l'exportation des données utilisateur
        const dummyData = {
            user: {
                name: "Utilisateur Démo",
                email: "demo@triprune.com",
                createdAt: new Date().toISOString(),
            },
            analyses: [
                {
                    id: 1,
                    date: new Date().toISOString(),
                    category: "Bonne qualité",
                    confidence: 95,
                },
            ],
            preferences: {
                privacy: privacyOptions,
            },
        }

        // Créer un blob et le retourner
        const dataStr = JSON.stringify(dummyData, null, 2)
        return new Blob([dataStr], { type: "application/json" })
    }

    // Fonction pour supprimer le compte utilisateur
    const deleteUserAccount = async () => {
        // Simuler la suppression du compte utilisateur
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                // Supprimer les données utilisateur du localStorage
                localStorage.removeItem("triprune_current_user")
                localStorage.removeItem("triprune_privacy_options")
                localStorage.removeItem("triprune_notification_options")

                // Rediriger vers la page d'accueil
                window.location.href = "/"

                resolve()
            }, 1000)
        })
    }

    // Effet pour initialiser les options de confidentialité
    useEffect(() => {
        // Récupérer les options de confidentialité depuis le localStorage
        const savedOptions = localStorage.getItem("triprune_privacy_options")
        if (savedOptions) {
            setPrivacyOptions(JSON.parse(savedOptions))
        }
    }, [])

    const value = {
        privacyOptions,
        togglePrivacyOption,
        savePrivacyPreferences,
        exportUserData,
        deleteUserAccount,
    }

    return <PrivacyContext.Provider value={value}>{children}</PrivacyContext.Provider>
}

// Hook personnalisé pour utiliser le contexte de confidentialité
export const usePrivacy = () => {
    const context = useContext(PrivacyContext)
    if (context === undefined) {
        throw new Error("usePrivacy doit être utilisé à l'intérieur d'un PrivacyProvider")
    }
    return context
}

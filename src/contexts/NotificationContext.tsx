"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Interface pour les options de notification
export interface NotificationOption {
    id: string
    enabled: boolean
}

// Interface pour le contexte de notification
interface NotificationContextType {
    notificationOptions: NotificationOption[]
    toggleNotificationOption: (id: string) => void
    saveNotificationPreferences: () => Promise<void>
}

// Création du contexte
const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Options de notification par défaut
const defaultNotificationOptions: NotificationOption[] = [
    { id: "email_updates", enabled: true },
    { id: "app_notifications", enabled: true },
    { id: "analysis_complete", enabled: true },
    { id: "new_features", enabled: false },
]

// Provider du contexte de notification
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // État pour stocker les options de notification
    const [notificationOptions, setNotificationOptions] = useState<NotificationOption[]>(() => {
        // Récupérer les options de notification depuis le localStorage ou utiliser les options par défaut
        const savedOptions = localStorage.getItem("triprune_notification_options")
        return savedOptions ? JSON.parse(savedOptions) : defaultNotificationOptions
    })

    // Fonction pour basculer l'état d'une option de notification
    const toggleNotificationOption = (id: string) => {
        setNotificationOptions(
            notificationOptions.map((option) => (option.id === id ? { ...option, enabled: !option.enabled } : option)),
        )
    }

    // Fonction pour sauvegarder les préférences de notification
    const saveNotificationPreferences = async () => {
        // Sauvegarder les options de notification dans le localStorage
        localStorage.setItem("triprune_notification_options", JSON.stringify(notificationOptions))

        // Simuler un appel API
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve()
            }, 500)
        })
    }

    // Effet pour initialiser les options de notification
    useEffect(() => {
        // Récupérer les options de notification depuis le localStorage
        const savedOptions = localStorage.getItem("triprune_notification_options")
        if (savedOptions) {
            setNotificationOptions(JSON.parse(savedOptions))
        }
    }, [])

    const value = {
        notificationOptions,
        toggleNotificationOption,
        saveNotificationPreferences,
    }

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

// Hook personnalisé pour utiliser le contexte de notification
export const useNotification = () => {
    const context = useContext(NotificationContext)
    if (context === undefined) {
        throw new Error("useNotification doit être utilisé à l'intérieur d'un NotificationProvider")
    }
    return context
}

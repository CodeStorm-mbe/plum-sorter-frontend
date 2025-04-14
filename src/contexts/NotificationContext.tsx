"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { NotificationService, Notification as ApiNotification } from "../services"

// Types pour les notifications
export interface Notification {
    id: number
    title: string
    message: string
    type: string
    isRead: boolean
    createdAt: string
}

interface NotificationContextType {
    notifications: Notification[]
    unreadCount: number
    isLoading: boolean
    error: string | null
    fetchNotifications: () => Promise<void>
    markAsRead: (id: number) => Promise<void>
    markAllAsRead: () => Promise<void>
    deleteNotification: (id: number) => Promise<void>
    clearError: () => void
}

// Création du contexte
const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Hook personnalisé pour utiliser le contexte de notification
export const useNotification = () => {
    const context = useContext(NotificationContext)
    if (context === undefined) {
        throw new Error("useNotification doit être utilisé à l'intérieur d'un NotificationProvider")
    }
    return context
}

// Convertir les notifications de l'API en format frontend
const convertApiNotification = (apiNotification: ApiNotification): Notification => ({
    id: apiNotification.id,
    title: apiNotification.title,
    message: apiNotification.message,
    type: apiNotification.type,
    isRead: apiNotification.is_read,
    createdAt: apiNotification.created_at
})

// Provider du contexte de notification
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    // Calculer le nombre de notifications non lues
    const unreadCount = notifications.filter(notification => !notification.isRead).length

    // Récupérer les notifications au chargement
    useEffect(() => {
        fetchNotifications()
    }, [])

    // Fonction pour récupérer les notifications
    const fetchNotifications = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const apiNotifications = await NotificationService.getNotifications()
            setNotifications(apiNotifications.map(convertApiNotification))
        } catch (err) {
            console.error("Erreur lors de la récupération des notifications:", err)
            setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la récupération des notifications")
        } finally {
            setIsLoading(false)
        }
    }

    // Fonction pour marquer une notification comme lue
    const markAsRead = async (id: number) => {
        try {
            setIsLoading(true)
            setError(null)
            await NotificationService.markAsRead(id)
            setNotifications(prevNotifications =>
                prevNotifications.map(notification =>
                    notification.id === id
                        ? { ...notification, isRead: true }
                        : notification
                )
            )
        } catch (err) {
            console.error(`Erreur lors du marquage de la notification ${id} comme lue:`, err)
            setError(err instanceof Error ? err.message : "Une erreur est survenue lors du marquage de la notification comme lue")
        } finally {
            setIsLoading(false)
        }
    }

    // Fonction pour marquer toutes les notifications comme lues
    const markAllAsRead = async () => {
        try {
            setIsLoading(true)
            setError(null)
            await NotificationService.markAllAsRead()
            setNotifications(prevNotifications =>
                prevNotifications.map(notification => ({ ...notification, isRead: true }))
            )
        } catch (err) {
            console.error("Erreur lors du marquage de toutes les notifications comme lues:", err)
            setError(err instanceof Error ? err.message : "Une erreur est survenue lors du marquage de toutes les notifications comme lues")
        } finally {
            setIsLoading(false)
        }
    }

    // Fonction pour supprimer une notification
    const deleteNotification = async (id: number) => {
        try {
            setIsLoading(true)
            setError(null)
            await NotificationService.deleteNotification(id)
            setNotifications(prevNotifications =>
                prevNotifications.filter(notification => notification.id !== id)
            )
        } catch (err) {
            console.error(`Erreur lors de la suppression de la notification ${id}:`, err)
            setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la suppression de la notification")
        } finally {
            setIsLoading(false)
        }
    }

    // Fonction pour effacer les erreurs
    const clearError = () => setError(null)

    const value = {
        notifications,
        unreadCount,
        isLoading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearError
    }

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

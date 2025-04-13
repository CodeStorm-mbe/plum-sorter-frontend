"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, AlertCircle } from "lucide-react"
import Button from "../Button"
import { useLanguage } from "../../contexts/LanguageContext"
import { useNotification } from "../../contexts/NotificationContext"

const NotificationSettings: React.FC = () => {
    const { t } = useLanguage()
    const { notificationOptions, toggleNotificationOption, saveNotificationPreferences } = useNotification()
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    // Fonction pour obtenir le label et la description d'une option de notification
    const getNotificationOptionInfo = (id: string) => {
        const options: Record<string, { label: string; description: string }> = {
            email_updates: {
                label: t("settings.notifications.emailUpdates"),
                description: t("settings.notifications.emailUpdatesDesc"),
            },
            app_notifications: {
                label: t("settings.notifications.appNotifications"),
                description: t("settings.notifications.appNotificationsDesc"),
            },
            analysis_complete: {
                label: t("settings.notifications.analysisComplete"),
                description: t("settings.notifications.analysisCompleteDesc"),
            },
            new_features: {
                label: t("settings.notifications.newFeatures"),
                description: t("settings.notifications.newFeaturesDesc"),
            },
        }
        return options[id] || { label: id, description: "" }
    }

    const handleSaveNotifications = async () => {
        setIsLoading(true)
        try {
            await saveNotificationPreferences()
            setSuccessMessage(t("settings.notifications.success"))
            setTimeout(() => setSuccessMessage(null), 3000)
        } catch (error) {
            console.error("Erreur lors de la sauvegarde des préférences de notification:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <h2 className="text-xl font-title font-semibold mb-6 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-accent-primary" />
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          {t("settings.notifications.title")}
        </span>
            </h2>

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

            <div className="space-y-6">
                <p className="text-white/70">{t("settings.notifications.description")}</p>

                <div className="space-y-4">
                    {notificationOptions.map((option) => {
                        const { label, description } = getNotificationOptionInfo(option.id)
                        return (
                            <div
                                key={option.id}
                                className="p-4 rounded-lg border border-white/10 bg-background-light/30 flex items-center justify-between"
                            >
                                <div>
                                    <h3 className="font-medium text-white">{label}</h3>
                                    <p className="text-sm text-white/60">{description}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={option.enabled}
                                        onChange={() => toggleNotificationOption(option.id)}
                                    />
                                    <div className="w-11 h-6 bg-background-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                                </label>
                            </div>
                        )
                    })}
                </div>

                <div className="pt-4">
                    <Button variant="primary" onClick={handleSaveNotifications} disabled={isLoading}>
                        {isLoading ? "..." : t("settings.notifications.save")}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default NotificationSettings

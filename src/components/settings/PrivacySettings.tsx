"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, AlertCircle, Download, Trash2 } from "lucide-react"
import Button from "../Button"
import { useLanguage } from "../../contexts/LanguageContext"
import { usePrivacy } from "../../contexts/PrivacyContext"

const PrivacySettings: React.FC = () => {
    const { t } = useLanguage()
    const { privacyOptions, togglePrivacyOption, savePrivacyPreferences, exportUserData, deleteUserAccount } =
        usePrivacy()
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Fonction pour obtenir le label et la description d'une option de confidentialité
    const getPrivacyOptionInfo = (id: string) => {
        const options: Record<string, { label: string; description: string }> = {
            data_collection: {
                label: t("settings.privacy.dataCollection"),
                description: t("settings.privacy.dataCollectionDesc"),
            },
            usage_analytics: {
                label: t("settings.privacy.usageAnalytics"),
                description: t("settings.privacy.usageAnalyticsDesc"),
            },
            third_party_sharing: {
                label: t("settings.privacy.thirdPartySharing"),
                description: t("settings.privacy.thirdPartySharingDesc"),
            },
        }
        return options[id] || { label: id, description: "" }
    }

    const handleSavePrivacy = async () => {
        setIsLoading(true)
        try {
            await savePrivacyPreferences()
            setSuccessMessage(t("settings.privacy.success"))
            setTimeout(() => setSuccessMessage(null), 3000)
        } catch (error) {
            console.error("Erreur lors de la sauvegarde des préférences de confidentialité:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleExportData = async () => {
        try {
            const blob = await exportUserData()

            // Créer un lien de téléchargement
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "triprune-data.json"
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            setSuccessMessage(t("settings.privacy.exportSuccess"))
            setTimeout(() => setSuccessMessage(null), 3000)
        } catch (error) {
            console.error("Erreur lors de l'exportation des données:", error)
        }
    }

    const handleDeleteAccount = async () => {
        setIsLoading(true)
        try {
            await deleteUserAccount()
            setShowDeleteConfirm(false)
            setSuccessMessage(t("settings.privacy.deleteSuccess"))
            setTimeout(() => setSuccessMessage(null), 3000)
        } catch (error) {
            console.error("Erreur lors de la suppression du compte:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <h2 className="text-xl font-title font-semibold mb-6 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-accent-primary" />
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          {t("settings.privacy.title")}
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

            <div className="space-y-8">
                {/* Options de confidentialité */}
                <div>
                    <h3 className="text-lg font-medium mb-4">{t("settings.privacy.optionsTitle")}</h3>
                    <div className="space-y-4">
                        {privacyOptions.map((option) => {
                            const { label, description } = getPrivacyOptionInfo(option.id)
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
                                            onChange={() => togglePrivacyOption(option.id)}
                                        />
                                        <div className="w-11 h-6 bg-background-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                                    </label>
                                </div>
                            )
                        })}
                    </div>

                    <div className="pt-4">
                        <Button variant="primary" onClick={handleSavePrivacy} disabled={isLoading}>
                            {isLoading ? "..." : t("settings.privacy.save")}
                        </Button>
                    </div>
                </div>

                {/* Exportation des données */}
                <div>
                    <h3 className="text-lg font-medium mb-4">{t("settings.privacy.dataExportTitle")}</h3>
                    <p className="text-white/70 mb-4">{t("settings.privacy.dataExportDesc")}</p>
                    <Button variant="outline" onClick={handleExportData} icon={<Download className="h-5 w-5" />}>
                        {t("settings.privacy.exportData")}
                    </Button>
                </div>

                {/* Suppression du compte */}
                <div>
                    <h3 className="text-lg font-medium mb-4 text-accent-tertiary">{t("settings.privacy.dangerZoneTitle")}</h3>
                    <div className="p-4 rounded-lg border border-accent-tertiary/30 bg-accent-tertiary/10">
                        <p className="text-white/70 mb-4">{t("settings.privacy.deleteAccountDesc")}</p>

                        {!showDeleteConfirm ? (
                            <Button
                                variant="outline"
                                className="border-accent-tertiary text-accent-tertiary hover:bg-accent-tertiary/20"
                                onClick={() => setShowDeleteConfirm(true)}
                                icon={<Trash2 className="h-5 w-5" />}
                            >
                                {t("settings.privacy.deleteAccount")}
                            </Button>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-accent-tertiary font-medium">{t("settings.privacy.deleteConfirm")}</p>
                                <div className="flex space-x-4">
                                    <Button
                                        variant="outline"
                                        className="border-accent-tertiary text-accent-tertiary hover:bg-accent-tertiary/20"
                                        onClick={handleDeleteAccount}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "..." : t("settings.privacy.confirmDelete")}
                                    </Button>
                                    <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={isLoading}>
                                        {t("settings.privacy.cancel")}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrivacySettings

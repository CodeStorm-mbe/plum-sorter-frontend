"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Lock, AlertCircle, Eye, EyeOff, Save } from "lucide-react"
import Button from "../Button"
import { useLanguage } from "../../contexts/LanguageContext"
import { useSecurity } from "../../contexts/SecurityContext"

const SecuritySettings: React.FC = () => {
    const { t } = useLanguage()
    const { twoFactorEnabled, toggleTwoFactor, changePassword, activeSessions, logoutAllSessions } = useSecurity()

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingTwoFactor, setIsLoadingTwoFactor] = useState(false)
    const [isLoadingLogout, setIsLoadingLogout] = useState(false)

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage(null)

        // Validation simple
        if (newPassword.length < 8) {
            setErrorMessage(t("settings.security.passwordTooShort"))
            return
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage(t("settings.security.passwordsDoNotMatch"))
            return
        }

        setIsLoading(true)
        try {
            await changePassword(currentPassword, newPassword)
            setSuccessMessage(t("settings.security.passwordChangeSuccess"))
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
            setTimeout(() => setSuccessMessage(null), 3000)
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message)
            } else {
                setErrorMessage("Une erreur est survenue")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggleTwoFactor = async () => {
        setIsLoadingTwoFactor(true)
        try {
            await toggleTwoFactor()
            setSuccessMessage(
                twoFactorEnabled ? t("settings.security.twoFactorDisabled") : t("settings.security.twoFactorEnabled"),
            )
            setTimeout(() => setSuccessMessage(null), 3000)
        } catch (error) {
            console.error("Erreur lors de la modification de l'authentification à deux facteurs:", error)
        } finally {
            setIsLoadingTwoFactor(false)
        }
    }

    const handleLogoutAllSessions = async () => {
        setIsLoadingLogout(true)
        try {
            await logoutAllSessions()
            setSuccessMessage("Toutes les autres sessions ont été déconnectées")
            setTimeout(() => setSuccessMessage(null), 3000)
        } catch (error) {
            console.error("Erreur lors de la déconnexion des sessions:", error)
        } finally {
            setIsLoadingLogout(false)
        }
    }

    return (
        <div>
            <h2 className="text-xl font-title font-semibold mb-6 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-accent-primary" />
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          {t("settings.security.title")}
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

            {errorMessage && (
                <motion.div
                    className="mb-6 p-3 bg-accent-tertiary/20 border border-accent-tertiary/30 rounded-md flex items-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    <AlertCircle className="h-5 w-5 text-accent-tertiary mr-2" />
                    <p className="text-white/90 text-sm">{errorMessage}</p>
                    <button
                        onClick={() => setErrorMessage(null)}
                        className="ml-auto text-white/50 hover:text-white"
                        aria-label="Fermer"
                    >
                        &times;
                    </button>
                </motion.div>
            )}

            <div className="space-y-8">
                {/* Changement de mot de passe */}
                <div>
                    <h3 className="text-lg font-medium mb-4">{t("settings.security.changePasswordTitle")}</h3>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="current-password" className="block text-sm font-medium text-white/70">
                                {t("settings.security.currentPassword")}
                            </label>
                            <div className="relative">
                                <input
                                    id="current-password"
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                    className="block w-full pl-3 pr-10 py-2 bg-background-light/50 border border-white/10 rounded-md focus:ring-1 focus:ring-accent-primary focus:border-accent-primary text-white placeholder-white/30"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="new-password" className="block text-sm font-medium text-white/70">
                                {t("settings.security.newPassword")}
                            </label>
                            <div className="relative">
                                <input
                                    id="new-password"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="block w-full pl-3 pr-10 py-2 bg-background-light/50 border border-white/10 rounded-md focus:ring-1 focus:ring-accent-primary focus:border-accent-primary text-white placeholder-white/30"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <p className="text-xs text-white/50">{t("settings.security.passwordRequirements")}</p>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-white/70">
                                {t("settings.security.confirmPassword")}
                            </label>
                            <div className="relative">
                                <input
                                    id="confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="block w-full pl-3 pr-10 py-2 bg-background-light/50 border border-white/10 rounded-md focus:ring-1 focus:ring-accent-primary focus:border-accent-primary text-white placeholder-white/30"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <Button type="submit" variant="primary" icon={<Save className="h-5 w-5" />} disabled={isLoading}>
                                {isLoading ? "..." : t("settings.security.updatePassword")}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Authentification à deux facteurs */}
                <div>
                    <h3 className="text-lg font-medium mb-4">{t("settings.security.twoFactorTitle")}</h3>
                    <div className="p-4 rounded-lg border border-white/10 bg-background-light/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-white">{t("settings.security.twoFactorAuth")}</h4>
                                <p className="text-sm text-white/60">{t("settings.security.twoFactorDesc")}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={twoFactorEnabled}
                                    onChange={handleToggleTwoFactor}
                                    disabled={isLoadingTwoFactor}
                                />
                                <div className="w-11 h-6 bg-background-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Sessions actives */}
                <div>
                    <h3 className="text-lg font-medium mb-4">{t("settings.security.activeSessions")}</h3>
                    <div className="space-y-4">
                        {activeSessions.map((session) => (
                            <div key={session.id} className="p-4 rounded-lg border border-white/10 bg-background-light/30">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-white">
                                            {session.isCurrentSession ? t("settings.security.currentSession") : `Session ${session.id}`}
                                        </h4>
                                        <p className="text-sm text-white/60">
                                            {t("settings.security.browser")}: {session.browser} • {t("settings.security.device")}:{" "}
                                            {session.device} • {t("settings.security.location")}: {session.location}
                                        </p>
                                        {session.isCurrentSession && (
                                            <p className="text-xs text-accent-primary mt-1">{t("settings.security.activeNow")}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {activeSessions.length > 1 && (
                            <Button variant="outline" onClick={handleLogoutAllSessions} disabled={isLoadingLogout}>
                                {isLoadingLogout ? "..." : t("settings.security.logoutAllSessions")}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SecuritySettings

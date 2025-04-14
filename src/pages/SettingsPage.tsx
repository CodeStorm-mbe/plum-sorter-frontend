"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import PageTransition from "../components/PageTransition"
import ProtectedRoute from "../components/auth/ProtectedRoute"
import SettingsLayout from "../components/settings/SettingsLayout"
import ProfileSettings from "../components/settings/ProfileSettings"
import AppearanceSettings from "../components/settings/AppearanceSettings"
import LanguageSettings from "../components/settings/LanguageSettings"
import NotificationSettings from "../components/settings/NotificationSettings"
import PrivacySettings from "../components/settings/PrivacySettings"
import SecuritySettings from "../components/settings/SecuritySettings"
import { useLanguage } from "../contexts/LanguageContext"

// Types pour les sections de paramètres
type SettingsSection = "profile" | "appearance" | "language" | "notifications" | "privacy" | "security"

const SettingsPage: React.FC = () => {
    const { t } = useLanguage()
    const [activeSection, setActiveSection] = useState<SettingsSection>("profile")

    // Fonction pour rendre la section active
    const renderActiveSection = () => {
        switch (activeSection) {
            case "profile":
                return <ProfileSettings />
            case "appearance":
                return <AppearanceSettings />
            case "language":
                return <LanguageSettings />
            case "notifications":
                return <NotificationSettings />
            case "privacy":
                return <PrivacySettings />
            case "security":
                return <SecuritySettings />
            default:
                return <ProfileSettings />
        }
    }

    return (
        <ProtectedRoute>
            <PageTransition>
                <div className="min-h-screen">
                    <Navbar />

                    <div className="container mx-auto pt-28 pb-16 px-4 md:px-8">
                        <motion.div
                            className="flex flex-col items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.h1
                                className="text-3xl md:text-4xl font-title font-bold text-center mb-2"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                  {t("settings.title")}
                </span>
                            </motion.h1>

                            <motion.p
                                className="text-center text-white/70 mb-8 max-w-md"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                {t("settings.subtitle")}
                            </motion.p>

                            <div className="w-full max-w-6xl">
                                <SettingsLayout activeSection={activeSection} onSectionChange={setActiveSection}>
                                    {renderActiveSection()}
                                </SettingsLayout>
                            </div>
                        </motion.div>
                    </div>

                    {/* Footer */}
                    <footer className="py-8 px-4 md:px-8 lg:px-16 bg-background-light/50 backdrop-blur-md border-t border-white/5">
                        <div className="container mx-auto text-center">
                            <p className="text-white/60">{t("footer.copyright")}</p>
                        </div>
                    </footer>
                </div>
            </PageTransition>
        </ProtectedRoute>
    )
}

export default SettingsPage

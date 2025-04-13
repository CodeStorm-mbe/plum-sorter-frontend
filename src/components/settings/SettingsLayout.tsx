"use client"

import type React from "react"
import { motion } from "framer-motion"
import { User, Palette, Globe, Bell, Shield, Lock } from "lucide-react"
import { useLanguage } from "../../contexts/LanguageContext"

// Types pour les sections de paramètres
type SettingsSection = "profile" | "appearance" | "language" | "notifications" | "privacy" | "security"

interface SettingsLayoutProps {
    children: React.ReactNode
    activeSection: SettingsSection
    onSectionChange: (section: SettingsSection) => void
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children, activeSection, onSectionChange }) => {
    const { t } = useLanguage()

    // Configuration des sections de paramètres
    const sections = [
        {
            id: "profile" as SettingsSection,
            label: t("settings.sections.profile"),
            icon: <User className="h-5 w-5" />,
        },
        {
            id: "appearance" as SettingsSection,
            label: t("settings.sections.appearance"),
            icon: <Palette className="h-5 w-5" />,
        },
        {
            id: "language" as SettingsSection,
            label: t("settings.sections.language"),
            icon: <Globe className="h-5 w-5" />,
        },
        {
            id: "notifications" as SettingsSection,
            label: t("settings.sections.notifications"),
            icon: <Bell className="h-5 w-5" />,
        },
        {
            id: "privacy" as SettingsSection,
            label: t("settings.sections.privacy"),
            icon: <Shield className="h-5 w-5" />,
        },
        {
            id: "security" as SettingsSection,
            label: t("settings.sections.security"),
            icon: <Lock className="h-5 w-5" />,
        },
    ]

    return (
        <div className="card">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar de navigation */}
                <div className="md:w-1/4">
                    <nav className="space-y-1">
                        {sections.map((section) => (
                            <motion.button
                                key={section.id}
                                className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${
                                    activeSection === section.id
                                        ? "bg-background-light text-accent-primary"
                                        : "text-white/70 hover:bg-background-light/50 hover:text-white"
                                }`}
                                onClick={() => onSectionChange(section.id)}
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div
                                    className={`p-2 rounded-full ${
                                        activeSection === section.id ? "bg-accent-primary/20" : "bg-background-light/50"
                                    } mr-3`}
                                >
                                    {section.icon}
                                </div>
                                <span className="font-medium">{section.label}</span>
                                {activeSection === section.id && (
                                    <motion.div
                                        className="ml-auto h-2 w-2 rounded-full bg-accent-primary"
                                        layoutId="settings-indicator"
                                    />
                                )}
                            </motion.button>
                        ))}
                    </nav>
                </div>

                {/* Contenu principal */}
                <div className="md:w-3/4">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default SettingsLayout

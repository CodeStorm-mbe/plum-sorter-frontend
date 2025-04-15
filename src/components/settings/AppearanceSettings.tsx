"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Palette, Sun, Moon, Monitor, Check, AlertCircle } from "lucide-react"
import Button from "../Button"
import { useLanguage } from "../../contexts/LanguageContext"
import { useTheme, type Theme, type AccentColor } from "../../contexts/ThemeContext"
import { ThemeProvider } from "next-themes"

const AppearanceSettings: React.FC = () => {
    const { t } = useLanguage()
    const { theme, setTheme, accentColor, setAccentColor, availableColors } = useTheme()

    const [localTheme, setLocalTheme] = useState<Theme>(theme)
    const [localAccentColor, setLocalAccentColor] = useState<AccentColor>(accentColor)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    // Options de thème
    const themeOptions = [
        { id: "light" as Theme, label: t("settings.appearance.light"), icon: <Sun className="h-5 w-5" /> },
        { id: "dark" as Theme, label: t("settings.appearance.dark"), icon: <Moon className="h-5 w-5" /> },
        { id: "system" as Theme, label: t("settings.appearance.system"), icon: <Monitor className="h-5 w-5" /> },
    ]

    const handleSaveAppearance = () => {
        // Appliquer les changements
        setTheme(localTheme)
        setAccentColor(localAccentColor)

        // Afficher le message de succès
        setSuccessMessage(t("settings.appearance.success"))
        setTimeout(() => setSuccessMessage(null), 3000)
    }

    return (
        <ThemeProvider>
        <div>
            <h2 className="text-xl font-title font-semibold mb-6 flex items-center">
                <Palette className="h-5 w-5 mr-2 text-accent-primary" />
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          {t("settings.appearance.title")}
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
                {/* Sélection du thème */}
                <div>
                    <h3 className="text-lg font-medium mb-4">{t("settings.appearance.themeTitle")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {themeOptions.map((option) => (
                            <motion.button
                                key={option.id}
                                className={`p-4 rounded-lg border ${
                                    localTheme === option.id
                                        ? "border-accent-primary bg-background-light"
                                        : "border-white/10 bg-background-light/50 hover:bg-background-light/80"
                                } flex items-center justify-between transition-colors`}
                                onClick={() => setLocalTheme(option.id)}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center">
                                    <div
                                        className={`p-2 rounded-full ${
                                            localTheme === option.id ? "bg-accent-primary/20" : "bg-background-light/50"
                                        } mr-3`}
                                    >
                                        {option.icon}
                                    </div>
                                    <span>{option.label}</span>
                                </div>
                                {localTheme === option.id && <Check className="h-5 w-5 text-accent-primary" />}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Sélection de la couleur d'accent */}
                <div>
                    <h3 className="text-lg font-medium mb-4">{t("settings.appearance.accentTitle")}</h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {availableColors.map((color) => (
                            <motion.button
                                key={color.value}
                                className={`p-4 rounded-lg border ${
                                    localAccentColor.value === color.value ? "border-white/30" : "border-white/10 hover:border-white/20"
                                } flex flex-col items-center justify-center transition-colors`}
                                onClick={() => setLocalAccentColor(color)}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="w-8 h-8 rounded-full mb-2" style={{ backgroundColor: color.value }}>
                                    {localAccentColor.value === color.value && (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Check className="h-4 w-4 text-white" />
                                        </div>
                                    )}
                                </div>
                                <span className="text-sm">{color.name}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Aperçu */}
                <div>
                    <h3 className="text-lg font-medium mb-4">{t("settings.appearance.previewTitle")}</h3>
                    <div
                        className="p-6 rounded-lg border border-white/10 bg-background-light/30"
                        style={{ "--accent-primary-rgb": hexToRgb(localAccentColor.value) } as React.CSSProperties}
                    >
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: localAccentColor.value }}></div>
                                <span className="font-medium" style={{ color: localAccentColor.value }}>
                  {t("settings.appearance.previewText")}
                </span>
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="primary" size="sm">
                                    {t("settings.appearance.primaryButton")}
                                </Button>
                                <Button variant="secondary" size="sm">
                                    {t("settings.appearance.secondaryButton")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <Button
                        variant="primary"
                        onClick={handleSaveAppearance}
                        disabled={localTheme === theme && localAccentColor.value === accentColor.value}
                    >
                        {t("settings.appearance.save")}
                    </Button>
                </div>
            </div>
        </div>
        </ThemeProvider>
    )
}

// Fonction utilitaire pour convertir une couleur hexadécimale en RGB
function hexToRgb(hex: string): string {
    // Supprimer le # si présent
    hex = hex.replace("#", "")

    // Convertir en RGB
    const r = Number.parseInt(hex.substring(0, 2), 16)
    const g = Number.parseInt(hex.substring(2, 4), 16)
    const b = Number.parseInt(hex.substring(4, 6), 16)

    return `${r}, ${g}, ${b}`
}

export default AppearanceSettings

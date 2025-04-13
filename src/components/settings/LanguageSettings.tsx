"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Globe, Check, AlertCircle } from "lucide-react"
import { useLanguage, type Language } from "../../contexts/LanguageContext"
import Button from "../Button"
import { useState } from "react"

const LanguageSettings: React.FC = () => {
    const { language, setLanguage, languages, t } = useLanguage()
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(language)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const handleSaveLanguage = () => {
        setLanguage(selectedLanguage)
        setSuccessMessage(t("settings.language.success"))
        setTimeout(() => setSuccessMessage(null), 3000)
    }

    return (
        <div>
            <h2 className="text-xl font-title font-semibold mb-6 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-accent-primary" />
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          {t("settings.language.title")}
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
                <p className="text-white/70">{t("settings.language.description")}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {languages.map((lang) => (
                        <motion.button
                            key={lang.code}
                            className={`p-4 rounded-lg border ${
                                selectedLanguage === lang.code
                                    ? "border-accent-primary bg-background-light"
                                    : "border-white/10 bg-background-light/50 hover:bg-background-light/80"
                            } flex items-center justify-between transition-colors`}
                            onClick={() => setSelectedLanguage(lang.code)}
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center">
                                <div className="text-2xl mr-3">{lang.flag}</div>
                                <div className="text-left">
                                    <div className="font-medium">{lang.name}</div>
                                    <div className="text-sm text-white/60">{getLanguageNativeName(lang.code)}</div>
                                </div>
                            </div>
                            {selectedLanguage === lang.code && <Check className="h-5 w-5 text-accent-primary" />}
                        </motion.button>
                    ))}
                </div>

                <div className="pt-4">
                    <Button variant="primary" onClick={handleSaveLanguage} disabled={selectedLanguage === language}>
                        {t("settings.language.save")}
                    </Button>
                </div>
            </div>
        </div>
    )
}

// Fonction pour obtenir le nom natif de la langue
function getLanguageNativeName(code: Language): string {
    const nativeNames: Record<Language, string> = {
        fr: "Français",
        en: "English",
        es: "Español",
        de: "Deutsch",
        zh: "中文",
        ar: "العربية",
    }
    return nativeNames[code]
}

export default LanguageSettings

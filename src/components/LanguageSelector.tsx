"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, Check } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"

interface LanguageSelectorProps {
    variant?: "icon" | "full"
    className?: string
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = "full", className = "" }) => {
    const { language, setLanguage, languages } = useLanguage()
    const [isOpen, setIsOpen] = useState(false)

    const currentLanguage = languages.find((lang) => lang.code === language)

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    const handleLanguageChange = (langCode: typeof language) => {
        setLanguage(langCode)
        setIsOpen(false)
    }

    return (
        <div className={`relative ${className}`}>
            <motion.button
                className={`flex items-center space-x-2 p-2 rounded-md hover:bg-background-light/50 transition-colors ${
                    variant === "icon" ? "text-white/70" : "text-white/80"
                }`}
                onClick={toggleDropdown}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Sélectionner une langue"
            >
                <Globe className="h-4 w-4" />
                {variant === "full" && (
                    <>
                        <span className="text-sm">{currentLanguage?.flag}</span>
                        <span className="text-sm hidden md:inline-block">{currentLanguage?.name}</span>
                    </>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background-light/90 backdrop-blur-md border border-white/10 z-50"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="py-1">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    className="flex items-center justify-between w-full px-4 py-2 text-sm text-white/80 hover:bg-background-light hover:text-white transition-colors"
                                    onClick={() => handleLanguageChange(lang.code)}
                                >
                                    <div className="flex items-center">
                                        <span className="mr-2">{lang.flag}</span>
                                        <span>{lang.name}</span>
                                    </div>
                                    {language === lang.code && <Check className="h-4 w-4 text-accent-primary" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default LanguageSelector

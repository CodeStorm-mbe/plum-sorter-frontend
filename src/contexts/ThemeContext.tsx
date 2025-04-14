"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Types pour les thèmes et les couleurs d'accent
export type Theme = "light" | "dark" | "system"
export type AccentColor = {
    name: string
    value: string
}

// Interface pour le contexte de thème
interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
    accentColor: AccentColor
    setAccentColor: (color: AccentColor) => void
    availableColors: AccentColor[]
}

// Création du contexte
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Couleurs d'accent disponibles
const availableColors: AccentColor[] = [
    { name: "Cyan", value: "#00e5ff" },
    { name: "Purple", value: "#7b2ff7" },
    { name: "Pink", value: "#ff2a6d" },
    { name: "Green", value: "#05ffa1" },
    { name: "Orange", value: "#ff9e00" },
    { name: "Blue", value: "#0070f3" },
]

// Provider du contexte de thème
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // État pour stocker le thème actuel
    const [theme, setThemeState] = useState<Theme>(() => {
        // Récupérer le thème depuis le localStorage ou utiliser le thème sombre par défaut
        const savedTheme = localStorage.getItem("triprune_theme")
        return (savedTheme as Theme) || "dark"
    })

    // État pour stocker la couleur d'accent actuelle
    const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
        // Récupérer la couleur d'accent depuis le localStorage ou utiliser la couleur par défaut
        const savedColor = localStorage.getItem("triprune_accent_color")
        return savedColor ? JSON.parse(savedColor) : availableColors[0]
    })

    // Fonction pour changer de thème
    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
        localStorage.setItem("triprune_theme", newTheme)

        // Appliquer le thème au document
        if (newTheme === "dark" || (newTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    }

    // Fonction pour changer de couleur d'accent
    const setAccentColor = (color: AccentColor) => {
        setAccentColorState(color)
        localStorage.setItem("triprune_accent_color", JSON.stringify(color))

        // Appliquer la couleur d'accent au document
        document.documentElement.style.setProperty("--accent-primary", color.value)
        document.documentElement.style.setProperty("--accent-primary-rgb", hexToRgb(color.value))
    }

    // Effet pour initialiser le thème
    useEffect(() => {
        // Appliquer le thème initial
        if (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }

        // Écouter les changements de préférence de thème du système
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        const handleChange = () => {
            if (theme === "system") {
                if (mediaQuery.matches) {
                    document.documentElement.classList.add("dark")
                } else {
                    document.documentElement.classList.remove("dark")
                }
            }
        }

        mediaQuery.addEventListener("change", handleChange)
        return () => mediaQuery.removeEventListener("change", handleChange)
    }, [theme])

    // Effet pour initialiser la couleur d'accent
    useEffect(() => {
        // Appliquer la couleur d'accent initiale
        document.documentElement.style.setProperty("--accent-primary", accentColor.value)
        document.documentElement.style.setProperty("--accent-primary-rgb", hexToRgb(accentColor.value))
    }, [accentColor])

    const value = {
        theme,
        setTheme,
        accentColor,
        setAccentColor,
        availableColors,
    }

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// Hook personnalisé pour utiliser le contexte de thème
export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error("useTheme doit être utilisé à l'intérieur d'un ThemeProvider")
    }
    return context
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

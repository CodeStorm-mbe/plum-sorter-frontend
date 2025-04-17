import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

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
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Utiliser next-themes pour gérer le thème
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
        >
            <ThemeProviderInternal>{children}</ThemeProviderInternal>
        </NextThemesProvider>
    )
}

// Composant interne pour gérer les couleurs d'accent et exposer l'API complète
function ThemeProviderInternal({ children }: { children: React.ReactNode }) {
    // État pour stocker le thème actuel
    const [theme, setTheme] = useState<Theme>("dark")
    
    // Effet pour synchroniser avec next-themes
    useEffect(() => {
        // Fonction pour mettre à jour notre état local basé sur le thème de next-themes
        const updateTheme = () => {
            const themeFromStorage = localStorage.getItem("theme") as Theme | null
            setTheme(themeFromStorage || "dark")
        }
        
        // Mettre à jour initialement
        updateTheme()
        
        // Écouter les changements de thème
        window.addEventListener("storage", updateTheme)
        return () => window.removeEventListener("storage", updateTheme)
    }, [])
    
    // État pour stocker la couleur d'accent actuelle
    const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
        // Récupérer la couleur d'accent depuis le localStorage ou utiliser la couleur par défaut
        if (typeof window !== 'undefined') {
            const savedColor = localStorage.getItem("triprune_accent_color")
            return savedColor ? JSON.parse(savedColor) : availableColors[0]
        }
        return availableColors[0]
    })
    
    // Fonction pour changer de thème
    const handleSetTheme = (newTheme: Theme) => {
        setTheme(newTheme)
        localStorage.setItem("theme", newTheme)
        
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
    
    // Effet pour initialiser la couleur d'accent
    useEffect(() => {
        // Appliquer la couleur d'accent initiale
        document.documentElement.style.setProperty("--accent-primary", accentColor.value)
        document.documentElement.style.setProperty("--accent-primary-rgb", hexToRgb(accentColor.value))
    }, [accentColor])
    
    const value = {
        theme,
        setTheme: handleSetTheme,
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

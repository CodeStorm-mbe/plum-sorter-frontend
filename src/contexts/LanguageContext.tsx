"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Langues supportées
export type Language = "fr" | "en" | "es" | "de" | "zh" | "ar"

// Interface pour le contexte de langue
interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
    languages: { code: Language; name: string; flag: string }[]
}

// Création du contexte
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Définition des langues disponibles
const availableLanguages = [
    { code: "fr" as Language, name: "Français", flag: "🇫🇷" },
    { code: "en" as Language, name: "English", flag: "🇬🇧" },
    { code: "es" as Language, name: "Español", flag: "🇪🇸" },
    { code: "de" as Language, name: "Deutsch", flag: "🇩🇪" },
    { code: "zh" as Language, name: "中文", flag: "🇨🇳" },
    { code: "ar" as Language, name: "العربية", flag: "🇸🇦" },
]

// Traductions
const translations: Record<Language, Record<string, string>> = {
    fr: {
        // Navigation
        "nav.home": "Accueil",
        "nav.prediction": "Prédiction",
        "nav.dashboard": "Dashboard",
        "nav.about": "À propos",
        "nav.login": "Connexion",
        "nav.register": "S'inscrire",
        "nav.profile": "Mon profil",
        "nav.settings": "Paramètres",
        "nav.logout": "Déconnexion",
        "nav.darkMode": "Mode sombre",
        "nav.lightMode": "Mode clair",

        // Page d'accueil
        "home.title": "Tri automatique des prunes",
        "home.subtitle":
            "Une solution innovante utilisant l'intelligence artificielle pour classifier les prunes en six catégories distinctes avec une précision exceptionnelle.",
        "home.cta": "Tester maintenant",
        "home.how.title": "Comment ça marche",
        "home.how.description":
            "Notre système utilise des algorithmes avancés de vision par ordinateur pour analyser et classifier les prunes avec une grande précision.",

        // Authentification
        "auth.login.title": "Connexion",
        "auth.login.subtitle": "Connectez-vous pour accéder à votre tableau de bord et gérer vos analyses de prunes",
        "auth.register.title": "Créer un compte",
        "auth.register.subtitle": "Rejoignez TriPrune pour accéder à toutes les fonctionnalités d'analyse de prunes",
        "auth.forgot.title": "Mot de passe oublié",
        "auth.forgot.subtitle": "Réinitialisez votre mot de passe pour récupérer l'accès à votre compte",

        // Prédiction
        "prediction.title": "Analyse de prunes",
        "prediction.subtitle":
            "Téléchargez une image de prune pour l'analyser avec notre intelligence artificielle avancée",
        "prediction.upload": "Téléchargez une image de prune",
        "prediction.analyze": "Analyser",
        "prediction.results": "Résultats de l'analyse",

        // Catégories de prunes
        "category.good": "Bonne qualité",
        "category.unripe": "Non mûre",
        "category.spotted": "Tachetée",
        "category.cracked": "Fissurée",
        "category.bruised": "Meurtrie",
        "category.rotten": "Pourrie",

        // Paramètres
        "settings.title": "Paramètres",
        "settings.subtitle": "Personnalisez votre expérience et gérez vos préférences",

        // Sections de paramètres
        "settings.sections.profile": "Profil",
        "settings.sections.appearance": "Apparence",
        "settings.sections.language": "Langue",
        "settings.sections.notifications": "Notifications",
        "settings.sections.privacy": "Confidentialité",
        "settings.sections.security": "Sécurité",

        // Paramètres de profil
        "settings.profile.title": "Paramètres du profil",
        "settings.profile.name": "Nom complet",
        "settings.profile.namePlaceholder": "Votre nom",
        "settings.profile.email": "Email",
        "settings.profile.emailPlaceholder": "votre@email.com",
        "settings.profile.bio": "Biographie",
        "settings.profile.bioPlaceholder": "Parlez-nous un peu de vous...",
        "settings.profile.save": "Enregistrer les modifications",
        "settings.profile.saving": "Enregistrement...",
        "settings.profile.success": "Profil mis à jour avec succès",

        // Paramètres d'apparence
        "settings.appearance.title": "Paramètres d'apparence",
        "settings.appearance.themeTitle": "Thème",
        "settings.appearance.light": "Clair",
        "settings.appearance.dark": "Sombre",
        "settings.appearance.system": "Système",
        "settings.appearance.accentTitle": "Couleur d'accent",
        "settings.appearance.previewTitle": "Aperçu",
        "settings.appearance.previewText": "Voici à quoi ressemblera votre interface",
        "settings.appearance.primaryButton": "Bouton primaire",
        "settings.appearance.secondaryButton": "Bouton secondaire",
        "settings.appearance.save": "Enregistrer les modifications",
        "settings.appearance.success": "Apparence mise à jour avec succès",

        // Paramètres de langue
        "settings.language.title": "Paramètres de langue",
        "settings.language.description": "Choisissez la langue que vous souhaitez utiliser dans l'application",
        "settings.language.save": "Enregistrer la langue",
        "settings.language.success": "Langue mise à jour avec succès",

        // Paramètres de notification
        "settings.notifications.title": "Paramètres de notification",
        "settings.notifications.description": "Gérez comment et quand vous recevez des notifications",
        "settings.notifications.emailUpdates": "Mises à jour par email",
        "settings.notifications.emailUpdatesDesc": "Recevoir des mises à jour importantes par email",
        "settings.notifications.appNotifications": "Notifications dans l'application",
        "settings.notifications.appNotificationsDesc": "Afficher les notifications dans l'application",
        "settings.notifications.analysisComplete": "Analyse terminée",
        "settings.notifications.analysisCompleteDesc": "Être notifié lorsqu'une analyse de prune est terminée",
        "settings.notifications.newFeatures": "Nouvelles fonctionnalités",
        "settings.notifications.newFeaturesDesc": "Être informé des nouvelles fonctionnalités et mises à jour",
        "settings.notifications.save": "Enregistrer les préférences",
        "settings.notifications.success": "Préférences de notification mises à jour",

        // Paramètres de confidentialité
        "settings.privacy.title": "Paramètres de confidentialité",
        "settings.privacy.optionsTitle": "Options de confidentialité",
        "settings.privacy.dataCollection": "Collecte de données",
        "settings.privacy.dataCollectionDesc": "Autoriser la collecte de données pour améliorer le service",
        "settings.privacy.usageAnalytics": "Analyses d'utilisation",
        "settings.privacy.usageAnalyticsDesc": "Partager des statistiques d'utilisation anonymes",
        "settings.privacy.thirdPartySharing": "Partage avec des tiers",
        "settings.privacy.thirdPartySharingDesc": "Autoriser le partage de données avec des partenaires",
        "settings.privacy.save": "Enregistrer les préférences",
        "settings.privacy.success": "Préférences de confidentialité mises à jour",
        "settings.privacy.dataExportTitle": "Exportation de données",
        "settings.privacy.dataExportDesc": "Téléchargez une copie de toutes vos données personnelles",
        "settings.privacy.exportData": "Exporter mes données",
        "settings.privacy.exportSuccess": "Données exportées avec succès",
        "settings.privacy.dangerZoneTitle": "Zone de danger",
        "settings.privacy.deleteAccountDesc": "Supprimer définitivement votre compte et toutes vos données",
        "settings.privacy.deleteAccount": "Supprimer mon compte",
        "settings.privacy.deleteConfirm":
            "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
        "settings.privacy.confirmDelete": "Oui, supprimer mon compte",
        "settings.privacy.cancel": "Annuler",
        "settings.privacy.deleteSuccess": "Compte supprimé avec succès",

        // Paramètres de sécurité
        "settings.security.title": "Paramètres de sécurité",
        "settings.security.changePasswordTitle": "Changer de mot de passe",
        "settings.security.currentPassword": "Mot de passe actuel",
        "settings.security.newPassword": "Nouveau mot de passe",
        "settings.security.confirmPassword": "Confirmer le mot de passe",
        "settings.security.passwordRequirements": "Le mot de passe doit contenir au moins 8 caractères",
        "settings.security.updatePassword": "Mettre à jour le mot de passe",
        "settings.security.passwordChangeSuccess": "Mot de passe mis à jour avec succès",
        "settings.security.passwordTooShort": "Le mot de passe doit contenir au moins 8 caractères",
        "settings.security.passwordsDoNotMatch": "Les mots de passe ne correspondent pas",
        "settings.security.twoFactorTitle": "Authentification à deux facteurs",
        "settings.security.twoFactorAuth": "Authentification à deux facteurs",
        "settings.security.twoFactorDesc": "Ajouter une couche de sécurité supplémentaire à votre compte",
        "settings.security.twoFactorEnabled": "Authentification à deux facteurs activée",
        "settings.security.twoFactorDisabled": "Authentification à deux facteurs désactivée",
        "settings.security.activeSessions": "Sessions actives",
        "settings.security.currentSession": "Session actuelle",
        "settings.security.browser": "Navigateur",
        "settings.security.device": "Appareil",
        "settings.security.location": "Emplacement",
        "settings.security.activeNow": "Actif maintenant",
        "settings.security.logoutAllSessions": "Se déconnecter de toutes les sessions",

        // Footer
        "footer.copyright": "© 2025 TriPrune - Projet JCIA Hackathon",
    },

    en: {
        // Navigation
        "nav.home": "Home",
        "nav.prediction": "Prediction",
        "nav.dashboard": "Dashboard",
        "nav.about": "About",
        "nav.login": "Login",
        "nav.register": "Sign up",
        "nav.profile": "My profile",
        "nav.settings": "Settings",
        "nav.logout": "Logout",
        "nav.darkMode": "Dark mode",
        "nav.lightMode": "Light mode",

        // Home page
        "home.title": "Automatic plum sorting",
        "home.subtitle":
            "An innovative solution using artificial intelligence to classify plums into six distinct categories with exceptional accuracy.",
        "home.cta": "Try it now",
        "home.how.title": "How it works",
        "home.how.description":
            "Our system uses advanced computer vision algorithms to analyze and classify plums with high precision.",

        // Authentication
        "auth.login.title": "Login",
        "auth.login.subtitle": "Sign in to access your dashboard and manage your plum analyses",
        "auth.register.title": "Create an account",
        "auth.register.subtitle": "Join TriPrune to access all plum analysis features",
        "auth.forgot.title": "Forgot password",
        "auth.forgot.subtitle": "Reset your password to regain access to your account",

        // Prediction
        "prediction.title": "Plum Analysis",
        "prediction.subtitle": "Upload a plum image to analyze it with our advanced artificial intelligence",
        "prediction.upload": "Upload a plum image",
        "prediction.analyze": "Analyze",
        "prediction.results": "Analysis results",

        // Plum categories
        "category.good": "Good quality",
        "category.unripe": "Unripe",
        "category.spotted": "Spotted",
        "category.cracked": "Cracked",
        "category.bruised": "Bruised",
        "category.rotten": "Rotten",

        // Settings
        "settings.title": "Settings",
        "settings.subtitle": "Customize your experience and manage your preferences",

        // Settings sections
        "settings.sections.profile": "Profile",
        "settings.sections.appearance": "Appearance",
        "settings.sections.language": "Language",
        "settings.sections.notifications": "Notifications",
        "settings.sections.privacy": "Privacy",
        "settings.sections.security": "Security",

        // Profile settings
        "settings.profile.title": "Profile Settings",
        "settings.profile.name": "Full name",
        "settings.profile.namePlaceholder": "Your name",
        "settings.profile.email": "Email",
        "settings.profile.emailPlaceholder": "your@email.com",
        "settings.profile.bio": "Biography",
        "settings.profile.bioPlaceholder": "Tell us a bit about yourself...",
        "settings.profile.save": "Save changes",
        "settings.profile.saving": "Saving...",
        "settings.profile.success": "Profile updated successfully",

        // Appearance settings
        "settings.appearance.title": "Appearance Settings",
        "settings.appearance.themeTitle": "Theme",
        "settings.appearance.light": "Light",
        "settings.appearance.dark": "Dark",
        "settings.appearance.system": "System",
        "settings.appearance.accentTitle": "Accent color",
        "settings.appearance.previewTitle": "Preview",
        "settings.appearance.previewText": "This is how your interface will look",
        "settings.appearance.primaryButton": "Primary button",
        "settings.appearance.secondaryButton": "Secondary button",
        "settings.appearance.save": "Save changes",
        "settings.appearance.success": "Appearance updated successfully",

        // Language settings
        "settings.language.title": "Language Settings",
        "settings.language.description": "Choose the language you want to use in the application",
        "settings.language.save": "Save language",
        "settings.language.success": "Language updated successfully",

        // Notification settings
        "settings.notifications.title": "Notification Settings",
        "settings.notifications.description": "Manage how and when you receive notifications",
        "settings.notifications.emailUpdates": "Email updates",
        "settings.notifications.emailUpdatesDesc": "Receive important updates via email",
        "settings.notifications.appNotifications": "In-app notifications",
        "settings.notifications.appNotificationsDesc": "Show notifications in the application",
        "settings.notifications.analysisComplete": "Analysis complete",
        "settings.notifications.analysisCompleteDesc": "Be notified when a plum analysis is complete",
        "settings.notifications.newFeatures": "New features",
        "settings.notifications.newFeaturesDesc": "Be informed about new features and updates",
        "settings.notifications.save": "Save preferences",
        "settings.notifications.success": "Notification preferences updated",

        // Privacy settings
        "settings.privacy.title": "Privacy Settings",
        "settings.privacy.optionsTitle": "Privacy options",
        "settings.privacy.dataCollection": "Data collection",
        "settings.privacy.dataCollectionDesc": "Allow data collection to improve the service",
        "settings.privacy.usageAnalytics": "Usage analytics",
        "settings.privacy.usageAnalyticsDesc": "Share anonymous usage statistics",
        "settings.privacy.thirdPartySharing": "Third-party sharing",
        "settings.privacy.thirdPartySharingDesc": "Allow data sharing with partners",
        "settings.privacy.save": "Save preferences",
        "settings.privacy.success": "Privacy preferences updated",
        "settings.privacy.dataExportTitle": "Data export",
        "settings.privacy.dataExportDesc": "Download a copy of all your personal data",
        "settings.privacy.exportData": "Export my data",
        "settings.privacy.exportSuccess": "Data exported successfully",
        "settings.privacy.dangerZoneTitle": "Danger zone",
        "settings.privacy.deleteAccountDesc": "Permanently delete your account and all your data",
        "settings.privacy.deleteAccount": "Delete my account",
        "settings.privacy.deleteConfirm": "Are you sure you want to delete your account? This action is irreversible.",
        "settings.privacy.confirmDelete": "Yes, delete my account",
        "settings.privacy.cancel": "Cancel",
        "settings.privacy.deleteSuccess": "Account deleted successfully",

        // Security settings
        "settings.security.title": "Security Settings",
        "settings.security.changePasswordTitle": "Change password",
        "settings.security.currentPassword": "Current password",
        "settings.security.newPassword": "New password",
        "settings.security.confirmPassword": "Confirm password",
        "settings.security.passwordRequirements": "Password must be at least 8 characters long",
        "settings.security.updatePassword": "Update password",
        "settings.security.passwordChangeSuccess": "Password updated successfully",
        "settings.security.passwordTooShort": "Password must be at least 8 characters long",
        "settings.security.passwordsDoNotMatch": "Passwords do not match",
        "settings.security.twoFactorTitle": "Two-factor authentication",
        "settings.security.twoFactorAuth": "Two-factor authentication",
        "settings.security.twoFactorDesc": "Add an extra layer of security to your account",
        "settings.security.twoFactorEnabled": "Two-factor authentication enabled",
        "settings.security.twoFactorDisabled": "Two-factor authentication disabled",
        "settings.security.activeSessions": "Active sessions",
        "settings.security.currentSession": "Current session",
        "settings.security.browser": "Browser",
        "settings.security.device": "Device",
        "settings.security.location": "Location",
        "settings.security.activeNow": "Active now",
        "settings.security.logoutAllSessions": "Log out of all sessions",

        // Footer
        "footer.copyright": "© 2025 TriPrune - JCIA Hackathon Project",
    },

    es: {
        // Navigation
        "nav.home": "Inicio",
        "nav.prediction": "Predicción",
        "nav.dashboard": "Panel",
        "nav.about": "Acerca de",
        "nav.login": "Iniciar sesión",
        "nav.register": "Registrarse",
        "nav.profile": "Mi perfil",
        "nav.settings": "Configuración",
        "nav.logout": "Cerrar sesión",
        "nav.darkMode": "Modo oscuro",
        "nav.lightMode": "Modo claro",

        // Home page
        "home.title": "Clasificación automática de ciruelas",
        "home.subtitle":
            "Una solución innovadora que utiliza inteligencia artificial para clasificar ciruelas en seis categorías distintas con precisión excepcional.",
        "home.cta": "Probar ahora",
        "home.how.title": "Cómo funciona",
        "home.how.description":
            "Nuestro sistema utiliza algoritmos avanzados de visión por computadora para analizar y clasificar ciruelas con gran precisión.",

        // Authentication
        "auth.login.title": "Iniciar sesión",
        "auth.login.subtitle": "Inicie sesión para acceder a su panel y gestionar sus análisis de ciruelas",
        "auth.register.title": "Crear una cuenta",
        "auth.register.subtitle": "Únase a TriPrune para acceder a todas las funciones de análisis de ciruelas",
        "auth.forgot.title": "Contraseña olvidada",
        "auth.forgot.subtitle": "Restablezca su contraseña para recuperar el acceso a su cuenta",

        // Prediction
        "prediction.title": "Análisis de ciruelas",
        "prediction.subtitle": "Suba una imagen de ciruela para analizarla con nuestra inteligencia artificial avanzada",
        "prediction.upload": "Subir una imagen de ciruela",
        "prediction.analyze": "Analizar",
        "prediction.results": "Resultados del análisis",

        // Plum categories
        "category.good": "Buena calidad",
        "category.unripe": "No madura",
        "category.spotted": "Manchada",
        "category.cracked": "Agrietada",
        "category.bruised": "Magullada",
        "category.rotten": "Podrida",

        // Settings
        "settings.title": "Configuración",
        "settings.subtitle": "Personalice su experiencia y gestione sus preferencias",

        // Settings sections
        "settings.sections.profile": "Perfil",
        "settings.sections.appearance": "Apariencia",
        "settings.sections.language": "Idioma",
        "settings.sections.notifications": "Notificaciones",
        "settings.sections.privacy": "Privacidad",
        "settings.sections.security": "Seguridad",

        // Profile settings
        "settings.profile.title": "Configuración del perfil",
        "settings.profile.name": "Nombre completo",
        "settings.profile.namePlaceholder": "Su nombre",
        "settings.profile.email": "Correo electrónico",
        "settings.profile.emailPlaceholder": "su@email.com",
        "settings.profile.bio": "Biografía",
        "settings.profile.bioPlaceholder": "Cuéntenos un poco sobre usted...",
        "settings.profile.save": "Guardar cambios",
        "settings.profile.saving": "Guardando...",
        "settings.profile.success": "Perfil actualizado con éxito",

        // Appearance settings
        "settings.appearance.title": "Configuración de apariencia",
        "settings.appearance.themeTitle": "Tema",
        "settings.appearance.light": "Claro",
        "settings.appearance.dark": "Oscuro",
        "settings.appearance.system": "Sistema",
        "settings.appearance.accentTitle": "Color de acento",
        "settings.appearance.previewTitle": "Vista previa",
        "settings.appearance.previewText": "Así es como se verá su interfaz",
        "settings.appearance.primaryButton": "Botón primario",
        "settings.appearance.secondaryButton": "Botón secundario",
        "settings.appearance.save": "Guardar cambios",
        "settings.appearance.success": "Apariencia actualizada con éxito",

        // Language settings
        "settings.language.title": "Configuración de idioma",
        "settings.language.description": "Elija el idioma que desea utilizar en la aplicación",
        "settings.language.save": "Guardar idioma",
        "settings.language.success": "Idioma actualizado con éxito",

        // Notification settings
        "settings.notifications.title": "Configuración de notificaciones",
        "settings.notifications.description": "Gestione cómo y cuándo recibe notificaciones",
        "settings.notifications.emailUpdates": "Actualizaciones por correo",
        "settings.notifications.emailUpdatesDesc": "Recibir actualizaciones importantes por correo electrónico",
        "settings.notifications.appNotifications": "Notificaciones en la aplicación",
        "settings.notifications.appNotificationsDesc": "Mostrar notificaciones en la aplicación",
        "settings.notifications.analysisComplete": "Análisis completo",
        "settings.notifications.analysisCompleteDesc": "Ser notificado cuando se complete un análisis de ciruela",
        "settings.notifications.newFeatures": "Nuevas funciones",
        "settings.notifications.newFeaturesDesc": "Ser informado sobre nuevas funciones y actualizaciones",
        "settings.notifications.save": "Guardar preferencias",
        "settings.notifications.success": "Preferencias de notificación actualizadas",

        // Privacy settings
        "settings.privacy.title": "Configuración de privacidad",
        "settings.privacy.optionsTitle": "Opciones de privacidad",
        "settings.privacy.dataCollection": "Recopilación de datos",
        "settings.privacy.dataCollectionDesc": "Permitir la recopilación de datos para mejorar el servicio",
        "settings.privacy.usageAnalytics": "Análisis de uso",
        "settings.privacy.usageAnalyticsDesc": "Compartir estadísticas de uso anónimas",
        "settings.privacy.thirdPartySharing": "Compartir con terceros",
        "settings.privacy.thirdPartySharingDesc": "Permitir compartir datos con socios",
        "settings.privacy.save": "Guardar preferencias",
        "settings.privacy.success": "Preferencias de privacidad actualizadas",
        "settings.privacy.dataExportTitle": "Exportación de datos",
        "settings.privacy.dataExportDesc": "Descargue una copia de todos sus datos personales",
        "settings.privacy.exportData": "Exportar mis datos",
        "settings.privacy.exportSuccess": "Datos exportados con éxito",
        "settings.privacy.dangerZoneTitle": "Zona de peligro",
        "settings.privacy.deleteAccountDesc": "Eliminar permanentemente su cuenta y todos sus datos",
        "settings.privacy.deleteAccount": "Eliminar mi cuenta",
        "settings.privacy.deleteConfirm": "¿Está seguro de que desea eliminar su cuenta? Esta acción es irreversible.",
        "settings.privacy.confirmDelete": "Sí, eliminar mi cuenta",
        "settings.privacy.cancel": "Cancelar",
        "settings.privacy.deleteSuccess": "Cuenta eliminada con éxito",

        // Security settings
        "settings.security.title": "Configuración de seguridad",
        "settings.security.changePasswordTitle": "Cambiar contraseña",
        "settings.security.currentPassword": "Contraseña actual",
        "settings.security.newPassword": "Nueva contraseña",
        "settings.security.confirmPassword": "Confirmar contraseña",
        "settings.security.passwordRequirements": "La contraseña debe tener al menos 8 caracteres",
        "settings.security.updatePassword": "Actualizar contraseña",
        "settings.security.passwordChangeSuccess": "Contraseña actualizada con éxito",
        "settings.security.passwordTooShort": "La contraseña debe tener al menos 8 caracteres",
        "settings.security.passwordsDoNotMatch": "Las contraseñas no coinciden",
        "settings.security.twoFactorTitle": "Autenticación de dos factores",
        "settings.security.twoFactorAuth": "Autenticación de dos factores",
        "settings.security.twoFactorDesc": "Añadir una capa adicional de seguridad a su cuenta",
        "settings.security.twoFactorEnabled": "Autenticación de dos factores activada",
        "settings.security.twoFactorDisabled": "Autenticación de dos factores desactivada",
        "settings.security.activeSessions": "Sesiones activas",
        "settings.security.currentSession": "Sesión actual",
        "settings.security.browser": "Navegador",
        "settings.security.device": "Dispositivo",
        "settings.security.location": "Ubicación",
        "settings.security.activeNow": "Activo ahora",
        "settings.security.logoutAllSessions": "Cerrar sesión en todas las sesiones",

        // Footer
        "footer.copyright": "© 2025 TriPrune - Proyecto Hackathon JCIA",
    },

    de: {
        // Navigation
        "nav.home": "Startseite",
        "nav.prediction": "Vorhersage",
        "nav.dashboard": "Dashboard",
        "nav.about": "Über uns",
        "nav.login": "Anmelden",
        "nav.register": "Registrieren",
        "nav.profile": "Mein Profil",
        "nav.settings": "Einstellungen",
        "nav.logout": "Abmelden",
        "nav.darkMode": "Dunkelmodus",
        "nav.lightMode": "Hellmodus",

        // Home page
        "home.title": "Automatische Pflaumensortierung",
        "home.subtitle":
            "Eine innovative Lösung, die künstliche Intelligenz nutzt, um Pflaumen mit außergewöhnlicher Genauigkeit in sechs verschiedene Kategorien zu klassifizieren.",
        "home.cta": "Jetzt testen",
        "home.how.title": "Wie es funktioniert",
        "home.how.description":
            "Unser System verwendet fortschrittliche Computer-Vision-Algorithmen, um Pflaumen mit hoher Präzision zu analysieren und zu klassifizieren.",

        // Authentication
        "auth.login.title": "Anmelden",
        "auth.login.subtitle":
            "Melden Sie sich an, um auf Ihr Dashboard zuzugreifen und Ihre Pflaumenanalysen zu verwalten",
        "auth.register.title": "Konto erstellen",
        "auth.register.subtitle": "Treten Sie TriPrune bei, um Zugang zu allen Pflaumenanalyse-Funktionen zu erhalten",
        "auth.forgot.title": "Passwort vergessen",
        "auth.forgot.subtitle": "Setzen Sie Ihr Passwort zurück, um wieder Zugriff auf Ihr Konto zu erhalten",

        // Prediction
        "prediction.title": "Pflaumenanalyse",
        "prediction.subtitle":
            "Laden Sie ein Pflaumenbild hoch, um es mit unserer fortschrittlichen künstlichen Intelligenz zu analysieren",
        "prediction.upload": "Pflaumenbild hochladen",
        "prediction.analyze": "Analysieren",
        "prediction.results": "Analyseergebnisse",

        // Plum categories
        "category.good": "Gute Qualität",
        "category.unripe": "Unreif",
        "category.spotted": "Fleckig",
        "category.cracked": "Rissig",
        "category.bruised": "Gequetscht",
        "category.rotten": "Verfault",

        // Settings
        "settings.title": "Einstellungen",
        "settings.subtitle": "Passen Sie Ihre Erfahrung an und verwalten Sie Ihre Präferenzen",

        // Settings sections
        "settings.sections.profile": "Profil",
        "settings.sections.appearance": "Erscheinungsbild",
        "settings.sections.language": "Sprache",
        "settings.sections.notifications": "Benachrichtigungen",
        "settings.sections.privacy": "Datenschutz",
        "settings.sections.security": "Sicherheit",

        // Profile settings
        "settings.profile.title": "Profileinstellungen",
        "settings.profile.name": "Vollständiger Name",
        "settings.profile.namePlaceholder": "Ihr Name",
        "settings.profile.email": "E-Mail",
        "settings.profile.emailPlaceholder": "ihre@email.com",
        "settings.profile.bio": "Biografie",
        "settings.profile.bioPlaceholder": "Erzählen Sie uns etwas über sich...",
        "settings.profile.save": "Änderungen speichern",
        "settings.profile.saving": "Speichern...",
        "settings.profile.success": "Profil erfolgreich aktualisiert",

        // Appearance settings
        "settings.appearance.title": "Erscheinungsbildeinstellungen",
        "settings.appearance.themeTitle": "Thema",
        "settings.appearance.light": "Hell",
        "settings.appearance.dark": "Dunkel",
        "settings.appearance.system": "System",
        "settings.appearance.accentTitle": "Akzentfarbe",
        "settings.appearance.previewTitle": "Vorschau",
        "settings.appearance.previewText": "So wird Ihre Benutzeroberfläche aussehen",
        "settings.appearance.primaryButton": "Primärer Button",
        "settings.appearance.secondaryButton": "Sekundärer Button",
        "settings.appearance.save": "Änderungen speichern",
        "settings.appearance.success": "Erscheinungsbild erfolgreich aktualisiert",

        // Language settings
        "settings.language.title": "Spracheinstellungen",
        "settings.language.description": "Wählen Sie die Sprache, die Sie in der Anwendung verwenden möchten",
        "settings.language.save": "Sprache speichern",
        "settings.language.success": "Sprache erfolgreich aktualisiert",

        // Notification settings
        "settings.notifications.title": "Benachrichtigungseinstellungen",
        "settings.notifications.description": "Verwalten Sie, wie und wann Sie Benachrichtigungen erhalten",
        "settings.notifications.emailUpdates": "E-Mail-Updates",
        "settings.notifications.emailUpdatesDesc": "Wichtige Updates per E-Mail erhalten",
        "settings.notifications.appNotifications": "In-App-Benachrichtigungen",
        "settings.notifications.appNotificationsDesc": "Benachrichtigungen in der Anwendung anzeigen",
        "settings.notifications.analysisComplete": "Analyse abgeschlossen",
        "settings.notifications.analysisCompleteDesc": "Benachrichtigt werden, wenn eine Pflaumenanalyse abgeschlossen ist",
        "settings.notifications.newFeatures": "Neue Funktionen",
        "settings.notifications.newFeaturesDesc": "Über neue Funktionen und Updates informiert werden",
        "settings.notifications.save": "Präferenzen speichern",
        "settings.notifications.success": "Benachrichtigungspräferenzen aktualisiert",

        // Privacy settings
        "settings.privacy.title": "Datenschutzeinstellungen",
        "settings.privacy.optionsTitle": "Datenschutzoptionen",
        "settings.privacy.dataCollection": "Datenerfassung",
        "settings.privacy.dataCollectionDesc": "Datenerfassung zur Verbesserung des Dienstes zulassen",
        "settings.privacy.usageAnalytics": "Nutzungsanalyse",
        "settings.privacy.usageAnalyticsDesc": "Anonyme Nutzungsstatistiken teilen",
        "settings.privacy.thirdPartySharing": "Teilen mit Dritten",
        "settings.privacy.thirdPartySharingDesc": "Datenaustausch mit Partnern zulassen",
        "settings.privacy.save": "Präferenzen speichern",
        "settings.privacy.success": "Datenschutzpräferenzen aktualisiert",
        "settings.privacy.dataExportTitle": "Datenexport",
        "settings.privacy.dataExportDesc": "Laden Sie eine Kopie all Ihrer persönlichen Daten herunter",
        "settings.privacy.exportData": "Meine Daten exportieren",
        "settings.privacy.exportSuccess": "Daten erfolgreich exportiert",
        "settings.privacy.dangerZoneTitle": "Gefahrenzone",
        "settings.privacy.deleteAccountDesc": "Löschen Sie Ihr Konto und alle Ihre Daten dauerhaft",
        "settings.privacy.deleteAccount": "Mein Konto löschen",
        "settings.privacy.deleteConfirm":
            "Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion ist irreversibel.",
        "settings.privacy.confirmDelete": "Ja, mein Konto löschen",
        "settings.privacy.cancel": "Abbrechen",
        "settings.privacy.deleteSuccess": "Konto erfolgreich gelöscht",

        // Security settings
        "settings.security.title": "Sicherheitseinstellungen",
        "settings.security.changePasswordTitle": "Passwort ändern",
        "settings.security.currentPassword": "Aktuelles Passwort",
        "settings.security.newPassword": "Neues Passwort",
        "settings.security.confirmPassword": "Passwort bestätigen",
        "settings.security.passwordRequirements": "Das Passwort muss mindestens 8 Zeichen lang sein",
        "settings.security.updatePassword": "Passwort aktualisieren",
        "settings.security.passwordChangeSuccess": "Passwort erfolgreich aktualisiert",
        "settings.security.passwordTooShort": "Das Passwort muss mindestens 8 Zeichen lang sein",
        "settings.security.passwordsDoNotMatch": "Die Passwörter stimmen nicht überein",
        "settings.security.twoFactorTitle": "Zwei-Faktor-Authentifizierung",
        "settings.security.twoFactorAuth": "Zwei-Faktor-Authentifizierung",
        "settings.security.twoFactorDesc": "Fügen Sie Ihrem Konto eine zusätzliche Sicherheitsebene hinzu",
        "settings.security.twoFactorEnabled": "Zwei-Faktor-Authentifizierung aktiviert",
        "settings.security.twoFactorDisabled": "Zwei-Faktor-Authentifizierung deaktiviert",
        "settings.security.activeSessions": "Aktive Sitzungen",
        "settings.security.currentSession": "Aktuelle Sitzung",
        "settings.security.browser": "Browser",
        "settings.security.device": "Gerät",
        "settings.security.location": "Standort",
        "settings.security.activeNow": "Jetzt aktiv",
        "settings.security.logoutAllSessions": "Von allen Sitzungen abmelden",

        // Footer
        "footer.copyright": "© 2025 TriPrune - JCIA Hackathon Projekt",
    },

    zh: {
        // Navigation
        "nav.home": "首页",
        "nav.prediction": "预测",
        "nav.dashboard": "仪表板",
        "nav.about": "关于",
        "nav.login": "登录",
        "nav.register": "注册",
        "nav.profile": "我的资料",
        "nav.settings": "设置",
        "nav.logout": "登出",
        "nav.darkMode": "深色模式",
        "nav.lightMode": "浅色模式",

        // Home page
        "home.title": "自动李子分类",
        "home.subtitle": "一种创新解决方案，使用人工智能以卓越的精度将李子分为六个不同类别。",
        "home.cta": "立即测试",
        "home.how.title": "工作原理",
        "home.how.description": "我们的系统使用先进的计算机视觉算法，以高精度分析和分类李子。",

        // Authentication
        "auth.login.title": "登录",
        "auth.login.subtitle": "登录以访问您的仪表板并管理您的李子分析",
        "auth.register.title": "创建账户",
        "auth.register.subtitle": "加入TriPrune，访问所有李子分析功能",
        "auth.forgot.title": "忘记密码",
        "auth.forgot.subtitle": "重置密码以重新获得账户访问权限",

        // Prediction
        "prediction.title": "李子分析",
        "prediction.subtitle": "上传李子图像，用我们的先进人工智能进行分析",
        "prediction.upload": "上传李子图像",
        "prediction.analyze": "分析",
        "prediction.results": "分析结果",

        // Plum categories
        "category.good": "优质",
        "category.unripe": "未成熟",
        "category.spotted": "有斑点",
        "category.cracked": "有裂缝",
        "category.bruised": "有瘀伤",
        "category.rotten": "腐烂",

        // Settings
        "settings.title": "设置",
        "settings.subtitle": "自定义您的体验并管理您的偏好",

        // Settings sections
        "settings.sections.profile": "个人资料",
        "settings.sections.appearance": "外观",
        "settings.sections.language": "语言",
        "settings.sections.notifications": "通知",
        "settings.sections.privacy": "隐私",
        "settings.sections.security": "安全",

        // Profile settings
        "settings.profile.title": "个人资料设置",
        "settings.profile.name": "全名",
        "settings.profile.namePlaceholder": "您的姓名",
        "settings.profile.email": "电子邮件",
        "settings.profile.emailPlaceholder": "your@email.com",
        "settings.profile.bio": "个人简介",
        "settings.profile.bioPlaceholder": "告诉我们一些关于您的信息...",
        "settings.profile.save": "保存更改",
        "settings.profile.saving": "保存中...",
        "settings.profile.success": "个人资料更新成功",

        // Appearance settings
        "settings.appearance.title": "外观设置",
        "settings.appearance.themeTitle": "主题",
        "settings.appearance.light": "浅色",
        "settings.appearance.dark": "深色",
        "settings.appearance.system": "系统",
        "settings.appearance.accentTitle": "强调色",
        "settings.appearance.previewTitle": "预览",
        "settings.appearance.previewText": "您的界面将如此显示",
        "settings.appearance.primaryButton": "主要按钮",
        "settings.appearance.secondaryButton": "次要按钮",
        "settings.appearance.save": "保存更改",
        "settings.appearance.success": "外观更新成功",

        // Language settings
        "settings.language.title": "语言设置",
        "settings.language.description": "选择您想在应用中使用的语言",
        "settings.language.save": "保存语言",
        "settings.language.success": "语言更新成功",

        // Notification settings
        "settings.notifications.title": "通知设置",
        "settings.notifications.description": "管理您接收通知的方式和时间",
        "settings.notifications.emailUpdates": "电子邮件更新",
        "settings.notifications.emailUpdatesDesc": "通过电子邮件接收重要更新",
        "settings.notifications.appNotifications": "应用内通知",
        "settings.notifications.appNotificationsDesc": "在应用中显示通知",
        "settings.notifications.analysisComplete": "分析完成",
        "settings.notifications.analysisCompleteDesc": "当李子分析完成时收到通知",
        "settings.notifications.newFeatures": "新功能",
        "settings.notifications.newFeaturesDesc": "了解新功能和更新",
        "settings.notifications.save": "保存偏好",
        "settings.notifications.success": "通知偏好已更新",

        // Privacy settings
        "settings.privacy.title": "隐私设置",
        "settings.privacy.optionsTitle": "隐私选项",
        "settings.privacy.dataCollection": "数据收集",
        "settings.privacy.dataCollectionDesc": "允许数据收集以改进服务",
        "settings.privacy.usageAnalytics": "使用分析",
        "settings.privacy.usageAnalyticsDesc": "分享匿名使用统计",
        "settings.privacy.thirdPartySharing": "第三方共享",
        "settings.privacy.thirdPartySharingDesc": "允许与合作伙伴共享数据",
        "settings.privacy.save": "保存偏好",
        "settings.privacy.success": "隐私偏好已更新",
        "settings.privacy.dataExportTitle": "数据导出",
        "settings.privacy.dataExportDesc": "下载您所有个人数据的副本",
        "settings.privacy.exportData": "导出我的数据",
        "settings.privacy.exportSuccess": "数据导出成功",
        "settings.privacy.dangerZoneTitle": "危险区域",
        "settings.privacy.deleteAccountDesc": "永久删除您的账户和所有数据",
        "settings.privacy.deleteAccount": "删除我的账户",
        "settings.privacy.deleteConfirm": "您确定要删除您的账户吗？此操作不可逆。",
        "settings.privacy.confirmDelete": "是的，删除我的账户",
        "settings.privacy.cancel": "取消",
        "settings.privacy.deleteSuccess": "账户删除成功",

        // Security settings
        "settings.security.title": "安全设置",
        "settings.security.changePasswordTitle": "更改密码",
        "settings.security.currentPassword": "当前密码",
        "settings.security.newPassword": "新密码",
        "settings.security.confirmPassword": "确认密码",
        "settings.security.passwordRequirements": "密码必须至少有8个字符",
        "settings.security.updatePassword": "更新密码",
        "settings.security.passwordChangeSuccess": "密码更新成功",
        "settings.security.passwordTooShort": "密码必须至少有8个字符",
        "settings.security.passwordsDoNotMatch": "密码不匹配",
        "settings.security.twoFactorTitle": "两因素认证",
        "settings.security.twoFactorAuth": "两因素认证",
        "settings.security.twoFactorDesc": "为您的账户添加额外的安全层",
        "settings.security.twoFactorEnabled": "两因素认证已启用",
        "settings.security.twoFactorDisabled": "两因素认证已禁用",
        "settings.security.activeSessions": "活动会话",
        "settings.security.currentSession": "当前会话",
        "settings.security.browser": "浏览器",
        "settings.security.device": "设备",
        "settings.security.location": "位置",
        "settings.security.activeNow": "当前活动",
        "settings.security.logoutAllSessions": "登出所有会话",

        // Footer
        "footer.copyright": "© 2025 TriPrune - JCIA黑客马拉松项目",
    },

    ar: {
        // Navigation
        "nav.home": "الرئيسية",
        "nav.prediction": "التنبؤ",
        "nav.dashboard": "لوحة التحكم",
        "nav.about": "حول",
        "nav.login": "تسجيل الدخول",
        "nav.register": "التسجيل",
        "nav.profile": "ملفي الشخصي",
        "nav.settings": "الإعدادات",
        "nav.logout": "تسجيل الخروج",
        "nav.darkMode": "الوضع المظلم",
        "nav.lightMode": "الوضع الفاتح",

        // Home page
        "home.title": "فرز البرقوق التلقائي",
        "home.subtitle": "حل مبتكر يستخدم الذكاء الاصطناعي لتصنيف البرقوق إلى ست فئات متميزة بدقة استثنائية.",
        "home.cta": "جرب الآن",
        "home.how.title": "كيف يعمل",
        "home.how.description": "يستخدم نظامنا خوارزميات رؤية الكمبيوتر المتقدمة لتحليل وتصنيف البرقوق بدقة عالية.",

        // Authentication
        "auth.login.title": "تسجيل الدخول",
        "auth.login.subtitle": "قم بتسجيل الدخول للوصول إلى لوحة التحكم الخاصة بك وإدارة تحليلات البرقوق",
        "auth.register.title": "إنشاء حساب",
        "auth.register.subtitle": "انضم إلى TriPrune للوصول إلى جميع ميزات تحليل البرقوق",
        "auth.forgot.title": "نسيت كلمة المرور",
        "auth.forgot.subtitle": "أعد تعيين كلمة المرور لاستعادة الوصول إلى حسابك",

        // Prediction
        "prediction.title": "تحليل البرقوق",
        "prediction.subtitle": "قم بتحميل صورة البرقوق لتحليلها باستخدام الذكاء الاصطناعي المتقدم",
        "prediction.upload": "تحميل صورة البرقوق",
        "prediction.analyze": "تحليل",
        "prediction.results": "نتائج التحليل",

        // Plum categories
        "category.good": "جودة جيدة",
        "category.unripe": "غير ناضج",
        "category.spotted": "مبقع",
        "category.cracked": "متشقق",
        "category.bruised": "مكدوم",
        "category.rotten": "فاسد",

        // Settings
        "settings.title": "الإعدادات",
        "settings.subtitle": "تخصيص تجربتك وإدارة تفضيلاتك",

        // Settings sections
        "settings.sections.profile": "الملف الشخصي",
        "settings.sections.appearance": "المظهر",
        "settings.sections.language": "اللغة",
        "settings.sections.notifications": "الإشعارات",
        "settings.sections.privacy": "الخصوصية",
        "settings.sections.security": "الأمان",

        // Profile settings
        "settings.profile.title": "إعدادات الملف الشخصي",
        "settings.profile.name": "الاسم الكامل",
        "settings.profile.namePlaceholder": "اسمك",
        "settings.profile.email": "البريد الإلكتروني",
        "settings.profile.emailPlaceholder": "your@email.com",
        "settings.profile.bio": "السيرة الذاتية",
        "settings.profile.bioPlaceholder": "أخبرنا قليلاً عن نفسك...",
        "settings.profile.save": "حفظ التغييرات",
        "settings.profile.saving": "جاري الحفظ...",
        "settings.profile.success": "تم تحديث الملف الشخصي بنجاح",

        // Appearance settings
        "settings.appearance.title": "إعدادات المظهر",
        "settings.appearance.themeTitle": "السمة",
        "settings.appearance.light": "فاتح",
        "settings.appearance.dark": "داكن",
        "settings.appearance.system": "النظام",
        "settings.appearance.accentTitle": "لون التمييز",
        "settings.appearance.previewTitle": "معاينة",
        "settings.appearance.previewText": "هكذا ستبدو واجهتك",
        "settings.appearance.primaryButton": "زر أساسي",
        "settings.appearance.secondaryButton": "زر ثانوي",
        "settings.appearance.save": "حفظ التغييرات",
        "settings.appearance.success": "تم تحديث المظهر بنجاح",

        // Language settings
        "settings.language.title": "إعدادات اللغة",
        "settings.language.description": "اختر اللغة التي تريد استخدامها في التطبيق",
        "settings.language.save": "حفظ اللغة",
        "settings.language.success": "تم تحديث اللغة بنجاح",

        // Notification settings
        "settings.notifications.title": "إعدادات الإشعارات",
        "settings.notifications.description": "إدارة كيفية ووقت تلقي الإشعارات",
        "settings.notifications.emailUpdates": "تحديثات البريد الإلكتروني",
        "settings.notifications.emailUpdatesDesc": "تلقي التحديثات المهمة عبر البريد الإلكتروني",
        "settings.notifications.appNotifications": "إشعارات التطبيق",
        "settings.notifications.appNotificationsDesc": "عرض الإشعارات في التطبيق",
        "settings.notifications.analysisComplete": "اكتمال التحليل",
        "settings.notifications.analysisCompleteDesc": "تلقي إشعار عند اكتمال تحليل البرقوق",
        "settings.notifications.newFeatures": "ميزات جديدة",
        "settings.notifications.newFeaturesDesc": "الإبلاغ عن الميزات الجديدة والتحديثات",
        "settings.notifications.save": "حفظ التفضيلات",
        "settings.notifications.success": "تم تحديث تفضيلات الإشعارات",

        // Privacy settings
        "settings.privacy.title": "إعدادات الخصوصية",
        "settings.privacy.optionsTitle": "خيارات الخصوصية",
        "settings.privacy.dataCollection": "جمع البيانات",
        "settings.privacy.dataCollectionDesc": "السماح بجمع البيانات لتحسين الخدمة",
        "settings.privacy.usageAnalytics": "تحليلات الاستخدام",
        "settings.privacy.usageAnalyticsDesc": "مشاركة إحصائيات الاستخدام المجهولة",
        "settings.privacy.thirdPartySharing": "المشاركة مع أطراف ثالثة",
        "settings.privacy.thirdPartySharingDesc": "السماح بمشاركة البيانات مع الشركاء",
        "settings.privacy.save": "حفظ التفضيلات",
        "settings.privacy.success": "تم تحديث تفضيلات الخصوصية",
        "settings.privacy.dataExportTitle": "تصدير البيانات",
        "settings.privacy.dataExportDesc": "تنزيل نسخة من جميع بياناتك الشخصية",
        "settings.privacy.exportData": "تصدير بياناتي",
        "settings.privacy.exportSuccess": "تم تصدير البيانات بنجاح",
        "settings.privacy.dangerZoneTitle": "منطقة الخطر",
        "settings.privacy.deleteAccountDesc": "حذف حسابك وجميع بياناتك بشكل دائم",
        "settings.privacy.deleteAccount": "حذف حسابي",
        "settings.privacy.deleteConfirm": "هل أنت متأكد من رغبتك في حذف حسابك؟ هذا الإجراء لا رجعة فيه.",
        "settings.privacy.confirmDelete": "نعم، احذف حسابي",
        "settings.privacy.cancel": "إلغاء",
        "settings.privacy.deleteSuccess": "تم حذف الحساب بنجاح",

        // Security settings
        "settings.security.title": "إعدادات الأمان",
        "settings.security.changePasswordTitle": "تغيير كلمة المرور",
        "settings.security.currentPassword": "كلمة المرور الحالية",
        "settings.security.newPassword": "كلمة المرور الجديدة",
        "settings.security.confirmPassword": "تأكيد كلمة المرور",
        "settings.security.passwordRequirements": "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل",
        "settings.security.updatePassword": "تحديث كلمة المرور",
        "settings.security.passwordChangeSuccess": "تم تحديث كلمة المرور بنجاح",
        "settings.security.passwordTooShort": "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل",
        "settings.security.passwordsDoNotMatch": "كلمات المرور غير متطابقة",
        "settings.security.twoFactorTitle": "المصادقة الثنائية",
        "settings.security.twoFactorAuth": "المصادقة الثنائية",
        "settings.security.twoFactorDesc": "إضافة طبقة أمان إضافية لحسابك",
        "settings.security.twoFactorEnabled": "تم تفعيل المصادقة الثنائية",
        "settings.security.twoFactorDisabled": "تم تعطيل المصادقة الثنائية",
        "settings.security.activeSessions": "الجلسات النشطة",
        "settings.security.currentSession": "الجلسة الحالية",
        "settings.security.browser": "المتصفح",
        "settings.security.device": "الجهاز",
        "settings.security.location": "الموقع",
        "settings.security.activeNow": "نشط الآن",
        "settings.security.logoutAllSessions": "تسجيل الخروج من جميع الجلسات",

        // Footer
        "footer.copyright": "© 2025 TriPrune - مشروع هاكاثون JCIA",
    },
}

// Provider du contexte de langue
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Récupérer la langue du navigateur ou utiliser le français par défaut
    const getBrowserLanguage = (): Language => {
        const browserLang = navigator.language.split("-")[0]
        return (availableLanguages.find((lang) => lang.code === browserLang)?.code || "fr") as Language
    }

    // État pour stocker la langue actuelle
    const [language, setLanguageState] = useState<Language>(() => {
        // Récupérer la langue depuis le localStorage ou utiliser la langue du navigateur
        const savedLanguage = localStorage.getItem("triprune_language")
        return (savedLanguage as Language) || getBrowserLanguage()
    })

    // Fonction pour changer de langue
    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        localStorage.setItem("triprune_language", lang)

        // Mettre à jour l'attribut dir pour les langues RTL (comme l'arabe)
        if (lang === "ar") {
            document.documentElement.dir = "rtl"
            document.documentElement.lang = lang
        } else {
            document.documentElement.dir = "ltr"
            document.documentElement.lang = lang
        }
    }

    // Effet pour initialiser la direction du document
    useEffect(() => {
        if (language === "ar") {
            document.documentElement.dir = "rtl"
            document.documentElement.lang = language
        } else {
            document.documentElement.dir = "ltr"
            document.documentElement.lang = language
        }
    }, [language])

    // Fonction de traduction
    const t = (key: string): string => {
        return translations[language][key] || key
    }

    const value = {
        language,
        setLanguage,
        t,
        languages: availableLanguages,
    }

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// Hook personnalisé pour utiliser le contexte de langue
export const useLanguage = () => {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useLanguage doit être utilisé à l'intérieur d'un LanguageProvider")
    }
    return context
}

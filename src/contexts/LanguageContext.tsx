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

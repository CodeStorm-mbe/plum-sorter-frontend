"use client"

// App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { AuthProvider } from "./contexts/AuthContext"
import { LanguageProvider } from "./contexts/LanguageContext"
import { ThemeProvider } from "./contexts/ThemeContext"
import { NotificationProvider } from "./contexts/NotificationContext"
import { PrivacyProvider } from "./contexts/PrivacyContext"
import { SecurityProvider } from "./contexts/SecurityContext"

// Import des pages
import HomePage from "./pages/HomePage"
import PredictionPage from "./pages/PredictionPage"
import DashboardPage from "./pages/DashboardPage"
import AboutPage from "./pages/AboutPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ProfilePage from "./pages/ProfilePage"
import SettingsPage from "./pages/SettingsPage"

// Import des styles
import "./styles/globals.css"

// Wrapper pour AnimatePresence
const AnimatedRoutes = () => {
    const location = useLocation()

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/prediction" element={<PredictionPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Routes>
        </AnimatePresence>
    )
}

function App() {
    return (
        <Router>
            <LanguageProvider>
                <ThemeProvider>
                    <AuthProvider>
                        <NotificationProvider>
                            <PrivacyProvider>
                                <SecurityProvider>
                                    <AnimatedRoutes />
                                </SecurityProvider>
                            </PrivacyProvider>
                        </NotificationProvider>
                    </AuthProvider>
                </ThemeProvider>
            </LanguageProvider>
        </Router>
    )
}

export default App

"use client"

// App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { AuthProvider } from "./contexts/AuthContext"
// Importer le LanguageProvider
import { LanguageProvider } from "./contexts/LanguageContext"

// Import des pages
import HomePage from "./pages/HomePage"
import PredictionPage from "./pages/PredictionPage"
import DashboardPage from "./pages/DashboardPage"
import AboutPage from "./pages/AboutPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ProfilePage from "./pages/ProfilePage"

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
            </Routes>
        </AnimatePresence>
    )
}

// Mettre à jour la fonction App pour inclure le LanguageProvider
function App() {
    return (
        <Router>
            <LanguageProvider>
                <AuthProvider>
                    <AnimatedRoutes />
                </AuthProvider>
            </LanguageProvider>
        </Router>
    )
}

export default App

"use client"

import type React from "react"

// App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { AuthProvider, useAuth } from "./contexts/AuthContext"

// Import des pages
import HomePage from "./pages/HomePage"
import PredictionPage from "./pages/PredictionPage"
import DashboardPage from "./pages/DashboardPage"
import AboutPage from "./pages/AboutPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProfilePage from "./pages/ProfilePage"

// Import des styles
import "./styles/globals.css"

// Composant pour les routes protégées
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

// Wrapper pour AnimatePresence
const AnimatedRoutes = () => {
    const location = useLocation()

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route
                    path="/prediction"
                    element={
                        <ProtectedRoute>
                            <PredictionPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </AnimatePresence>
    )
}

function AppWithAuth() {
    return <AnimatedRoutes />
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppWithAuth />
            </AuthProvider>
        </Router>
    )
}

export default App

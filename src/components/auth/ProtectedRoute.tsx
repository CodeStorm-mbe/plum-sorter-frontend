"use client"

import type React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import LoadingSpinner from "../LoadingSpinner"

interface ProtectedRouteProps {
    children: React.ReactNode
    requireAdmin?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
    const { user, isAuthenticated, isLoading } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (!isAuthenticated) {
        // Rediriger vers la page de connexion avec l'URL de retour
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (requireAdmin && user?.role !== "admin") {
        // Rediriger vers la page d'accueil si l'utilisateur n'est pas admin
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}

export default ProtectedRoute

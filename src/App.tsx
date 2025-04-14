<<<<<<< HEAD
// Mise à jour du fichier App.tsx pour inclure les nouvelles pages
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
import FarmPage from "./pages/FarmPage"
import BatchPage from "./pages/BatchPage"
import BatchClassificationPage from "./pages/BatchClassificationPage"
import ModelManagementPage from "./pages/ModelManagementPage"
// Import des composants d'authentification
import ProtectedRoute from "./components/auth/ProtectedRoute"
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
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                } />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                } />
                <Route path="/settings" element={
                    <ProtectedRoute>
                        <SettingsPage />
                    </ProtectedRoute>
                } />
                <Route path="/farms" element={
                    <ProtectedRoute>
                        <FarmPage />
                    </ProtectedRoute>
                } />
                <Route path="/batches" element={
                    <ProtectedRoute>
                        <BatchPage />
                    </ProtectedRoute>
                } />
                <Route path="/batches/:batchId/add-images" element={
                    <ProtectedRoute>
                        <BatchClassificationPage />
                    </ProtectedRoute>
                } />
                <Route path="/models" element={
                    <ProtectedRoute adminOnly={true}>
                        <ModelManagementPage />
                    </ProtectedRoute>
                } />
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
=======
import { MantineProvider, createTheme, MantineColorsTuple } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardHome from '@/pages/DashboardHome';
import FarmsPage from '@/pages/FarmsPage';
import ClassificationPage from '@/pages/ClassificationPage';
import BatchesPage from '@/pages/BatchesPage';
import StatisticsPage from '@/pages/StatisticsPage';
import SettingsPage from '@/pages/SettingsPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import VerifyEmailPage from '@/pages/VerifyEmailPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';

// Créer un client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Définir les couleurs personnalisées pour le thème
const plumPrimary: MantineColorsTuple = [
  '#f9f0ff',
  '#efdcfa',
  '#dbb8ef',
  '#c791e5',
  '#b672dc',
  '#ab5dd6',
  '#a651d3',
  '#8f3dbc',
  '#8034a8',
  '#702a95'
];

// Créer le thème personnalisé
const theme = createTheme({
  primaryColor: 'plum',
  colors: {
    plum: plumPrimary,
  },
  fontFamily: 'Roboto, sans-serif',
  defaultRadius: 'md',
});

// Composant temporaire pour le profil
const ProfilePage = () => (
  <div style={{ padding: '20px' }}>
    <h1>Profil</h1>
    <p>Cette page sera implémentée ultérieurement.</p>
  </div>
);

// Composant principal de l'application
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications position="top-right" />
        <Router>
          <ThemeProvider>
            <AuthProvider>
              <Routes>
                {/* Routes publiques */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                
                {/* Routes protégées avec le layout du tableau de bord */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  } 
                >
                  <Route index element={<DashboardHome />} />
                  <Route path="farms" element={<FarmsPage />} />
                  <Route path="classification" element={<ClassificationPage />} />
                  <Route path="batches" element={<BatchesPage />} />
                  <Route path="statistics" element={<StatisticsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>
                
                {/* Redirection par défaut */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </AuthProvider>
          </ThemeProvider>
        </Router>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
>>>>>>> 52b038ca4bba93cc54a40159cc8eb8c0fdc11314

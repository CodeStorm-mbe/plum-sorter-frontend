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

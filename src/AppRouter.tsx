import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RoleProvider, ProtectedRoute } from './contexts/RoleContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { DashboardProvider } from './contexts/DashboardContext';

// Pages publiques
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

// Pages protégées génériques
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

// Pages spécifiques aux rôles
import DashboardPage from './pages/DashboardPage';
import FarmerDashboardPage from './pages/FarmerDashboardPage';
import TechnicianDashboardPage from './pages/TechnicianDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Pages de gestion des fermes et lots
import FarmsPage from './pages/FarmsPage';
import FarmPage from './pages/FarmPage';
import FarmFormPage from './pages/FarmFormPage';
import BatchesPage from './pages/BatchesPage';
import BatchPage from './pages/BatchPage';
import BatchClassificationPage from './pages/BatchClassificationPage';

// Pages de classification
import ClassificationPage from './pages/ClassificationPage';
import PredictionPage from './pages/PredictionPage';

// Pages d'administration
import UsersManagementPage from './pages/UsersManagementPage';
import ModelManagementPage from './pages/ModelManagementPage';
import StatisticsPage from './pages/StatisticsPage';
import ReportsPage from './pages/ReportsPage';

// Composant principal de routage
const AppRouter: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <RoleProvider>
          <NotificationProvider>
            <DashboardProvider>
              <Routes>
                {/* Routes publiques */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />

                {/* Routes protégées génériques */}
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

                {/* Redirection du dashboard en fonction du rôle */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />

                {/* Routes spécifiques aux rôles */}
                <Route path="/farmer-dashboard" element={
                  <ProtectedRoute requiredRole="farmer">
                    <FarmerDashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/technician-dashboard" element={
                  <ProtectedRoute requiredRole="technician">
                    <TechnicianDashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin-dashboard" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } />

                {/* Routes de gestion des fermes */}
                <Route path="/farms" element={
                  <ProtectedRoute requiredPermission="view_farms">
                    <FarmsPage />
                  </ProtectedRoute>
                } />
                <Route path="/farms/:id" element={
                  <ProtectedRoute requiredPermission="view_farms">
                    <FarmPage />
                  </ProtectedRoute>
                } />
                <Route path="/farms/new" element={
                  <ProtectedRoute requiredPermission="create_farm">
                    <FarmFormPage />
                  </ProtectedRoute>
                } />
                <Route path="/farms/:id/edit" element={
                  <ProtectedRoute requiredPermission="edit_farm">
                    <FarmFormPage />
                  </ProtectedRoute>
                } />

                {/* Routes de gestion des lots */}
                <Route path="/batches" element={
                  <ProtectedRoute requiredPermission="view_batches">
                    <BatchesPage />
                  </ProtectedRoute>
                } />
                <Route path="/batches/:id" element={
                  <ProtectedRoute requiredPermission="view_batches">
                    <BatchPage />
                  </ProtectedRoute>
                } />
                <Route path="/batches/:id/classify" element={
                  <ProtectedRoute requiredPermission="create_classification">
                    <BatchClassificationPage />
                  </ProtectedRoute>
                } />

                {/* Routes de classification */}
                <Route path="/classifications" element={
                  <ProtectedRoute requiredPermission="view_classifications">
                    <ClassificationPage />
                  </ProtectedRoute>
                } />
                <Route path="/classifications/new" element={
                  <ProtectedRoute requiredPermission="create_classification">
                    <PredictionPage />
                  </ProtectedRoute>
                } />

                {/* Routes d'administration */}
                <Route path="/admin/users" element={
                  <ProtectedRoute requiredPermission="manage_users">
                    <UsersManagementPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/models" element={
                  <ProtectedRoute requiredPermission="manage_models">
                    <ModelManagementPage />
                  </ProtectedRoute>
                } />
                <Route path="/statistics" element={
                  <ProtectedRoute requiredPermission="view_statistics">
                    <StatisticsPage />
                  </ProtectedRoute>
                } />
                <Route path="/reports" element={
                  <ProtectedRoute requiredPermission="view_statistics">
                    <ReportsPage />
                  </ProtectedRoute>
                } />

                {/* Redirection par défaut */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </DashboardProvider>
          </NotificationProvider>
        </RoleProvider>
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardProvider } from './contexts/DashboardContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import RoleBasedRoute from './components/RoleBasedRoute';
import ProtectedRoute from './components/ProtectedRoute';
import { PERMISSIONS } from './services/rolePermissionService';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import DashboardPage from './pages/DashboardPage';
import FarmerDashboardPage from './pages/FarmerDashboardPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import FarmsPage from './pages/FarmsPage';
import FarmPage from './pages/FarmPage';
import FarmFormPage from './pages/FarmFormPage';
import BatchesPage from './pages/BatchesPage';
import BatchPage from './pages/BatchPage';
import ClassificationPage from './pages/ClassificationPage';
import BatchClassificationPage from './pages/BatchClassificationPage';
import PredictionPage from './pages/PredictionPage';
import StatisticsPage from './pages/StatisticsPage';
import ReportsPage from './pages/ReportsPage';
import ModelManagementPage from './pages/ModelManagementPage';
import UsersManagementPage from './pages/UsersManagementPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
// import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <NotificationProvider>
            <AuthProvider>
              <DashboardProvider>
                <Routes>
                  {/* Pages publiques */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/verify-email" element={<VerifyEmailPage />} />
                  
                  {/* Pages protégées - accessibles à tous les utilisateurs authentifiés */}
                  <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                    {/* Utiliser DashboardLayout comme wrapper pour toutes les pages protégées */}
                    <Route element={<DashboardLayout />}>
                      {/* Dashboard adapté au rôle */}
                      <Route 
                        path="/dashboard" 
                        element={
                          <RoleBasedRoute
                            requiredPermission={PERMISSIONS.VIEW_DASHBOARD}
                            fallbackPath="/"
                          >
                            {/* Afficher le dashboard approprié selon le rôle */}
                            <DashboardPage />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      {/* Dashboard spécifique pour les agriculteurs */}
                      <Route 
                        path="/farmer-dashboard" 
                        element={
                          <RoleBasedRoute
                            requiredPermission={PERMISSIONS.VIEW_DASHBOARD}
                            fallbackPath="/"
                          >
                            <FarmerDashboardPage />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/profile" 
                        element={
                          <RoleBasedRoute
                            requiredPermission={PERMISSIONS.EDIT_PROFILE}
                          >
                            <ProfilePage />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/settings" 
                        element={
                          <RoleBasedRoute>
                            <SettingsPage />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      {/* Pages pour les fermes */}
                      <Route 
                        path="/farms" 
                        element={
                          <RoleBasedRoute requiredPermission={PERMISSIONS.VIEW_FARMS}>
                            <FarmsPage />
                          </RoleBasedRoute>
                        } 
                      />
                      <Route 
                        path="/farms/:id" 
                        element={
                          <RoleBasedRoute requiredPermission={PERMISSIONS.VIEW_FARMS}>
                            <FarmPage />
                          </RoleBasedRoute>
                        } 
                      />
                      <Route 
                        path="/farms/new" 
                        element={
                          <RoleBasedRoute requiredPermission={PERMISSIONS.CREATE_FARM}>
                            <FarmFormPage />
                          </RoleBasedRoute>
                        } 
                      />
                      <Route 
                        path="/farms/:id/edit" 
                        element={
                          <RoleBasedRoute requiredPermission={PERMISSIONS.EDIT_FARM}>
                            <FarmFormPage />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      {/* Pages pour les lots */}
                      <Route 
                        path="/batches" 
                        element={
                          <RoleBasedRoute requiredPermission={PERMISSIONS.VIEW_BATCHES}>
                            <BatchesPage />
                          </RoleBasedRoute>
                        } 
                      />
                      <Route 
                        path="/batches/:id" 
                        element={
                          <RoleBasedRoute requiredPermission={PERMISSIONS.VIEW_BATCHES}>
                            <BatchPage />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      {/* Pages pour les classifications */}
                      <Route 
                        path="/classifications" 
                        element={
                          <RoleBasedRoute requiredPermission={PERMISSIONS.VIEW_CLASSIFICATIONS}>
                            <ClassificationPage />
                          </RoleBasedRoute>
                        } 
                      />
                      <Route 
                        path="/classifications/new" 
                        element={
                          <RoleBasedRoute requiredPermission={PERMISSIONS.CREATE_CLASSIFICATION}>
                            <PredictionPage />
                          </RoleBasedRoute>
                        } 
                      />
                      <Route 
                        path="/classifications/batch" 
                        element={
                          <RoleBasedRoute requiredPermission={PERMISSIONS.CREATE_CLASSIFICATION}>
                            <BatchClassificationPage />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      {/* Pages pour les statistiques */}
                      <Route 
                        path="/statistics" 
                        element={
                          <RoleBasedRoute requiredPermission={PERMISSIONS.VIEW_STATISTICS}>
                            <StatisticsPage />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      {/* Pages pour les rapports */}
                      <Route 
                        path="/reports" 
                        element={
                          <RoleBasedRoute requiredPermission={PERMISSIONS.VIEW_STATISTICS}>
                            <ReportsPage />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      {/* Pages d'administration - accessibles uniquement aux administrateurs */}
                      <Route 
                        path="/admin/models" 
                        element={
                          <RoleBasedRoute requiredPermission={PERMISSIONS.MANAGE_MODELS}>
                            <ModelManagementPage />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/admin/users" 
                        element={
                          <RoleBasedRoute requiredPermission={PERMISSIONS.MANAGE_USERS}>
                            <UsersManagementPage />
                          </RoleBasedRoute>
                        } 
                      />
                    </Route>
                  </Route>
                  
                  {/* Redirection par défaut */}
                  <Route path="/home" element={<Navigate to="/" replace />} />
                  {/* <Route path="*" element={<NotFound />} /> */}
                </Routes>
              </DashboardProvider>
            </AuthProvider>
          </NotificationProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

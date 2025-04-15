import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardProvider } from './contexts/DashboardContext';
import RoleBasedRoute from './components/RoleBasedRoute';
import { PERMISSIONS } from './services/rolePermissionService';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import FarmsPage from './pages/FarmsPage';
import FarmPage from './pages/FarmPage';
import BatchesPage from './pages/BatchesPage';
import BatchPage from './pages/BatchPage';
import ClassificationPage from './pages/ClassificationPage';
import PredictionPage from './pages/PredictionPage';
import StatisticsPage from './pages/StatisticsPage';
import ModelManagementPage from './pages/ModelManagementPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

import './App.css';

function App() {
  return (
    <Router>
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
            <Route 
              path="/dashboard" 
              element={
                <RoleBasedRoute>
                  <DashboardPage />
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <RoleBasedRoute>
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
            
            {/* Pages pour les statistiques */}
            <Route 
              path="/statistics" 
              element={
                <RoleBasedRoute requiredPermission={PERMISSIONS.VIEW_STATISTICS}>
                  <StatisticsPage />
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
            
            {/* Redirection par défaut */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </DashboardProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

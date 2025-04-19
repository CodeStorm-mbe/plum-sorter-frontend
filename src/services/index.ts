// index.ts - Export de tous les services
import api from './api';
import AuthService from './authService';
import BatchService from './batchService';
import ClassificationService from './classificationService';
import DashboardService from './dashboardService';
import FarmService from './farmService';
import ModelService from './modelService';
import { RolePermissionService, PERMISSIONS } from './rolePermissionService';
import UserService from './userService';
import NotificationService from './notificationService';

// Nouveaux services
import DashboardAnalyticsService from './dashboardAnalyticsService';
import AdminDashboardService from './adminDashboardService';
import TechnicianDashboardService from './technicianDashboardService';
import SecurityService from './securityService';
import OptimizationService from './optimizationService';

export {
  api,
  AuthService,
  BatchService,
  ClassificationService,
  DashboardService,
  FarmService,
  ModelService,
  RolePermissionService,
  PERMISSIONS,
  UserService,
  NotificationService,
  
  // Nouveaux services
  DashboardAnalyticsService,
  AdminDashboardService,
  TechnicianDashboardService,
  SecurityService,
  OptimizationService
};

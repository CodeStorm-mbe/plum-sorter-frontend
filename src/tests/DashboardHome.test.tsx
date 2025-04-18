import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { DashboardHome } from '../pages/DashboardHome';
import { useDashboard } from '../contexts/DashboardContext';
import { useAuth } from '../contexts/AuthContext';

// Mock des contextes
jest.mock('../contexts/DashboardContext');
jest.mock('../contexts/AuthContext');

// Mock des composants
jest.mock('../components/dashboard/ClassificationChart', () => ({
  ClassificationChart: () => <div data-testid="classification-chart" />
}));
jest.mock('../components/dashboard/RecentClassifications', () => ({
  RecentClassifications: () => <div data-testid="recent-classifications" />
}));
jest.mock('../components/dashboard/AdminStats', () => ({
  AdminStats: () => <div data-testid="admin-stats" />
}));
jest.mock('../components/dashboard/FarmerStats', () => ({
  FarmerStats: () => <div data-testid="farmer-stats" />
}));
jest.mock('../components/dashboard/TechnicianStats', () => ({
  TechnicianStats: () => <div data-testid="technician-stats" />
}));
jest.mock('../components/dashboard/SystemPerformance', () => ({
  SystemPerformance: () => <div data-testid="system-performance" />
}));

describe('DashboardHome Component', () => {
  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
  });

  test('affiche un loader pendant le chargement', () => {
    // Configurer le mock pour simuler le chargement
    (useDashboard as jest.Mock).mockReturnValue({
      dashboardData: null,
      isLoading: true,
      error: null,
      refreshData: jest.fn(),
      lastUpdated: null
    });
    
    (useAuth as jest.Mock).mockReturnValue({
      user: { username: 'testuser', role: 'admin' }
    });

    render(<DashboardHome />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('affiche un message d\'erreur en cas d\'erreur', () => {
    // Configurer le mock pour simuler une erreur
    (useDashboard as jest.Mock).mockReturnValue({
      dashboardData: null,
      isLoading: false,
      error: 'Erreur de chargement',
      refreshData: jest.fn(),
      lastUpdated: null
    });
    
    (useAuth as jest.Mock).mockReturnValue({
      user: { username: 'testuser', role: 'admin' }
    });

    render(<DashboardHome />);
    
    expect(screen.getByText('Erreur')).toBeInTheDocument();
    expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
  });

  test('affiche le dashboard admin pour un utilisateur admin', async () => {
    // Données de test pour un admin
    const mockDashboardData = {
      totalClassifications: 100,
      classPercentages: { 'Bonne qualité': 70, 'Mauvaise qualité': 30 },
      recentClassifications: [],
      systemPerformance: {
        averageProcessingTime: 0.5,
        apiResponseTime: 0.2,
        modelVersion: '1.0.0',
        modelAccuracy: 0.95
      },
      totalUsers: 50,
      usersByRole: { admin: 5, farmer: 30, technician: 15 },
      activeUsers: 40
    };
    
    (useDashboard as jest.Mock).mockReturnValue({
      dashboardData: mockDashboardData,
      isLoading: false,
      error: null,
      refreshData: jest.fn(),
      lastUpdated: new Date()
    });
    
    (useAuth as jest.Mock).mockReturnValue({
      user: { username: 'admin', role: 'admin' }
    });

    render(<DashboardHome />);
    
    await waitFor(() => {
      expect(screen.getByText('Tableau de bord')).toBeInTheDocument();
      expect(screen.getByText(/Bienvenue, admin/)).toBeInTheDocument();
      expect(screen.getByTestId('classification-chart')).toBeInTheDocument();
      expect(screen.getByTestId('system-performance')).toBeInTheDocument();
      expect(screen.getByTestId('admin-stats')).toBeInTheDocument();
      expect(screen.getByTestId('recent-classifications')).toBeInTheDocument();
    });
  });

  test('affiche le dashboard farmer pour un utilisateur farmer', async () => {
    // Données de test pour un farmer
    const mockDashboardData = {
      totalClassifications: 50,
      classPercentages: { 'Bonne qualité': 60, 'Mauvaise qualité': 40 },
      recentClassifications: [],
      totalBatches: 10,
      pendingBatches: 3,
      farms: [{ id: 1, name: 'Ferme Test' }]
    };
    
    (useDashboard as jest.Mock).mockReturnValue({
      dashboardData: mockDashboardData,
      isLoading: false,
      error: null,
      refreshData: jest.fn(),
      lastUpdated: new Date()
    });
    
    (useAuth as jest.Mock).mockReturnValue({
      user: { username: 'farmer', role: 'farmer' }
    });

    render(<DashboardHome />);
    
    await waitFor(() => {
      expect(screen.getByText('Tableau de bord')).toBeInTheDocument();
      expect(screen.getByText(/Bienvenue, farmer/)).toBeInTheDocument();
      expect(screen.getByTestId('classification-chart')).toBeInTheDocument();
      expect(screen.getByTestId('farmer-stats')).toBeInTheDocument();
      expect(screen.getByTestId('recent-classifications')).toBeInTheDocument();
    });
  });

  test('affiche le dashboard technician pour un utilisateur technician', async () => {
    // Données de test pour un technician
    const mockDashboardData = {
      totalClassifications: 200,
      classPercentages: { 'Bonne qualité': 75, 'Mauvaise qualité': 25 },
      recentClassifications: [],
      managedFarms: 5,
      farmPerformance: [{ id: 1, name: 'Ferme Test', total_classifications: 100 }]
    };
    
    (useDashboard as jest.Mock).mockReturnValue({
      dashboardData: mockDashboardData,
      isLoading: false,
      error: null,
      refreshData: jest.fn(),
      lastUpdated: new Date()
    });
    
    (useAuth as jest.Mock).mockReturnValue({
      user: { username: 'technician', role: 'technician' }
    });

    render(<DashboardHome />);
    
    await waitFor(() => {
      expect(screen.getByText('Tableau de bord')).toBeInTheDocument();
      expect(screen.getByText(/Bienvenue, technician/)).toBeInTheDocument();
      expect(screen.getByTestId('classification-chart')).toBeInTheDocument();
      expect(screen.getByTestId('technician-stats')).toBeInTheDocument();
      expect(screen.getByTestId('recent-classifications')).toBeInTheDocument();
    });
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserList } from '../components/users/UserList';
import { userService } from '../services';

// Mock du service
jest.mock('../services', () => ({
  userService: {
    getUsers: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  }
}));

// Mock des notifications
jest.mock('../utils/notifications', () => ({
  notifications: {
    show: jest.fn()
  }
}));

describe('UserList Component', () => {
  const mockUsers = [
    { 
      id: 1, 
      username: 'admin1', 
      email: 'admin@example.com', 
      first_name: 'Admin', 
      last_name: 'User',
      role: 'admin',
      is_active: true
    },
    { 
      id: 2, 
      username: 'farmer1', 
      email: 'farmer@example.com', 
      first_name: 'Farmer', 
      last_name: 'User',
      role: 'farmer',
      is_active: true
    },
    { 
      id: 3, 
      username: 'tech1', 
      email: 'tech@example.com', 
      first_name: 'Tech', 
      last_name: 'User',
      role: 'technician',
      is_active: false
    }
  ];

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
    
    // Configurer le mock pour retourner des utilisateurs
    userService.getUsers.mockResolvedValue({ results: mockUsers });
  });

  test('affiche un message de chargement pendant le chargement des données', async () => {
    render(
      <MemoryRouter>
        <UserList />
      </MemoryRouter>
    );

    expect(screen.getByText('Chargement des utilisateurs...')).toBeInTheDocument();
  });

  test('affiche la liste des utilisateurs une fois chargée', async () => {
    render(
      <MemoryRouter>
        <UserList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.getByText('Farmer User')).toBeInTheDocument();
      expect(screen.getByText('Tech User')).toBeInTheDocument();
    });
  });

  test('affiche correctement les badges de rôle', async () => {
    render(
      <MemoryRouter>
        <UserList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Administrateur')).toBeInTheDocument();
      expect(screen.getByText('Agriculteur')).toBeInTheDocument();
      expect(screen.getByText('Technicien')).toBeInTheDocument();
    });
  });

  test('affiche correctement les badges de statut', async () => {
    render(
      <MemoryRouter>
        <UserList />
      </MemoryRouter>
    );

    await waitFor(() => {
      const actifBadges = screen.getAllByText('Actif');
      expect(actifBadges.length).toBe(2);
      expect(screen.getByText('Inactif')).toBeInTheDocument();
    });
  });

  test('filtre les utilisateurs lors de la recherche', async () => {
    render(
      <MemoryRouter>
        <UserList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });

    // Simuler une recherche
    const searchInput = screen.getByPlaceholderText('Rechercher un utilisateur...');
    fireEvent.change(searchInput, { target: { value: 'farmer' } });

    await waitFor(() => {
      expect(screen.queryByText('Admin User')).not.toBeInTheDocument();
      expect(screen.getByText('Farmer User')).toBeInTheDocument();
      expect(screen.queryByText('Tech User')).not.toBeInTheDocument();
    });
  });

  test('filtre les utilisateurs par rôle', async () => {
    render(
      <MemoryRouter>
        <UserList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });

    // Simuler un filtrage par rôle
    const roleSelect = screen.getByPlaceholderText('Filtrer par rôle');
    fireEvent.change(roleSelect, { target: { value: 'admin' } });

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.queryByText('Farmer User')).not.toBeInTheDocument();
      expect(screen.queryByText('Tech User')).not.toBeInTheDocument();
    });
  });

  // Autres tests possibles :
  // - Test d'ouverture du modal de création
  // - Test d'ouverture du modal de modification
  // - Test d'ouverture du modal de suppression
  // - Test de création d'un utilisateur
  // - Test de modification d'un utilisateur
  // - Test de suppression d'un utilisateur
});

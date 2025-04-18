import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UsersManagementPage from '../pages/UsersManagementPage';
import { useAuth } from '../contexts/AuthContext';

// Mock du contexte d'authentification
jest.mock('../contexts/AuthContext');

// Mock du composant UserList
jest.mock('../components/users/UserList', () => ({
  UserList: () => <div data-testid="user-list" />
}));

describe('UsersManagementPage Component', () => {
  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
  });

  test('redirige vers le dashboard si l\'utilisateur n\'est pas un administrateur', () => {
    // Configurer le mock pour simuler un utilisateur non-admin
    (useAuth as jest.Mock).mockReturnValue({
      user: { role: 'farmer' }
    });

    const { container } = render(
      <MemoryRouter>
        <UsersManagementPage />
      </MemoryRouter>
    );

    // Vérifier que le composant est vide (redirection)
    expect(container.firstChild).toBeNull();
  });

  test('affiche la page d\'administration des utilisateurs pour un administrateur', () => {
    // Configurer le mock pour simuler un administrateur
    (useAuth as jest.Mock).mockReturnValue({
      user: { role: 'admin' }
    });

    render(
      <MemoryRouter>
        <UsersManagementPage />
      </MemoryRouter>
    );

    // Vérifier que le titre est affiché
    expect(screen.getByText('Administration des Utilisateurs')).toBeInTheDocument();
    
    // Vérifier que le composant UserList est rendu
    expect(screen.getByTestId('user-list')).toBeInTheDocument();
  });
});

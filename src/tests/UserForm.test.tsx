import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserForm } from '../components/users/UserForm';

// Mock des notifications
jest.mock('../utils/notifications', () => ({
  notifications: {
    show: jest.fn()
  }
}));

describe('UserForm Component', () => {
  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    role: 'farmer',
    is_active: true
  };

  const mockProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    isSubmitting: false
  };

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
  });

  test('affiche correctement le formulaire de création', () => {
    render(<UserForm {...mockProps} />);

    expect(screen.getByLabelText(/Nom d'utilisateur/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prénom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rôle/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Utilisateur actif/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmer le mot de passe/i)).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: /Créer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Annuler/i })).toBeInTheDocument();
  });

  test('affiche correctement le formulaire de modification', () => {
    render(<UserForm {...mockProps} user={mockUser} />);

    expect(screen.getByLabelText(/Nom d'utilisateur/i)).toHaveValue('testuser');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('test@example.com');
    expect(screen.getByLabelText(/Prénom/i)).toHaveValue('Test');
    expect(screen.getByLabelText(/Nom/i)).toHaveValue('User');
    
    // Vérifier que les champs de mot de passe ne sont pas affichés par défaut en mode édition
    expect(screen.queryByLabelText(/Mot de passe/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Confirmer le mot de passe/i)).not.toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: /Mettre à jour/i })).toBeInTheDocument();
  });

  test('affiche les champs de mot de passe en mode édition lorsque la case est cochée', () => {
    render(<UserForm {...mockProps} user={mockUser} />);
    
    // Vérifier que les champs de mot de passe ne sont pas affichés par défaut
    expect(screen.queryByLabelText(/Mot de passe/i)).not.toBeInTheDocument();
    
    // Cocher la case pour modifier le mot de passe
    fireEvent.click(screen.getByLabelText(/Modifier le mot de passe/i));
    
    // Vérifier que les champs de mot de passe sont maintenant affichés
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmer le mot de passe/i)).toBeInTheDocument();
  });

  test('appelle onCancel lorsqu\'on clique sur le bouton Annuler', () => {
    render(<UserForm {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Annuler/i }));
    
    expect(mockProps.onCancel).toHaveBeenCalledTimes(1);
  });

  test('désactive le bouton de soumission pendant le chargement', () => {
    render(<UserForm {...mockProps} isSubmitting={true} />);
    
    expect(screen.getByRole('button', { name: /Créer/i })).toBeDisabled();
  });

  test('valide les données du formulaire avant soumission', async () => {
    render(<UserForm {...mockProps} />);
    
    // Soumettre le formulaire sans remplir les champs requis
    fireEvent.click(screen.getByRole('button', { name: /Créer/i }));
    
    // Vérifier que des messages d'erreur s'affichent
    await waitFor(() => {
      expect(screen.getByText(/Le nom d'utilisateur doit contenir au moins 3 caractères/i)).toBeInTheDocument();
      expect(screen.getByText(/Email invalide/i)).toBeInTheDocument();
      expect(screen.getByText(/Le prénom doit contenir au moins 2 caractères/i)).toBeInTheDocument();
      expect(screen.getByText(/Le nom doit contenir au moins 2 caractères/i)).toBeInTheDocument();
      expect(screen.getByText(/Le rôle est requis/i)).toBeInTheDocument();
    });
    
    // Vérifier que onSubmit n'a pas été appelé
    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });
});

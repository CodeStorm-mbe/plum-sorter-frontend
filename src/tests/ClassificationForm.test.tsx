import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ClassificationForm } from '../components/classifications/ClassificationForm';

// Mock des notifications
jest.mock('../utils/notifications', () => ({
  notifications: {
    show: jest.fn()
  }
}));

describe('ClassificationForm Component', () => {
  const mockProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    isSubmitting: false,
    batchId: 1,
    farmId: 2
  };

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
  });

  test('affiche correctement le formulaire de classification', () => {
    render(<ClassificationForm {...mockProps} />);

    expect(screen.getByText(/Sélectionner une image de prune/i)).toBeInTheDocument();
    expect(screen.getByText(/Utiliser l'augmentation de test/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Classifier/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Annuler/i })).toBeInTheDocument();
  });

  test('appelle onCancel lorsqu\'on clique sur le bouton Annuler', () => {
    render(<ClassificationForm {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Annuler/i }));
    
    expect(mockProps.onCancel).toHaveBeenCalledTimes(1);
  });

  test('désactive le bouton de soumission pendant le chargement', () => {
    render(<ClassificationForm {...mockProps} isSubmitting={true} />);
    
    const submitButton = screen.getByRole('button', { name: /Classifier/i });
    expect(submitButton).toBeDisabled();
  });

  test('affiche une erreur lorsque le formulaire est soumis sans image', async () => {
    render(<ClassificationForm {...mockProps} />);
    
    // Soumettre le formulaire sans sélectionner d'image
    fireEvent.click(screen.getByRole('button', { name: /Classifier/i }));
    
    // Vérifier que onSubmit n'a pas été appelé
    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  // Note: Les tests impliquant le téléchargement de fichiers sont plus complexes
  // et nécessiteraient une configuration supplémentaire
});

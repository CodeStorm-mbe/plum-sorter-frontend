import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FarmsList } from '../components/farms/FarmsList';
import { farmService } from '../services';

// Mock du service
jest.mock('../services', () => ({
  farmService: {
    getFarms: jest.fn(),
    createFarm: jest.fn(),
    updateFarm: jest.fn(),
    deleteFarm: jest.fn(),
  }
}));

// Mock des notifications
jest.mock('../utils/notifications', () => ({
  notifications: {
    show: jest.fn()
  }
}));

describe('FarmsList Component', () => {
  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
  });

  test('affiche un message lorsqu\'aucune ferme n\'est disponible', async () => {
    // Configurer le mock pour retourner une liste vide
    farmService.getFarms.mockResolvedValue({ results: [] });

    render(
      <MemoryRouter>
        <FarmsList />
      </MemoryRouter>
    );

    // Vérifier que le message s'affiche
    await waitFor(() => {
      expect(screen.getByText(/Vous n'avez pas encore de fermes/i)).toBeInTheDocument();
    });
  });

  test('affiche la liste des fermes lorsqu\'elles sont disponibles', async () => {
    // Configurer le mock pour retourner des fermes
    const mockFarms = {
      results: [
        { id: 1, name: 'Ferme Test 1', location: 'Location 1', total_batches: 5 },
        { id: 2, name: 'Ferme Test 2', location: 'Location 2', total_batches: 3 }
      ]
    };
    farmService.getFarms.mockResolvedValue(mockFarms);

    render(
      <MemoryRouter>
        <FarmsList />
      </MemoryRouter>
    );

    // Vérifier que les fermes s'affichent
    await waitFor(() => {
      expect(screen.getByText('Ferme Test 1')).toBeInTheDocument();
      expect(screen.getByText('Ferme Test 2')).toBeInTheDocument();
    });
  });

  test('ouvre le modal de création lorsqu\'on clique sur "Ajouter une ferme"', async () => {
    // Configurer le mock pour retourner une liste vide
    farmService.getFarms.mockResolvedValue({ results: [] });

    render(
      <MemoryRouter>
        <FarmsList />
      </MemoryRouter>
    );

    // Attendre que le composant soit chargé
    await waitFor(() => {
      expect(screen.getByText(/Ajouter une ferme/i)).toBeInTheDocument();
    });

    // Cliquer sur le bouton d'ajout
    fireEvent.click(screen.getByText(/Ajouter une ferme/i));

    // Vérifier que le modal s'ouvre
    await waitFor(() => {
      expect(screen.getByText(/Ajouter une nouvelle ferme/i)).toBeInTheDocument();
    });
  });

  // Autres tests possibles :
  // - Test de création d'une ferme
  // - Test de modification d'une ferme
  // - Test de suppression d'une ferme
  // - Test de navigation vers la page de détails d'une ferme
});

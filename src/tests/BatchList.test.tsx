import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BatchList } from '../components/batches/BatchList';
import { batchService } from '../services';

// Mock du service
jest.mock('../services', () => ({
  batchService: {
    updateBatch: jest.fn(),
    deleteBatch: jest.fn(),
  }
}));

// Mock des notifications
jest.mock('../utils/notifications', () => ({
  notifications: {
    show: jest.fn()
  }
}));

describe('BatchList Component', () => {
  const mockBatches = [
    { 
      id: 1, 
      name: 'Lot Test 1', 
      status: 'pending', 
      harvest_date: '2025-04-10', 
      quantity: 100,
      variety: 'Reine Claude',
      total_classifications: 5 
    },
    { 
      id: 2, 
      name: 'Lot Test 2', 
      status: 'completed', 
      harvest_date: '2025-04-15', 
      quantity: 150,
      variety: 'Mirabelle',
      total_classifications: 10 
    }
  ];

  const mockProps = {
    batches: mockBatches,
    onBatchCreated: jest.fn(),
    onBatchUpdated: jest.fn(),
    onBatchDeleted: jest.fn(),
    farmId: 1
  };

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
  });

  test('affiche un message lorsqu\'aucun lot n\'est disponible', () => {
    render(
      <MemoryRouter>
        <BatchList {...mockProps} batches={[]} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Aucun lot disponible pour cette ferme/i)).toBeInTheDocument();
  });

  test('affiche la liste des lots lorsqu\'ils sont disponibles', () => {
    render(
      <MemoryRouter>
        <BatchList {...mockProps} />
      </MemoryRouter>
    );

    expect(screen.getByText('Lot Test 1')).toBeInTheDocument();
    expect(screen.getByText('Lot Test 2')).toBeInTheDocument();
    expect(screen.getByText('Reine Claude')).toBeInTheDocument();
    expect(screen.getByText('Mirabelle')).toBeInTheDocument();
  });

  test('affiche correctement les badges de statut', () => {
    render(
      <MemoryRouter>
        <BatchList {...mockProps} />
      </MemoryRouter>
    );

    expect(screen.getByText('En attente')).toBeInTheDocument();
    expect(screen.getByText('Terminé')).toBeInTheDocument();
  });

  test('affiche correctement les informations de date et quantité', () => {
    render(
      <MemoryRouter>
        <BatchList {...mockProps} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Récolté le: 10\/04\/2025/i)).toBeInTheDocument();
    expect(screen.getByText(/Quantité: 100 kg/i)).toBeInTheDocument();
    expect(screen.getByText(/Quantité: 150 kg/i)).toBeInTheDocument();
  });

  test('affiche correctement les badges de classification', () => {
    render(
      <MemoryRouter>
        <BatchList {...mockProps} />
      </MemoryRouter>
    );

    expect(screen.getByText('5 classifications')).toBeInTheDocument();
    expect(screen.getByText('10 classifications')).toBeInTheDocument();
  });

  // Autres tests possibles :
  // - Test d'ouverture du menu d'actions
  // - Test de modification d'un lot
  // - Test de suppression d'un lot
  // - Test de navigation vers la page de classification
});

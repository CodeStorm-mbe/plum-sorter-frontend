import React, { useState, useEffect } from 'react';
import { Card, Title, Button, Group, Text, Badge, ActionIcon, Menu, Modal, Stack } from '@mantine/core';
import { IconDotsVertical, IconEdit, IconTrash, IconPlus, IconMap } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '../../utils/notifications';
import { FarmForm } from './FarmForm';
import { Farm } from '../../types';
import { FarmService } from '../../services';

export const FarmsList: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  // Charger les fermes au montage du composant
  useEffect(() => {
    loadFarms();
  }, []);

  // Fonction pour charger les fermes
  const loadFarms = async () => {
    try {
      setIsLoading(true);
      const response = await FarmService.getFarms();
      setFarms(response.results || []);
    } catch (error: any) {
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de charger les fermes',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour créer une ferme
  const handleCreateFarm = async (data: any) => {
    try {
      setIsSubmitting(true);
      await FarmService.createFarm(data);
      notifications.show({
        title: 'Succès',
        message: 'Ferme créée avec succès',
        color: 'green',
      });
      setIsCreateModalOpen(false);
      loadFarms();
    } catch (error: any) {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Impossible de créer la ferme',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour mettre à jour une ferme
  const handleUpdateFarm = async (data: any) => {
    if (!selectedFarm) return;
    
    try {
      setIsSubmitting(true);
      await FarmService.updateFarm(selectedFarm.id, data);
      notifications.show({
        title: 'Succès',
        message: 'Ferme mise à jour avec succès',
        color: 'green',
      });
      setIsEditModalOpen(false);
      loadFarms();
    } catch (error: any) {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Impossible de mettre à jour la ferme',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour supprimer une ferme
  const handleDeleteFarm = async () => {
    if (!selectedFarm) return;
    
    try {
      setIsSubmitting(true);
      await FarmService.deleteFarm(selectedFarm.id);
      notifications.show({
        title: 'Succès',
        message: 'Ferme supprimée avec succès',
        color: 'green',
      });
      setIsDeleteModalOpen(false);
      loadFarms();
    } catch (error: any) {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Impossible de supprimer la ferme',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour naviguer vers la page de détails d'une ferme
  const handleViewFarm = (farmId: number) => {
    navigate(`/farms/${farmId}`);
  };

  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={2}>Mes Fermes</Title>
        <Button 
          leftSection={<IconPlus size={16} />} 
          onClick={() => setIsCreateModalOpen(true)}
        >
          Ajouter une ferme
        </Button>
      </Group>

      {isLoading ? (
        <Text>Chargement des fermes...</Text>
      ) : farms.length === 0 ? (
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Text ta="center" c="dimmed">
            Vous n'avez pas encore de fermes. Cliquez sur "Ajouter une ferme" pour commencer.
          </Text>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {farms.map((farm) => (
            <Card key={farm.id} shadow="sm" p="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                  <Text fw={500}>{farm.name}</Text>
                  <Menu withinPortal position="bottom-end" shadow="sm">
                    <Menu.Target>
                      <ActionIcon>
                        <IconDotsVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item 
                        leftSection={<IconEdit size={16} />} 
                        onClick={() => {
                          setSelectedFarm(farm);
                          setIsEditModalOpen(true);
                        }}
                      >
                        Modifier
                      </Menu.Item>
                      <Menu.Item 
                        leftSection={<IconTrash size={16} />} 
                        color="red"
                        onClick={() => {
                          setSelectedFarm(farm);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        Supprimer
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Card.Section>
              <Stack gap="xs" mt="md">
                <Text size="sm" c="dimmed">Emplacement: {farm.location}</Text>
                {farm.size && (
                  <Text size="sm" c="dimmed">Taille: {farm.size} hectares</Text>
                )}
                {farm.description && (
                  <Text size="sm" lineClamp={2}>{farm.description}</Text>
                )}
                <Group justify="space-between" mt="md">
                  <Badge color="blue">
                    {0} lots
                  </Badge>
                  <Button 
                    variant="light" 
                    onClick={() => handleViewFarm(farm.id)}
                    rightSection={<IconMap size={16} />}
                  >
                    Voir détails
                  </Button>
                </Group>
              </Stack>
            </Card>
          ))}
        </div>
      )}

      {/* Modal pour créer une ferme */}
      <Modal
        opened={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Ajouter une nouvelle ferme"
        size="lg"
      >
        <FarmForm
          onSubmit={handleCreateFarm}
          onCancel={() => setIsCreateModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Modal pour modifier une ferme */}
      <Modal
        opened={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Modifier la ferme"
        size="lg"
      >
        {selectedFarm && (
          <FarmForm
            farm={selectedFarm}
            onSubmit={handleUpdateFarm}
            onCancel={() => setIsEditModalOpen(false)}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>

      {/* Modal pour confirmer la suppression */}
      <Modal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmer la suppression"
        size="sm"
      >
        <Text mb="md">
          Êtes-vous sûr de vouloir supprimer la ferme "{selectedFarm?.name}" ? Cette action est irréversible.
        </Text>
        <Group justify="flex-end">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Annuler
          </Button>
          <Button color="red" onClick={handleDeleteFarm} loading={isSubmitting}>
            Supprimer
          </Button>
        </Group>
      </Modal>
    </>
  );
};

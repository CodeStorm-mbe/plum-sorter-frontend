import { useState } from 'react';
import { Container, Title, Text, Card, Button, Group, TextInput, Modal, SimpleGrid, Badge, ActionIcon, Menu, Box, Loader, Center, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus, IconEdit, IconTrash, IconDotsVertical, IconMapPin, IconRuler, IconUser, IconAlertCircle } from '@tabler/icons-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Farm } from '../types';
import api from '../services/api';
import { notifications } from '../utils/notifications';

// Service pour récupérer les fermes
const fetchFarms = async (): Promise<Farm[]> => {
  const response = await api.get('/farms/');
  return response.data;
};

// Service pour créer une ferme
const createFarm = async (farmData: Omit<Farm, 'id' | 'owner' | 'created_at' | 'updated_at'>): Promise<Farm> => {
  const response = await api.post('/farms/', farmData);
  return response.data;
};

// Service pour mettre à jour une ferme
const updateFarm = async ({ id, ...farmData }: Partial<Farm> & { id: number }): Promise<Farm> => {
  const response = await api.put(`/farms/${id}/`, farmData);
  return response.data;
};

// Service pour supprimer une ferme
const deleteFarm = async (id: number): Promise<void> => {
  await api.delete(`/farms/${id}/`);
};

export function FarmsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const queryClient = useQueryClient();

  // Formulaire pour créer/éditer une ferme
  const form = useForm({
    initialValues: {
      name: '',
      location: '',
      size: 0,
      description: '',
      latitude: undefined as number | undefined,
      longitude: undefined as number | undefined,
    },
    validate: {
      name: (value: string) => (value.length < 3 ? 'Le nom doit contenir au moins 3 caractères' : null),
      location: (value: string) => (value.length < 3 ? 'La localisation doit contenir au moins 3 caractères' : null),
      size: (value: number) => (value <= 0 ? 'La taille doit être supérieure à 0' : null),
    },
  });

  // Requête pour récupérer les fermes
  const { data: farms, isLoading, error } = useQuery({
    queryKey: ['farms'],
    queryFn: fetchFarms,
  });

  // Mutation pour créer une ferme
  const createMutation = useMutation({
    mutationFn: createFarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      setCreateModalOpen(false);
      form.reset();
      notifications.show({
        title: 'Succès',
        message: 'La ferme a été créée avec succès',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Une erreur est survenue lors de la création de la ferme',
        color: 'red',
      });
    },
  });

  // Mutation pour mettre à jour une ferme
  const updateMutation = useMutation({
    mutationFn: updateFarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      setEditModalOpen(false);
      setSelectedFarm(null);
      form.reset();
      notifications.show({
        title: 'Succès',
        message: 'La ferme a été mise à jour avec succès',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Une erreur est survenue lors de la mise à jour de la ferme',
        color: 'red',
      });
    },
  });

  // Mutation pour supprimer une ferme
  const deleteMutation = useMutation({
    mutationFn: deleteFarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      setDeleteModalOpen(false);
      setSelectedFarm(null);
      notifications.show({
        title: 'Succès',
        message: 'La ferme a été supprimée avec succès',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Une erreur est survenue lors de la suppression de la ferme',
        color: 'red',
      });
    },
  });

  // Mettre à jour le formulaire lorsqu'une ferme est sélectionnée pour l'édition
  useState(() => {
    if (selectedFarm && editModalOpen) {
      form.setValues({
        name: selectedFarm.name,
        location: selectedFarm.location,
        size: selectedFarm.size,
        description: selectedFarm.description || '',
        latitude: selectedFarm.latitude,
        longitude: selectedFarm.longitude,
      });
    }
  });

  // Gérer la soumission du formulaire de création
  const handleCreateSubmit = (values: typeof form.values) => {
    createMutation.mutate(values);
  };

  // Gérer la soumission du formulaire d'édition
  const handleEditSubmit = (values: typeof form.values) => {
    if (selectedFarm) {
      updateMutation.mutate({ id: selectedFarm.id, ...values });
    }
  };

  // Gérer la suppression d'une ferme
  const handleDelete = () => {
    if (selectedFarm) {
      deleteMutation.mutate(selectedFarm.id);
    }
  };

  // Ouvrir le modal d'édition
  const openEditModal = (farm: Farm) => {
    setSelectedFarm(farm);
    setEditModalOpen(true);
  };

  // Ouvrir le modal de suppression
  const openDeleteModal = (farm: Farm) => {
    setSelectedFarm(farm);
    setDeleteModalOpen(true);
  };

  // Afficher un loader pendant le chargement
  if (isLoading) {
    return (
      <Center style={{ height: 'calc(100vh - 60px)' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  // Afficher une erreur si la requête a échoué
  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle size={16} />} title="Erreur" color="red">
          Une erreur est survenue lors du chargement des fermes. Veuillez réessayer plus tard.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Gestion des Fermes</Title>
          <Text c="dimmed">Gérez vos fermes et leurs informations</Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={() => {
          form.reset();
          setCreateModalOpen(true);
        }}>
          Ajouter une ferme
        </Button>
      </Group>

      {farms && farms.length === 0 ? (
        <Card withBorder p="xl" radius="md" shadow="sm">
          <Center style={{ minHeight: '200px', flexDirection: 'column', gap: '16px' }}>
            <Text fw={500} size="lg" ta="center">
              Vous n'avez pas encore de fermes
            </Text>
            <Text c="dimmed" ta="center" mb="md">
              Commencez par ajouter votre première ferme pour gérer vos prunes
            </Text>
            <Button leftSection={<IconPlus size={16} />} onClick={() => setCreateModalOpen(true)}>
              Ajouter une ferme
            </Button>
          </Center>
        </Card>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {farms?.map((farm) => (
            <Card key={farm.id} withBorder padding="lg" radius="md" shadow="sm">
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                  <Text fw={500}>{farm.name}</Text>
                  <Menu position="bottom-end" shadow="md">
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray">
                        <IconDotsVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => openEditModal(farm)}>
                        Modifier
                      </Menu.Item>
                      <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => openDeleteModal(farm)}>
                        Supprimer
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Card.Section>

              <Group mt="md" mb="xs">
                <Badge color="plum" variant="light">
                  {farm.location}
                </Badge>
                <Badge color="blue" variant="light">
                  {farm.size} hectares
                </Badge>
              </Group>

              <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                {farm.description || 'Aucune description disponible'}
              </Text>

              <Box mt="md">
                <Group gap="xs">
                  <IconMapPin size={16} style={{ opacity: 0.7 }} />
                  <Text size="sm">{farm.location}</Text>
                </Group>
                <Group gap="xs" mt="xs">
                  <IconRuler size={16} style={{ opacity: 0.7 }} />
                  <Text size="sm">{farm.size} hectares</Text>
                </Group>
                <Group gap="xs" mt="xs">
                  <IconUser size={16} style={{ opacity: 0.7 }} />
                  <Text size="sm">Propriétaire: {farm.owner_details?.username || 'Vous'}</Text>
                </Group>
              </Box>

              <Button variant="light" color="plum" fullWidth mt="md">
                Voir les détails
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* Modal de création de ferme */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Ajouter une nouvelle ferme"
        centered
      >
        <form onSubmit={form.onSubmit(handleCreateSubmit)}>
          <TextInput
            label="Nom de la ferme"
            placeholder="Ma ferme de prunes"
            required
            {...form.getInputProps('name')}
          />
          <TextInput
            label="Localisation"
            placeholder="Région, Ville, etc."
            required
            mt="md"
            {...form.getInputProps('location')}
          />
          <TextInput
            label="Taille (hectares)"
            placeholder="10"
            required
            mt="md"
            type="number"
            min={0}
            step={0.1}
            {...form.getInputProps('size')}
          />
          <TextInput
            label="Description"
            placeholder="Description de la ferme"
            mt="md"
            {...form.getInputProps('description')}
          />
          <Group gap="xs" grow mt="md">
            <TextInput
              label="Latitude"
              placeholder="45.123456"
              type="number"
              step="any"
              {...form.getInputProps('latitude')}
            />
            <TextInput
              label="Longitude"
              placeholder="5.123456"
              type="number"
              step="any"
              {...form.getInputProps('longitude')}
            />
          </Group>
          <Group justify="flex-end" mt="xl">
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" loading={createMutation.isPending}>
              Créer
            </Button>
          </Group>
        </form>
      </Modal>

      {/* Modal d'édition de ferme */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Modifier la ferme"
        centered
      >
        <form onSubmit={form.onSubmit(handleEditSubmit)}>
          <TextInput
            label="Nom de la ferme"
            placeholder="Ma ferme de prunes"
            required
            {...form.getInputProps('name')}
          />
          <TextInput
            label="Localisation"
            placeholder="Région, Ville, etc."
            required
            mt="md"
            {...form.getInputProps('location')}
          />
          <TextInput
            label="Taille (hectares)"
            placeholder="10"
            required
            mt="md"
            type="number"
            min={0}
            step={0.1}
            {...form.getInputProps('size')}
          />
          <TextInput
            label="Description"
            placeholder="Description de la ferme"
            mt="md"
            {...form.getInputProps('description')}
          />
          <Group gap="xs" grow mt="md">
            <TextInput
              label="Latitude"
              placeholder="45.123456"
              type="number"
              step="any"
              {...form.getInputProps('latitude')}
            />
            <TextInput
              label="Longitude"
              placeholder="5.123456"
              type="number"
              step="any"
              {...form.getInputProps('longitude')}
            />
          </Group>
          <Group justify="flex-end" mt="xl">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" loading={updateMutation.isPending}>
              Enregistrer
            </Button>
          </Group>
        </form>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Supprimer la ferme"
        centered
      >
        <Text>
          Êtes-vous sûr de vouloir supprimer la ferme "{selectedFarm?.name}" ? Cette action est irréversible.
        </Text>
        <Group justify="flex-end" mt="xl">
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Annuler
          </Button>
          <Button color="red" onClick={handleDelete} loading={deleteMutation.isPending}>
            Supprimer
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}

export default FarmsPage;

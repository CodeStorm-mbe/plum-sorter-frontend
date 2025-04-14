import { useState, useEffect } from 'react';
import { Container, Title, Text, Card, Button, Group, TextInput, Modal, SimpleGrid, Badge, ActionIcon, Menu, Box, Loader, Center, Alert, Tabs, Table, Avatar, Progress, Select, FileInput, Switch } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconEdit, IconTrash, IconDotsVertical, IconUpload, IconPackages, IconApple, IconChartPie, IconPhoto } from '@tabler/icons-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Farm, PlumBatch, QualityDistribution } from '../types';
import api from '../services/api';

// Service pour récupérer les fermes
const fetchFarms = async (): Promise<Farm[]> => {
  const response = await api.get('/farms/');
  return response.data;
};

// Service pour récupérer les lots
const fetchBatches = async (): Promise<PlumBatch[]> => {
  const response = await api.get('/batches/');
  return response.data;
};

// Service pour créer un lot
const createBatch = async (batchData: { name: string; description?: string; farm: number }): Promise<PlumBatch> => {
  const response = await api.post('/batches/', batchData);
  return response.data;
};

// Service pour mettre à jour un lot
const updateBatch = async ({ id, ...batchData }: Partial<PlumBatch> & { id: number }): Promise<PlumBatch> => {
  const response = await api.put(`/batches/${id}/`, batchData);
  return response.data;
};

// Service pour supprimer un lot
const deleteBatch = async (id: number): Promise<void> => {
  await api.delete(`/batches/${id}/`);
};

// Service pour classifier un lot d'images
const classifyBatchImages = async ({ id, formData }: { id: number; formData: FormData }): Promise<any> => {
  const response = await api.post(`/batches/${id}/classify_batch/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export function BatchesPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<PlumBatch | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>('all');
  const [selectedFarm, setSelectedFarm] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Formulaire pour créer/éditer un lot
  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      farm: '',
    },
    validate: {
      name: (value: string) => (value.length < 3 ? 'Le nom doit contenir au moins 3 caractères' : null),
      farm: (value: string) => (!value ? 'Veuillez sélectionner une ferme' : null),
    },
  });

  // Formulaire pour télécharger des images
  const uploadForm = useForm({
    initialValues: {
      use_tta: false,
    },
  });

  // Requête pour récupérer les fermes
  const { data: farms, isLoading: farmsLoading } = useQuery({
    queryKey: ['farms'],
    queryFn: fetchFarms,
  });

  // Requête pour récupérer les lots
  const { data: batches, isLoading: batchesLoading, error: batchesError } = useQuery({
    queryKey: ['batches'],
    queryFn: fetchBatches,
  });

  // Mutation pour créer un lot
  const createMutation = useMutation({
    mutationFn: createBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      setCreateModalOpen(false);
      form.reset();
      notifications.show({
        title: 'Succès',
        message: 'Le lot a été créé avec succès',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Une erreur est survenue lors de la création du lot',
        color: 'red',
      });
    },
  });

  // Mutation pour mettre à jour un lot
  const updateMutation = useMutation({
    mutationFn: updateBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      setEditModalOpen(false);
      setSelectedBatch(null);
      form.reset();
      notifications.show({
        title: 'Succès',
        message: 'Le lot a été mis à jour avec succès',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Une erreur est survenue lors de la mise à jour du lot',
        color: 'red',
      });
    },
  });

  // Mutation pour supprimer un lot
  const deleteMutation = useMutation({
    mutationFn: deleteBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      setDeleteModalOpen(false);
      setSelectedBatch(null);
      notifications.show({
        title: 'Succès',
        message: 'Le lot a été supprimé avec succès',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Une erreur est survenue lors de la suppression du lot',
        color: 'red',
      });
    },
  });

  // Mutation pour classifier un lot d'images
  const classifyBatchMutation = useMutation({
    mutationFn: classifyBatchImages,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      setUploadModalOpen(false);
      setSelectedBatch(null);
      setSelectedFiles([]);
      notifications.show({
        title: 'Succès',
        message: 'Les images ont été classifiées avec succès',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Une erreur est survenue lors de la classification des images',
        color: 'red',
      });
    },
  });

  // Mettre à jour le formulaire lorsqu'un lot est sélectionné pour l'édition
  useEffect(() => {
    if (selectedBatch && editModalOpen) {
      form.setValues({
        name: selectedBatch.name,
        description: selectedBatch.description || '',
        farm: selectedBatch.farm.toString(),
      });
    }
  }, [selectedBatch, editModalOpen]);

  // Gérer la soumission du formulaire de création
  const handleCreateSubmit = (values: typeof form.values) => {
    createMutation.mutate({
      name: values.name,
      description: values.description,
      farm: parseInt(values.farm),
    });
  };

  // Gérer la soumission du formulaire d'édition
  const handleEditSubmit = (values: typeof form.values) => {
    if (selectedBatch) {
      updateMutation.mutate({
        id: selectedBatch.id,
        name: values.name,
        description: values.description,
        farm: parseInt(values.farm),
      });
    }
  };

  // Gérer la suppression d'un lot
  const handleDelete = () => {
    if (selectedBatch) {
      deleteMutation.mutate(selectedBatch.id);
    }
  };

  // Gérer le téléchargement d'images pour un lot
  const handleUploadSubmit = (values: typeof uploadForm.values) => {
    if (selectedBatch && selectedFiles.length > 0) {
      const formData = new FormData();
      
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });
      
      formData.append('use_tta', values.use_tta.toString());
      
      classifyBatchMutation.mutate({
        id: selectedBatch.id,
        formData,
      });
    }
  };

  // Ouvrir le modal d'édition
  const openEditModal = (batch: PlumBatch) => {
    setSelectedBatch(batch);
    setEditModalOpen(true);
  };

  // Ouvrir le modal de suppression
  const openDeleteModal = (batch: PlumBatch) => {
    setSelectedBatch(batch);
    setDeleteModalOpen(true);
  };

  // Ouvrir le modal de téléchargement d'images
  const openUploadModal = (batch: PlumBatch) => {
    setSelectedBatch(batch);
    setUploadModalOpen(true);
  };

  // Filtrer les lots en fonction de l'onglet actif et de la ferme sélectionnée
  const filteredBatches = batches?.filter((batch) => {
    if (selectedFarm && batch.farm.toString() !== selectedFarm) {
      return false;
    }
    
    if (activeTab === 'all') {
      return true;
    } else if (activeTab === 'pending') {
      return batch.status === 'pending';
    } else if (activeTab === 'classified') {
      return batch.status === 'classified';
    } else if (activeTab === 'archived') {
      return batch.status === 'archived';
    }
    
    return true;
  });

  // Afficher un loader pendant le chargement
  if (batchesLoading || farmsLoading) {
    return (
      <Center style={{ height: 'calc(100vh - 60px)' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  // Afficher une erreur si la requête a échoué
  if (batchesError) {
    return (
      <Container size="xl" py="xl">
        <Alert title="Erreur" color="red">
          Une erreur est survenue lors du chargement des lots. Veuillez réessayer plus tard.
        </Alert>
      </Container>
    );
  }

  // Formater la distribution de qualité pour l'affichage
  const formatQualityDistribution = (distribution: QualityDistribution) => {
    const qualityMapping: Record<string, { label: string; color: string }> = {
      'bonne_qualite': { label: 'Bonne qualité', color: 'green' },
      'non_mure': { label: 'Non mûre', color: 'yellow' },
      'tachetee': { label: 'Tachetée', color: 'orange' },
      'fissuree': { label: 'Fissurée', color: 'red' },
      'meurtrie': { label: 'Meurtrie', color: 'red' },
      'pourrie': { label: 'Pourrie', color: 'red' },
    };
    
    return Object.entries(distribution).map(([key, value]) => ({
      label: qualityMapping[key]?.label || key,
      color: qualityMapping[key]?.color || 'gray',
      count: value.count,
      percentage: value.percentage,
    }));
  };

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Gestion des Lots</Title>
          <Text c="dimmed">Gérez vos lots de prunes et leurs classifications</Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={() => {
          form.reset();
          setCreateModalOpen(true);
        }}>
          Créer un nouveau lot
        </Button>
      </Group>

      <Group mb="md">
        <Select
          placeholder="Filtrer par ferme"
          data={farms?.map(farm => ({ value: farm.id.toString(), label: farm.name })) || []}
          value={selectedFarm}
          onChange={setSelectedFarm}
          clearable
          w={250}
        />
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab} mb="md">
        <Tabs.List>
          <Tabs.Tab value="all" leftSection={<IconPackages size={16} />}>
            Tous les lots
          </Tabs.Tab>
          <Tabs.Tab value="pending" leftSection={<IconUpload size={16} />}>
            En attente
          </Tabs.Tab>
          <Tabs.Tab value="classified" leftSection={<IconApple size={16} />}>
            Classifiés
          </Tabs.Tab>
          <Tabs.Tab value="archived" leftSection={<IconChartPie size={16} />}>
            Archivés
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {filteredBatches && filteredBatches.length === 0 ? (
        <Card withBorder p="xl" radius="md" shadow="sm">
          <Center style={{ minHeight: '200px', flexDirection: 'column', gap: '16px' }}>
            <Text fw={500} size="lg" ta="center">
              Aucun lot trouvé
            </Text>
            <Text c="dimmed" ta="center" mb="md">
              {activeTab !== 'all' 
                ? `Aucun lot avec le statut "${activeTab}" n'a été trouvé.` 
                : 'Commencez par créer votre premier lot pour organiser vos prunes.'}
            </Text>
            <Button leftSection={<IconPlus size={16} />} onClick={() => setCreateModalOpen(true)}>
              Créer un nouveau lot
            </Button>
          </Center>
        </Card>
      ) : (
        <Card withBorder p={0} radius="md" shadow="sm">
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nom</Table.Th>
                <Table.Th>Ferme</Table.Th>
                <Table.Th>Statut</Table.Th>
                <Table.Th>Prunes</Table.Th>
                <Table.Th>Distribution de qualité</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredBatches?.map((batch) => (
                <Table.Tr key={batch.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar color="plum" radius="xl">
                        {batch.name.charAt(0)}
                      </Avatar>
                      <div>
                        <Text fw={500}>{batch.name}</Text>
                        <Text size="xs" c="dimmed">
                          {batch.description || 'Aucune description'}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    {batch.farm_details?.name || `Ferme #${batch.farm}`}
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        batch.status === 'pending' ? 'yellow' :
                        batch.status === 'classified' ? 'green' :
                        'gray'
                      }
                    >
                      {batch.status_display || batch.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {batch.total_plums || 0}
                  </Table.Td>
                  <Table.Td>
                    {batch.quality_distribution ? (
                      <Box w={200}>
                        {formatQualityDistribution(batch.quality_distribution).map((quality, index) => (
                          <Box key={index} mb={5}>
                            <Group justify="apart" mb={5}>
                              <Text size="xs">{quality.label}</Text>
                              <Text size="xs" fw={500}>{quality.percentage.toFixed(1)}%</Text>
                            </Group>
                            <Progress
                              value={quality.percentage}
                              color={quality.color}
                              size="sm"
                            />
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Text size="sm" c="dimmed">Aucune donnée</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Button
                        variant="light"
                        size="xs"
                        onClick={() => openUploadModal(batch)}
                      >
                        Classifier
                      </Button>
                      <Menu position="bottom-end" shadow="md">
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray">
                            <IconDotsVertical size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => openEditModal(batch)}>
                            Modifier
                          </Menu.Item>
                          <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => openDeleteModal(batch)}>
                            Supprimer
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      )}

      {/* Modal de création de lot */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Créer un nouveau lot"
        centered
      >
        <form onSubmit={form.onSubmit(handleCreateSubmit)}>
          <TextInput
            label="Nom du lot"
            placeholder="Lot de prunes du 15/04/2025"
            required
            {...form.getInputProps('name')}
          />
          <TextInput
            label="Description"
            placeholder="Description du lot"
            mt="md"
            {...form.getInputProps('description')}
          />
          <Select
            label="Ferme"
            placeholder="Sélectionner une ferme"
            data={farms?.map(farm => ({ value: farm.id.toString(), label: farm.name })) || []}
            required
            mt="md"
            {...form.getInputProps('farm')}
          />
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

      {/* Modal d'édition de lot */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Modifier le lot"
        centered
      >
        <form onSubmit={form.onSubmit(handleEditSubmit)}>
          <TextInput
            label="Nom du lot"
            placeholder="Lot de prunes du 15/04/2025"
            required
            {...form.getInputProps('name')}
          />
          <TextInput
            label="Description"
            placeholder="Description du lot"
            mt="md"
            {...form.getInputProps('description')}
          />
          <Select
            label="Ferme"
            placeholder="Sélectionner une ferme"
            data={farms?.map(farm => ({ value: farm.id.toString(), label: farm.name })) || []}
            required
            mt="md"
            {...form.getInputProps('farm')}
          />
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
        title="Supprimer le lot"
        centered
      >
        <Text>
          Êtes-vous sûr de vouloir supprimer le lot "{selectedBatch?.name}" ? Cette action est irréversible.
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

      {/* Modal de téléchargement d'images */}
      <Modal
        opened={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title={`Classifier des images pour le lot "${selectedBatch?.name}"`}
        centered
        size="lg"
      >
        <form onSubmit={uploadForm.onSubmit(handleUploadSubmit)}>
          <FileInput
            label="Images de prunes"
            placeholder="Sélectionner des images"
            accept="image/png,image/jpeg,image/jpg"
            multiple
            required
            clearable
            leftSection={<IconPhoto size={16} />}
            value={selectedFiles}
            onChange={setSelectedFiles as any}
            mb="md"
          />

          <Switch
            label="Utiliser TTA (Test Time Augmentation)"
            description="Améliore la précision mais ralentit le traitement"
            mb="xl"
            {...uploadForm.getInputProps('use_tta', { type: 'checkbox' })}
          />

          <Group justify="flex-end" mt="xl">
            <Button variant="outline" onClick={() => setUploadModalOpen(false)}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              leftSection={<IconUpload size={16} />} 
              loading={classifyBatchMutation.isPending}
              disabled={selectedFiles.length === 0}
            >
              Classifier {selectedFiles.length} image{selectedFiles.length !== 1 ? 's' : ''}
            </Button>
          </Group>
        </form>
      </Modal>
    </Container>
  );
}

export default BatchesPage;

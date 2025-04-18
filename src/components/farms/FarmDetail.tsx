import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Title, 
  Button, 
  Group, 
  Text, 
  Badge, 
  Tabs, 
  Grid, 
  Stack, 
  ActionIcon,
  Modal,
  Loader
} from '@mantine/core';
import { 
  IconArrowLeft, 
  IconEdit, 
  IconTrash, 
  IconPlant, 
  IconMapPin, 
  IconRuler, 
  IconPackage,
  IconChartBar
} from '@tabler/icons-react';
import { notifications } from '../../utils/notifications';
import { FarmForm } from './FarmForm';
import { BatchList } from '../batches/BatchList';
import { BatchForm } from '../batches/BatchForm';
import { Farm } from '../../types';
import { farmService, batchService } from '../../services';

export const FarmDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const farmId = parseInt(id || '0');
  const navigate = useNavigate();
  
  const [farm, setFarm] = useState<Farm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateBatchModalOpen, setIsCreateBatchModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  const [farmStats, setFarmStats] = useState<any>(null);
  const [batches, setBatches] = useState<any[]>([]);
  const [batchesLoading, setBatchesLoading] = useState(false);

  // Charger les données de la ferme au montage du composant
  useEffect(() => {
    if (farmId) {
      loadFarm();
      loadFarmStats();
      loadFarmBatches();
    }
  }, [farmId]);

  // Fonction pour charger les données de la ferme
  const loadFarm = async () => {
    try {
      setIsLoading(true);
      const data = await farmService.getFarm(farmId);
      setFarm(data);
    } catch (error: any) {
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de charger les données de la ferme',
        color: 'red',
      });
      navigate('/farms');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour charger les statistiques de la ferme
  const loadFarmStats = async () => {
    try {
      const data = await farmService.getFarmStats(farmId);
      setFarmStats(data);
    } catch (error: any) {
      console.error('Erreur lors du chargement des statistiques:', error);
      // Ne pas afficher de notification, ce n'est pas critique
    }
  };

  // Fonction pour charger les lots de la ferme
  const loadFarmBatches = async () => {
    try {
      setBatchesLoading(true);
      const data = await farmService.getFarmBatches(farmId);
      setBatches(data.results || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des lots:', error);
      // Ne pas afficher de notification, ce n'est pas critique
    } finally {
      setBatchesLoading(false);
    }
  };

  // Fonction pour mettre à jour une ferme
  const handleUpdateFarm = async (data: any) => {
    try {
      setIsSubmitting(true);
      await farmService.updateFarm(farmId, data);
      notifications.show({
        title: 'Succès',
        message: 'Ferme mise à jour avec succès',
        color: 'green',
      });
      setIsEditModalOpen(false);
      loadFarm();
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
    try {
      setIsSubmitting(true);
      await farmService.deleteFarm(farmId);
      notifications.show({
        title: 'Succès',
        message: 'Ferme supprimée avec succès',
        color: 'green',
      });
      navigate('/farms');
    } catch (error: any) {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Impossible de supprimer la ferme',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
      setIsDeleteModalOpen(false);
    }
  };

  // Fonction pour créer un lot
  const handleCreateBatch = async (data: any) => {
    try {
      setIsSubmitting(true);
      await batchService.createBatch({
        ...data,
        farm: farmId
      });
      notifications.show({
        title: 'Succès',
        message: 'Lot créé avec succès',
        color: 'green',
      });
      setIsCreateBatchModalOpen(false);
      loadFarmBatches();
    } catch (error: any) {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Impossible de créer le lot',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <Loader size="xl" />
      </div>
    );
  }

  if (!farm) {
    return (
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Text align="center" color="dimmed">
          Ferme non trouvée
        </Text>
        <Button 
          leftIcon={<IconArrowLeft size={16} />} 
          onClick={() => navigate('/farms')}
          mt="md"
          variant="outline"
        >
          Retour aux fermes
        </Button>
      </Card>
    );
  }

  return (
    <>
      <Group position="apart" mb="md">
        <Group>
          <ActionIcon size="lg" variant="light" onClick={() => navigate('/farms')}>
            <IconArrowLeft size={20} />
          </ActionIcon>
          <Title order={2}>{farm.name}</Title>
        </Group>
        <Group>
          <Button 
            variant="outline" 
            leftIcon={<IconEdit size={16} />} 
            onClick={() => setIsEditModalOpen(true)}
          >
            Modifier
          </Button>
          <Button 
            variant="filled" 
            color="red" 
            leftIcon={<IconTrash size={16} />} 
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Supprimer
          </Button>
        </Group>
      </Group>

      <Tabs value={activeTab} onTabChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="overview" icon={<IconPlant size={14} />}>Vue d'ensemble</Tabs.Tab>
          <Tabs.Tab value="batches" icon={<IconPackage size={14} />}>Lots</Tabs.Tab>
          <Tabs.Tab value="statistics" icon={<IconChartBar size={14} />}>Statistiques</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="xs">
          <Card shadow="sm" p="lg" radius="md" withBorder mt="md">
            <Grid>
              <Grid.Col span={12} md={6}>
                <Stack spacing="md">
                  <Group>
                    <IconMapPin size={20} />
                    <Text>Emplacement: {farm.location}</Text>
                  </Group>
                  {farm.size && (
                    <Group>
                      <IconRuler size={20} />
                      <Text>Taille: {farm.size} hectares</Text>
                    </Group>
                  )}
                  {farm.description && (
                    <Text>
                      <strong>Description:</strong><br />
                      {farm.description}
                    </Text>
                  )}
                </Stack>
              </Grid.Col>
              <Grid.Col span={12} md={6}>
                <Card shadow="xs" p="md" radius="md" withBorder>
                  <Title order={4}>Résumé</Title>
                  <Stack spacing="xs" mt="md">
                    <Group position="apart">
                      <Text>Nombre de lots:</Text>
                      <Badge size="lg">{batches.length}</Badge>
                    </Group>
                    <Group position="apart">
                      <Text>Classifications totales:</Text>
                      <Badge size="lg" color="blue">{farmStats?.total_classifications || 0}</Badge>
                    </Group>
                    <Group position="apart">
                      <Text>Qualité moyenne:</Text>
                      <Badge 
                        size="lg" 
                        color={farmStats?.average_quality > 70 ? "green" : farmStats?.average_quality > 40 ? "yellow" : "red"}
                      >
                        {farmStats?.average_quality ? `${farmStats.average_quality}%` : 'N/A'}
                      </Badge>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="batches" pt="xs">
          <Group position="apart" mb="md">
            <Title order={3}>Lots de prunes</Title>
            <Button 
              leftIcon={<IconPackage size={16} />} 
              onClick={() => setIsCreateBatchModalOpen(true)}
            >
              Ajouter un lot
            </Button>
          </Group>
          
          {batchesLoading ? (
            <Loader />
          ) : (
            <BatchList 
              batches={batches} 
              onBatchCreated={loadFarmBatches}
              onBatchUpdated={loadFarmBatches}
              onBatchDeleted={loadFarmBatches}
              farmId={farmId}
            />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="statistics" pt="xs">
          <Card shadow="sm" p="lg" radius="md" withBorder mt="md">
            <Title order={3} mb="md">Statistiques de la ferme</Title>
            
            {!farmStats ? (
              <Text align="center" color="dimmed">
                Aucune statistique disponible pour cette ferme
              </Text>
            ) : (
              <Grid>
                <Grid.Col span={12} md={6}>
                  <Card shadow="xs" p="md" radius="md" withBorder>
                    <Title order={4}>Distribution des classifications</Title>
                    {/* Ici, on pourrait ajouter un graphique de distribution */}
                    <Stack spacing="xs" mt="md">
                      {farmStats.class_percentages && Object.entries(farmStats.class_percentages).map(([className, percentage]: [string, any]) => (
                        <Group position="apart" key={className}>
                          <Text>{className}:</Text>
                          <Text weight={500}>{percentage}%</Text>
                        </Group>
                      ))}
                    </Stack>
                  </Card>
                </Grid.Col>
                <Grid.Col span={12} md={6}>
                  <Card shadow="xs" p="md" radius="md" withBorder>
                    <Title order={4}>Tendances</Title>
                    <Stack spacing="xs" mt="md">
                      <Group position="apart">
                        <Text>Confiance moyenne:</Text>
                        <Text weight={500}>{farmStats.average_confidence?.toFixed(2) || 'N/A'}</Text>
                      </Group>
                      <Group position="apart">
                        <Text>Dernière classification:</Text>
                        <Text weight={500}>
                          {farmStats.last_classification_date 
                            ? new Date(farmStats.last_classification_date).toLocaleDateString() 
                            : 'Jamais'}
                        </Text>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
              </Grid>
            )}
          </Card>
        </Tabs.Panel>
      </Tabs>

      {/* Modal pour modifier une ferme */}
      <Modal
        opened={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Modifier la ferme"
        size="lg"
      >
        <FarmForm
          farm={farm}
          onSubmit={handleUpdateFarm}
          onCancel={() => setIsEditModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Modal pour confirmer la suppression */}
      <Modal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmer la suppression"
        size="sm"
      >
        <Text mb="md">
          Êtes-vous sûr de vouloir supprimer la ferme "{farm.name}" ? Cette action est irréversible et supprimera également tous les lots associés.
        </Text>
        <Group position="right">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Annuler
          </Button>
          <Button color="red" onClick={handleDeleteFarm} loading={isSubmitting}>
            Supprimer
          </Button>
        </Group>
      </Modal>

      {/* Modal pour créer un lot */}
      <Modal
        opened={isCreateBatchModalOpen}
        onClose={() => setIsCreateBatchModalOpen(false)}
        title="Ajouter un nouveau lot"
        size="lg"
      >
        <BatchForm
          onSubmit={handleCreateBatch}
          onCancel={() => setIsCreateBatchModalOpen(false)}
          isSubmitting={isSubmitting}
          farmId={farmId}
        />
      </Modal>
    </>
  );
};

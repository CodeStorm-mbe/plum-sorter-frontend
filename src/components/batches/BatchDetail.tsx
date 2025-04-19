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
  Loader,
  Image
} from '@mantine/core';
import { 
  IconArrowLeft, 
  IconEdit, 
  IconTrash, 
  IconPackage, 
  IconCalendar, 
  IconScale, 
  IconPhoto,
  IconChartBar
} from '@tabler/icons-react';
import { notifications } from '../../utils/notifications';
import { BatchForm } from './BatchForm';
import { ClassificationForm } from '../classifications/ClassificationForm';
import { ClassificationList } from '../classifications/ClassificationList';
import { BatchService, ClassificationService } from '../../services';

export const BatchDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const batchId = parseInt(id || '0');
  const navigate = useNavigate();
  
  const [batch, setBatch] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isClassifyModalOpen, setIsClassifyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  const [classifications, setClassifications] = useState<any[]>([]);
  const [classificationsLoading, setClassificationsLoading] = useState(false);

  // Charger les données du lot au montage du composant
  useEffect(() => {
    if (batchId) {
      loadBatch();
      loadClassifications();
    }
  }, [batchId]);

  // Fonction pour charger les données du lot
  const loadBatch = async () => {
    try {
      setIsLoading(true);
      const data = await BatchService.getBatch(batchId);
      setBatch(data);
    } catch (error: any) {
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de charger les données du lot',
        color: 'red',
      });
      navigate('/batches');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour charger les classifications du lot
  const loadClassifications = async () => {
    try {
      setClassificationsLoading(true);
      const data = await BatchService.getBatchClassifications(batchId);
      setClassifications(data.results || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des classifications:', error);
      // Ne pas afficher de notification, ce n'est pas critique
    } finally {
      setClassificationsLoading(false);
    }
  };

  // Fonction pour mettre à jour un lot
  const handleUpdateBatch = async (data: any) => {
    try {
      setIsSubmitting(true);
      await BatchService.updateBatch(batchId, data);
      notifications.show({
        title: 'Succès',
        message: 'Lot mis à jour avec succès',
        color: 'green',
      });
      setIsEditModalOpen(false);
      loadBatch();
    } catch (error: any) {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Impossible de mettre à jour le lot',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour supprimer un lot
  const handleDeleteBatch = async () => {
    try {
      setIsSubmitting(true);
      await BatchService.deleteBatch(batchId);
      notifications.show({
        title: 'Succès',
        message: 'Lot supprimé avec succès',
        color: 'green',
      });
      navigate('/batches');
    } catch (error: any) {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Impossible de supprimer le lot',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
      setIsDeleteModalOpen(false);
    }
  };

  // Fonction pour classifier une image
  const handleClassifyImage = async (data: any) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('image', data.image);
      formData.append('batch_id', batchId.toString());
      
      if (batch?.farm?.id) {
        formData.append('farm_id', batch.farm.id.toString());
      }
      
      if (data.use_tta) {
        formData.append('use_tta', 'true');
      }
      
      await ClassificationService.classifyImage(formData);
      
      notifications.show({
        title: 'Succès',
        message: 'Image classifiée avec succès',
        color: 'green',
      });
      
      setIsClassifyModalOpen(false);
      loadClassifications();
    } catch (error: any) {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Impossible de classifier l\'image',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour obtenir la couleur du badge selon le statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'processing':
        return 'blue';
      case 'completed':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Fonction pour obtenir le libellé du statut
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'processing':
        return 'En traitement';
      case 'completed':
        return 'Terminé';
      case 'rejected':
        return 'Rejeté';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <Loader size="xl" />
      </div>
    );
  }

  if (!batch) {
    return (
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Text ta="center" c="dimmed">
          Lot non trouvé
        </Text>
        <Button 
          leftSection={<IconArrowLeft size={16} />} 
          onClick={() => navigate('/batches')}
          mt="md"
          variant="outline"
        >
          Retour aux lots
        </Button>
      </Card>
    );
  }

  return (
    <>
      <Group justify="space-between" mb="md">
        <Group>
          <ActionIcon size="lg" variant="light" onClick={() => navigate(-1)}>
            <IconArrowLeft size={20} />
          </ActionIcon>
          <Title order={2}>{batch.name}</Title>
        </Group>
        <Group>
          <Button 
            variant="filled" 
            color="green" 
            leftSection={<IconPhoto size={16} />} 
            onClick={() => setIsClassifyModalOpen(true)}
          >
            Classifier
          </Button>
          <Button 
            variant="outline" 
            leftSection={<IconEdit size={16} />} 
            onClick={() => setIsEditModalOpen(true)}
          >
            Modifier
          </Button>
          <Button 
            variant="filled" 
            color="red" 
            leftSection={<IconTrash size={16} />} 
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Supprimer
          </Button>
        </Group>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<IconPackage size={14} />}>Vue d'ensemble</Tabs.Tab>
          <Tabs.Tab value="classifications" leftSection={<IconPhoto size={14} />}>Classifications</Tabs.Tab>
          <Tabs.Tab value="statistics" leftSection={<IconChartBar size={14} />}>Statistiques</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="xs">
          <Card shadow="sm" p="lg" radius="md" withBorder mt="md">
            <Grid>
              <Grid.Col span={6}>
                <Stack gap="md">
                  <Group>
                    <IconCalendar size={20} />
                    <Text>
                      Date de récolte: {batch.harvest_date 
                        ? new Date(batch.harvest_date).toLocaleDateString() 
                        : 'Non spécifiée'}
                    </Text>
                  </Group>
                  {batch.quantity && (
                    <Group>
                      <IconScale size={20} />
                      <Text>Quantité: {batch.quantity} kg</Text>
                    </Group>
                  )}
                  {batch.variety && (
                    <Text>
                      <strong>Variété:</strong> {batch.variety}
                    </Text>
                  )}
                  {batch.description && (
                    <Text>
                      <strong>Description:</strong><br />
                      {batch.description}
                    </Text>
                  )}
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Card shadow="xs" p="md" radius="md" withBorder>
                  <Title order={4}>Résumé</Title>
                  <Stack gap="xs" mt="md">
                    <Group justify="space-between">
                      <Text>Statut:</Text>
                      <Badge size="lg" color={getStatusColor(batch.status)}>
                        {getStatusLabel(batch.status)}
                      </Badge>
                    </Group>
                    <Group justify="space-between">
                      <Text>Classifications:</Text>
                      <Badge size="lg" color="blue">{classifications.length}</Badge>
                    </Group>
                    {batch.classification_summary && (
                      <Group justify="space-between">
                        <Text>Qualité moyenne:</Text>
                        <Badge 
                          size="lg" 
                          color={batch.classification_summary.average_quality > 70 ? "green" : batch.classification_summary.average_quality > 40 ? "yellow" : "red"}
                        >
                          {batch.classification_summary.average_quality ? `${batch.classification_summary.average_quality}%` : 'N/A'}
                        </Badge>
                      </Group>
                    )}
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="classifications" pt="xs">
          <Group justify="space-between" mb="md">
            <Title order={3}>Classifications</Title>
            <Button 
              leftSection={<IconPhoto size={16} />} 
              onClick={() => setIsClassifyModalOpen(true)}
            >
              Nouvelle classification
            </Button>
          </Group>
          
          {classificationsLoading ? (
            <Loader />
          ) : (
            <ClassificationList 
              classifications={classifications} 
              onClassificationCreated={loadClassifications}
              onClassificationDeleted={loadClassifications}
            />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="statistics" pt="xs">
          <Card shadow="sm" p="lg" radius="md" withBorder mt="md">
            <Title order={3} mb="md">Statistiques du lot</Title>
            
            {!batch.classification_summary ? (
              <Text ta="center" c="dimmed">
                Aucune statistique disponible pour ce lot. Ajoutez des classifications pour générer des statistiques.
              </Text>
            ) : (
              <Grid>
                <Grid.Col span={6}>
                  <Card shadow="xs" p="md" radius="md" withBorder>
                    <Title order={4}>Distribution des classifications</Title>
                    {/* Ici, on pourrait ajouter un graphique de distribution */}
                    <Stack gap="xs" mt="md">
                      {batch.classification_summary.class_distribution && 
                        Object.entries(batch.classification_summary.class_distribution).map(([className, count]: [string, any]) => (
                          <Group justify="space-between" key={className}>
                            <Text>{className}:</Text>
                            <Text fw={500}>{count}</Text>
                          </Group>
                        ))
                      }
                    </Stack>
                  </Card>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Card shadow="xs" p="md" radius="md" withBorder>
                    <Title order={4}>Métriques</Title>
                    <Stack gap="xs" mt="md">
                      <Group justify="space-between">
                        <Text>Confiance moyenne:</Text>
                        <Text fw={500}>
                          {batch.classification_summary.average_confidence?.toFixed(2) || 'N/A'}
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text>Dernière classification:</Text>
                        <Text fw={500}>
                          {batch.classification_summary.last_classification_date 
                            ? new Date(batch.classification_summary.last_classification_date).toLocaleDateString() 
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

      {/* Modal pour modifier un lot */}
      <Modal
        opened={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Modifier le lot"
        size="lg"
      >
        <BatchForm
          batch={batch}
          onSubmit={handleUpdateBatch}
          onCancel={() => setIsEditModalOpen(false)}
          isSubmitting={isSubmitting}
          farmId={batch.farm?.id || 0}
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
          Êtes-vous sûr de vouloir supprimer le lot "{batch.name}" ? Cette action est irréversible et supprimera également toutes les classifications associées.
        </Text>
        <Group justify="flex-end">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Annuler
          </Button>
          <Button color="red" onClick={handleDeleteBatch} loading={isSubmitting}>
            Supprimer
          </Button>
        </Group>
      </Modal>

      {/* Modal pour classifier une image */}
      <Modal
        opened={isClassifyModalOpen}
        onClose={() => setIsClassifyModalOpen(false)}
        title="Classifier une image"
        size="lg"
      >
        <ClassificationForm
          onSubmit={handleClassifyImage}
          onCancel={() => setIsClassifyModalOpen(false)}
          isSubmitting={isSubmitting}
          batchId={batchId}
          farmId={batch.farm?.id}
        />
      </Modal>
    </>
  );
};

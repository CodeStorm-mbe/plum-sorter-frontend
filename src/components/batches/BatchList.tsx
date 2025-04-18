import React, { useState } from 'react';
import { Card, Title, Button, Group, Text, Badge, ActionIcon, Menu, Modal, Stack, Grid } from '@mantine/core';
import { IconDotsVertical, IconEdit, IconTrash, IconEye, IconPhoto } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '../../utils/notifications';
import { BatchForm } from './BatchForm';
import { batchService } from '../../services';

interface BatchListProps {
  batches: any[];
  onBatchCreated: () => void;
  onBatchUpdated: () => void;
  onBatchDeleted: () => void;
  farmId: number;
}

export const BatchList: React.FC<BatchListProps> = ({ 
  batches, 
  onBatchCreated, 
  onBatchUpdated, 
  onBatchDeleted,
  farmId
}) => {
  const [selectedBatch, setSelectedBatch] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fonction pour mettre à jour un lot
  const handleUpdateBatch = async (data: any) => {
    if (!selectedBatch) return;
    
    try {
      setIsSubmitting(true);
      await batchService.updateBatch(selectedBatch.id, data);
      notifications.show({
        title: 'Succès',
        message: 'Lot mis à jour avec succès',
        color: 'green',
      });
      setIsEditModalOpen(false);
      onBatchUpdated();
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
    if (!selectedBatch) return;
    
    try {
      setIsSubmitting(true);
      await batchService.deleteBatch(selectedBatch.id);
      notifications.show({
        title: 'Succès',
        message: 'Lot supprimé avec succès',
        color: 'green',
      });
      setIsDeleteModalOpen(false);
      onBatchDeleted();
    } catch (error: any) {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Impossible de supprimer le lot',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour naviguer vers la page de détails d'un lot
  const handleViewBatch = (batchId: number) => {
    navigate(`/batches/${batchId}`);
  };

  // Fonction pour naviguer vers la page de classification d'un lot
  const handleClassifyBatch = (batchId: number) => {
    navigate(`/classifications/new?batch=${batchId}`);
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

  if (batches.length === 0) {
    return (
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Text align="center" color="dimmed">
          Aucun lot disponible pour cette ferme. Ajoutez un lot pour commencer.
        </Text>
      </Card>
    );
  }

  return (
    <>
      <Grid>
        {batches.map((batch) => (
          <Grid.Col key={batch.id} span={12} md={6} lg={4}>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group position="apart">
                  <Text weight={500}>{batch.name}</Text>
                  <Menu withinPortal position="bottom-end" shadow="sm">
                    <Menu.Target>
                      <ActionIcon>
                        <IconDotsVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item 
                        icon={<IconEye size={16} />} 
                        onClick={() => handleViewBatch(batch.id)}
                      >
                        Voir détails
                      </Menu.Item>
                      <Menu.Item 
                        icon={<IconPhoto size={16} />} 
                        onClick={() => handleClassifyBatch(batch.id)}
                      >
                        Classifier
                      </Menu.Item>
                      <Menu.Item 
                        icon={<IconEdit size={16} />} 
                        onClick={() => {
                          setSelectedBatch(batch);
                          setIsEditModalOpen(true);
                        }}
                      >
                        Modifier
                      </Menu.Item>
                      <Menu.Item 
                        icon={<IconTrash size={16} />} 
                        color="red"
                        onClick={() => {
                          setSelectedBatch(batch);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        Supprimer
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Card.Section>
              <Stack spacing="xs" mt="md">
                {batch.harvest_date && (
                  <Text size="sm" color="dimmed">
                    Récolté le: {new Date(batch.harvest_date).toLocaleDateString()}
                  </Text>
                )}
                {batch.quantity && (
                  <Text size="sm" color="dimmed">Quantité: {batch.quantity} kg</Text>
                )}
                {batch.variety && (
                  <Text size="sm" color="dimmed">Variété: {batch.variety}</Text>
                )}
                <Group position="apart" mt="md">
                  <Badge color={getStatusColor(batch.status)}>
                    {getStatusLabel(batch.status)}
                  </Badge>
                  <Badge color="blue">
                    {batch.total_classifications || 0} classifications
                  </Badge>
                </Group>
                <Group position="right" mt="md">
                  <Button 
                    variant="light" 
                    onClick={() => handleClassifyBatch(batch.id)}
                    leftIcon={<IconPhoto size={16} />}
                  >
                    Classifier
                  </Button>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {/* Modal pour modifier un lot */}
      <Modal
        opened={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Modifier le lot"
        size="lg"
      >
        {selectedBatch && (
          <BatchForm
            batch={selectedBatch}
            onSubmit={handleUpdateBatch}
            onCancel={() => setIsEditModalOpen(false)}
            isSubmitting={isSubmitting}
            farmId={farmId}
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
          Êtes-vous sûr de vouloir supprimer le lot "{selectedBatch?.name}" ? Cette action est irréversible et supprimera également toutes les classifications associées.
        </Text>
        <Group position="right">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Annuler
          </Button>
          <Button color="red" onClick={handleDeleteBatch} loading={isSubmitting}>
            Supprimer
          </Button>
        </Group>
      </Modal>
    </>
  );
};

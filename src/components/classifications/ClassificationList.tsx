import React, { useState } from 'react';
import { 
  Card, 
  Text, 
  Badge, 
  Group, 
  Stack, 
  Grid, 
  Image, 
  ActionIcon, 
  Menu,
  Modal,
  Button
} from '@mantine/core';
import { IconDotsVertical, IconTrash, IconEye, IconDownload } from '@tabler/icons-react';
import { notifications } from '../../utils/notifications';
import { ClassificationService } from '../../services';

interface ClassificationListProps {
  classifications: any[];
  onClassificationCreated?: () => void;
  onClassificationDeleted?: () => void;
}

export const ClassificationList: React.FC<ClassificationListProps> = ({ 
  classifications, 
  onClassificationDeleted 
}) => {
  const [selectedClassification, setSelectedClassification] = useState<any | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fonction pour supprimer une classification
  const handleDeleteClassification = async () => {
    if (!selectedClassification) return;
    
    try {
      setIsSubmitting(true);
      await ClassificationService.deleteClassification(selectedClassification.id);
      notifications.show({
        title: 'Succès',
        message: 'Classification supprimée avec succès',
        color: 'green',
      });
      setIsDeleteModalOpen(false);
      if (onClassificationDeleted) {
        onClassificationDeleted();
      }
    } catch (error: any) {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Impossible de supprimer la classification',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour obtenir la couleur du badge selon la classe
  const getClassColor = (className: string) => {
    const lowerClass = className.toLowerCase();
    if (lowerClass.includes('bonne') || lowerClass.includes('good')) return 'green';
    if (lowerClass.includes('non mûre') || lowerClass.includes('unripe')) return 'blue';
    if (lowerClass.includes('tachetée') || lowerClass.includes('spotted')) return 'yellow';
    if (lowerClass.includes('fissurée') || lowerClass.includes('cracked')) return 'orange';
    if (lowerClass.includes('meurtrie') || lowerClass.includes('bruised')) return 'grape';
    if (lowerClass.includes('pourrie') || lowerClass.includes('rotten')) return 'red';
    return 'gray';
  };

  if (classifications.length === 0) {
    return (
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Text ta="center" c="dimmed">
          Aucune classification disponible. Ajoutez une classification pour commencer.
        </Text>
      </Card>
    );
  }

  return (
    <>
      <Grid>
        {classifications.map((classification) => (
          <Grid.Col key={classification.id} span={3}>
            <Card shadow="sm" p="md" radius="md" withBorder>
              <Card.Section>
                <div style={{ textAlign: 'center', height: 160 }}>
                  <Image
                    src={classification.image_url || '/placeholder-plum.jpg'}
                    height={160}
                    alt={`Classification ${classification.id}`}
                    fallbackSrc="/placeholder-plum.jpg"
                  />
                </div>
              </Card.Section>

              <Group justify="space-between" mt="md" mb="xs">
                <Badge color={getClassColor(classification.class_name)} size="lg">
                  {classification.class_name}
                </Badge>
                <Menu withinPortal position="bottom-end" shadow="sm">
                  <Menu.Target>
                    <ActionIcon>
                      <IconDotsVertical size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item 
                      leftSection={<IconEye size={16} />} 
                      onClick={() => {
                        setSelectedClassification(classification);
                        setIsViewModalOpen(true);
                      }}
                    >
                      Voir détails
                    </Menu.Item>
                    {classification.image_url && (
                      <Menu.Item 
                        leftSection={<IconDownload size={16} />} 
                        component="a"
                        href={classification.image_url}
                        download
                        target="_blank"
                      >
                        Télécharger l'image
                      </Menu.Item>
                    )}
                    <Menu.Item 
                      leftSection={<IconTrash size={16} />} 
                      color="red"
                      onClick={() => {
                        setSelectedClassification(classification);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Supprimer
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>

              <Stack gap={5}>
                <Text size="sm" c="dimmed">
                  Confiance: {(classification.confidence_score * 100).toFixed(1)}%
                </Text>
                <Text size="sm" c="dimmed">
                  Date: {new Date(classification.created_at).toLocaleString()}
                </Text>
                {classification.batch && (
                  <Text size="sm" c="dimmed">
                    Lot: {classification.batch.name}
                  </Text>
                )}
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {/* Modal pour confirmer la suppression */}
      <Modal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmer la suppression"
        size="sm"
      >
        <Text mb="md">
          Êtes-vous sûr de vouloir supprimer cette classification ? Cette action est irréversible.
        </Text>
        <Group justify="flex-end">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Annuler
          </Button>
          <Button color="red" onClick={handleDeleteClassification} loading={isSubmitting}>
            Supprimer
          </Button>
        </Group>
      </Modal>

      {/* Modal pour voir les détails */}
      <Modal
        opened={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Détails de la classification"
        size="lg"
      >
        {selectedClassification && (
          <Stack gap="md">
            <div style={{ textAlign: 'center' }}>
              <Image
                src={selectedClassification.image_url || '/placeholder-plum.jpg'}
                height={300}
                fit="contain"
                alt={`Classification ${selectedClassification.id}`}
                fallbackSrc="/placeholder-plum.jpg"
              />
            </div>
            
            <Group justify="center">
              <Badge color={getClassColor(selectedClassification.class_name)} size="xl">
                {selectedClassification.class_name}
              </Badge>
            </Group>
            
            <Card shadow="xs" p="md" withBorder>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text fw={500}>Confiance:</Text>
                  <Text>{(selectedClassification.confidence_score * 100).toFixed(1)}%</Text>
                </Group>
                
                <Group justify="space-between">
                  <Text fw={500}>Date:</Text>
                  <Text>{new Date(selectedClassification.created_at).toLocaleString()}</Text>
                </Group>
                
                {selectedClassification.batch && (
                  <Group justify="space-between">
                    <Text fw={500}>Lot:</Text>
                    <Text>{selectedClassification.batch.name}</Text>
                  </Group>
                )}
                
                {selectedClassification.farm && (
                  <Group justify="space-between">
                    <Text fw={500}>Ferme:</Text>
                    <Text>{selectedClassification.farm.name}</Text>
                  </Group>
                )}
                
                {selectedClassification.model_version && (
                  <Group justify="space-between">
                    <Text fw={500}>Version du modèle:</Text>
                    <Text>{selectedClassification.model_version}</Text>
                  </Group>
                )}
                
                {selectedClassification.processing_time && (
                  <Group justify="space-between">
                    <Text fw={500}>Temps de traitement:</Text>
                    <Text>{selectedClassification.processing_time.toFixed(2)} secondes</Text>
                  </Group>
                )}
              </Stack>
            </Card>
            
            {selectedClassification.class_probabilities && (
              <Card shadow="xs" p="md" withBorder>
                <Text fw={500} mb="xs">Probabilités par classe:</Text>
                <Stack gap="xs">
                  {Object.entries(selectedClassification.class_probabilities).map(([className, probability]: [string, any]) => (
                    <Group justify="space-between" key={className}>
                      <Text>{className}:</Text>
                      <Text>{(probability * 100).toFixed(1)}%</Text>
                    </Group>
                  ))}
                </Stack>
              </Card>
            )}
          </Stack>
        )}
      </Modal>
    </>
  );
};

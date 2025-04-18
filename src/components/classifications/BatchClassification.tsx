import React, { useState } from 'react';
import { 
  Card, 
  Title, 
  Button, 
  Group, 
  Text, 
  Stack, 
  FileInput, 
  Checkbox,
  Progress,
  Modal,
  Grid,
  Loader
} from '@mantine/core';
import { IconUpload, IconPhoto } from '@tabler/icons-react';
import { notifications } from '../../utils/notifications';
import { classificationService } from '../../services';

export const BatchClassification: React.FC<{ batchId: number }> = ({ batchId }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [useTta, setUseTta] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  // Gérer le changement de fichiers
  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  // Fonction pour classifier un lot entier
  const handleClassifyBatch = async () => {
    if (files.length === 0) {
      notifications.show({
        title: 'Erreur',
        message: 'Veuillez sélectionner au moins une image',
        color: 'red',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setProgress(0);
      
      // Créer un FormData pour l'envoi des fichiers
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });
      
      if (useTta) {
        formData.append('use_tta', 'true');
      }
      
      // Simuler une progression (dans un cas réel, cela viendrait du backend)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 500);
      
      const response = await classificationService.classifyBatch(batchId, formData);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Afficher les résultats
      setResults(response.results || []);
      setIsModalOpen(true);
      
      notifications.show({
        title: 'Succès',
        message: `${files.length} images classifiées avec succès`,
        color: 'green',
      });
    } catch (error: any) {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Impossible de classifier les images',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Title order={3} mb="md">Classification par lot</Title>
        
        <Stack spacing="md">
          <Text>
            Sélectionnez plusieurs images de prunes pour les classifier en une seule opération.
            Cette fonctionnalité est utile pour traiter rapidement un grand nombre d'images.
          </Text>
          
          <FileInput
            label="Sélectionner des images"
            placeholder="Cliquez pour sélectionner des images"
            accept="image/png,image/jpeg,image/jpg"
            multiple
            clearable
            icon={<IconUpload size={14} />}
            value={files}
            onChange={handleFilesChange}
            disabled={isSubmitting}
          />
          
          {files.length > 0 && (
            <Text size="sm" color="dimmed">
              {files.length} image{files.length > 1 ? 's' : ''} sélectionnée{files.length > 1 ? 's' : ''}
            </Text>
          )}
          
          <Checkbox
            label="Utiliser l'augmentation de test (TTA) pour améliorer la précision"
            description="Cette option peut ralentir le processus de classification mais améliore généralement la précision"
            checked={useTta}
            onChange={(event) => setUseTta(event.currentTarget.checked)}
            disabled={isSubmitting}
          />
          
          {isSubmitting && (
            <Stack spacing="xs">
              <Text size="sm" align="center">{progress}% - Classification en cours...</Text>
              <Progress value={progress} size="md" radius="xl" />
            </Stack>
          )}
          
          <Group position="right" mt="md">
            <Button 
              leftIcon={<IconPhoto size={16} />} 
              onClick={handleClassifyBatch}
              loading={isSubmitting}
              disabled={files.length === 0}
              color="green"
            >
              Classifier {files.length} image{files.length !== 1 ? 's' : ''}
            </Button>
          </Group>
        </Stack>
      </Card>
      
      {/* Modal pour afficher les résultats */}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Résultats de classification"
        size="xl"
      >
        {results.length === 0 ? (
          <Loader />
        ) : (
          <Stack spacing="md">
            <Text>
              {results.length} image{results.length > 1 ? 's ont' : ' a'} été classifiée{results.length > 1 ? 's' : ''} avec succès.
            </Text>
            
            <Grid>
              {results.map((result, index) => (
                <Grid.Col key={index} span={12} md={6}>
                  <Card shadow="sm" p="md" withBorder>
                    <Group position="apart">
                      <Text weight={500}>Image {index + 1}</Text>
                      <Text color={result.success ? 'green' : 'red'}>
                        {result.success ? 'Succès' : 'Échec'}
                      </Text>
                    </Group>
                    
                    {result.success && (
                      <Stack spacing="xs" mt="md">
                        <Group position="apart">
                          <Text>Classe:</Text>
                          <Text weight={500}>{result.class_name}</Text>
                        </Group>
                        <Group position="apart">
                          <Text>Confiance:</Text>
                          <Text weight={500}>{(result.confidence_score * 100).toFixed(1)}%</Text>
                        </Group>
                      </Stack>
                    )}
                    
                    {!result.success && (
                      <Text color="red" mt="md">
                        Erreur: {result.error || 'Une erreur est survenue'}
                      </Text>
                    )}
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        )}
      </Modal>
    </>
  );
};

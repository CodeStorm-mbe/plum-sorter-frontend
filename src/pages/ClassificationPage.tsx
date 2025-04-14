import { useState } from 'react';
import { Container, Title, Text, Card, Button, Group, FileInput, Select, Switch, Loader, Center, Alert, Image, Stack, Paper, Badge, Grid } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUpload, IconPhoto, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Farm, PlumClassification } from '../types';
import api from '../services/api';
import { notifications } from '../utils/notifications';

// Service pour récupérer les fermes
const fetchFarms = async (): Promise<Farm[]> => {
  const response = await api.get('/farms/');
  return response.data;
};

// Service pour classifier une image
const classifyImage = async (formData: FormData): Promise<PlumClassification> => {
  const response = await api.post('/classifications/classify/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export function ClassificationPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [classificationResult, setClassificationResult] = useState<PlumClassification | null>(null);

  // Formulaire pour la classification
  const form = useForm({
    initialValues: {
      farm_id: '',
      batch_id: '',
      use_tta: false,
    },
    validate: {
      farm_id: (value: string) => (!value ? 'Veuillez sélectionner une ferme' : null),
    },
  });

  // Requête pour récupérer les fermes
  const { data: farms, isLoading: farmsLoading, error: farmsError } = useQuery({
    queryKey: ['farms'],
    queryFn: fetchFarms,
  });

  // Mutation pour classifier une image
  const classifyMutation = useMutation({
    mutationFn: classifyImage,
    onSuccess: (data) => {
      setClassificationResult(data);
      notifications.show({
        title: 'Succès',
        message: 'L\'image a été classifiée avec succès',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Une erreur est survenue lors de la classification de l\'image',
        color: 'red',
      });
    },
  });

  // Gérer le changement d'image
  const handleImageChange = (file: File | null) => {
    setSelectedImage(file);
    setClassificationResult(null);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (values: typeof form.values) => {
    if (!selectedImage) {
      notifications.show({
        title: 'Erreur',
        message: 'Veuillez sélectionner une image à classifier',
        color: 'red',
      });
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('farm_id', values.farm_id);
    
    if (values.batch_id) {
      formData.append('batch_id', values.batch_id);
    }
    
    formData.append('use_tta', values.use_tta.toString());
    
    classifyMutation.mutate(formData);
  };

  // Afficher un loader pendant le chargement des fermes
  if (farmsLoading) {
    return (
      <Center style={{ height: 'calc(100vh - 60px)' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  // Afficher une erreur si la requête a échoué
  if (farmsError) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle size={16} />} title="Erreur" color="red">
          Une erreur est survenue lors du chargement des fermes. Veuillez réessayer plus tard.
        </Alert>
      </Container>
    );
  }

  // Formater le nom de la classe pour l'affichage
  const formatClassName = (className: string): string => {
    const mapping: Record<string, string> = {
      'bonne_qualite': 'Bonne qualité',
      'non_mure': 'Non mûre',
      'tachetee': 'Tachetée',
      'fissuree': 'Fissurée',
      'meurtrie': 'Meurtrie',
      'pourrie': 'Pourrie',
    };
    
    return mapping[className] || className;
  };

  // Obtenir la couleur en fonction de la classe
  const getClassColor = (className: string): string => {
    const mapping: Record<string, string> = {
      'bonne_qualite': 'green',
      'non_mure': 'yellow',
      'tachetee': 'orange',
      'fissuree': 'red',
      'meurtrie': 'red',
      'pourrie': 'red',
    };
    
    return mapping[className] || 'gray';
  };

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="md">Classification des Prunes</Title>
      <Text c="dimmed" mb="xl">
        Téléchargez une image de prune pour la classifier et obtenir une évaluation de sa qualité
      </Text>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder p="xl" radius="md" shadow="sm">
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <FileInput
                label="Image de prune"
                placeholder="Sélectionner une image"
                accept="image/png,image/jpeg,image/jpg"
                required
                clearable
                leftSection={<IconPhoto size={16} />}
                value={selectedImage}
                onChange={handleImageChange}
                mb="md"
              />

              <Select
                label="Ferme"
                placeholder="Sélectionner une ferme"
                data={farms?.map(farm => ({ value: farm.id.toString(), label: farm.name })) || []}
                required
                mb="md"
                {...form.getInputProps('farm_id')}
              />

              <Select
                label="Lot (optionnel)"
                placeholder="Sélectionner un lot"
                data={[]} // À remplacer par les lots de la ferme sélectionnée
                mb="md"
                clearable
                {...form.getInputProps('batch_id')}
              />

              <Switch
                label="Utiliser TTA (Test Time Augmentation)"
                description="Améliore la précision mais ralentit le traitement"
                mb="xl"
                {...form.getInputProps('use_tta', { type: 'checkbox' })}
              />

              <Button 
                type="submit" 
                leftSection={<IconUpload size={16} />} 
                loading={classifyMutation.isPending}
                fullWidth
              >
                Classifier l'image
              </Button>
            </form>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder p="xl" radius="md" shadow="sm" h="100%">
            <Title order={4} mb="md">Aperçu et Résultat</Title>
            
            {previewUrl ? (
              <Stack>
                <Paper withBorder p="xs">
                  <Image
                    src={previewUrl}
                    alt="Aperçu de la prune"
                    radius="md"
                    fit="contain"
                    h={200}
                  />
                </Paper>
                
                {classificationResult ? (
                  <Card withBorder p="md" radius="md">
                    <Title order={5} mb="xs">Résultat de la classification</Title>
                    
                    <Group mb="xs">
                      <Badge color={getClassColor(classificationResult.class_name)} size="lg">
                        {formatClassName(classificationResult.class_name)}
                      </Badge>
                      <Badge color="blue" variant="outline">
                        Confiance: {(classificationResult.confidence_score * 100).toFixed(2)}%
                      </Badge>
                    </Group>
                    
                    <Text size="sm" mb="xs">
                      <strong>Est une prune:</strong> {classificationResult.is_plum ? 'Oui' : 'Non'}
                    </Text>
                    
                    {classificationResult.processing_time && (
                      <Text size="sm" c="dimmed">
                        Temps de traitement: {classificationResult.processing_time.toFixed(2)}s
                      </Text>
                    )}
                    
                    <Alert icon={<IconCheck size={16} />} color="green" mt="md">
                      Classification réussie! L'image a été classifiée comme {formatClassName(classificationResult.class_name)} avec un niveau de confiance de {(classificationResult.confidence_score * 100).toFixed(2)}%.
                    </Alert>
                  </Card>
                ) : (
                  <Center p="xl">
                    <Text c="dimmed">Cliquez sur "Classifier l'image" pour obtenir le résultat</Text>
                  </Center>
                )}
              </Stack>
            ) : (
              <Center style={{ height: '300px' }}>
                <Stack align="center" gap="xs">
                  <IconPhoto size={48} opacity={0.3} />
                  <Text c="dimmed">Sélectionnez une image pour voir l'aperçu</Text>
                </Stack>
              </Center>
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default ClassificationPage;

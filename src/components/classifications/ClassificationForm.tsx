import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Group, Stack, Box, FileInput, Checkbox, Text, Image } from '@mantine/core';
import { notifications } from '../../utils/notifications';
import { IconUpload, IconPhoto } from '@tabler/icons-react';

// Schéma de validation pour le formulaire
const classificationSchema = z.object({
  image: z.any().refine((file) => file, 'L\'image est requise'),
  use_tta: z.boolean().optional(),
});

type ClassificationFormData = z.infer<typeof classificationSchema>;

interface ClassificationFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  batchId?: number;
  farmId?: number;
}

export const ClassificationForm: React.FC<ClassificationFormProps> = ({ 
  onSubmit, 
  onCancel, 
  isSubmitting,
  batchId,
  farmId
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileInputError, setFileInputError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue,
    watch
  } = useForm<ClassificationFormData>({
    resolver: zodResolver(classificationSchema),
    defaultValues: {
      image: null,
      use_tta: false,
    }
  });

  // Observer l'image sélectionnée pour créer une prévisualisation
  const selectedImage = watch('image');

  // Gérer le changement d'image
  const handleImageChange = (file: File | null) => {
    setValue('image', file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFileInputError(null);
    } else {
      setPreviewImage(null);
      setFileInputError('L\'image est requise');
    }
  };

  // Gérer la soumission du formulaire
  const handleFormSubmit = async (data: ClassificationFormData) => {
    try {
      await onSubmit(data);
    } catch (error: any) {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Une erreur est survenue lors de la classification',
        color: 'red',
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack gap="md">
        <FileInput
          label="Sélectionner une image de prune"
          placeholder="Cliquez pour sélectionner une image"
          accept="image/png,image/jpeg,image/jpg"
          leftSection={<IconUpload size={14} />}
          onChange={handleImageChange}
          error={fileInputError}
          required
        />

        {previewImage && (
          <Box style={{ maxWidth: '100%', textAlign: 'center' }}>
            <Text size="sm" fw={500} mb="xs">Prévisualisation :</Text>
            <Image
              src={previewImage}
              alt="Prévisualisation de l'image"
              radius="md"
              style={{ maxHeight: '300px', maxWidth: '100%', margin: '0 auto' }}
            />
          </Box>
        )}

        <Checkbox
          label="Utiliser l'augmentation de test (TTA) pour améliorer la précision"
          description="Cette option peut ralentir le processus de classification mais améliore généralement la précision"
          {...register('use_tta')}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            loading={isSubmitting}
            leftSection={<IconPhoto size={16} />}
            color="green"
          >
            Classifier
          </Button>
        </Group>
      </Stack>
    </Box>
  );
};

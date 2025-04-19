import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextInput, Textarea, NumberInput, Group, Stack, Box } from '@mantine/core';
import { notifications } from '../../utils/notifications';
import { Farm } from '../../types';

// Schéma de validation pour le formulaire
const farmSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  location: z.string().min(3, 'L\'emplacement doit contenir au moins 3 caractères'),
  size: z.number().positive('La taille doit être positive').optional(),
  description: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

type FarmFormData = z.infer<typeof farmSchema>;

interface FarmFormProps {
  farm?: Farm;
  onSubmit: (data: FarmFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const FarmForm: React.FC<FarmFormProps> = ({ 
  farm, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue,
    reset
  } = useForm<FarmFormData>({
    resolver: zodResolver(farmSchema),
    defaultValues: {
      name: farm?.name || '',
      location: farm?.location || '',
      size: farm?.size || undefined,
      description: farm?.description || '',
      latitude: farm?.latitude || undefined,
      longitude: farm?.longitude || undefined,
    }
  });

  // Gérer la soumission du formulaire
  const handleFormSubmit = async (data: FarmFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error: any) {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Une erreur est survenue lors de la soumission du formulaire',
        color: 'red',
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Nom de la ferme"
          placeholder="Entrez le nom de la ferme"
          required
          {...register('name')}
          error={errors.name?.message}
        />

        <TextInput
          label="Emplacement"
          placeholder="Entrez l'emplacement de la ferme"
          required
          {...register('location')}
          error={errors.location?.message}
        />

        <NumberInput
          label="Taille (hectares)"
          placeholder="Entrez la taille de la ferme en hectares"
          min={0}
          decimalScale={2}
          step={0.5}
          error={errors.size?.message}
          onChange={(value) => setValue('size', value as number)}
        />

        <Textarea
          label="Description"
          placeholder="Entrez une description de la ferme"
          autosize
          minRows={3}
          maxRows={6}
          {...register('description')}
          error={errors.description?.message}
        />

        <Group grow>
          <NumberInput
            label="Latitude"
            placeholder="Latitude"
            decimalScale={6}
            min={-90}
            max={90}
            error={errors.latitude?.message}
            onChange={(value) => setValue('latitude', value as number)}
          />

          <NumberInput
            label="Longitude"
            placeholder="Longitude"
            decimalScale={6}
            min={-180}
            max={180}
            error={errors.longitude?.message}
            onChange={(value) => setValue('longitude', value as number)}
          />
        </Group>

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {farm ? 'Mettre à jour' : 'Créer'}
          </Button>
        </Group>
      </Stack>
    </Box>
  );
};

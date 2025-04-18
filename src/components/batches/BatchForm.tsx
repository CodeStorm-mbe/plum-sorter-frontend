import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextInput, Textarea, NumberInput, Group, Stack, Box, Select, DatePicker } from '@mantine/core';
import { notifications } from '../../utils/notifications';

// Schéma de validation pour le formulaire
const batchSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  harvest_date: z.date().optional(),
  quantity: z.number().positive('La quantité doit être positive').optional(),
  variety: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
});

type BatchFormData = z.infer<typeof batchSchema>;

interface BatchFormProps {
  batch?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  farmId: number;
}

export const BatchForm: React.FC<BatchFormProps> = ({ 
  batch, 
  onSubmit, 
  onCancel, 
  isSubmitting,
  farmId
}) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue,
    reset,
    control
  } = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      name: batch?.name || '',
      harvest_date: batch?.harvest_date ? new Date(batch.harvest_date) : undefined,
      quantity: batch?.quantity || undefined,
      variety: batch?.variety || '',
      description: batch?.description || '',
      status: batch?.status || 'pending',
    }
  });

  // Gérer la soumission du formulaire
  const handleFormSubmit = async (data: BatchFormData) => {
    try {
      // Ajouter l'ID de la ferme
      const batchData = {
        ...data,
        farm: farmId
      };
      
      await onSubmit(batchData);
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
      <Stack spacing="md">
        <TextInput
          label="Nom du lot"
          placeholder="Entrez le nom du lot"
          required
          {...register('name')}
          error={errors.name?.message}
        />

        <DatePicker
          label="Date de récolte"
          placeholder="Sélectionnez la date de récolte"
          value={batch?.harvest_date ? new Date(batch.harvest_date) : null}
          onChange={(date) => setValue('harvest_date', date as Date)}
          error={errors.harvest_date?.message}
        />

        <NumberInput
          label="Quantité (kg)"
          placeholder="Entrez la quantité en kilogrammes"
          min={0}
          precision={2}
          step={0.5}
          {...register('quantity', { valueAsNumber: true })}
          error={errors.quantity?.message}
          onChange={(value) => setValue('quantity', value as number)}
        />

        <TextInput
          label="Variété"
          placeholder="Entrez la variété de prunes"
          {...register('variety')}
          error={errors.variety?.message}
        />

        <Select
          label="Statut"
          placeholder="Sélectionnez le statut du lot"
          data={[
            { value: 'pending', label: 'En attente' },
            { value: 'processing', label: 'En traitement' },
            { value: 'completed', label: 'Terminé' },
            { value: 'rejected', label: 'Rejeté' },
          ]}
          defaultValue={batch?.status || 'pending'}
          onChange={(value) => setValue('status', value as string)}
          error={errors.status?.message}
        />

        <Textarea
          label="Description"
          placeholder="Entrez une description du lot"
          autosize
          minRows={3}
          maxRows={6}
          {...register('description')}
          error={errors.description?.message}
        />

        <Group position="right" mt="md">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {batch ? 'Mettre à jour' : 'Créer'}
          </Button>
        </Group>
      </Stack>
    </Box>
  );
};

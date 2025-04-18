import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button, 
  TextInput, 
  PasswordInput, 
  Select, 
  Group, 
  Stack, 
  Box, 
  Checkbox,
  Text
} from '@mantine/core';
import { notifications } from '../../utils/notifications';
import { User } from '../../types';

// Schéma de validation pour le formulaire
const userSchema = z.object({
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères').optional(),
  confirm_password: z.string().optional(),
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  role: z.string().min(1, 'Le rôle est requis'),
  is_active: z.boolean().optional(),
}).refine((data) => {
  if (data.password && data.confirm_password) {
    return data.password === data.confirm_password;
  }
  return true;
}, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirm_password'],
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({ 
  user, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}) => {
  const isEditMode = !!user;
  const [showPassword, setShowPassword] = useState(!isEditMode);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue,
    watch
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      confirm_password: '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      role: user?.role || '',
      is_active: user?.is_active ?? true,
    }
  });

  // Gérer la soumission du formulaire
  const handleFormSubmit = async (data: UserFormData) => {
    try {
      // Si en mode édition et pas de mot de passe fourni, supprimer les champs de mot de passe
      if (isEditMode && !data.password) {
        delete data.password;
        delete data.confirm_password;
      }
      
      await onSubmit(data);
    } catch (error: any) {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Une erreur est survenue lors de la soumission du formulaire',
        color: 'red',
      });
    }
  };

  // Gérer l'affichage des champs de mot de passe en mode édition
  const togglePasswordFields = () => {
    setShowPassword(!showPassword);
    if (!showPassword) {
      setValue('password', '');
      setValue('confirm_password', '');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Nom d'utilisateur"
          placeholder="Entrez le nom d'utilisateur"
          required
          {...register('username')}
          error={errors.username?.message}
        />

        <TextInput
          label="Email"
          placeholder="Entrez l'adresse email"
          required
          {...register('email')}
          error={errors.email?.message}
        />

        <Group grow>
          <TextInput
            label="Prénom"
            placeholder="Entrez le prénom"
            required
            {...register('first_name')}
            error={errors.first_name?.message}
          />

          <TextInput
            label="Nom"
            placeholder="Entrez le nom"
            required
            {...register('last_name')}
            error={errors.last_name?.message}
          />
        </Group>

        <Select
          label="Rôle"
          placeholder="Sélectionnez un rôle"
          required
          data={[
            { value: 'admin', label: 'Administrateur' },
            { value: 'technician', label: 'Technicien' },
            { value: 'farmer', label: 'Agriculteur' },
          ]}
          defaultValue={user?.role || ''}
          onChange={(value) => setValue('role', value as string)}
          error={errors.role?.message}
        />

        <Checkbox
          label="Utilisateur actif"
          checked={watch('is_active')}
          onChange={(event) => setValue('is_active', event.currentTarget.checked)}
        />

        {isEditMode && (
          <Group>
            <Checkbox
              label="Modifier le mot de passe"
              checked={showPassword}
              onChange={togglePasswordFields}
            />
          </Group>
        )}

        {(!isEditMode || showPassword) && (
          <>
            <PasswordInput
              label="Mot de passe"
              placeholder="Entrez le mot de passe"
              required={!isEditMode}
              {...register('password')}
              error={errors.password?.message}
            />

            <PasswordInput
              label="Confirmer le mot de passe"
              placeholder="Confirmez le mot de passe"
              required={!isEditMode}
              {...register('confirm_password')}
              error={errors.confirm_password?.message}
            />
          </>
        )}

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {user ? 'Mettre à jour' : 'Créer'}
          </Button>
        </Group>
      </Stack>
    </Box>
  );
};

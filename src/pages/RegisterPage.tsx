<<<<<<< HEAD
"use client"

import type React from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import RegisterForm from "../components/auth/RegisterForm"
import PageTransition from "../components/PageTransition"

const RegisterPage: React.FC = () => {
    return (
        <PageTransition>
            <div className="min-h-screen">
                <Navbar />

                <div className="container mx-auto pt-28 pb-16 px-4 md:px-8">
                    <motion.div
                        className="flex flex-col items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.h1
                            className="text-3xl md:text-4xl font-title font-bold text-center mb-2"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
              <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                Créer un compte
              </span>
                        </motion.h1>

                        <motion.p
                            className="text-center text-white/70 mb-8 max-w-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            Rejoignez TriPrune pour accéder à toutes les fonctionnalités d'analyse de prunes
                        </motion.p>

                        <RegisterForm />
                    </motion.div>
                </div>

                {/* Footer */}
                <footer className="py-8 px-4 md:px-8 lg:px-16 bg-background-light/50 backdrop-blur-md border-t border-white/5">
                    <div className="container mx-auto text-center">
                        <p className="text-white/60">© 2025 TriPrune - Projet JCIA Hackathon</p>
                    </div>
                </footer>
            </div>
        </PageTransition>
    )
}

export default RegisterPage
=======
import { useState } from 'react';
import { TextInput, PasswordInput, Button, Box, Title, Text, Anchor, Divider, Alert, Select, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/types';

export function RegisterPage() {
  const { register, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirm_password: '',
      first_name: '',
      last_name: '',
      role: 'farmer' as 'farmer' | 'technician',
      phone_number: '',
    },
    validate: {
      username: (value) => (value.length < 3 ? 'Le nom d\'utilisateur doit contenir au moins 3 caractères' : null),
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Email invalide'),
      password: (value) => (value.length < 8 ? 'Le mot de passe doit contenir au moins 8 caractères' : null),
      confirm_password: (value, values) => (value !== values.password ? 'Les mots de passe ne correspondent pas' : null),
      first_name: (value) => (value.length < 2 ? 'Le prénom doit contenir au moins 2 caractères' : null),
      last_name: (value) => (value.length < 2 ? 'Le nom doit contenir au moins 2 caractères' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setError(null);
      setFieldErrors({});
      await register(values);
      // La redirection est gérée dans le contexte d'authentification
    } catch (err) {
      const apiError = err as ApiError;
      
      if (apiError.errors) {
        // Traiter les erreurs de champ spécifiques
        const newFieldErrors: Record<string, string> = {};
        
        Object.entries(apiError.errors).forEach(([field, errors]) => {
          if (Array.isArray(errors) && errors.length > 0) {
            newFieldErrors[field] = errors[0];
          }
        });
        
        setFieldErrors(newFieldErrors);
        
        if (Object.keys(newFieldErrors).length === 0) {
          setError(apiError.message || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
        }
      } else {
        setError(apiError.message || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
      }
    }
  };

  return (
    <Box maw={500} mx="auto" mt={30} p={20}>
      <Title order={2} ta="center" mb={30}>
        Créer un compte
      </Title>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title="Erreur" color="red" mb={20}>
          {error}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Group grow>
          <TextInput
            label="Prénom"
            placeholder="Votre prénom"
            required
            error={fieldErrors.first_name}
            {...form.getInputProps('first_name')}
          />

          <TextInput
            label="Nom"
            placeholder="Votre nom"
            required
            error={fieldErrors.last_name}
            {...form.getInputProps('last_name')}
          />
        </Group>

        <TextInput
          label="Nom d'utilisateur"
          placeholder="Choisissez un nom d'utilisateur"
          required
          mt="md"
          error={fieldErrors.username}
          {...form.getInputProps('username')}
        />

        <TextInput
          label="Email"
          placeholder="votre@email.com"
          required
          mt="md"
          error={fieldErrors.email}
          {...form.getInputProps('email')}
        />

        <TextInput
          label="Téléphone"
          placeholder="Votre numéro de téléphone"
          mt="md"
          error={fieldErrors.phone_number}
          {...form.getInputProps('phone_number')}
        />

        <Select
          label="Rôle"
          placeholder="Sélectionnez votre rôle"
          required
          mt="md"
          data={[
            { value: 'farmer', label: 'Agriculteur' },
            { value: 'technician', label: 'Technicien' },
          ]}
          error={fieldErrors.role}
          {...form.getInputProps('role')}
        />

        <PasswordInput
          label="Mot de passe"
          placeholder="Votre mot de passe"
          required
          mt="md"
          error={fieldErrors.password}
          {...form.getInputProps('password')}
        />

        <PasswordInput
          label="Confirmer le mot de passe"
          placeholder="Répétez votre mot de passe"
          required
          mt="md"
          error={fieldErrors.confirm_password}
          {...form.getInputProps('confirm_password')}
        />

        <Button fullWidth mt="xl" type="submit" loading={isLoading}>
          S'inscrire
        </Button>
      </form>

      <Divider my="md" label="Déjà inscrit?" labelPosition="center" />

      <Button
        component={Link}
        to="/login"
        variant="outline"
        fullWidth
      >
        Se connecter
      </Button>

      <Text c="dimmed" size="sm" ta="center" mt="md">
        En vous inscrivant, vous acceptez nos{' '}
        <Anchor size="sm" href="#">
          Conditions d'utilisation
        </Anchor>{' '}
        et notre{' '}
        <Anchor size="sm" href="#">
          Politique de confidentialité
        </Anchor>
      </Text>
    </Box>
  );
}

export default RegisterPage;
>>>>>>> 52b038ca4bba93cc54a40159cc8eb8c0fdc11314

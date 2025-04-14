<<<<<<< HEAD
"use client"

import type React from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import LoginForm from "../components/auth/LoginForm"
import PageTransition from "../components/PageTransition"

// Importer le hook useLanguage
import { useLanguage } from "../contexts/LanguageContext"

// Ajouter l'utilisation du hook dans le composant LoginPage
const LoginPage: React.FC = () => {
    const { t } = useLanguage()

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
                {t("auth.login.title")}
              </span>
                        </motion.h1>

                        <motion.p
                            className="text-center text-white/70 mb-8 max-w-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            {t("auth.login.subtitle")}
                        </motion.p>

                        <LoginForm />
                    </motion.div>
                </div>

                {/* Footer */}
                <footer className="py-8 px-4 md:px-8 lg:px-16 bg-background-light/50 backdrop-blur-md border-t border-white/5">
                    <div className="container mx-auto text-center">
                        <p className="text-white/60">{t("footer.copyright")}</p>
                    </div>
                </footer>
            </div>
        </PageTransition>
    )
}

export default LoginPage
=======
import { useState } from 'react';
import { TextInput, PasswordInput, Button, Group, Box, Title, Text, Anchor, Divider, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/types';

interface LocationState {
  emailVerified?: boolean;
  passwordReset?: boolean;
  passwordResetRequested?: boolean;
}

export function LoginPage() {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (value.length < 3 ? 'Le nom d\'utilisateur doit contenir au moins 3 caractères' : null),
      password: (value) => (value.length < 6 ? 'Le mot de passe doit contenir au moins 6 caractères' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setError(null);
      await login(values.username, values.password);
      navigate('/dashboard');
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.errors && apiError.errors.email) {
        setError('Votre email n\'a pas été vérifié. Veuillez vérifier votre boîte de réception ou demander un nouvel email de vérification.');
      } else {
        setError(apiError.message || 'Identifiants invalides. Veuillez réessayer.');
      }
    }
  };

  return (
    <Box maw={400} mx="auto" mt={50} p={20}>
      <Title order={2} ta="center" mb={30}>
        Connexion au Système de Classification des Prunes
      </Title>

      {state?.emailVerified && (
        <Alert color="green" mb={20}>
          Votre email a été vérifié avec succès. Vous pouvez maintenant vous connecter.
        </Alert>
      )}

      {state?.passwordReset && (
        <Alert color="green" mb={20}>
          Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
        </Alert>
      )}

      {state?.passwordResetRequested && (
        <Alert color="blue" mb={20}>
          Un email de réinitialisation de mot de passe a été envoyé. Veuillez vérifier votre boîte de réception.
        </Alert>
      )}

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title="Erreur" color="red" mb={20}>
          {error}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Nom d'utilisateur"
          placeholder="Votre nom d'utilisateur"
          required
          {...form.getInputProps('username')}
        />

        <PasswordInput
          label="Mot de passe"
          placeholder="Votre mot de passe"
          required
          mt="md"
          {...form.getInputProps('password')}
        />

        <Group justify="space-between" mt="md">
          <Anchor component={Link} to="/forgot-password" size="sm">
            Mot de passe oublié?
          </Anchor>
        </Group>

        <Button fullWidth mt="xl" type="submit" loading={isLoading}>
          Se connecter
        </Button>
      </form>

      <Divider my="md" label="Pas encore inscrit?" labelPosition="center" />

      <Button
        component={Link}
        to="/register"
        variant="outline"
        fullWidth
      >
        Créer un compte
      </Button>

      <Text c="dimmed" size="sm" ta="center" mt="md">
        En vous connectant, vous acceptez nos{' '}
        <Anchor size="sm" href="#">
          Conditions d'utilisation
        </Anchor>
      </Text>
    </Box>
  );
}

export default LoginPage;
>>>>>>> 52b038ca4bba93cc54a40159cc8eb8c0fdc11314

<<<<<<< HEAD
"use client"

import type React from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm"
import PageTransition from "../components/PageTransition"

const ForgotPasswordPage: React.FC = () => {
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
                Mot de passe oublié
              </span>
                        </motion.h1>

                        <motion.p
                            className="text-center text-white/70 mb-8 max-w-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            Réinitialisez votre mot de passe pour récupérer l'accès à votre compte
                        </motion.p>

                        <ForgotPasswordForm />
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

export default ForgotPasswordPage
=======
import { useState } from 'react';
import { TextInput, Button, Box, Title, Text, Alert, Paper } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/types';

export function ForgotPasswordPage() {
  const { resetPassword, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Email invalide'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setError(null);
      setSuccess(false);
      await resetPassword(values.email);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { state: { passwordResetRequested: true } });
      }, 3000);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Impossible d\'envoyer l\'email de réinitialisation. Veuillez réessayer.');
    }
  };

  return (
    <Box maw={400} mx="auto" mt={50} p={20}>
      <Title order={2} ta="center" mb={30}>
        Mot de passe oublié
      </Title>

      {success && (
        <Alert icon={<IconCheck size={16} />} title="Succès" color="green" mb={20}>
          Un email de réinitialisation de mot de passe a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception.
        </Alert>
      )}

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title="Erreur" color="red" mb={20}>
          {error}
        </Alert>
      )}

      <Text mb={20}>
        Entrez votre adresse email ci-dessous et nous vous enverrons un lien pour réinitialiser votre mot de passe.
      </Text>

      <Paper withBorder p="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="Votre adresse email"
            required
            {...form.getInputProps('email')}
          />

          <Button fullWidth mt="xl" type="submit" loading={isLoading}>
            Envoyer le lien de réinitialisation
          </Button>
        </form>
      </Paper>

      <Text ta="center" mt={20}>
        <Link to="/login">Retour à la page de connexion</Link>
      </Text>
    </Box>
  );
}

export default ForgotPasswordPage;
>>>>>>> 52b038ca4bba93cc54a40159cc8eb8c0fdc11314

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

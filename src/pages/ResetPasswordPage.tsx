import { useState } from 'react';
import { PasswordInput, Button, Box, Title, Text, Alert, Paper } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ApiError {
  message: string;
}

export function ResetPasswordPage() {
  const { isLoading, resetPassword } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const form = useForm({
    initialValues: {
      password: '',
      confirm_password: '',
    },
    validate: {
      password: (value: string) => (value.length < 8 ? 'Le mot de passe doit contenir au moins 8 caractères' : null),
      confirm_password: (value: string, values: {password: string}) => (value !== values.password ? 'Les mots de passe ne correspondent pas' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (!token) {
      setError('Token manquant. Veuillez utiliser le lien envoyé dans l\'email de réinitialisation.');
      return;
    }

    try {
      setError(null);
      setSuccess(false);
      // Passer le token et le nouveau mot de passe
      await resetPassword(token, values.password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { state: { passwordReset: true } });
      }, 3000);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Impossible de réinitialiser le mot de passe. Le token est peut-être invalide ou expiré.');
    }
  };

  return (
    <Box maw={400} mx="auto" mt={50} p={20}>
      <Title order={2} ta="center" mb={30}>
        Réinitialisation du mot de passe
      </Title>

      {success && (
        <Alert icon={<IconCheck size={16} />} title="Succès" color="green" mb={20}>
          Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.
        </Alert>
      )}

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title="Erreur" color="red" mb={20}>
          {error}
        </Alert>
      )}

      {!token && (
        <Alert icon={<IconAlertCircle size={16} />} title="Token manquant" color="yellow" mb={20}>
          Aucun token de réinitialisation n'a été fourni. Veuillez utiliser le lien envoyé dans l'email de réinitialisation.
        </Alert>
      )}

      <Text mb={20}>
        Veuillez entrer votre nouveau mot de passe ci-dessous.
      </Text>

      <Paper withBorder p="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <PasswordInput
            label="Nouveau mot de passe"
            placeholder="Votre nouveau mot de passe"
            required
            {...form.getInputProps('password')}
          />

          <PasswordInput
            label="Confirmer le mot de passe"
            placeholder="Répétez votre nouveau mot de passe"
            required
            mt="md"
            {...form.getInputProps('confirm_password')}
          />

          <Button fullWidth mt="xl" type="submit" loading={isLoading} disabled={!token}>
            Réinitialiser le mot de passe
          </Button>
        </form>
      </Paper>

      <Text ta="center" mt={20}>
        <Link to="/login">Retour à la page de connexion</Link>
      </Text>
    </Box>
  );
}

export default ResetPasswordPage;

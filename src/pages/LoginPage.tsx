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

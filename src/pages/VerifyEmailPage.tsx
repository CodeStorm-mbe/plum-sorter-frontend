import { useState, useEffect } from 'react';
import { TextInput, Button, Box, Title, Text, Alert, Paper } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/types';

interface LocationState {
  email?: string;
}

export function VerifyEmailPage() {
  const { verifyEmail, resendVerificationEmail, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useParams<{ token?: string }>(); // Extraire le token de l'URL
  const state = location.state as LocationState;

  const form = useForm({
    initialValues: {
      token: state?.token || '',
      email: state?.email || '',
    },
    validate: {
      token: (value) => (value ? null : 'Le token est requis'),
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Email invalide'),
    },
  });

  // Vérifier le token automatiquement si présent dans l'URL
  useEffect(() => {
    if (token) {
      handleVerify({ token });
    }
  }, [token]);

  const handleVerify = async (values: { token: string }) => {
    try {
      setError(null);
      await verifyEmail(values.token);
      setSuccess('Votre email a été vérifié avec succès. Vous allez être redirigé vers la page de connexion.');
      setTimeout(() => {
        navigate('/login', { state: { emailVerified: true } });
      }, 3000);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Token invalide ou expiré. Veuillez demander un nouveau token.');
    }
  };

  const handleResend = async (values: { email: string }) => {
    try {
      setError(null);
      setResendSuccess(false);
      await resendVerificationEmail(values.email);
      setResendSuccess(true);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Impossible d'envoyer l'email de vérification. Veuillez réessayer.");
    }
  };

  return (
    <Box maw={500} mx="auto" mt={50} p={20}>
      <Title order={2} ta="center" mb={30}>
        Vérification de l'email
      </Title>

      {success && (
        <Alert icon={<IconCheck size={16} />} title="Succès" color="green" mb={20}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title="Erreur" color="red" mb={20}>
          {error}
        </Alert>
      )}

      {!token && (
        <>
          <Text mb={20}>
            Un email de vérification a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception et
            entrer le token de vérification ci-dessous.
          </Text>

          <Paper withBorder p="md" mb={30}>
            <form onSubmit={form.onSubmit((values) => handleVerify({ token: values.token }))}>
              <TextInput
                label="Token de vérification"
                placeholder="Entrez le token reçu par email"
                required
                {...form.getInputProps('token')}
              />

              <Button fullWidth mt="md" type="submit" loading={isLoading}>
                Vérifier mon email
              </Button>
            </form>
          </Paper>
        </>
      )}

      <Title order={4} ta="center" mb={15}>
        Vous n'avez pas reçu d'email ?
      </Title>

      {resendSuccess && (
        <Alert color="green" mb={20}>
          Un nouvel email de vérification a été envoyé. Veuillez vérifier votre boîte de réception.
        </Alert>
      )}

      <Paper withBorder p="md">
        <form onSubmit={form.onSubmit((values) => handleResend({ email: values.email }))}>
          <TextInput
            label="Email"
            placeholder="Confirmez votre adresse email"
            required
            {...form.getInputProps('email')}
          />

          <Button fullWidth mt="md" type="submit" loading={isLoading} variant="outline">
            Renvoyer l'email de vérification
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default VerifyEmailPage;
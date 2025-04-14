<<<<<<< HEAD
"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import PageTransition from "../components/PageTransition"
import ProtectedRoute from "../components/auth/ProtectedRoute"
import SettingsLayout from "../components/settings/SettingsLayout"
import ProfileSettings from "../components/settings/ProfileSettings"
import AppearanceSettings from "../components/settings/AppearanceSettings"
import LanguageSettings from "../components/settings/LanguageSettings"
import NotificationSettings from "../components/settings/NotificationSettings"
import PrivacySettings from "../components/settings/PrivacySettings"
import SecuritySettings from "../components/settings/SecuritySettings"
import { useLanguage } from "../contexts/LanguageContext"

// Types pour les sections de paramètres
type SettingsSection = "profile" | "appearance" | "language" | "notifications" | "privacy" | "security"

const SettingsPage: React.FC = () => {
    const { t } = useLanguage()
    const [activeSection, setActiveSection] = useState<SettingsSection>("profile")

    // Fonction pour rendre la section active
    const renderActiveSection = () => {
        switch (activeSection) {
            case "profile":
                return <ProfileSettings />
            case "appearance":
                return <AppearanceSettings />
            case "language":
                return <LanguageSettings />
            case "notifications":
                return <NotificationSettings />
            case "privacy":
                return <PrivacySettings />
            case "security":
                return <SecuritySettings />
            default:
                return <ProfileSettings />
        }
    }

    return (
        <ProtectedRoute>
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
                  {t("settings.title")}
                </span>
                            </motion.h1>

                            <motion.p
                                className="text-center text-white/70 mb-8 max-w-md"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                {t("settings.subtitle")}
                            </motion.p>

                            <div className="w-full max-w-6xl">
                                <SettingsLayout activeSection={activeSection} onSectionChange={setActiveSection}>
                                    {renderActiveSection()}
                                </SettingsLayout>
                            </div>
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
        </ProtectedRoute>
    )
}

export default SettingsPage
=======
import { useState } from 'react';
import { Container, Title, Text, Card, Group, TextInput, PasswordInput, Switch, Tabs, Button, Select, Avatar, Divider, FileInput, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconUser, IconLock, IconSettings, IconBell, IconPalette, IconCheck } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { User, UserSettings } from '@/types';
import api from '@/services/api';

export function SettingsPage() {
  const { user, isLoading } = useAuth();
  const { colorScheme, toggleColorScheme } = useTheme();
  const [activeTab, setActiveTab] = useState<string | null>('profile');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Formulaire pour les informations de profil
  const profileForm = useForm({
    initialValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone_number: user?.phone_number || '',
      organization: user?.organization || '',
      address: user?.address || '',
    },
    validate: {
      first_name: (value) => (value.length < 2 ? 'Le prénom doit contenir au moins 2 caractères' : null),
      last_name: (value) => (value.length < 2 ? 'Le nom doit contenir au moins 2 caractères' : null),
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Email invalide'),
    },
  });

  // Formulaire pour le changement de mot de passe
  const passwordForm = useForm({
    initialValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
    validate: {
      current_password: (value) => (value.length < 8 ? 'Le mot de passe doit contenir au moins 8 caractères' : null),
      new_password: (value) => (value.length < 8 ? 'Le mot de passe doit contenir au moins 8 caractères' : null),
      confirm_password: (value, values) => (value !== values.new_password ? 'Les mots de passe ne correspondent pas' : null),
    },
  });

  // Formulaire pour les paramètres de notification
  const notificationForm = useForm({
    initialValues: {
      email_notifications: true,
      push_notifications: true,
      classification_alerts: true,
      batch_completion_alerts: true,
      system_updates: false,
    },
  });

  // Formulaire pour les paramètres d'affichage
  const displayForm = useForm({
    initialValues: {
      theme: colorScheme,
      language: 'fr',
      dashboard_view: 'cards',
    },
  });

  // Gérer la soumission du formulaire de profil
  const handleProfileSubmit = async (values: typeof profileForm.values) => {
    try {
      // Simuler une mise à jour de profil
      await new Promise(resolve => setTimeout(resolve, 500));
      
      notifications.show({
        title: 'Succès',
        message: 'Votre profil a été mis à jour avec succès',
        color: 'green',
      });
      
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      notifications.show({
        title: 'Erreur',
        message: 'Une erreur est survenue lors de la mise à jour de votre profil',
        color: 'red',
      });
    }
  };

  // Gérer la soumission du formulaire de mot de passe
  const handlePasswordSubmit = async (values: typeof passwordForm.values) => {
    try {
      // Simuler un changement de mot de passe
      await new Promise(resolve => setTimeout(resolve, 500));
      
      notifications.show({
        title: 'Succès',
        message: 'Votre mot de passe a été changé avec succès',
        color: 'green',
      });
      
      passwordForm.reset();
    } catch (error) {
      notifications.show({
        title: 'Erreur',
        message: 'Une erreur est survenue lors du changement de mot de passe',
        color: 'red',
      });
    }
  };

  // Gérer la soumission du formulaire de notifications
  const handleNotificationSubmit = async (values: typeof notificationForm.values) => {
    try {
      // Simuler une mise à jour des paramètres de notification
      await new Promise(resolve => setTimeout(resolve, 500));
      
      notifications.show({
        title: 'Succès',
        message: 'Vos paramètres de notification ont été mis à jour avec succès',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Erreur',
        message: 'Une erreur est survenue lors de la mise à jour de vos paramètres de notification',
        color: 'red',
      });
    }
  };

  // Gérer la soumission du formulaire d'affichage
  const handleDisplaySubmit = async (values: typeof displayForm.values) => {
    try {
      // Mettre à jour le thème si nécessaire
      if (values.theme !== colorScheme) {
        toggleColorScheme();
      }
      
      // Simuler une mise à jour des paramètres d'affichage
      await new Promise(resolve => setTimeout(resolve, 500));
      
      notifications.show({
        title: 'Succès',
        message: 'Vos paramètres d\'affichage ont été mis à jour avec succès',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Erreur',
        message: 'Une erreur est survenue lors de la mise à jour de vos paramètres d\'affichage',
        color: 'red',
      });
    }
  };

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="md">Paramètres</Title>
      <Text c="dimmed" mb="xl">
        Gérez votre profil, vos préférences et vos paramètres de sécurité
      </Text>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="xl">
          <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
            Profil
          </Tabs.Tab>
          <Tabs.Tab value="security" leftSection={<IconLock size={16} />}>
            Sécurité
          </Tabs.Tab>
          <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>
            Notifications
          </Tabs.Tab>
          <Tabs.Tab value="display" leftSection={<IconPalette size={16} />}>
            Affichage
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="profile">
          <Card withBorder p="xl" radius="md" shadow="sm">
            {updateSuccess && (
              <Alert icon={<IconCheck size={16} />} title="Profil mis à jour" color="green" mb="md">
                Vos informations de profil ont été mises à jour avec succès.
              </Alert>
            )}
            
            <Group mb="xl">
              <Avatar 
                size={100} 
                color="plum" 
                radius={100}
                src={profileImage ? URL.createObjectURL(profileImage) : undefined}
              >
                {user?.first_name?.[0] || user?.username?.[0] || 'U'}
              </Avatar>
              <div>
                <Text fw={500} size="lg">
                  {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : user?.username}
                </Text>
                <Text c="dimmed" size="sm">
                  {user?.email}
                </Text>
                <FileInput
                  placeholder="Changer l'image de profil"
                  accept="image/png,image/jpeg,image/jpg"
                  value={profileImage}
                  onChange={setProfileImage}
                  mt="xs"
                  size="xs"
                  w={250}
                />
              </div>
            </Group>

            <Divider mb="xl" />

            <form onSubmit={profileForm.onSubmit(handleProfileSubmit)}>
              <Group grow mb="md">
                <TextInput
                  label="Prénom"
                  placeholder="Votre prénom"
                  {...profileForm.getInputProps('first_name')}
                />
                <TextInput
                  label="Nom"
                  placeholder="Votre nom"
                  {...profileForm.getInputProps('last_name')}
                />
              </Group>

              <TextInput
                label="Email"
                placeholder="Votre email"
                mb="md"
                {...profileForm.getInputProps('email')}
              />

              <TextInput
                label="Téléphone"
                placeholder="Votre numéro de téléphone"
                mb="md"
                {...profileForm.getInputProps('phone_number')}
              />

              <TextInput
                label="Organisation"
                placeholder="Votre organisation"
                mb="md"
                {...profileForm.getInputProps('organization')}
              />

              <TextInput
                label="Adresse"
                placeholder="Votre adresse"
                mb="xl"
                {...profileForm.getInputProps('address')}
              />

              <Group justify="flex-end">
                <Button type="submit">
                  Enregistrer les modifications
                </Button>
              </Group>
            </form>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="security">
          <Card withBorder p="xl" radius="md" shadow="sm">
            <Title order={3} mb="md">Changer le mot de passe</Title>
            
            <form onSubmit={passwordForm.onSubmit(handlePasswordSubmit)}>
              <PasswordInput
                label="Mot de passe actuel"
                placeholder="Votre mot de passe actuel"
                mb="md"
                {...passwordForm.getInputProps('current_password')}
              />

              <PasswordInput
                label="Nouveau mot de passe"
                placeholder="Votre nouveau mot de passe"
                mb="md"
                {...passwordForm.getInputProps('new_password')}
              />

              <PasswordInput
                label="Confirmer le mot de passe"
                placeholder="Répétez votre nouveau mot de passe"
                mb="xl"
                {...passwordForm.getInputProps('confirm_password')}
              />

              <Group justify="flex-end">
                <Button type="submit">
                  Changer le mot de passe
                </Button>
              </Group>
            </form>

            <Divider my="xl" />

            <Title order={3} mb="md">Sessions actives</Title>
            <Text c="dimmed" mb="md">
              Vous êtes actuellement connecté sur cet appareil uniquement.
            </Text>
            
            <Button variant="outline" color="red">
              Déconnecter toutes les autres sessions
            </Button>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="notifications">
          <Card withBorder p="xl" radius="md" shadow="sm">
            <form onSubmit={notificationForm.onSubmit(handleNotificationSubmit)}>
              <Title order={3} mb="md">Paramètres de notification</Title>

              <Switch
                label="Notifications par email"
                description="Recevoir des notifications par email"
                mb="md"
                {...notificationForm.getInputProps('email_notifications', { type: 'checkbox' })}
              />

              <Switch
                label="Notifications push"
                description="Recevoir des notifications push dans le navigateur"
                mb="md"
                {...notificationForm.getInputProps('push_notifications', { type: 'checkbox' })}
              />

              <Divider my="xl" />

              <Title order={4} mb="md">Types de notifications</Title>

              <Switch
                label="Alertes de classification"
                description="Être notifié lorsqu'une classification est terminée"
                mb="md"
                {...notificationForm.getInputProps('classification_alerts', { type: 'checkbox' })}
              />

              <Switch
                label="Alertes de complétion de lot"
                description="Être notifié lorsqu'un lot est entièrement classifié"
                mb="md"
                {...notificationForm.getInputProps('batch_completion_alerts', { type: 'checkbox' })}
              />

              <Switch
                label="Mises à jour système"
                description="Être notifié des mises à jour et nouvelles fonctionnalités"
                mb="xl"
                {...notificationForm.getInputProps('system_updates', { type: 'checkbox' })}
              />

              <Group justify="flex-end">
                <Button type="submit">
                  Enregistrer les préférences
                </Button>
              </Group>
            </form>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="display">
          <Card withBorder p="xl" radius="md" shadow="sm">
            <form onSubmit={displayForm.onSubmit(handleDisplaySubmit)}>
              <Title order={3} mb="md">Paramètres d'affichage</Title>

              <Select
                label="Thème"
                placeholder="Sélectionner un thème"
                data={[
                  { value: 'light', label: 'Clair' },
                  { value: 'dark', label: 'Sombre' },
                ]}
                mb="md"
                {...displayForm.getInputProps('theme')}
              />

              <Select
                label="Langue"
                placeholder="Sélectionner une langue"
                data={[
                  { value: 'fr', label: 'Français' },
                  { value: 'en', label: 'English' },
                ]}
                mb="md"
                {...displayForm.getInputProps('language')}
              />

              <Select
                label="Vue du tableau de bord"
                placeholder="Sélectionner une vue"
                data={[
                  { value: 'cards', label: 'Cartes' },
                  { value: 'list', label: 'Liste' },
                  { value: 'compact', label: 'Compact' },
                ]}
                mb="xl"
                {...displayForm.getInputProps('dashboard_view')}
              />

              <Group justify="flex-end">
                <Button type="submit">
                  Enregistrer les préférences
                </Button>
              </Group>
            </form>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}

export default SettingsPage;
>>>>>>> 52b038ca4bba93cc54a40159cc8eb8c0fdc11314

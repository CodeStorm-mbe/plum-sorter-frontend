import React, { useState, useEffect } from 'react';
import {
  Card,
  Text,
  Badge,
  Group,
  Stack,
  SimpleGrid,
  Avatar,
  ActionIcon,
  Menu,
  Modal,
  Button,
  TextInput,
  Select,
  Flex,
  Title,
} from '@mantine/core';
import { IconDotsVertical, IconEdit, IconTrash, IconSearch, IconFilter, IconUserPlus } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import UserService from "../../services/userService";
import { UserForm } from './UserForm';
import { User as AppUser } from '../../types';
import { User as ApiUser } from '../../services/authService';

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  // Load users
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await UserService.getUsers();
      
      // Conversion des utilisateurs de l'API vers le format de l'application
      const typedUsers = response.map(apiUser => {
        // Créer un utilisateur compatible avec le type AppUser
        const appUser: AppUser = {
          id: apiUser.id,
          username: apiUser.name, // Utiliser name comme username
          email: apiUser.email,
          first_name: apiUser.name.split(' ')[0] || '', // Extraire le prénom du nom complet
          last_name: apiUser.name.split(' ').slice(1).join(' ') || '', // Extraire le nom de famille
          role: apiUser.role,
          is_active: apiUser.is_verified, // Utiliser is_verified comme is_active
          date_joined: apiUser.created_at,
          last_login: '',
          name: apiUser.name,
          avatar: apiUser.avatar
        };
        return appUser;
      });
      
      setUsers(typedUsers);
      setFilteredUsers(typedUsers);
    } catch (error: any) {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Impossible de charger les utilisateurs',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users when search or role filter changes
  useEffect(() => {
    let result = [...users];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.first_name.toLowerCase().includes(query) ||
          user.last_name.toLowerCase().includes(query)
      );
    }

    // Apply role filter
    if (roleFilter) {
      result = result.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(result);
  }, [users, searchQuery, roleFilter]);

  // Get badge color based on role
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'red';
      case 'technician':
        return 'blue';
      case 'farmer':
        return 'green';
      default:
        return 'gray';
    }
  };

  // Get role label
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'technician':
        return 'Technicien';
      case 'farmer':
        return 'Agriculteur';
      default:
        return role;
    }
  };

  // Get initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Stack gap="md">
      <Flex justify="space-between" align="center">
        <Title order={2}>Gestion des Utilisateurs</Title>
        <Button leftSection={<IconUserPlus size={16} />} onClick={() => setIsCreateModalOpen(true)}>
          Ajouter un utilisateur
        </Button>
      </Flex>

      <Flex gap="md">
        <TextInput
          placeholder="Rechercher un utilisateur..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Filtrer par rôle"
          leftSection={<IconFilter size={16} />}
          clearable
          data={[
            { value: 'admin', label: 'Administrateur' },
            { value: 'technician', label: 'Technicien' },
            { value: 'farmer', label: 'Agriculteur' },
          ]}
          value={roleFilter}
          onChange={setRoleFilter}
          style={{ width: '200px' }}
        />
      </Flex>

      {isLoading ? (
        <Text ta="center">Chargement des utilisateurs...</Text>
      ) : filteredUsers.length === 0 ? (
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Text ta="center" c="dimmed">
            Aucun utilisateur trouvé. {!searchQuery && !roleFilter && 'Ajoutez un utilisateur pour commencer.'}
          </Text>
        </Card>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {filteredUsers.map((user) => (
            <Card key={user.id} shadow="sm" p="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Group>
                  <Avatar color={getRoleBadgeColor(user.role)} radius="xl">
                    {getInitials(user.first_name, user.last_name)}
                  </Avatar>
                  <div>
                    <Text fw={500}>
                      {user.first_name} {user.last_name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      @{user.username}
                    </Text>
                  </div>
                </Group>
                <Menu withinPortal position="bottom-end" shadow="sm">
                  <Menu.Target>
                    <ActionIcon variant="subtle">
                      <IconDotsVertical size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconEdit size={16} />}
                      onClick={() => {
                        setSelectedUser(user);
                        setIsEditModalOpen(true);
                      }}
                    >
                      Modifier
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconTrash size={16} />}
                      color="red"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Supprimer
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>

              <Stack gap={5}>
                <Text size="sm">{user.email}</Text>
                <Group justify="space-between">
                  <Badge color={getRoleBadgeColor(user.role)}>{getRoleLabel(user.role)}</Badge>
                  <Badge color={user.is_active ? 'green' : 'gray'}>{user.is_active ? 'Actif' : 'Inactif'}</Badge>
                </Group>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* Modal for creating a user */}
      {/* <Modal
        opened={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Ajouter un utilisateur"
        size="lg"
      >
        <UserForm
          onSubmit={handleCreateUser}
          onCancel={() => setIsCreateModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal> */}

      {/* Modal for editing a user */}
      {/* <Modal
        opened={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Modifier l'utilisateur"
        size="lg"
      >
        {selectedUser && (
          <UserForm
            user={selectedUser}
            onSubmit={handleUpdateUser}
            onCancel={() => setIsEditModalOpen(false)}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal> */}

      {/* Modal for confirming deletion */}
      {/* <Modal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmer la suppression"
        size="sm"
      >
        <Text mb="md">
          Êtes-vous sûr de vouloir supprimer l'utilisateur {selectedUser?.first_name} {selectedUser?.last_name} ? Cette
          action est irréversible.
        </Text>
        <Group justify="flex-end">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Annuler
          </Button>
          <Button color="red" onClick={handleDeleteUser} loading={isSubmitting}>
            Supprimer
          </Button>
        </Group>
      </Modal> */}
    </Stack>
  );
};

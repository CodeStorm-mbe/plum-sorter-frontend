import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Text, 
  Badge, 
  Group, 
  Stack, 
  Grid, 
  Avatar, 
  ActionIcon, 
  Menu,
  Modal,
  Button,
  TextInput,
  Select
} from '@mantine/core';
import { IconDotsVertical, IconEdit, IconTrash, IconSearch, IconFilter, IconUserPlus } from '@tabler/icons-react';
import { notifications } from '../../utils/notifications';
import { userService } from '../../services';
import { UserForm } from './UserForm';
import { User } from '../../types';

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  // Charger les utilisateurs
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getUsers();
      setUsers(response.results || []);
      setFilteredUsers(response.results || []);
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

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    loadUsers();
  }, []);

  // Filtrer les utilisateurs lorsque la recherche ou le filtre change
  useEffect(() => {
    let result = [...users];
    
    // Appliquer la recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.first_name.toLowerCase().includes(query) ||
        user.last_name.toLowerCase().includes(query)
      );
    }
    
    // Appliquer le filtre de rôle
    if (roleFilter) {
      result = result.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(result);
  }, [users, searchQuery, roleFilter]);

  // Créer un utilisateur
  const handleCreateUser = async (data: any) => {
    try {
      setIsSubmitting(true);
      await userService.createUser(data);
      notifications.show({
        title: 'Succès',
        message: 'Utilisateur créé avec succès',
        color: 'green',
      });
      setIsCreateModalOpen(false);
      loadUsers();
    } catch (error: any) {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Impossible de créer l\'utilisateur',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mettre à jour un utilisateur
  const handleUpdateUser = async (data: any) => {
    if (!selectedUser) return;
    
    try {
      setIsSubmitting(true);
      await userService.updateUser(selectedUser.id, data);
      notifications.show({
        title: 'Succès',
        message: 'Utilisateur mis à jour avec succès',
        color: 'green',
      });
      setIsEditModalOpen(false);
      loadUsers();
    } catch (error: any) {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Impossible de mettre à jour l\'utilisateur',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Supprimer un utilisateur
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setIsSubmitting(true);
      await userService.deleteUser(selectedUser.id);
      notifications.show({
        title: 'Succès',
        message: 'Utilisateur supprimé avec succès',
        color: 'green',
      });
      setIsDeleteModalOpen(false);
      loadUsers();
    } catch (error: any) {
      notifications.show({
        title: 'Erreur',
        message: error.message || 'Impossible de supprimer l\'utilisateur',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtenir la couleur du badge selon le rôle
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

  // Obtenir le libellé du rôle
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

  // Obtenir les initiales pour l'avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <>
      <Stack spacing="md">
        <Group position="apart">
          <Text size="xl" weight={700}>Gestion des Utilisateurs</Text>
          <Button 
            leftIcon={<IconUserPlus size={16} />} 
            onClick={() => setIsCreateModalOpen(true)}
          >
            Ajouter un utilisateur
          </Button>
        </Group>

        <Group>
          <TextInput
            placeholder="Rechercher un utilisateur..."
            icon={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Filtrer par rôle"
            icon={<IconFilter size={16} />}
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
        </Group>

        {isLoading ? (
          <Text align="center">Chargement des utilisateurs...</Text>
        ) : filteredUsers.length === 0 ? (
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Text align="center" color="dimmed">
              Aucun utilisateur trouvé. {!searchQuery && !roleFilter && 'Ajoutez un utilisateur pour commencer.'}
            </Text>
          </Card>
        ) : (
          <Grid>
            {filteredUsers.map((user) => (
              <Grid.Col key={user.id} span={12} sm={6} md={4}>
                <Card shadow="sm" p="lg" radius="md" withBorder>
                  <Group position="apart" mb="xs">
                    <Group>
                      <Avatar color={getRoleBadgeColor(user.role)} radius="xl">
                        {getInitials(user.first_name, user.last_name)}
                      </Avatar>
                      <div>
                        <Text weight={500}>{user.first_name} {user.last_name}</Text>
                        <Text size="xs" color="dimmed">@{user.username}</Text>
                      </div>
                    </Group>
                    <Menu withinPortal position="bottom-end" shadow="sm">
                      <Menu.Target>
                        <ActionIcon>
                          <IconDotsVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item 
                          icon={<IconEdit size={16} />} 
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditModalOpen(true);
                          }}
                        >
                          Modifier
                        </Menu.Item>
                        <Menu.Item 
                          icon={<IconTrash size={16} />} 
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

                  <Stack spacing={5}>
                    <Text size="sm">{user.email}</Text>
                    <Group position="apart">
                      <Badge color={getRoleBadgeColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                      <Badge color={user.is_active ? 'green' : 'gray'}>
                        {user.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Stack>

      {/* Modal pour créer un utilisateur */}
      <Modal
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
      </Modal>

      {/* Modal pour modifier un utilisateur */}
      <Modal
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
      </Modal>

      {/* Modal pour confirmer la suppression */}
      <Modal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmer la suppression"
        size="sm"
      >
        <Text mb="md">
          Êtes-vous sûr de vouloir supprimer l'utilisateur {selectedUser?.first_name} {selectedUser?.last_name} ? Cette action est irréversible.
        </Text>
        <Group position="right">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Annuler
          </Button>
          <Button color="red" onClick={handleDeleteUser} loading={isSubmitting}>
            Supprimer
          </Button>
        </Group>
      </Modal>
    </>
  );
};

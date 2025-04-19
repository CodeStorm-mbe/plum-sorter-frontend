import React from 'react';
import { Container, Title, Paper } from '@mantine/core';
import { UserList } from '../components/users/UserList';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const UsersManagementPage: React.FC = () => {
  const { user } = useAuth();
  
  // Vérifier si l'utilisateur est un administrateur
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="lg">Administration des Utilisateurs</Title>
      <Paper shadow="xs" p="md" withBorder>
        <UserList />
      </Paper>
    </Container>
  );
};

export default UsersManagementPage;

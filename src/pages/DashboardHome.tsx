import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../contexts/DashboardContext';
import { Card, Grid, Text, Title, Group, Badge, Loader, Alert, Button, Stack } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { notifications } from '../utils/notifications';
import { ClassificationChart } from '../components/dashboard/ClassificationChart';
import { RecentClassifications } from '../components/dashboard/RecentClassifications';
import { AdminStats } from '../components/dashboard/AdminStats';
import { FarmerStats } from '../components/dashboard/FarmerStats';
import { TechnicianStats } from '../components/dashboard/TechnicianStats';
import { SystemPerformance } from '../components/dashboard/SystemPerformance';

const DashboardHome = () => {
  const { user } = useAuth();
  const { dashboardData, isLoading, error, refreshData, lastUpdated } = useDashboard();
  const [refreshing, setRefreshing] = useState(false);

  // Fonction pour rafraîchir les données
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshData();
      notifications.show({
        title: 'Données rafraîchies',
        message: 'Les données du dashboard ont été mises à jour avec succès.',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de rafraîchir les données du dashboard.',
        color: 'red',
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Formater la date de dernière mise à jour
  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Jamais';
    
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000); // différence en secondes
    
    if (diff < 60) return `Il y a ${diff} secondes`;
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} minutes`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} heures`;
    return lastUpdated.toLocaleString();
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <Loader size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title="Erreur" color="red">
        {error}
        <Button variant="light" color="red" onClick={handleRefresh} mt="md">
          Réessayer
        </Button>
      </Alert>
    );
  }

  if (!dashboardData) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title="Aucune donnée" color="blue">
        Aucune donnée disponible pour le dashboard.
        <Button variant="light" color="blue" onClick={handleRefresh} mt="md">
          Rafraîchir
        </Button>
      </Alert>
    );
  }

  return (
    <Stack spacing="lg">
      <Group position="apart">
        <div>
          <Title order={2}>Tableau de bord</Title>
          <Text color="dimmed" size="sm">
            Bienvenue, {user?.username} | Dernière mise à jour : {formatLastUpdated()}
          </Text>
        </div>
        <Button 
          leftIcon={<IconRefresh size={16} />} 
          onClick={handleRefresh}
          loading={refreshing}
        >
          Rafraîchir
        </Button>
      </Group>

      <Grid>
        <Grid.Col span={12} md={8}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Card.Section withBorder inheritPadding py="xs">
              <Group position="apart">
                <Title order={3}>Distribution des classifications</Title>
                <Badge color="blue" variant="light">
                  Total: {dashboardData.totalClassifications}
                </Badge>
              </Group>
            </Card.Section>
            <Card.Section p="lg">
              {dashboardData.totalClassifications > 0 ? (
                <ClassificationChart 
                  data={dashboardData.classPercentages} 
                  height={300}
                />
              ) : (
                <Text align="center" color="dimmed" py="xl">
                  Aucune classification disponible
                </Text>
              )}
            </Card.Section>
          </Card>
        </Grid.Col>

        <Grid.Col span={12} md={4}>
          {user?.role === 'admin' && dashboardData.systemPerformance && (
            <SystemPerformance data={dashboardData.systemPerformance} />
          )}
          
          {user?.role === 'farmer' && (
            <FarmerStats 
              totalBatches={dashboardData.totalBatches} 
              pendingBatches={dashboardData.pendingBatches}
              farms={dashboardData.farms?.length || 0}
            />
          )}
          
          {user?.role === 'technician' && (
            <TechnicianStats 
              managedFarms={dashboardData.managedFarms} 
              farmPerformance={dashboardData.farmPerformance}
            />
          )}
        </Grid.Col>
      </Grid>

      {/* Section spécifique au rôle Admin */}
      {user?.role === 'admin' && (
        <AdminStats 
          totalUsers={dashboardData.totalUsers} 
          usersByRole={dashboardData.usersByRole} 
          activeUsers={dashboardData.activeUsers}
        />
      )}

      {/* Classifications récentes */}
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="xs">
          <Title order={3}>Classifications récentes</Title>
        </Card.Section>
        <Card.Section p="lg">
          <RecentClassifications 
            classifications={dashboardData.recentClassifications || []} 
          />
        </Card.Section>
      </Card>
    </Stack>
  );
};

export default DashboardHome;

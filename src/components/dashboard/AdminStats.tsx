import React from 'react';
import { Card, Grid, Text, Title, Group, Badge, RingProgress } from '@mantine/core';
import { IconUsers, IconUserCheck, IconUserPlus } from '@tabler/icons-react';

interface AdminStatsProps {
  totalUsers: number;
  usersByRole: Record<string, number>;
  activeUsers: number;
}

export const AdminStats: React.FC<AdminStatsProps> = ({ totalUsers, usersByRole, activeUsers }) => {
  // Calculer le pourcentage d'utilisateurs actifs
  const activePercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={3}>Statistiques des utilisateurs</Title>
      </Card.Section>
      <Card.Section p="lg">
        <Grid>
          <Grid.Col span={12} md={4}>
            <Group position="center" direction="column" spacing="xs">
              <IconUsers size={32} color="#228be6" />
              <Title order={4}>Utilisateurs totaux</Title>
              <Text size="xl" weight={700}>{totalUsers}</Text>
              <Group spacing="xs">
                <Badge color="blue">Admin: {usersByRole.admin || 0}</Badge>
                <Badge color="green">Techniciens: {usersByRole.technician || 0}</Badge>
                <Badge color="orange">Agriculteurs: {usersByRole.farmer || 0}</Badge>
              </Group>
            </Group>
          </Grid.Col>
          
          <Grid.Col span={12} md={4}>
            <Group position="center" direction="column" spacing="xs">
              <IconUserCheck size={32} color="#40c057" />
              <Title order={4}>Utilisateurs actifs</Title>
              <Text size="xl" weight={700}>{activeUsers}</Text>
              <Text size="sm" color="dimmed">Derniers 30 jours</Text>
            </Group>
          </Grid.Col>
          
          <Grid.Col span={12} md={4}>
            <Group position="center" direction="column" spacing="xs">
              <RingProgress
                sections={[{ value: activePercentage, color: 'blue' }]}
                label={
                  <Text size="xl" weight={700} align="center">
                    {activePercentage}%
                  </Text>
                }
                size={120}
              />
              <Title order={4}>Taux d'activité</Title>
            </Group>
          </Grid.Col>
        </Grid>
      </Card.Section>
    </Card>
  );
};

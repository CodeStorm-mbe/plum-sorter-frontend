import React from 'react';
import { Card, Grid, Text, Title, Group, Badge, RingProgress, Stack } from '@mantine/core';
import { IconPlant, IconPackage, IconClock } from '@tabler/icons-react';

interface FarmerStatsProps {
  totalBatches: number;
  pendingBatches: number;
  farms: number;
}

export const FarmerStats: React.FC<FarmerStatsProps> = ({ totalBatches, pendingBatches, farms }) => {
  // Calculer le pourcentage de lots en attente
  const pendingPercentage = totalBatches > 0 ? Math.round((pendingBatches / totalBatches) * 100) : 0;

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={3}>Statistiques de l'agriculteur</Title>
      </Card.Section>
      <Card.Section p="lg">
        <Stack gap="md">
          <Group justify="space-between">
            <Group>
              <IconPlant size={24} color="#40c057" />
              <div>
                <Text>Fermes</Text>
                <Text fw={700} size="lg">{farms}</Text>
              </div>
            </Group>
            <Badge color="green" size="lg">{farms > 1 ? 'Fermes actives' : 'Ferme active'}</Badge>
          </Group>

          <Group justify="space-between">
            <Group>
              <IconPackage size={24} color="#228be6" />
              <div>
                <Text>Lots totaux</Text>
                <Text fw={700} size="lg">{totalBatches}</Text>
              </div>
            </Group>
            <RingProgress
              sections={[{ value: pendingPercentage, color: 'orange' }]}
              label={
                <Text size="xs" ta="center">
                  {pendingPercentage}%
                </Text>
              }
              size={40}
            />
          </Group>

          <Group justify="space-between">
            <Group>
              <IconClock size={24} color="#fd7e14" />
              <div>
                <Text>Lots en attente</Text>
                <Text fw={700} size="lg">{pendingBatches}</Text>
              </div>
            </Group>
            <Badge color="orange" size="lg">En attente</Badge>
          </Group>
        </Stack>
      </Card.Section>
    </Card>
  );
};

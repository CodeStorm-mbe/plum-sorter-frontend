import React from 'react';
import { Card, Grid, Text, Title, Group, Badge, Progress, Stack } from '@mantine/core';
import { IconBuildingFactory2, IconChartBar, IconTrendingUp } from '@tabler/icons-react';
import { FarmStatistics } from '../../types';

interface TechnicianStatsProps {
  managedFarms: number;
  farmPerformance: FarmStatistics[];
}

export const TechnicianStats: React.FC<TechnicianStatsProps> = ({ managedFarms, farmPerformance }) => {
  // Trouver la ferme avec le plus de classifications
  const topFarm = farmPerformance && farmPerformance.length > 0 
    ? farmPerformance.reduce((prev, current) => 
        (prev.total_classifications > current.total_classifications) ? prev : current
      )
    : null;

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={3}>Statistiques du technicien</Title>
      </Card.Section>
      <Card.Section p="lg">
        <Stack gap="md">
          <Group justify="space-between">
            <Group>
              <IconBuildingFactory2 size={24} color="#228be6" />
              <div>
                <Text>Fermes gérées</Text>
                <Text fw={700} size="lg">{managedFarms}</Text>
              </div>
            </Group>
            <Badge color="blue" size="lg">Supervision active</Badge>
          </Group>

          {topFarm && (
            <div>
              <Group justify="space-between" mb="xs">
                <Text fw={500}>Ferme la plus active</Text>
                <Badge color="green">{topFarm.name}</Badge>
              </Group>
              <Progress 
                value={100} 
                color="green" 
                size="xl" 
              />
              <Text size="sm" ta="center" mt="xs">
                {topFarm.total_classifications} classifications
              </Text>
            </div>
          )}

          <Group justify="space-between">
            <Group>
              <IconChartBar size={24} color="#40c057" />
              <div>
                <Text>Performance moyenne</Text>
                <Text fw={700} size="lg">
                  {farmPerformance && farmPerformance.length > 0 
                    ? `${Math.round(farmPerformance.reduce((sum, farm) => 
                        sum + (farm.class_percentages?.['Bonne qualité'] || 0), 0) / farmPerformance.length)}%`
                    : 'N/A'}
                </Text>
              </div>
            </Group>
            <IconTrendingUp size={24} color="#40c057" />
          </Group>
        </Stack>
      </Card.Section>
    </Card>
  );
};

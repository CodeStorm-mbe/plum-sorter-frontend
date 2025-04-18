import React from 'react';
import { Card, Grid, Text, Title, Group, Badge, Progress, Stack, RingProgress } from '@mantine/core';
import { IconServer, IconClock, IconBrandSpeedtest, IconVersions } from '@tabler/icons-react';

interface SystemPerformanceProps {
  data: {
    averageProcessingTime: number;
    apiResponseTime: number;
    modelVersion: string;
    modelAccuracy?: number;
  };
}

export const SystemPerformance: React.FC<SystemPerformanceProps> = ({ data }) => {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={3}>Performance du système</Title>
      </Card.Section>
      <Card.Section p="lg">
        <Stack spacing="md">
          <Group position="apart">
            <Group>
              <IconClock size={24} color="#228be6" />
              <div>
                <Text>Temps de traitement moyen</Text>
                <Text weight={700} size="lg">{data.averageProcessingTime.toFixed(2)} s</Text>
              </div>
            </Group>
            <Badge color="blue" size="lg">Performance</Badge>
          </Group>

          <Group position="apart">
            <Group>
              <IconBrandSpeedtest size={24} color="#40c057" />
              <div>
                <Text>Temps de réponse API</Text>
                <Text weight={700} size="lg">{data.apiResponseTime.toFixed(2)} s</Text>
              </div>
            </Group>
            <Badge 
              color={data.apiResponseTime < 0.3 ? "green" : data.apiResponseTime < 0.8 ? "yellow" : "red"} 
              size="lg"
            >
              {data.apiResponseTime < 0.3 ? "Rapide" : data.apiResponseTime < 0.8 ? "Normal" : "Lent"}
            </Badge>
          </Group>

          <Group position="apart">
            <Group>
              <IconVersions size={24} color="#fd7e14" />
              <div>
                <Text>Version du modèle</Text>
                <Text weight={700} size="lg">{data.modelVersion}</Text>
              </div>
            </Group>
            {data.modelAccuracy !== undefined && (
              <RingProgress
                sections={[{ value: data.modelAccuracy * 100, color: 'green' }]}
                label={
                  <Text size="xs" align="center">
                    {(data.modelAccuracy * 100).toFixed(1)}%
                  </Text>
                }
                size={40}
              />
            )}
          </Group>
        </Stack>
      </Card.Section>
    </Card>
  );
};

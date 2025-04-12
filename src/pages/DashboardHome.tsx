import { ReactNode } from 'react';
import { Box, Container, Title, Text, Card, SimpleGrid, Group, ThemeIcon, useMantineTheme } from '@mantine/core';
import { IconApple, IconFarm, IconPackages, IconChartBar } from '@tabler/icons-react';

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  color: string;
}

function StatsCard({ title, value, description, icon, color }: StatsCardProps) {
  return (
    <Card withBorder p="md" radius="md" shadow="sm">
      <Group justify="space-between">
        <Box>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            {title}
          </Text>
          <Text fw={700} size="xl" mt={5}>
            {value}
          </Text>
          <Text size="xs" c="dimmed" mt={5}>
            {description}
          </Text>
        </Box>
        <ThemeIcon color={color} variant="light" size={48} radius="md">
          {icon}
        </ThemeIcon>
      </Group>
    </Card>
  );
}

export function DashboardHome() {
  const theme = useMantineTheme();

  // Ces données seraient normalement chargées depuis l'API
  const stats = [
    {
      title: 'Classifications',
      value: '1,284',
      description: '+12% par rapport au mois dernier',
      icon: <IconApple size={24} />,
      color: theme.colors.plum[6],
    },
    {
      title: 'Fermes',
      value: '8',
      description: '2 nouvelles fermes ce mois-ci',
      icon: <IconFarm size={24} />,
      color: theme.colors.green[6],
    },
    {
      title: 'Lots',
      value: '42',
      description: '18 lots en attente de classification',
      icon: <IconPackages size={24} />,
      color: theme.colors.blue[6],
    },
    {
      title: 'Qualité moyenne',
      value: '76%',
      description: 'Amélioration de 5% depuis la dernière récolte',
      icon: <IconChartBar size={24} />,
      color: theme.colors.orange[6],
    },
  ];

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="md">Tableau de bord</Title>
      <Text c="dimmed" mb="xl">
        Bienvenue dans votre système de classification des prunes. Voici un aperçu de vos activités récentes.
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </SimpleGrid>

      <Title order={3} mt="xl" mb="md">
        Classifications récentes
      </Title>
      <Card withBorder p="md" radius="md" shadow="sm">
        <Text c="dimmed">
          Les classifications récentes seront affichées ici. Cette section sera implémentée dans les prochaines étapes.
        </Text>
      </Card>

      <Title order={3} mt="xl" mb="md">
        Répartition de la qualité
      </Title>
      <Card withBorder p="md" radius="md" shadow="sm">
        <Text c="dimmed">
          Les graphiques de répartition de la qualité seront affichés ici. Cette section sera implémentée dans les prochaines étapes.
        </Text>
      </Card>
    </Container>
  );
}

export default DashboardHome;

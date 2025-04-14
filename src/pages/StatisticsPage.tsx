import { useState, useEffect } from 'react';
import { Container, Title, Text, Card, Button, Group, Select, Grid, Loader, Center, Alert, Paper, RingProgress, Stack, SegmentedControl, Box } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useQuery } from '@tanstack/react-query';
import { IconAlertCircle, IconApple } from '@tabler/icons-react';
import { BarChart, PieChart, LineChart } from '@mantine/charts';
import { DateValue } from '@mantine/dates';
import { Farm, StatisticsResponse, FarmStatistics } from '../types';
import api from '../services/api';

// Service pour récupérer les fermes
const fetchFarms = async (): Promise<Farm[]> => {
  const response = await api.get('/farms/');
  return response.data;
};

// Service pour récupérer les statistiques globales
const fetchGlobalStatistics = async (params: { start_date?: string; end_date?: string }): Promise<StatisticsResponse> => {
  const queryParams = new URLSearchParams();
  if (params.start_date) queryParams.append('start_date', params.start_date);
  if (params.end_date) queryParams.append('end_date', params.end_date);
  
  const response = await api.get(`/classifications/stats/?${queryParams.toString()}`);
  return response.data;
};

// Service pour récupérer les statistiques d'une ferme
const fetchFarmStatistics = async (farmId: number, params: { start_date?: string; end_date?: string }): Promise<FarmStatistics> => {
  const queryParams = new URLSearchParams();
  if (params.start_date) queryParams.append('start_date', params.start_date);
  if (params.end_date) queryParams.append('end_date', params.end_date);
  
  const response = await api.get(`/farms/${farmId}/stats/?${queryParams.toString()}`);
  return response.data;
};

export function StatisticsPage() {
  const [selectedFarm, setSelectedFarm] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[DateValue, DateValue]>([null, null]);
  const [chartType, setChartType] = useState<'quality' | 'trend'>('quality');
  
  // Formater les dates pour l'API
  const formatDate = (date: Date | null): string | undefined => {
    if (!date) return undefined;
    return date.toISOString().split('T')[0];
  };
  
  // Paramètres pour les requêtes
  const queryParams = {
    start_date: dateRange[0] ? formatDate(dateRange[0]) : undefined,
    end_date: dateRange[1] ? formatDate(dateRange[1]) : undefined,
  };

  // Requête pour récupérer les fermes
  const { data: farms, isLoading: farmsLoading } = useQuery({
    queryKey: ['farms'],
    queryFn: fetchFarms,
  });

  // Requête pour récupérer les statistiques globales
  const { 
    data: globalStats, 
    isLoading: globalStatsLoading, 
    error: globalStatsError 
  } = useQuery({
    queryKey: ['global-stats', queryParams],
    queryFn: () => fetchGlobalStatistics(queryParams),
  });

  // Requête pour récupérer les statistiques d'une ferme spécifique
  const { 
    data: farmStats, 
    isLoading: farmStatsLoading, 
    error: farmStatsError 
  } = useQuery({
    queryKey: ['farm-stats', selectedFarm, queryParams],
    queryFn: () => fetchFarmStatistics(parseInt(selectedFarm!), queryParams),
    enabled: !!selectedFarm,
  });

  // Formater les données pour les graphiques
  const formatQualityData = (stats: StatisticsResponse | FarmStatistics | undefined) => {
    if (!stats || !stats.class_counts) return [];
    
    const qualityMapping: Record<string, { label: string; color: string }> = {
      'bonne_qualite': { label: 'Bonne qualité', color: '#4CAF50' },
      'non_mure': { label: 'Non mûre', color: '#FFC107' },
      'tachetee': { label: 'Tachetée', color: '#FF9800' },
      'fissuree': { label: 'Fissurée', color: '#F44336' },
      'meurtrie': { label: 'Meurtrie', color: '#E91E63' },
      'pourrie': { label: 'Pourrie', color: '#9C27B0' },
    };
    
    return Object.entries(stats.class_counts).map(([key, value]) => ({
      name: qualityMapping[key]?.label || key,
      value: typeof value === 'number' ? value : 0, // Assurer que value est un nombre
      color: qualityMapping[key]?.color || '#CCCCCC',
    }));
  };

  // Données pour le graphique en anneau
  const ringData = (stats: StatisticsResponse | FarmStatistics | undefined) => {
    if (!stats || !stats.class_percentages) return { value: 0, color: 'gray' };
    
    // Calculer le pourcentage de prunes de bonne qualité
    const goodQualityPercentage = stats.class_percentages['bonne_qualite'] || 0;
    
    // Déterminer la couleur en fonction du pourcentage
    let color = '#4CAF50'; // Vert par défaut
    if (goodQualityPercentage < 30) {
      color = '#F44336'; // Rouge
    } else if (goodQualityPercentage < 60) {
      color = '#FFC107'; // Jaune
    }
    
    return { value: goodQualityPercentage, color };
  };

  // Données pour le graphique de tendance (simulées pour l'exemple)
  const trendData = [
    { date: '2025-01', 'Bonne qualité': 65, 'Non mûre': 20, 'Tachetée': 10, 'Autre': 5 },
    { date: '2025-02', 'Bonne qualité': 68, 'Non mûre': 18, 'Tachetée': 9, 'Autre': 5 },
    { date: '2025-03', 'Bonne qualité': 70, 'Non mûre': 15, 'Tachetée': 10, 'Autre': 5 },
    { date: '2025-04', 'Bonne qualité': 72, 'Non mûre': 14, 'Tachetée': 8, 'Autre': 6 },
    { date: '2025-05', 'Bonne qualité': 75, 'Non mûre': 12, 'Tachetée': 8, 'Autre': 5 },
    { date: '2025-06', 'Bonne qualité': 80, 'Non mûre': 10, 'Tachetée': 6, 'Autre': 4 },
  ];

  // Afficher un loader pendant le chargement
  const isLoading = farmsLoading || globalStatsLoading || (selectedFarm && farmStatsLoading);
  if (isLoading) {
    return (
      <Center style={{ height: 'calc(100vh - 60px)' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  // Afficher une erreur si la requête a échoué
  const error = globalStatsError || (selectedFarm && farmStatsError);
  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle size={16} />} title="Erreur" color="red">
          Une erreur est survenue lors du chargement des statistiques. Veuillez réessayer plus tard.
        </Alert>
      </Container>
    );
  }

  // Statistiques à afficher (globales ou par ferme)
  const displayStats = selectedFarm ? farmStats : globalStats;

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="md">Statistiques et Visualisations</Title>
      <Text c="dimmed" mb="xl">
        Analysez la qualité de vos prunes et suivez les tendances au fil du temps
      </Text>

      <Card withBorder p="md" radius="md" shadow="sm" mb="xl">
        <Group grow align="flex-end">
          <Select
            label="Ferme"
            placeholder="Toutes les fermes"
            data={[
              { value: '', label: 'Toutes les fermes' },
              ...(farms?.map((farm: Farm) => ({ value: farm.id.toString(), label: farm.name })) || [])
            ]}
            value={selectedFarm}
            onChange={setSelectedFarm}
            clearable={false}
          />
          <DatePickerInput
            type="range"
            value={dateRange}
            onChange={setDateRange}
            label="Filtrer par date"
            placeholder="Choisissez une période"
            locale="fr"
            mx="auto"
            clearable
            maw={300}
          />
        </Group>
      </Card>

      <Grid gutter="md" mb="xl">
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card withBorder p="md" radius="md" shadow="sm" h="100%">
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Classifications totales</Text>
            </Group>
            <Center my="md">
              <Title order={1}>{displayStats?.total_classifications || 0}</Title>
            </Center>
            <Text size="sm" c="dimmed" ta="center">
              {dateRange[0] && dateRange[1] 
                ? `Du ${dateRange[0].toLocaleDateString()} au ${dateRange[1].toLocaleDateString()}`
                : 'Toutes périodes confondues'}
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card withBorder p="md" radius="md" shadow="sm" h="100%">
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Confiance moyenne</Text>
            </Group>
            <Center my="md">
              <Title order={1}>{displayStats?.average_confidence 
                ? `${(displayStats.average_confidence * 100).toFixed(1)}%` 
                : '0%'}
              </Title>
            </Center>
            <Text size="sm" c="dimmed" ta="center">
              Niveau de confiance moyen des classifications
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card withBorder p="md" radius="md" shadow="sm" h="100%">
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Prunes de bonne qualité</Text>
            </Group>
            <Center>
              <RingProgress
                size={120}
                thickness={12}
                roundCaps
                sections={[ringData(displayStats)]}
                label={
                  <Center>
                    <IconApple style={{ width: 20, height: 20 }} />
                    <Text size="xs" ta="center" fw={700}>
                      {displayStats?.class_percentages?.['bonne_qualite'] 
                        ? `${displayStats.class_percentages['bonne_qualite'].toFixed(1)}%` 
                        : '0%'}
                    </Text>
                  </Center>
                }
              />
            </Center>
            <Text size="sm" c="dimmed" ta="center">
              Pourcentage de prunes de bonne qualité
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card withBorder p="md" radius="md" shadow="sm" h="100%">
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Fermes actives</Text>
            </Group>
            <Center my="md">
              <Title order={1}>{farms?.length || 0}</Title>
            </Center>
            <Text size="sm" c="dimmed" ta="center">
              Nombre total de fermes enregistrées
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Paper withBorder p="md" radius="md" shadow="sm" mb="xl">
        <Stack gap="xs" mb="md">
          <Group justify="space-between">
            <Title order={3}>Répartition de la qualité</Title>
            <SegmentedControl
              value={chartType}
              onChange={(value: string) => setChartType(value as 'quality' | 'trend')}
              data={[
                { label: 'Qualité', value: 'quality' },
                { label: 'Tendance', value: 'trend' },
              ]}
            />
          </Group>
          <Text c="dimmed">
            {chartType === 'quality' 
              ? 'Distribution des classifications par catégorie de qualité' 
              : 'Évolution de la qualité des prunes au fil du temps'}
          </Text>
        </Stack>

        {chartType === 'quality' ? (
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Box h={300}>
                {formatQualityData(displayStats).length > 0 ? (
                  <PieChart
                    data={formatQualityData(displayStats)}
                    withLabels
                    labelsType="percent"
                    withTooltip
                    tooltipDataSource="segment"
                    h={300}
                  />
                ) : (
                  <Center h={300}>
                    <Text c="dimmed">Aucune donnée disponible</Text>
                  </Center>
                )}
              </Box>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Box h={300}>
                {formatQualityData(displayStats).length > 0 ? (
                  <BarChart
                    h={300}
                    data={formatQualityData(displayStats)}
                    dataKey="name"
                    series={[{ name: 'value', color: 'plum.6' }]}
                    tickLine="y"
                    withLegend={false}
                    withTooltip
                  />
                ) : (
                  <Center h={300}>
                    <Text c="dimmed">Aucune donnée disponible</Text>
                  </Center>
                )}
              </Box>
            </Grid.Col>
          </Grid>
        ) : (
          <Box h={400}>
            <LineChart
              h={400}
              data={trendData}
              dataKey="date"
              series={[
                { name: 'Bonne qualité', color: 'green.6' },
                { name: 'Non mûre', color: 'yellow.6' },
                { name: 'Tachetée', color: 'orange.6' },
                { name: 'Autre', color: 'gray.6' },
              ]}
              withLegend
              withTooltip
              gridAxis="xy"
              yAxisProps={{ domain: [0, 100] }}
            />
          </Box>
        )}
      </Paper>

      {selectedFarm && farmStats?.batches && farmStats.batches.length > 0 && (
        <Paper withBorder p="md" radius="md" shadow="sm">
          <Title order={3} mb="xs">Statistiques par lot</Title>
          <Text c="dimmed" mb="md">
            Répartition de la qualité pour chaque lot de la ferme sélectionnée
          </Text>
          
          <Grid>
            {farmStats.batches.map((batch) => (
              <Grid.Col key={batch.batch_id} span={{ base: 12, sm: 6, lg: 4 }}>
                <Card withBorder p="md" radius="md" shadow="sm">
                  <Text fw={500} mb="md">{batch.batch_name}</Text>
                  <Box h={200}>
                    {Object.keys(batch.quality_distribution || {}).length > 0 ? (
                      <PieChart
                        data={Object.entries(batch.quality_distribution || {}).map(([key, value]) => ({
                          name: key,
                          value: typeof value.count === 'number' ? value.count : 0,
                          color: key === 'bonne_qualite' ? '#4CAF50' : 
                                key === 'non_mure' ? '#FFC107' : 
                                key === 'tachetee' ? '#FF9800' : 
                                key === 'fissuree' ? '#F44336' : 
                                key === 'meurtrie' ? '#E91E63' : 
                                key === 'pourrie' ? '#9C27B0' : '#CCCCCC'
                        }))}
                        withLabels
                        labelsPosition="outside"
                        h={200}
                        size={150}
                      />
                    ) : (
                      <Center h={200}>
                        <Text c="dimmed">Aucune donnée disponible</Text>
                      </Center>
                    )}
                  </Box>
                  <Text size="sm" ta="center" mt="sm">
                    Total: {batch.total_classifications || 0} prunes
                  </Text>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Paper>
      )}
    </Container>
  );
}

export default StatisticsPage;

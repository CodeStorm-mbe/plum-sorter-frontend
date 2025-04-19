import React from 'react';
import { Table, Text, Badge, Group, Avatar, Card, Title } from '@mantine/core';

interface RecentClassificationsProps {
  classifications: any[];
}

export const RecentClassifications: React.FC<RecentClassificationsProps> = ({ classifications }) => {
  // Si aucune classification, afficher un message
  if (!classifications || classifications.length === 0) {
    return <Text ta="center">Aucune classification récente</Text>;
  }

  // Fonction pour déterminer la couleur du badge selon la classe
  const getBadgeColor = (className: string) => {
    const lowerClass = className.toLowerCase();
    if (lowerClass.includes('bonne') || lowerClass.includes('good')) return 'green';
    if (lowerClass.includes('non mûre') || lowerClass.includes('unripe')) return 'blue';
    if (lowerClass.includes('tachetée') || lowerClass.includes('spotted')) return 'yellow';
    if (lowerClass.includes('fissurée') || lowerClass.includes('cracked')) return 'orange';
    if (lowerClass.includes('meurtrie') || lowerClass.includes('bruised')) return 'grape';
    if (lowerClass.includes('pourrie') || lowerClass.includes('rotten')) return 'red';
    return 'gray';
  };

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Table striped highlightOnHover>
      <thead>
        <tr>
          <th>Image</th>
          <th>Classification</th>
          <th>Confiance</th>
          <th>Lot</th>
          <th>Ferme</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {classifications.map((classification, index) => (
          <tr key={index}>
            <td>
              <Avatar 
                src={classification.image_url || '/placeholder-plum.jpg'} 
                size="md" 
                radius="sm" 
              />
            </td>
            <td>
              <Badge 
                color={getBadgeColor(classification.class_name)} 
                variant="filled"
              >
                {classification.class_name}
              </Badge>
            </td>
            <td>
              <Text>{(classification.confidence_score * 100).toFixed(1)}%</Text>
            </td>
            <td>
              <Text>{classification.batch?.name || '-'}</Text>
            </td>
            <td>
              <Text>{classification.farm?.name || '-'}</Text>
            </td>
            <td>
              <Text size="sm">{formatDate(classification.created_at)}</Text>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

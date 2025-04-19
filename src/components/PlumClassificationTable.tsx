import React from 'react';
import { Table, Badge } from '@mantine/core';
import { formatDate, getQualityColor, getQualityLabel } from '../utils/apiUtils';
import { PlumClassification } from '../types';

interface PlumClassificationTableProps {
  classifications: PlumClassification[];
}

export const PlumClassificationTable: React.FC<PlumClassificationTableProps> = ({ classifications }) => {
  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Image</Table.Th>
          <Table.Th>Qualité</Table.Th>
          <Table.Th>Score de confiance</Table.Th>
          <Table.Th>Date de classification</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {classifications.map((classification) => (
          <Table.Tr key={classification.id}>
            <Table.Td>
              <img 
                src={classification.image} 
                alt={`Classification ${classification.id}`} 
                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} 
              />
            </Table.Td>
            <Table.Td>
              <Badge 
                color={getQualityColor(classification.class_name).replace('#', '')}
                variant="filled"
              >
                {getQualityLabel(classification.class_name)}
              </Badge>
            </Table.Td>
            <Table.Td>
              {(classification.confidence_score * 100).toFixed(2)}%
            </Table.Td>
            <Table.Td>
              {formatDate(classification.created_at)}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

export default PlumClassificationTable;

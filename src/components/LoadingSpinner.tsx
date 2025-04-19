import React from 'react';
import { Loader } from '@mantine/core';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  return (
    <Loader size={size} className={className} />
  );
};

export default LoadingSpinner;

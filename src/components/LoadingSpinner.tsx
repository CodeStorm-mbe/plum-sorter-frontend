import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'gold';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'emerald',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3'
  };
  
  const colorClasses = {
    emerald: 'border-t-accent-emerald',
    gold: 'border-t-accent-gold'
  };
  
  return (
    <motion.div 
      className={`inline-block animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]} border-white/20 ${className}`}
      animate={{ rotate: 360 }}
      transition={{ 
        duration: 1, 
        repeat: Infinity, 
        ease: "linear" 
      }}
    />
  );
};

export default LoadingSpinner;

import React from 'react';
import { motion } from 'framer-motion';

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className = '' }) => {
  // Fonction pour obtenir la couleur de la catégorie
  const getCategoryColor = (category: string) => {
    const categoryMap: Record<string, string> = {
      'bonne qualité': 'bg-plum-good',
      'non mûre': 'bg-plum-unripe',
      'tachetée': 'bg-plum-spotted',
      'fissurée': 'bg-plum-cracked',
      'meurtrie': 'bg-plum-bruised',
      'pourrie': 'bg-plum-rotten',
      'Bonne qualité': 'bg-plum-good',
      'Non mûre': 'bg-plum-unripe',
      'Tachetée': 'bg-plum-spotted',
      'Fissurée': 'bg-plum-cracked',
      'Meurtrie': 'bg-plum-bruised',
      'Pourrie': 'bg-plum-rotten'
    };
    
    return categoryMap[category] || 'bg-accent-gold';
  };

  return (
    <motion.span
      className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(category)} ${className}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {category}
    </motion.span>
  );
};

export default CategoryBadge;

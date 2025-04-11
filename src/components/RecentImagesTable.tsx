import React from 'react';
import { motion } from 'framer-motion';

interface RecentImagesTableProps {
  images: Array<{
    id: number;
    thumbnail: string;
    category: string;
    confidence: number;
    date: string;
  }>;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  className?: string;
}

const RecentImagesTable: React.FC<RecentImagesTableProps> = ({ 
  images, 
  activeFilter, 
  onFilterChange,
  className = '' 
}) => {
  // Fonction pour obtenir la couleur de la catégorie
  const getCategoryColor = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Bonne qualité': 'bg-plum-good',
      'Non mûre': 'bg-plum-unripe',
      'Tachetée': 'bg-plum-spotted',
      'Fissurée': 'bg-plum-cracked',
      'Meurtrie': 'bg-plum-bruised',
      'Pourrie': 'bg-plum-rotten'
    };
    
    return categoryMap[category] || 'bg-accent-gold';
  };

  // Filtrer les images en fonction du filtre actif
  const filteredImages = images.filter(img => activeFilter === 'all' || img.category === activeFilter);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-wrap gap-2 mb-4">
        {['all', 'Bonne qualité', 'Non mûre', 'Tachetée', 'Fissurée', 'Meurtrie', 'Pourrie'].map((filter) => (
          <button
            key={filter}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              activeFilter === filter 
                ? 'bg-accent-gold text-background-DEFAULT' 
                : 'bg-background-light text-white/80 hover:bg-background-DEFAULT'
            }`}
            onClick={() => onFilterChange(filter)}
          >
            {filter === 'all' ? 'Toutes' : filter}
          </button>
        ))}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Catégorie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Confiance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredImages.length > 0 ? (
              filteredImages.map((image) => (
                <motion.tr 
                  key={image.id} 
                  className="hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={image.thumbnail} alt={`Prune ${image.id}`} className="h-12 w-12 rounded-md object-cover" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${getCategoryColor(image.category)} mr-2`}></div>
                      <span>{image.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-background-DEFAULT rounded-full h-2 mr-2">
                        <div 
                          className="bg-accent-gold h-2 rounded-full" 
                          style={{ width: `${image.confidence}%` }}
                        ></div>
                      </div>
                      <span>{image.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white/70">
                    {image.date}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-white/50">
                  Aucune image ne correspond au filtre sélectionné
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentImagesTable;

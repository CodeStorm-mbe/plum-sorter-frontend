import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Mock data - in a real app this would come from your API
const mockImages = [
    {
        id: 1,
        thumbnailUrl: 'https://via.placeholder.com/100',
        category: 'Bonne Qualité',
        confidence: 95.2,
        timestamp: '2025-04-10T09:15:22Z',
        categoryKey: 'good',
    },
    {
        id: 2,
        thumbnailUrl: 'https://via.placeholder.com/100',
        category: 'Tachetée',
        confidence: 87.6,
        timestamp: '2025-04-10T08:45:12Z',
        categoryKey: 'spotted',
    },
    {
        id: 3,
        thumbnailUrl: 'https://via.placeholder.com/100',
        category: 'Non Mûre',
        confidence: 92.3,
        timestamp: '2025-04-09T16:22:05Z',
        categoryKey: 'unripe',
    },
    {
        id: 4,
        thumbnailUrl: 'https://via.placeholder.com/100',
        category: 'Fissurée',
        confidence: 83.4,
        timestamp: '2025-04-09T14:55:38Z',
        categoryKey: 'cracked',
    },
    {
        id: 5,
        thumbnailUrl: 'https://via.placeholder.com/100',
        category: 'Pourrie',
        confidence: 91.7,
        timestamp: '2025-04-08T11:10:45Z',
        categoryKey: 'rotten',
    },
    {
        id: 6,
        thumbnailUrl: 'https://via.placeholder.com/100',
        category: 'Meurtrie',
        confidence: 88.2,
        timestamp: '2025-04-08T10:30:19Z',
        categoryKey: 'bruised',
    },
];

const RecentImages = ({ dateFilter, categoryFilter }) => {
    const [filteredImages, setFilteredImages] = useState([]);

    useEffect(() => {
        // Apply filters
        let results = [...mockImages];

        // Date filtering
        if (dateFilter !== 'all') {
            const now = new Date();
            let cutoff = new Date();

            if (dateFilter === 'today') {
                cutoff.setHours(0, 0, 0, 0);
            } else if (dateFilter === 'week') {
                cutoff.setDate(now.getDate() - 7);
            } else if (dateFilter === 'month') {
                cutoff.setMonth(now.getMonth() - 1);
            }

            results = results.filter(img => new Date(img.timestamp) >= cutoff);
        }

        // Category filtering
        if (categoryFilter !== 'all') {
            results = results.filter(img => img.categoryKey === categoryFilter);
        }

        setFilteredImages(results);
    }, [dateFilter, categoryFilter]);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="overflow-x-auto">
            {filteredImages.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                    Aucune image correspondant aux filtres sélectionnés
                </div>
            ) : (
                <table className="w-full">
                    <thead>
                    <tr className="text-left text-sm text-gray-400 border-b border-gray-700">
                        <th className="pb-3 font-medium">Image</th>
                        <th className="pb-3 font-medium">Catégorie</th>
                        <th className="pb-3 font-medium">Confiance</th>
                        <th className="pb-3 font-medium">Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredImages.map((image, index) => (
                        <motion.tr
                            key={image.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-gray-800"
                        >
                            <td className="py-3">
                                <img
                                    src={image.thumbnailUrl}
                                    alt={`Image ${image.id}`}
                                    className="w-12 h-12 object-cover rounded"
                                />
                            </td>
                            <td className="py-3">
                                <span className="font-medium">{image.category}</span>
                            </td>
                            <td className="py-3">
                                <span className="text-accent-gold">{image.confidence}%</span>
                            </td>
                            <td className="py-3 text-sm text-gray-400">
                                {formatDate(image.timestamp)}
                            </td>
                        </motion.tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default RecentImages;

import { motion } from 'framer-motion';

// These would be defined based on your application's categories
const categoryIcons = {
    'Bonne Qualité': '✅',
    'Non Mûre': '🟢',
    'Tachetée': '🔴',
    'Fissurée': '⚠️',
    'Meurtrie': '🟣',
    'Pourrie': '⚫',
};

const ResultDisplay = ({ prediction, onViewExplanation, showGradCAM }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background-dark bg-opacity-50 rounded-lg p-6"
        >
            <h3 className="font-title text-xl text-center mb-6">Résultat de l'analyse</h3>

            <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                    <div className="text-4xl mr-4">
                        {categoryIcons[prediction.category] || '🔍'}
                    </div>

                    <div>
                        <h4 className="font-title text-xl text-accent-emerald">{prediction.category}</h4>
                        <p className="text-sm text-gray-400">Catégorie détectée</p>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="font-title text-2xl text-accent-gold">
                        {prediction.confidence}%
                    </div>
                    <p className="text-sm text-gray-400">Confiance</p>
                </div>
            </div>

            <div className="mt-6 text-center">
                <button
                    onClick={onViewExplanation}
                    className="text-accent-emerald hover:text-accent-emerald/80 font-medium transition-colors duration-300"
                >
                    {showGradCAM ? 'Masquer l\'explication' : 'Voir l\'explication (Grad-CAM)'}
                </button>
            </div>
        </motion.div>
    );
};

export default ResultDisplay;

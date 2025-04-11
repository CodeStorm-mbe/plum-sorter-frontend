import { useState } from 'react';
import { motion } from 'framer-motion';
import ImageUploader from '../components/prediction/ImageUploader';
import ResultDisplay from '../components/prediction/ResultDisplay';
import GradCAMViewer from '../components/prediction/GradCAMViewer';

const PredictionPage = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showGradCAM, setShowGradCAM] = useState(false);

    const handleImageSelect = (imageFile) => {
        setSelectedImage(imageFile);
        setPrediction(null);
        setShowGradCAM(false);
    };

    const handleAnalyze = async () => {
        if (!selectedImage) return;

        setIsLoading(true);

        // Simulate API call to backend
        setTimeout(() => {
            // Mock result - in real app, this would come from your API
            setPrediction({
                category: 'Bonne Qualité',
                confidence: 92.5,
                gradcamUrl: 'https://example.com/gradcam.jpg', // This would be from your API
            });
            setIsLoading(false);
        }, 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-24 max-w-4xl mx-auto"
        >
            <h1 className="font-title text-3xl md:text-4xl font-bold text-center mb-8">
                Analyse de <span className="text-accent-emerald">Prunes</span>
            </h1>

            <div className="bg-background-card rounded-xl p-6 md:p-8">
                <ImageUploader
                    onImageSelect={handleImageSelect}
                    selectedImage={selectedImage}
                />

                {selectedImage && !prediction && (
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading}
                            className={`px-6 py-3 rounded-lg font-title font-medium transition-colors duration-300 
                ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-accent-emerald hover:bg-accent-emerald/80'}`}
                        >
                            {isLoading ? 'Analyse en cours...' : 'Analyser l\'image'}
                        </button>
                    </div>
                )}

                {prediction && (
                    <div className="mt-8">
                        <ResultDisplay
                            prediction={prediction}
                            onViewExplanation={() => setShowGradCAM(!showGradCAM)}
                            showGradCAM={showGradCAM}
                        />

                        {showGradCAM && (
                            <GradCAMViewer
                                originalImage={selectedImage}
                                gradcamUrl={prediction.gradcamUrl}
                            />
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default PredictionPage;

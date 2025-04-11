import { motion } from 'framer-motion';

const GradCAMViewer = ({ originalImage, gradcamUrl }) => {
    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 bg-background-dark bg-opacity-50 rounded-lg p-6"
        >
            <h3 className="font-title text-xl text-center mb-4">Visualisation Grad-CAM</h3>

            <p className="text-sm text-gray-400 text-center mb-4">
                Les zones en surbrillance indiquent les régions importantes pour la classification
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-center mb-2 text-sm font-medium">Image originale</p>
                    <img
                        src={URL.createObjectURL(originalImage)}
                        alt="Original"
                        className="w-full h-48 object-contain rounded-lg"
                    />
                </div>

                <div>
                    <p className="text-center mb-2 text-sm font-medium">Cartographie Grad-CAM</p>
                    {/* In a real app, you would use the actual gradcamUrl from your API */}
                    <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center text-sm text-gray-500">
                        Grad-CAM en cours de chargement...
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <p className="text-sm text-gray-400">
                    <strong>Comment lire le Grad-CAM :</strong> Les zones rouges indiquent les parties de l'image que le modèle a utilisées pour déterminer la classification. Plus la couleur est chaude (rouge, jaune), plus cette zone a influencé la décision de l'IA.
                </p>
            </div>
        </motion.div>
    );
};

export default GradCAMViewer;

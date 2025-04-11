import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FaUpload } from 'react-icons/fa';

const ImageUploader = ({ onImageSelect, selectedImage }) => {
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            onImageSelect(file);
        }
    }, [onImageSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png']
        },
        maxFiles: 1,
    });

    return (
        <div className="w-full">
            {!selectedImage ? (
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300
            ${isDragActive ? 'border-accent-emerald bg-accent-emerald/10' : 'border-gray-600 hover:border-accent-emerald'}`}
                    {...getRootProps()}
                >
                    <input {...getInputProps()} />

                    <FaUpload className="mx-auto text-3xl mb-4 text-accent-gold" />

                    <p className="text-lg mb-2 font-medium">
                        {isDragActive ? 'Déposez l\'image ici...' : 'Glissez-déposez une image ici'}
                    </p>

                    <p className="text-gray-400 text-sm mb-4">
                        ou cliquez pour parcourir vos fichiers
                    </p>

                    <p className="text-xs text-gray-500">
                        Formats supportés: JPG, JPEG, PNG
                    </p>
                </motion.div>
            ) : (
                <div className="relative">
                    <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Aperçu"
                        className="w-full h-64 object-contain rounded-lg"
                    />

                    <button
                        onClick={() => onImageSelect(null)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;

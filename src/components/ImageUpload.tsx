import React, { useState, useRef } from 'react';

interface ImageUploadProps {
  onImageSelected: (file: File, preview: string) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, className = '' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFile = (file: File) => {
    // Vérifier si le fichier est une image
    if (!file.type.match('image.*')) {
      alert('Veuillez sélectionner une image.');
      return;
    }
    
    // Créer un aperçu de l'image
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        onImageSelected(file, e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div 
      className={`upload-zone ${isDragging ? 'border-accent-emerald' : ''} ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleBrowseClick}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-12 w-12 text-white/70 mb-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
        />
      </svg>
      <p className="text-white/70 mb-2">Glissez-déposez une image ici</p>
      <p className="text-white/50 text-sm mb-4">ou</p>
      <button className="btn-secondary">
        Parcourir
      </button>
      <input 
        type="file" 
        ref={fileInputRef}
        accept="image/*" 
        className="hidden" 
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUpload;

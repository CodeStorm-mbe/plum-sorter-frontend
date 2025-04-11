"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, ImageIcon, FileUp } from "lucide-react"

interface ImageUploadProps {
  onImageSelected: (file: File, preview: string) => void
  className?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, className = "" }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFile = (file: File) => {
    // Vérifier si le fichier est une image
    if (!file.type.match("image.*")) {
      alert("Veuillez sélectionner une image.")
      return
    }

    // Créer un aperçu de l'image
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        onImageSelected(file, e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
      <motion.div
          className={`upload-zone relative ${isDragging ? "border-accent-primary" : ""} ${className}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
      >
        {/* Background grid animation */}
        <div className="absolute inset-0 cyber-grid opacity-20" />

        <AnimatePresence>
          {(isDragging || isHovering) && (
              <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
              />
          )}
        </AnimatePresence>

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
              className="mb-4 p-4 bg-background-light/50 rounded-full"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            {isDragging ? (
                <FileUp className="h-10 w-10 text-accent-primary" />
            ) : (
                <Upload className="h-10 w-10 text-accent-primary" />
            )}
          </motion.div>

          <motion.p className="text-white/80 mb-2 font-medium" animate={{ opacity: isDragging ? 1 : 0.8 }}>
            {isDragging ? "Déposez l'image ici" : "Glissez-déposez une image ici"}
          </motion.p>

          <p className="text-white/50 text-sm mb-4">ou</p>

          <motion.button className="btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <span className="flex items-center">
            <ImageIcon className="h-4 w-4 mr-2" />
            Parcourir
          </span>
          </motion.button>

          <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
      </motion.div>
  )
}

export default ImageUpload

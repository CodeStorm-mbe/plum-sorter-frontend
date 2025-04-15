"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "../components/Navbar"
import ImageUpload from "../components/ImageUpload"
import ImagePreview from "../components/ImagePreview"
import Button from "../components/Button"
import CategoryBadge from "../components/CategoryBadge"
import ConfidenceBar from "../components/ConfidenceBar"
import PageTransition from "../components/PageTransition"
import { Eye, EyeOff, Info, AlertCircle, Upload } from "lucide-react"
import { MantineProvider } from "@mantine/core"

interface ResultProps {
  category: string
  confidence: number
  showHeatmap: boolean
  onToggleHeatmap: () => void
}

const ResultDisplay: React.FC<ResultProps> = ({ category, confidence, showHeatmap, onToggleHeatmap }) => {
  return (
      <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-title font-semibold mb-6 flex items-center">
          <Info className="h-5 w-5 mr-2 text-accent-primary" />
          <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          Résultats de l'analyse
        </span>
        </h2>

        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-full md:w-1/2">
            <motion.div
                className="mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-white/70 mb-2">Catégorie détectée:</p>
              <div className="flex items-center">
                <CategoryBadge category={category} size="lg" className="capitalize" />
              </div>
            </motion.div>

            <motion.div
                className="mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="text-white/70 mb-2">Score de confiance:</p>
              <ConfidenceBar value={confidence} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button
                  variant={showHeatmap ? "outline" : "primary"}
                  onClick={onToggleHeatmap}
                  icon={showHeatmap ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  size="md"
              >
                {showHeatmap ? "Masquer l'explication" : "Voir l'explication"}
              </Button>
            </motion.div>
          </div>

          <motion.div
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="card bg-background-light/50 p-4 h-full">
              <h3 className="font-medium mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-accent-primary" />
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Caractéristiques de cette catégorie:
              </span>
              </h3>

              <AnimatePresence mode="wait">
                <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                  <ul className="space-y-2 text-white/80">
                    {category === "bonne qualité" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-accent-primary mr-2">•</span>
                            <span>Couleur uniforme et vibrante</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-accent-primary mr-2">•</span>
                            <span>Surface lisse sans défauts</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-accent-primary mr-2">•</span>
                            <span>Forme régulière et symétrique</span>
                          </li>
                        </>
                    )}
                    {category === "non mûre" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-accent-primary mr-2">•</span>
                            <span>Couleur plus claire que la normale</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-accent-primary mr-2">•</span>
                            <span>Texture ferme</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-accent-primary mr-2">•</span>
                            <span>Manque de développement complet</span>
                          </li>
                        </>
                    )}
                    {category === "tachetée" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-accent-primary mr-2">•</span>
                            <span>Présence de taches sur la surface</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-accent-primary mr-2">•</span>
                            <span>Motifs irréguliers de décoloration</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-accent-primary mr-2">•</span>
                            <span>Texture potentiellement inégale</span>
                          </li>
                        </>
                    )}
                    {category === "fissurée" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-accent-primary mr-2">•</span>
                            <span>Présence de fissures visibles</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-accent-primary mr-2">•</span>
                            <span>Ruptures dans la peau du fruit</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-accent-primary mr-2">•</span>
                            <span>Possible exposition de la chair</span>
                          </li>
                        </>
                    )}
                    {category === "meurtrie" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-accent-primary mr-2">•</span>
                            <span>Zones de décoloration sombre</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-accent-primary mr-2">•</span>
                            <span>Dépressions sur la surface</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-accent-primary mr-2">•</span>
                            <span>Signes d'impact ou de pression</span>
                          </li>
                        </>
                    )}
                    {category === "pourrie" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-accent-primary mr-2">•</span>
                            <span>Zones de décomposition avancée</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-accent-primary mr-2">•</span>
                            <span>Couleur brune ou noirâtre</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-accent-primary mr-2">•</span>
                            <span>Texture molle et détériorée</span>
                          </li>
                        </>
                    )}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
  )
}

const PredictionPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<{
    category: string
    confidence: number
    showHeatmap: boolean
  } | null>(null)

  // Fonction pour gérer la sélection d'image
  const handleImageSelected = useCallback((file: File, preview: string) => {
    setFile(file)
    setPreview(preview)
    setResult(null)
  }, [])

  // Fonction pour analyser l'image
  const analyzeImage = useCallback(() => {
    if (!file) return

    setIsAnalyzing(true)

    // Simuler un appel API (à remplacer par un vrai appel API)
    setTimeout(() => {
      // Résultats fictifs pour la démonstration
      const categories = ["bonne qualité", "non mûre", "tachetée", "fissurée", "meurtrie", "pourrie"]
      const randomCategory = categories[Math.floor(Math.random() * categories.length)]
      const randomConfidence = 70 + Math.floor(Math.random() * 30) // Entre 70% et 99%

      setResult({
        category: randomCategory,
        confidence: randomConfidence,
        showHeatmap: false,
      })

      setIsAnalyzing(false)
    }, 2000)
  }, [file])

  // Fonction pour afficher/masquer la heatmap
  const toggleHeatmap = useCallback(() => {
    if (result) {
      setResult({
        ...result,
        showHeatmap: !result.showHeatmap,
      })
    }
  }, [result])

  // Fonction pour réinitialiser
  const resetImage = useCallback(() => {
    setFile(null)
    setPreview(null)
    setResult(null)
  }, [])

  return (
    <MantineProvider>
      <PageTransition>
        <div className="min-h-screen">
          <Navbar />

          <motion.div
              className="container mx-auto pt-28 pb-16 px-4 md:px-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
          >
            <motion.h1
                className="text-3xl md:text-4xl font-title font-bold text-center mb-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
            <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              Analyse de prunes
            </span>
            </motion.h1>

            <motion.p
                className="text-center text-white/70 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
              Téléchargez une image de prune pour l'analyser avec notre intelligence artificielle avancée
            </motion.p>

            <div className="max-w-4xl mx-auto">
              <motion.div
                  className="card mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-xl font-title font-semibold mb-4 flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-accent-primary" />
                  <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Téléchargez une image de prune
                </span>
                </h2>

                <AnimatePresence mode="wait">
                  {!preview ? (
                      <motion.div
                          key="upload"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                      >
                        <ImageUpload onImageSelected={handleImageSelected} />
                      </motion.div>
                  ) : (
                      <motion.div
                          key="preview"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                      >
                        <ImagePreview
                            preview={preview}
                            onReset={resetImage}
                            onAnalyze={analyzeImage}
                            isAnalyzing={isAnalyzing}
                            showHeatmap={result?.showHeatmap || false}
                        />
                      </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Résultats */}
              <AnimatePresence>
                {result && (
                    <ResultDisplay
                        category={result.category}
                        confidence={result.confidence}
                        showHeatmap={result.showHeatmap}
                        onToggleHeatmap={toggleHeatmap}
                    />
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Footer */}
          <footer className="py-8 px-4 md:px-8 lg:px-16 bg-background-light/50 backdrop-blur-md border-t border-white/5">
            <div className="container mx-auto text-center">
              <p className="text-white/60">© 2025 TriPrune - Projet JCIA Hackathon</p>
            </div>
          </footer>
        </div>
        </PageTransition>
      </MantineProvider>
  )
}

export default PredictionPage

"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Play, Eye, EyeOff } from "lucide-react"
import Button from "./Button"

interface ImagePreviewProps {
    preview: string
    onReset: () => void
    onAnalyze: () => void
    isAnalyzing: boolean
    showHeatmap: boolean
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ preview, onReset, onAnalyze, isAnalyzing, showHeatmap }) => {
    const [isHovering, setIsHovering] = useState(false)

    return (
        <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div
                className="relative rounded-lg overflow-hidden border border-white/10 shadow-lg"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <motion.img
                    src={preview || "/placeholder.svg"}
                    alt="Aperçu de la prune"
                    className="w-full h-auto max-h-[400px] object-contain"
                    layoutId="preview-image"
                />

                {/* Futuristic scan overlay */}
                <AnimatePresence>
                    {isAnalyzing && (
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-b from-accent-primary/10 to-accent-secondary/10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="absolute inset-0 border-2 border-accent-primary/50"
                                initial={{ top: 0 }}
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Heatmap overlay with improved visual */}
                {showHeatmap && (
                    <motion.div
                        className="absolute inset-0 mix-blend-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="absolute inset-0 bg-gradient-radial from-accent-tertiary/60 via-accent-secondary/40 to-transparent" />
                        <div className="absolute inset-0 cyber-dots" />
                    </motion.div>
                )}

                {/* Hover controls */}
                <AnimatePresence>
                    {isHovering && !isAnalyzing && (
                        <motion.div
                            className="absolute inset-0 bg-background/30 backdrop-blur-sm flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Button variant="primary" onClick={onAnalyze} icon={<Play className="h-5 w-5" />} withGlow>
                                Analyser
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <motion.button
                className="absolute top-2 right-2 p-2 bg-background-light/80 backdrop-blur-sm rounded-full text-white/70 hover:text-white"
                onClick={onReset}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 56, 96, 0.8)" }}
                whileTap={{ scale: 0.9 }}
            >
                <X className="h-5 w-5" />
            </motion.button>

            {isAnalyzing && (
                <div className="mt-6 text-center">
                    <motion.div
                        className="inline-block h-10 w-10 relative"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="absolute inset-0 rounded-full border-2 border-t-accent-primary border-r-accent-primary border-b-transparent border-l-transparent"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        />
                        <motion.div
                            className="absolute inset-1 rounded-full border-2 border-t-transparent border-r-transparent border-b-accent-secondary border-l-accent-secondary"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        />
                    </motion.div>
                    <motion.p
                        className="mt-4 text-white/80 font-medium"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Analyse en cours
                        <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                        >
                            ...
                        </motion.span>
                    </motion.p>
                    <motion.p
                        className="mt-1 text-white/50 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Détection des caractéristiques de la prune
                    </motion.p>
                </div>
            )}

            {!isAnalyzing && showHeatmap && (
                <div className="mt-4 flex justify-center">
                    <Button
                        variant="outline"
                        onClick={() => {}}
                        icon={showHeatmap ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        size="sm"
                    >
                        {showHeatmap ? "Masquer l'explication" : "Voir l'explication"}
                    </Button>
                </div>
            )}
        </motion.div>
    )
}

export default ImagePreview

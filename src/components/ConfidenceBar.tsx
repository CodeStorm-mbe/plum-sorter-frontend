"use client"

import type React from "react"
import { motion } from "framer-motion"

interface ConfidenceBarProps {
    value: number
    className?: string
    showLabels?: boolean
    animated?: boolean
}

const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ value, className = "", showLabels = true, animated = true }) => {
    // Déterminer la couleur en fonction de la valeur de confiance
    const getColorClass = () => {
        if (value >= 90) return "bg-plum-good"
        if (value >= 80) return "bg-accent-primary"
        if (value >= 70) return "bg-plum-spotted"
        return "bg-plum-rotten"
    }

    return (
        <div className={`w-full ${className}`}>
            <div className="flex mb-2 items-center justify-between">
                <motion.span
                    className="text-xl font-semibold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent"
                    initial={animated ? { opacity: 0, y: 5 } : undefined}
                    animate={animated ? { opacity: 1, y: 0 } : undefined}
                    transition={{ duration: 0.5 }}
                >
                    {value}%
                </motion.span>
            </div>
            <div className="overflow-hidden h-2 mb-2 text-xs flex rounded-full bg-background-light relative">
                <motion.div
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getColorClass()}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />

                {/* Animated glow effect */}
                <motion.div
                    className="absolute top-0 bottom-0 w-10 bg-white/30 blur-sm"
                    initial={{ left: "-10%" }}
                    animate={{ left: "110%" }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                />
            </div>

            {showLabels && (
                <div className="flex justify-between text-xs text-white/60">
                    <motion.span
                        initial={animated ? { opacity: 0 } : undefined}
                        animate={animated ? { opacity: 1 } : undefined}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        0%
                    </motion.span>
                    <motion.span
                        initial={animated ? { opacity: 0 } : undefined}
                        animate={animated ? { opacity: 1 } : undefined}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        50%
                    </motion.span>
                    <motion.span
                        initial={animated ? { opacity: 0 } : undefined}
                        animate={animated ? { opacity: 1 } : undefined}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        100%
                    </motion.span>
                </div>
            )}
        </div>
    )
}

export default ConfidenceBar

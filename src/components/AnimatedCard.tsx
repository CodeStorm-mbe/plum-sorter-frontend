"use client"

import type React from "react"
import { motion } from "framer-motion"

interface AnimatedCardProps {
    children: React.ReactNode
    delay?: number
    className?: string
    hoverEffect?: boolean
    glowEffect?: boolean
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
                                                       children,
                                                       delay = 0,
                                                       className = "",
                                                       hoverEffect = true,
                                                       glowEffect = false,
                                                   }) => {
    return (
        <motion.div
            className={`card relative ${className} ${glowEffect ? "overflow-visible" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.5,
                delay: delay,
                ease: [0.25, 0.1, 0.25, 1.0],
            }}
            whileHover={
                hoverEffect
                    ? {
                        y: -5,
                        boxShadow: "0 10px 30px -10px rgba(0, 229, 255, 0.2)",
                    }
                    : undefined
            }
        >
            {/* Cyber grid background */}
            <div className="absolute inset-0 cyber-grid opacity-10" />

            {/* Top border glow */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-primary/50 to-transparent" />

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent-primary/50" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-accent-primary/50" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-accent-primary/50" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-accent-primary/50" />

            {/* Glow effect */}
            {glowEffect && (
                <motion.div
                    className="absolute -inset-0.5 rounded-lg opacity-50 blur-sm z-[-1]"
                    animate={{
                        background: [
                            "linear-gradient(90deg, rgba(0,229,255,0.3), rgba(123,47,247,0.3))",
                            "linear-gradient(180deg, rgba(0,229,255,0.3), rgba(123,47,247,0.3))",
                            "linear-gradient(270deg, rgba(0,229,255,0.3), rgba(123,47,247,0.3))",
                            "linear-gradient(0deg, rgba(0,229,255,0.3), rgba(123,47,247,0.3))",
                            "linear-gradient(90deg, rgba(0,229,255,0.3), rgba(123,47,247,0.3))",
                        ],
                    }}
                    transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
            )}

            <div className="relative z-10">{children}</div>
        </motion.div>
    )
}

export default AnimatedCard

"use client"

import type React from "react"
import { motion } from "framer-motion"

// Définition des animations de page
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
}

export const pageTransition = {
  type: "tween",
  ease: [0.25, 0.1, 0.25, 1.0],
  duration: 0.5,
}

// Composant de transition de page
interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = "" }) => {
  return (
      <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className={`relative ${className}`}
      >
        {/* Background elements */}
        <div className="fixed inset-0 animated-gradient -z-10" />
        <div className="fixed inset-0 cyber-grid -z-10" />
        <div className="fixed inset-0 cyber-dots -z-10" />

        {children}
      </motion.div>
  )
}

export default PageTransition

"use client"

import type React from "react"
import { motion } from "framer-motion"

interface CategoryBadgeProps {
  category: string
  className?: string
  withAnimation?: boolean
  size?: "sm" | "md" | "lg"
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({
                                                       category,
                                                       className = "",
                                                       withAnimation = true,
                                                       size = "md",
                                                     }) => {
  // Fonction pour obtenir la couleur de la catégorie
  const getCategoryColor = (category: string) => {
    const categoryMap: Record<string, string> = {
      "bonne qualité": "bg-plum-good",
      "non mûre": "bg-plum-unripe",
      tachetée: "bg-plum-spotted",
      fissurée: "bg-plum-cracked",
      meurtrie: "bg-plum-bruised",
      pourrie: "bg-plum-rotten",
      "Bonne qualité": "bg-plum-good",
      "Non mûre": "bg-plum-unripe",
      Tachetée: "bg-plum-spotted",
      Fissurée: "bg-plum-cracked",
      Meurtrie: "bg-plum-bruised",
      Pourrie: "bg-plum-rotten",
    }

    return categoryMap[category] || "bg-accent-primary"
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  }

  return (
      <motion.span
          className={`${sizeClasses[size]} rounded-full font-medium ${getCategoryColor(category)} ${className}`}
          initial={withAnimation ? { scale: 0.9, opacity: 0 } : undefined}
          animate={withAnimation ? { scale: 1, opacity: 1 } : undefined}
          transition={{ duration: 0.3 }}
          whileHover={withAnimation ? { scale: 1.05 } : undefined}
      >
        {withAnimation && (
            <motion.span
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    `0 0 0 rgba(${getCategoryColor(category).replace("bg-", "")}, 0.4)`,
                    `0 0 8px rgba(${getCategoryColor(category).replace("bg-", "")}, 0.6)`,
                    `0 0 0 rgba(${getCategoryColor(category).replace("bg-", "")}, 0.4)`,
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
        )}
        {category}
      </motion.span>
  )
}

export default CategoryBadge

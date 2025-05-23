"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

interface ButtonProps {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "danger";
    onClick?: (e?: any) => void;
    className?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    size?: "sm" | "md" | "lg" | "icon";
    withGlow?: boolean;
    type?: "button" | "submit" | "reset";
    href?: string; // Ajout de la propriété href pour les liens
    title?: string; // Ajout de la propriété title pour les tooltips
}

const Button: React.FC<ButtonProps> = ({
                                         children,
                                         variant = "primary",
                                         onClick,
                                         className = "",
                                         icon,
                                         disabled = false,
                                         size = "md",
                                         withGlow = false,
                                         href,
                                         type = "button"
                                       }) => {
  const baseClasses =
      "font-medium rounded-md transition-all duration-300 flex items-center justify-center relative overflow-hidden"

  const sizeClasses = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-6",
    lg: "py-3 px-8 text-lg",
    icon: "p-2 w-10 h-10"
  }

  const variantClasses = {
    primary: "bg-accent-primary hover:bg-opacity-90 text-white",
    secondary: "bg-accent-secondary hover:bg-opacity-90 text-white",
    outline: "bg-transparent border border-accent-primary text-accent-primary hover:bg-accent-primary/10",
    ghost: "bg-transparent text-white hover:bg-white/10",
    link: "bg-transparent text-accent-primary hover:underline p-0",
    danger: "bg-red-600 hover:bg-red-700 text-white"
  }

  const glowClass = withGlow ? "glow" : ""
  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${glowClass} ${className}`

  // Si href est fourni, rendre un lien au lieu d'un bouton
  if (href) {
    return (
      <Link to={href}>
        <motion.button
            className={buttonClasses}
            disabled={disabled}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 1 }}
            type={type}
        >
          {variant === "primary" && (
              <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary opacity-0"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
              />
          )}

          {variant === "secondary" && (
              <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-accent-secondary to-accent-tertiary opacity-0"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
              />
          )}

          {icon && <span className="mr-2 relative z-10">{icon}</span>}
          <span className="relative z-10">{children}</span>

          {withGlow && (
              <motion.span
                  className="absolute inset-0 rounded-md"
                  animate={{
                    boxShadow: [
                      "0 0 5px rgba(var(--accent-primary-rgb), 0.5), 0 0 10px rgba(var(--accent-primary-rgb), 0.3)",
                      "0 0 10px rgba(var(--accent-primary-rgb), 0.7), 0 0 20px rgba(var(--accent-primary-rgb), 0.5)",
                      "0 0 5px rgba(var(--accent-primary-rgb), 0.5), 0 0 10px rgba(var(--accent-primary-rgb), 0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
          )}
        </motion.button>
      </Link>
    )
  }

  // Sinon, rendre un bouton normal
  return (
      <motion.button
          className={buttonClasses}
          onClick={onClick}
          disabled={disabled}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 1 }}
          type={type}
      >
        {variant === "primary" && (
            <motion.span
                className="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary opacity-0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            />
        )}

        {variant === "secondary" && (
            <motion.span
                className="absolute inset-0 bg-gradient-to-r from-accent-secondary to-accent-tertiary opacity-0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            />
        )}

        {icon && <span className="mr-2 relative z-10">{icon}</span>}
        <span className="relative z-10">{children}</span>

        {withGlow && (
            <motion.span
                className="absolute inset-0 rounded-md"
                animate={{
                  boxShadow: [
                    "0 0 5px rgba(var(--accent-primary-rgb), 0.5), 0 0 10px rgba(var(--accent-primary-rgb), 0.3)",
                    "0 0 10px rgba(var(--accent-primary-rgb), 0.7), 0 0 20px rgba(var(--accent-primary-rgb), 0.5)",
                    "0 0 5px rgba(var(--accent-primary-rgb), 0.5), 0 0 10px rgba(var(--accent-primary-rgb), 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
        )}
      </motion.button>
  )
}

export default Button
export type { ButtonProps }

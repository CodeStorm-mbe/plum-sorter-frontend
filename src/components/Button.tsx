import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '',
  icon,
  disabled = false
}) => {
  const baseClasses = "font-semibold py-2 px-6 rounded-md transition-all duration-300 shadow-lg flex items-center justify-center";
  
  const variantClasses = {
    primary: "bg-accent-emerald hover:bg-opacity-90 text-white",
    secondary: "bg-accent-gold hover:bg-opacity-90 text-background-DEFAULT"
  };
  
  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0.9 }}
      animate={{ opacity: 1 }}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;

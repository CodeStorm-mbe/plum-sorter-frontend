import React from 'react';
import { motion } from 'framer-motion';
import { useRole } from '../contexts/RoleContext';
import Button from './Button';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

interface CardProps {
  className?: string;
  children: React.ReactNode;
  animate?: boolean;
  delay?: number;
  onClick?: () => void;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  className = '',
  children,
  animate = true,
  delay = 0,
  onClick,
  hover = true
}) => {
  const baseClasses = "bg-background-light/30 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden";
  const hoverClasses = hover ? "hover:border-white/20 hover:shadow-lg transition-all duration-300" : "";
  const clickClasses = onClick ? "cursor-pointer" : "";
  
  if (animate) {
    return (
      <motion.div
        className={`${baseClasses} ${hoverClasses} ${clickClasses} ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        whileHover={hover ? { y: -5 } : {}}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${clickClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions }) => {
  return (
    <motion.div
      className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-3xl md:text-4xl font-title font-bold mb-2 bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
          {title}
        </h1>
        {description && (
          <p className="text-white/60 max-w-3xl">
            {description}
          </p>
        )}
      </div>
      
      {actions && (
        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          {actions}
        </div>
      )}
    </motion.div>
  );
};

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`container mx-auto pt-28 pb-16 px-4 md:px-8 ${className}`}>
      {children}
    </div>
  );
};

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

interface SectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const Section: React.FC<SectionProps> = ({ 
  title, 
  description, 
  children, 
  className = '',
  delay = 0
}) => {
  return (
    <motion.div
      className={`mb-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {title && (
        <h2 className="text-2xl font-title font-semibold mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          {title}
        </h2>
      )}
      {description && (
        <p className="text-white/60 mb-4">
          {description}
        </p>
      )}
      {children}
    </motion.div>
  );
};

interface GridProps {
  children: React.ReactNode;
  cols?: number;
  gap?: number;
  className?: string;
}

const Grid: React.FC<GridProps> = ({ 
  children, 
  cols = 3, 
  gap = 6,
  className = '' 
}) => {
  const getColsClass = () => {
    switch (cols) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };
  
  const getGapClass = () => {
    switch (gap) {
      case 2: return 'gap-2';
      case 4: return 'gap-4';
      case 6: return 'gap-6';
      case 8: return 'gap-8';
      default: return 'gap-6';
    }
  };
  
  return (
    <div className={`grid ${getColsClass()} ${getGapClass()} ${className}`}>
      {children}
    </div>
  );
};

export {
  Button,
  Card,
  PageHeader,
  PageContainer,
  PageTransition,
  Section,
  Grid
};

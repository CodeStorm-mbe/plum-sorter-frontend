import React from 'react';
import { motion } from 'framer-motion';

interface ConfidenceBarProps {
  value: number;
  className?: string;
}

const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ value, className = '' }) => {
  // Déterminer la couleur en fonction de la valeur de confiance
  const getColorClass = () => {
    if (value >= 90) return 'bg-plum-good';
    if (value >= 80) return 'bg-accent-gold';
    if (value >= 70) return 'bg-plum-spotted';
    return 'bg-plum-rotten';
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex mb-2 items-center justify-between">
        <span className="text-xl font-semibold text-accent-gold">
          {value}%
        </span>
      </div>
      <div className="overflow-hidden h-2 mb-2 text-xs flex rounded-full bg-background-DEFAULT">
        <motion.div 
          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getColorClass()}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between text-xs text-white/60">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default ConfidenceBar;

import React from 'react';

interface HeatmapOverlayProps {
  visible: boolean;
  className?: string;
}

const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({ visible, className = '' }) => {
  if (!visible) return null;
  
  return (
    <div 
      className={`absolute inset-0 bg-gradient-radial from-red-500/60 via-yellow-500/40 to-transparent mix-blend-overlay ${className}`}
      style={{
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
};

export default HeatmapOverlay;

import React from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import { useTheme } from '../contexts/ThemeContext';

// Créer un thème Mantine qui s'adapte au thème global
const createMantineTheme = (isDark: boolean) => {
  return createTheme({
    // Utiliser la propriété colorScheme de manière compatible avec Mantine
    primaryColor: 'blue',
    // Autres personnalisations du thème Mantine si nécessaire
    colors: {
      // Définir des couleurs personnalisées si nécessaire
    },
    components: {
      // Personnaliser les composants si nécessaire
    },
  });
};

// Wrapper pour intégrer le thème avec Mantine
export function MantineThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  
  // Déterminer si le thème est sombre
  const isDark = 
    theme === 'dark' || 
    (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Créer le thème Mantine
  const mantineTheme = createMantineTheme(isDark);
  
  return (
    <MantineProvider theme={mantineTheme} forceColorScheme={isDark ? 'dark' : 'light'}>
      {children}
    </MantineProvider>
  );
}

export default MantineThemeProvider;

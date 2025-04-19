import React from 'react';
import { MantineProvider, createTheme } from '@mantine/core';

// Import des styles Mantine
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/charts/styles.css';

interface MantineThemeProviderProps {
  children: React.ReactNode;
}

export function MantineThemeProvider({ children }: MantineThemeProviderProps) {
  // Créer un thème Mantine personnalisé
  const theme = createTheme({
    primaryColor: 'plum',
    colors: {
      plum: [
        '#f9f0ff',
        '#efd9ff',
        '#ddb3ff',
        '#ca8cff',
        '#b866ff',
        '#aa4dff',
        '#a23dff',
        '#8f2ce0',
        '#7e28c9',
        '#6c22b0'
      ],
    },
    fontFamily: 'Inter, sans-serif',
    headings: {
      fontFamily: 'Poppins, sans-serif',
    },
  });

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      {children}
    </MantineProvider>
  );
}

export default MantineThemeProvider;

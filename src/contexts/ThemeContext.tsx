import { createContext, useContext, useState, ReactNode } from 'react';
import { MantineColorScheme, useLocalStorage } from '@mantine/hooks';

interface ThemeContextType {
  colorScheme: MantineColorScheme;
  toggleColorScheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [colorScheme, setColorScheme] = useLocalStorage<MantineColorScheme>({
    key: 'plum-color-scheme',
    defaultValue: 'light',
  });

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme doit être utilisé à l\'intérieur d\'un ThemeProvider');
  }
  return context;
};

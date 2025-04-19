import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import { MantineThemeProvider } from './components/MantineThemeProvider'
import { RoleProvider } from './contexts/RoleContext.tsx'

// Créer une instance de QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RoleProvider>
      <ThemeProvider>
        <MantineThemeProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </MantineThemeProvider>
      </ThemeProvider>
    </RoleProvider>
  </StrictMode>,
)

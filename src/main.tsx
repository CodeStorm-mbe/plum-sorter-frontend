import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
    <ThemeProvider>
      <MantineProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </MantineProvider>
    </ThemeProvider>
  </StrictMode>,
)

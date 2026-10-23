import { PrimeReactProvider } from '@primereact/core'
import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { queryClient } from './api/query-client'
import { primeReactConfig } from './config/primereact'
import { AppRoutes } from './routes/AppRoutes'
import './styles/global.scss'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root not found in index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    <PrimeReactProvider {...primeReactConfig}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </QueryClientProvider>
    </PrimeReactProvider>
  </StrictMode>,
)

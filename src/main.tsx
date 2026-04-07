import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';


// 1. Initialize the Engine
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 1. Stop fetching every time I click the browser tab
      refetchOnWindowFocus: false, 
      
      // 2. Consider data "fresh" for 5 minutes
      // It will only hit the API again after 5 mins or if you manually refresh
      staleTime: 5 * 60 * 1000, 
      
      // 3. Keep old data in cache even if it's "stale"
      gcTime: 10 * 60 * 1000,
    },
  },
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
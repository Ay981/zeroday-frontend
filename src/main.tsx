import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "sileo"; 
import "sileo/styles.css";


// 1. Initialize the Engine (shared instance in src/lib/queryClient)



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      
      <Toaster
        position="top-center"
        theme="dark"
        options={{
          fill: "#171717",
          roundness: 16,
          styles: {
            title: "text-white!",
            description: "text-white/75!",
            badge: "bg-white/10!",
            button: "bg-white/10! hover:bg-white/15!",
            
          },
        }}
      />
      
      
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
/**
 * Vite Configuration
 * 
 * Purpose: Configure Vite bundler for React 19 with development proxy
 * to avoid CORS issues when calling the Flask backend.
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // Development server configuration
  server: {
    port: 5173,
    
    // Proxy API requests to the Flask backend during development
    // This avoids CORS issues - requests to /api/* get forwarded to localhost:5000
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  
  // Build configuration for production
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
})
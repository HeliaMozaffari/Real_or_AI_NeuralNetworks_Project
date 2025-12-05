/**
 * Main Entry Point
 * 
 * Purpose: Initialize React 19, import Bootstrap styles, and render the App.
 * This is where we wire up all the global dependencies.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Bootstrap CSS must be imported before custom styles
import 'bootstrap/dist/css/bootstrap.min.css'

// Custom global styles (loaded after Bootstrap to allow overrides)
import './styles/global.css'

// Main App component
import App from './App.jsx'

// Get the root DOM element
const rootElement = document.getElementById('root')

// Create React root and render the application
createRoot(rootElement).render(
  <StrictMode>
    {/* BrowserRouter enables client-side routing throughout the app */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
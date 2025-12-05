/**
 * App Component
 * 
 * Purpose: Main application component that sets up routing and layout.
 * Contains the navigation and routes to all main views.
 */

/**
 * App Component (Refined for Layout and Styling)
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';

// Layout Components
import LayoutNavbar from './components/LayoutNavBar';

// Route Views
import ClassifyView from './routes/ClassifyView';
import GenAIView from './routes/GenAIView';
import MetricsView from './routes/MetricsView';
import AboutView from './routes/AboutView';

function App() {
  return (
    // Use flex column layout to ensure the footer is always at the bottom
    <div className="app d-flex flex-column" style={{ minHeight: '100vh' }}> 
      
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Navigation Bar */}
      <LayoutNavbar />

      {/* Main Content Area - Expands to fill available space */}
      <main id="main-content" className="flex-grow-1">
        <Container className="py-5"> {/* Increased padding for better vertical spacing */}
          <Routes>
            <Route path="/" element={<Navigate to="/classify" replace />} />
            <Route path="/classify" element={<ClassifyView />} />
            <Route path="/genai" element={<GenAIView />} />
            <Route path="/metrics" element={<MetricsView />} />
            <Route path="/about" element={<AboutView />} />
            <Route path="*" element={<Navigate to="/classify" replace />} />
          </Routes>
        </Container>
      </main>

      {/* Footer - Consistent styling */}
      <footer className="text-center py-3" style={{ borderTop: '1px solid var(--color-bg-tertiary)' }}>
        <Container>
          <p className="mb-0" style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
            COMP-258 Neural Networks Project • Centennial College • 2024
          </p>
        </Container>
      </footer>
    </div>
  );
}

export default App;
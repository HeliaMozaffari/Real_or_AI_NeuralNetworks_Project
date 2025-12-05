/**
 * LayoutNavbar Component
 * 
 * Purpose: Main navigation bar for the application.
 * Provides links to all main views with active state highlighting.
 * Uses react-bootstrap Navbar with responsive collapse for mobile.
 */

import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function LayoutNavbar() {
  return (
    <Navbar expand="md" sticky="top" className="navbar">
      <Container>
        {/* Brand / Logo */}
        <Navbar.Brand as={NavLink} to="/">
          {/* Simple icon using Unicode character */}
          <span role="img" aria-hidden="true" style={{ fontSize: '1.5rem' }}>
            🔍
          </span>
          <span>Real or AI?</span>
        </Navbar.Brand>

        {/* Mobile Toggle Button */}
        <Navbar.Toggle 
          aria-controls="main-navbar" 
          aria-label="Toggle navigation menu"
        />

        {/* Navigation Links */}
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            {/* Classify - Main feature */}
            <Nav.Link as={NavLink} to="/classify">
              Classify Image
            </Nav.Link>

            {/* GenAI Assistant */}
            <Nav.Link as={NavLink} to="/genai">
              AI Assistant
            </Nav.Link>

            {/* Metrics Dashboard */}
            <Nav.Link as={NavLink} to="/metrics">
              Metrics
            </Nav.Link>

            {/* About / Model Card */}
            <Nav.Link as={NavLink} to="/about">
              About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default LayoutNavbar;
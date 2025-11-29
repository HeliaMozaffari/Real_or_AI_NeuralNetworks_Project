/**
 * GenAIView
 * 
 * Purpose: View for interacting with the GenAI assistant.
 * Provides a chat interface and summary generation functionality.
 * 
 * Features:
 * - Chat conversation with AI assistant
 * - Summary generation for results
 * - Conversation history management
 */

import { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

// Components
import GenAIChat from '../components/GenAIChat';

// API service
import { sendChatMessage, summarizeText, mocks } from '../services/api';

// Set to true to use mock API during development without backend
const USE_MOCKS = true;

function GenAIView() {
  // Chat state
  const [messages, setMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);

  // Summary state
  const [summaryInput, setSummaryInput] = useState('');
  const [summaryResult, setSummaryResult] = useState(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  /**
   * Handles sending a chat message
   * @param {string} userMessage - The user's message
   */
  const handleSendMessage = async (userMessage) => {
    // Add user message to state immediately
    const newUserMessage = { role: 'user', content: userMessage };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    
    setChatError(null);
    setIsChatLoading(true);

    try {
      // Call API (use mock or real based on flag)
      const apiFunction = USE_MOCKS 
        ? mocks.sendChatMessage 
        : sendChatMessage;
      
      const response = await apiFunction(updatedMessages);
      
      // Add assistant response to messages
      const assistantMessage = { role: 'assistant', content: response.reply };
      setMessages([...updatedMessages, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setChatError(err.message || 'Failed to get response. Please try again.');
    } finally {
      setIsChatLoading(false);
    }
  };

  /**
   * Handles summary generation
   */
  const handleGenerateSummary = async (e) => {
    e.preventDefault();
    
    if (!summaryInput.trim()) return;
    
    setSummaryError(null);
    setSummaryResult(null);
    setIsSummaryLoading(true);

    try {
      // Call API (use mock or real based on flag)
      const apiFunction = USE_MOCKS 
        ? mocks.summarizeText 
        : summarizeText;
      
      const response = await apiFunction(summaryInput, 'image classification results');
      setSummaryResult(response.summary);
    } catch (err) {
      console.error('Summary error:', err);
      setSummaryError(err.message || 'Failed to generate summary. Please try again.');
    } finally {
      setIsSummaryLoading(false);
    }
  };

  /**
   * Clears the chat history
   */
  const handleClearChat = () => {
    setMessages([]);
    setChatError(null);
  };

  // Suggested questions for the chat
  const suggestedQuestions = [
    "How does the model detect AI-generated faces?",
    "What features distinguish real photos from fake ones?",
    "Why might the model have low confidence?",
    "What is the GenImage dataset?",
  ];

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1>AI Assistant</h1>
        <p>Chat with our AI to learn about face classification and get explanations</p>
      </div>

      <Row className="g-4">
        {/* Chat Section */}
        <Col lg={8}>
          <Card className="custom-card" style={{ minHeight: '500px' }}>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h2 className="h5 mb-0">Chat Assistant</h2>
              {messages.length > 0 && (
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={handleClearChat}
                >
                  Clear Chat
                </Button>
              )}
            </Card.Header>
            <Card.Body className="d-flex flex-column">
              {/* Error Alert */}
              {chatError && (
                <Alert 
                  variant="danger" 
                  dismissible 
                  onClose={() => setChatError(null)}
                  className="mb-3"
                >
                  {chatError}
                </Alert>
              )}

              {/* Chat Component */}
              <GenAIChat
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isChatLoading}
              />
            </Card.Body>
          </Card>

          {/* Development mode indicator */}
          {USE_MOCKS && (
            <Alert variant="info" className="mt-3">
              <small>
                <strong>Dev Mode:</strong> Using mock API responses. 
                Set <code>USE_MOCKS = false</code> in GenAIView.jsx to use the real backend.
              </small>
            </Alert>
          )}
        </Col>

        {/* Sidebar */}
        <Col lg={4}>
          {/* Suggested Questions */}
          <Card className="custom-card mb-4">
            <Card.Header>
              <h3 className="h6 mb-0">Suggested Questions</h3>
            </Card.Header>
            <Card.Body className="p-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="link"
                  className="text-start w-100 p-2"
                  style={{ 
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.875rem'
                  }}
                  onClick={() => handleSendMessage(question)}
                  disabled={isChatLoading}
                >
                  → {question}
                </Button>
              ))}
            </Card.Body>
          </Card>

          {/* Summary Generator */}
          <Card className="custom-card">
            <Card.Header>
              <h3 className="h6 mb-0">Generate Summary</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleGenerateSummary}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="summary-input">
                    Enter text to summarize
                  </Form.Label>
                  <Form.Control
                    id="summary-input"
                    as="textarea"
                    rows={3}
                    value={summaryInput}
                    onChange={(e) => setSummaryInput(e.target.value)}
                    placeholder="Paste classification results or any text to summarize..."
                    disabled={isSummaryLoading}
                  />
                </Form.Group>
                
                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={!summaryInput.trim() || isSummaryLoading}
                >
                  {isSummaryLoading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Generating...
                    </>
                  ) : (
                    'Generate Summary'
                  )}
                </Button>
              </Form>

              {/* Summary Error */}
              {summaryError && (
                <Alert variant="danger" className="mt-3 mb-0">
                  {summaryError}
                </Alert>
              )}

              {/* Summary Result */}
              {summaryResult && (
                <div 
                  className="mt-3 p-3"
                  style={{ 
                    background: 'var(--color-bg-primary)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <h4 className="h6 mb-2">Summary</h4>
                  <p 
                    className="mb-0" 
                    style={{ 
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    {summaryResult}
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default GenAIView;
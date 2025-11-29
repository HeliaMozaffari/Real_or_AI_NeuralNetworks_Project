/**
 * GenAIChat Component
 * 
 * Purpose: Chat interface for interacting with the GenAI assistant.
 * Features:
 * - Message history display
 * - Text input for user messages
 * - Loading state while waiting for response
 * - Auto-scroll to latest message
 */
/**
 * GenAIChat Component (Updated for Dark Mode consistency)
 */
// ... (Imports, State, Refs, and Handlers remain the same) ...

/**
 * GenAIChat Component
 * Full code with all definitions and Dark Mode styling.
 */
import { useState, useRef, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function GenAIChat({ 
  onSendMessage, 
  messages = [], 
  isLoading = false,
  placeholder = "Ask about how the model works, why it made a prediction, or about AI-generated faces..."
}) {
  // --- STATE & REFS (These were missing in the previous snippet) ---
  const [inputValue, setInputValue] = useState('');
  
  // Refs for auto-scrolling and focus
  const chatEndRef = useRef(null); // <--- This fixes the ReferenceError
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // --- HANDLERS ---
  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;
    
    onSendMessage(trimmedInput);
    setInputValue('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  // --- RENDER ---
  return (
    <div className="d-flex flex-column" style={{ height: '100%' }}>
      {/* Chat messages container */}
      <div className="chat-container flex-grow-1 mb-3">
        {/* Welcome message if no messages yet */}
        {messages.length === 0 && (
          <div 
            className="text-center p-5 rounded" 
            style={{ color: 'var(--color-text-muted)', background: 'var(--color-bg-tertiary)', margin: '2rem' }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-accent-primary)' }}>
              🤖
            </div>
            <p className="mb-2 fw-bold" style={{ color: 'var(--color-text-primary)' }}>AI Assistant is Ready</p>
            <p className="mb-0" style={{ fontSize: '0.875rem' }}>
              Ask questions about the classifier, its predictions, or deepfakes.
            </p>
          </div>
        )}

        {/* Render messages */}
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`chat-message ${message.role}`}
            role="article"
            aria-label={`${message.role === 'user' ? 'You' : 'AI Assistant'} said`}
          >
            {message.content}
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="chat-message assistant animate-pulse">
            <Spinner
              animation="border"
              size="sm"
              role="status"
              className="me-2"
            />
            Thinking...
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={chatEndRef} />
      </div>

      {/* Input form */}
      <Form onSubmit={handleSubmit}>
        <div className="d-flex gap-2">
          <Form.Control
            ref={inputRef}
            as="textarea"
            rows={2}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            aria-label="Type your message"
            style={{ 
              resize: 'none',
              minHeight: '60px',
              background: 'var(--color-bg-primary)',
              color: 'var(--color-text-primary)',
              borderColor: 'var(--color-bg-tertiary)'
            }}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!inputValue.trim() || isLoading}
            style={{ alignSelf: 'flex-end', minWidth: '60px' }}
            aria-label="Send message"
          >
            {isLoading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                aria-hidden="true"
              />
            ) : (
              <span style={{ fontSize: '1.25rem' }}>➤</span>
            )}
          </Button>
        </div>
        
        {/* Help text */}
        <Form.Text className="d-block mt-1" style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
          Press **Enter** to send, **Shift+Enter** for new line
        </Form.Text>
      </Form>
    </div>
  );
}

export default GenAIChat;
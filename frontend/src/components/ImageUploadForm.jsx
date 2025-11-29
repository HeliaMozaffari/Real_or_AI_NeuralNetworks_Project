/**
 * ImageUploadForm Component
 * 
 * Purpose: Handles image file selection and upload for classification.
 * Features:
 * - Drag and drop support
 * - File type validation
 * - Image preview
 * - Accessible file input with proper labeling
 */

/**
 * ImageUploadForm Component (Updated)
 * - Ensures classes match the provided dark-mode CSS for upload-area, etc.
 */
/**
 * ImageUploadForm Component
 * Full code with all state definitions included.
 */
/**
 * ImageUploadForm Component
 * Full code with all definitions and Dark Mode styling.
 */
import { useState, useRef, useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function ImageUploadForm({ onSubmit, isLoading = false }) {
  // --- STATE (This fixes the ReferenceError: isDragOver is not defined) ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false); // <--- Vital line
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  // --- HANDLERS ---
  const validateFile = (file) => {
    if (!file) return 'No file selected';
    if (!ALLOWED_TYPES.includes(file.type)) return 'Invalid file type.';
    if (file.size > MAX_FILE_SIZE) return 'File too large (Max 10MB).';
    return null;
  };

  const handleFileSelect = useCallback((file) => {
    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) { setError('Please select an image first'); return; }
    onSubmit(selectedFile);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAreaClick = () => {
    if (!selectedFile) fileInputRef.current?.click();
  };

  // Build CSS classes
  const uploadAreaClasses = [
    'upload-area',
    isDragOver ? 'drag-over' : '',
    selectedFile ? 'has-file' : '',
  ].filter(Boolean).join(' ');

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Control
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        onChange={handleInputChange}
        className="d-none"
        id="image-upload-input"
      />

      <div
        className={uploadAreaClasses}
        onClick={handleAreaClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
      >
        {previewUrl ? (
          <div className="text-center w-100 position-relative">
            <Button 
              variant="danger" 
              size="sm"
              style={{ position: 'absolute', top: '-10px', right: '-10px', borderRadius: '50%', width: '30px', height: '30px', padding: 0, zIndex: 10 }} 
              onClick={(e) => { e.stopPropagation(); handleClear(); }} 
              disabled={isLoading}
            >
              &times;
            </Button>
            <img src={previewUrl} alt="Preview" className="image-preview" />
            <p className="mt-3 mb-0 text-truncate" style={{ color: 'var(--color-text-secondary)' }}>
              {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>📷</div>
            <p className="mb-1 fw-bold" style={{ color: 'var(--color-text-primary)' }}>Click to upload or drag and drop</p>
            <p className="mb-0" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>JPEG, PNG, WebP, or GIF (max 10MB)</p>
          </div>
        )}
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <div className="d-flex gap-2 mt-4">
        <Button type="submit" variant="primary" disabled={!selectedFile || isLoading || !!error} className="flex-grow-1" size="lg">
          {isLoading ? <><Spinner as="span" animation="border" size="sm" className="me-2" />Analyzing...</> : 'Classify Image'}
        </Button>
        {selectedFile && <Button type="button" variant="outline-secondary" onClick={handleClear} disabled={isLoading}>Reset</Button>}
      </div>
    </Form>
  );
}

export default ImageUploadForm;
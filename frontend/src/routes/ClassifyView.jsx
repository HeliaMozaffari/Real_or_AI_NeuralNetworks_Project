/**
 * ClassifyView
 * 
 * Purpose: Main view for image classification.
 * Allows users to upload an image and receive a Real/Fake prediction.
 * 
 * Flow:
 * 1. User uploads image via ImageUploadForm
 * 2. Image sent to /api/predict endpoint
 * 3. Result displayed via PredictionResult component
 */

import { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

// Components
import ImageUploadForm from '../components/ImageUploadForm';
import PredictionResult from '../components/PredictionResult';

// API service
import { uploadImageAndPredict, mocks } from '../services/api';

// Set to true to use mock API during development without backend
const USE_MOCKS = true;

function ClassifyView() {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Handles image submission for classification
   * @param {File} imageFile - The uploaded image file
   */
  const handleSubmit = async (imageFile) => {
    // Reset previous state
    setError(null);
    setResult(null);
    setIsLoading(true);
    
    // Create preview URL for the image
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);

    try {
      // Call API (use mock or real based on flag)
      const apiFunction = USE_MOCKS 
        ? mocks.uploadImageAndPredict 
        : uploadImageAndPredict;
      
      const response = await apiFunction(imageFile);
      
      // Set the result
      setResult(response);
    } catch (err) {
      // Handle error
      console.error('Classification error:', err);
      setError(err.message || 'Failed to classify image. Please try again.');
      
      // Clean up preview URL on error
      if (url) {
        URL.revokeObjectURL(url);
        setPreviewUrl(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resets the view for a new classification
   */
  const handleReset = () => {
    setResult(null);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1>Classify Image</h1>
        <p>Upload a face image to determine if it's real or AI-generated</p>
      </div>

      <Row className="g-4">
        {/* Upload Column */}
        <Col lg={result ? 6 : 8} className="mx-auto">
          <div className="custom-card p-4">
            <h2 className="h5 mb-3">Upload Image</h2>
            <ImageUploadForm 
              onSubmit={handleSubmit} 
              isLoading={isLoading}
            />
            
            {/* Development mode indicator */}
            {USE_MOCKS && (
              <Alert variant="info" className="mt-3 mb-0">
                <small>
                  <strong>Dev Mode:</strong> Using mock API responses. 
                  Set <code>USE_MOCKS = false</code> in ClassifyView.jsx to use the real backend.
                </small>
              </Alert>
            )}
          </div>
        </Col>

        {/* Results Column - only shown when there's a result */}
        {(result || error) && (
          <Col lg={6}>
            {/* Error Alert */}
            {error && (
              <Alert 
                variant="danger" 
                dismissible 
                onClose={() => setError(null)}
                className="animate-fade-in"
              >
                <Alert.Heading>Classification Failed</Alert.Heading>
                <p className="mb-0">{error}</p>
              </Alert>
            )}

            {/* Success Result */}
            {result && (
              <div className="animate-fade-in">
                <PredictionResult 
                  result={result} 
                  imageUrl={previewUrl}
                />
                
                {/* Try Another Button */}
                <button
                  onClick={handleReset}
                  className="btn btn-outline-secondary w-100 mt-3"
                >
                  Classify Another Image
                </button>
              </div>
            )}
          </Col>
        )}
      </Row>

      {/* Usage Tips */}
      <div 
        className="mt-5 p-4 custom-card"
        style={{ background: 'var(--color-bg-secondary)' }}
      >
        <h3 className="h5 mb-3">Tips for Best Results</h3>
        <Row className="g-3">
          <Col md={4}>
            <div className="d-flex gap-3">
              <div style={{ fontSize: '1.5rem' }}>📸</div>
              <div>
                <h4 className="h6 mb-1">Image Quality</h4>
                <p className="mb-0" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  Use clear, well-lit images. Blurry or low-resolution photos may reduce accuracy.
                </p>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="d-flex gap-3">
              <div style={{ fontSize: '1.5rem' }}>👤</div>
              <div>
                <h4 className="h6 mb-1">Face Visibility</h4>
                <p className="mb-0" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  Ensure the face is clearly visible and takes up a significant portion of the image.
                </p>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="d-flex gap-3">
              <div style={{ fontSize: '1.5rem' }}>⚠️</div>
              <div>
                <h4 className="h6 mb-1">Limitations</h4>
                <p className="mb-0" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  This tool is for educational purposes. Results should not be used as definitive proof.
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ClassifyView;
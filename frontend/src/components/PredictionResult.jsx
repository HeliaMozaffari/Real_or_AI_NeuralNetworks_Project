/**
 * PredictionResult Component
 * 
 * Purpose: Displays the classification result from the model.
 * Shows:
 * - Prediction label (Real or Fake)
 * - Confidence score with visual bar
 * - Optional explanation text
 */

import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

function PredictionResult({ result, imageUrl }) {
  // Destructure result data
  const { prediction, confidence, details } = result;
  
  // Determine if the prediction is "Real" (normalize different possible values)
  const isReal = prediction?.toLowerCase() === 'real';
  
  // Convert confidence to percentage (handle both 0-1 and 0-100 formats)
  const confidencePercent = confidence > 1 ? confidence : confidence * 100;
  const confidenceDisplay = confidencePercent.toFixed(1);
  
  // Determine confidence level for styling
  const getConfidenceLevel = (percent) => {
    if (percent >= 85) return 'high';
    if (percent >= 65) return 'medium';
    return 'low';
  };
  
  const confidenceLevel = getConfidenceLevel(confidencePercent);

  return (
    <Card className="custom-card animate-fade-in">
      <Card.Body className="p-4">
        {/* Header with result */}
        <div className="text-center mb-4">
          <h3 className="mb-3">Classification Result</h3>
          
          {/* Main prediction badge */}
          <div className={`result-badge ${isReal ? 'real' : 'fake'}`}>
            <span 
              role="img" 
              aria-hidden="true"
              style={{ fontSize: '1.25rem' }}
            >
              {isReal ? '✓' : '⚠'}
            </span>
            <span>{isReal ? 'Real Image' : 'AI-Generated'}</span>
          </div>
        </div>

        {/* Confidence score section */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="form-label mb-0">Confidence</span>
            <span 
              className="mono" 
              style={{ 
                color: 'var(--color-accent-primary)',
                fontWeight: 600,
                fontSize: '1.125rem'
              }}
            >
              {confidenceDisplay}%
            </span>
          </div>
          
          {/* Confidence bar visualization */}
          <div className="confidence-bar">
            <div 
              className={`confidence-bar-fill ${confidenceLevel}`}
              style={{ width: `${confidencePercent}%` }}
              role="progressbar"
              aria-valuenow={confidencePercent}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label={`Confidence: ${confidenceDisplay}%`}
            />
          </div>
          
          {/* Confidence level label */}
          <p 
            className="text-end mt-1 mb-0" 
            style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}
          >
            {confidenceLevel === 'high' && 'High confidence'}
            {confidenceLevel === 'medium' && 'Moderate confidence'}
            {confidenceLevel === 'low' && 'Low confidence'}
          </p>
        </div>

        {/* Optional explanation/details */}
        {details && (
          <div 
            className="p-3" 
            style={{ 
              background: 'var(--color-bg-primary)', 
              borderRadius: 'var(--radius-sm)' 
            }}
          >
            <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Analysis Details
            </h4>
            <p style={{ 
              fontSize: '0.875rem', 
              color: 'var(--color-text-secondary)',
              marginBottom: 0,
              lineHeight: 1.6
            }}>
              {details}
            </p>
          </div>
        )}

        {/* Image preview if provided */}
        {imageUrl && (
          <div className="mt-4 text-center">
            <img
              src={imageUrl}
              alt={`Analyzed image classified as ${prediction}`}
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                borderRadius: 'var(--radius-sm)',
                border: `2px solid ${isReal ? 'var(--color-accent-success)' : 'var(--color-accent-danger)'}`,
              }}
            />
          </div>
        )}

        {/* Interpretation guide */}
        <div 
          className="mt-4 p-3" 
          style={{ 
            background: 'rgba(6, 182, 212, 0.1)', 
            borderRadius: 'var(--radius-sm)',
            borderLeft: '3px solid var(--color-accent-primary)'
          }}
        >
          <p style={{ 
            fontSize: '0.8125rem', 
            color: 'var(--color-text-secondary)',
            marginBottom: 0
          }}>
            <strong>Note:</strong> This classification is based on patterns learned from the GenImage dataset. 
            {confidencePercent < 70 && ' Low confidence scores suggest the image may have ambiguous features.'}
            {confidencePercent >= 70 && confidencePercent < 85 && ' Consider additional verification for important decisions.'}
            {confidencePercent >= 85 && ' High confidence indicates strong distinguishing features were detected.'}
          </p>
        </div>
      </Card.Body>
    </Card>
  );
}

export default PredictionResult;
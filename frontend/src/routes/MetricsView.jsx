/**
 * MetricsView
 * 
 * Purpose: Displays model training metrics and performance data.
 * Fetches data from /api/metrics and visualizes:
 * - Accuracy over epochs
 * - Loss over epochs
 * - Confusion matrix
 */

import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

// Components
import MetricsCharts from '../components/MetricsCharts';
import ConfusionMatrix from '../components/ConfusionMatrix';

// API service
import { getMetrics, mocks } from '../services/api';

// Set to true to use mock API during development without backend
const USE_MOCKS = true;

function MetricsView() {
  // State management
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches metrics from the API
   */
  const fetchMetrics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call API (use mock or real based on flag)
      const apiFunction = USE_MOCKS ? mocks.getMetrics : getMetrics;
      const data = await apiFunction();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
      setError(err.message || 'Failed to load metrics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch metrics on component mount
  useEffect(() => {
    fetchMetrics();
  }, []);

  // Calculate summary statistics from metrics
  const getSummaryStats = () => {
    if (!metrics) return null;

    const lastEpoch = metrics.epochs.length - 1;
    return {
      finalTrainAccuracy: (metrics.train_accuracy[lastEpoch] * 100).toFixed(1),
      finalValAccuracy: (metrics.val_accuracy[lastEpoch] * 100).toFixed(1),
      finalTrainLoss: metrics.train_loss[lastEpoch].toFixed(4),
      finalValLoss: metrics.val_loss[lastEpoch].toFixed(4),
      totalEpochs: metrics.epochs.length,
    };
  };

  const stats = getSummaryStats();

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1>Model Metrics</h1>
        <p>Training performance and evaluation metrics for the face classifier</p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" className="mb-3" />
          <p style={{ color: 'var(--color-text-muted)' }}>Loading metrics...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="danger">
          <Alert.Heading>Failed to Load Metrics</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchMetrics}>
            Try Again
          </Button>
        </Alert>
      )}

      {/* Metrics Content */}
      {metrics && !isLoading && (
        <>
          {/* Summary Stats Cards */}
          <Row className="g-3 mb-4">
            <Col xs={6} md={3}>
              <Card className="custom-card h-100">
                <Card.Body className="text-center">
                  <div className="metric-value">{stats.finalValAccuracy}%</div>
                  <div className="metric-label">Validation Accuracy</div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={3}>
              <Card className="custom-card h-100">
                <Card.Body className="text-center">
                  <div className="metric-value">{stats.finalTrainAccuracy}%</div>
                  <div className="metric-label">Training Accuracy</div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={3}>
              <Card className="custom-card h-100">
                <Card.Body className="text-center">
                  <div className="metric-value">{stats.finalValLoss}</div>
                  <div className="metric-label">Validation Loss</div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={3}>
              <Card className="custom-card h-100">
                <Card.Body className="text-center">
                  <div className="metric-value">{stats.totalEpochs}</div>
                  <div className="metric-label">Total Epochs</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Charts */}
          <MetricsCharts metrics={metrics} />

          {/* Confusion Matrix */}
          <Row className="mt-4">
            <Col lg={8} className="mx-auto">
              <Card className="custom-card">
                <Card.Header>
                  <h3 className="h5 mb-0">Confusion Matrix</h3>
                </Card.Header>
                <Card.Body>
                  <ConfusionMatrix matrix={metrics.confusion_matrix} />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Development mode indicator */}
          {USE_MOCKS && (
            <Alert variant="info" className="mt-4">
              <small>
                <strong>Dev Mode:</strong> Displaying mock metrics data. 
                Set <code>USE_MOCKS = false</code> in MetricsView.jsx to fetch from the real backend.
              </small>
            </Alert>
          )}

          {/* Interpretation Guide */}
          <Card className="custom-card mt-4">
            <Card.Header>
              <h3 className="h5 mb-0">Understanding the Metrics</h3>
            </Card.Header>
            <Card.Body>
              <Row className="g-4">
                <Col md={6}>
                  <h4 className="h6" style={{ color: 'var(--color-accent-primary)' }}>
                    Accuracy & Loss Curves
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    The accuracy curve shows how well the model classifies images correctly over training. 
                    Loss measures prediction error - lower is better. Watch for the gap between training 
                    and validation curves: a large gap may indicate overfitting.
                  </p>
                </Col>
                <Col md={6}>
                  <h4 className="h6" style={{ color: 'var(--color-accent-primary)' }}>
                    Confusion Matrix Metrics
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    <strong>Precision</strong> measures how many predicted fakes are actually fake. 
                    <strong> Recall</strong> measures how many actual fakes were caught. 
                    <strong> F1 Score</strong> balances both metrics. High values indicate good performance.
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
}

export default MetricsView;
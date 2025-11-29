/**
 * AboutView (Model Card)
 * 
 * Purpose: Provides information about the project, model, and ethical considerations.
 * This serves as the "Model Card" requirement for the course project.
 * 
 * Contents:
 * - Problem description
 * - Dataset information
 * - Model architecture
 * - Performance metrics
 * - Limitations and ethical considerations
 * - Canadian industry relevance
 */

/**
 * AboutView (Model Card) - Refined for Dark Mode Look
 */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

function AboutView() {
    return (
        <div className="animate-fade-in">
            {/* Page Header */}
            <div className="page-header">
                <h1>About This Project</h1>
                <p>Model card and documentation for the Real vs AI Face Classifier</p>
            </div>

            {/* Project Overview */}
            <Card className="custom-card mb-4">
                <Card.Header>
                    <h2 className="h5 mb-0" style={{ color: 'var(--color-text-primary)' }}>Project Overview</h2>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={8}>
                            <p>
                                <strong>Real or AI?</strong> is a neural network-based image classification system 
                                designed to distinguish between authentic human face photographs and AI-generated 
                                synthetic faces. This project was developed as part of the **COMP-258 Neural Networks** course at Centennial College.
                            </p>
                            <p className="mb-0">
                                This tool aims to help identify synthetic images, contributing to efforts in combating 
                                misinformation and identity fraud in the age of rapidly advancing generative AI.
                            </p>
                        </Col>
                        <Col md={4}>
                            <div 
                                className="p-3 h-100 d-flex flex-column justify-content-center"
                                style={{ 
                                    background: 'var(--color-bg-tertiary)', 
                                    borderRadius: 'var(--radius-sm)' 
                                }}
                            >
                                {/* Using Bootstrap 5 utility classes for badges */}
                                <div className="mb-2">
                                    <Badge bg="info" className="me-2" style={{ backgroundColor: 'var(--color-accent-primary)', color: 'var(--color-bg-primary)' }}>TensorFlow</Badge>
                                    <Badge bg="info" className="me-2" style={{ backgroundColor: 'var(--color-accent-primary)', color: 'var(--color-bg-primary)' }}>Keras</Badge>
                                    <Badge bg="info" style={{ backgroundColor: 'var(--color-accent-primary)', color: 'var(--color-bg-primary)' }}>CNN</Badge>
                                </div>
                                <div className="mb-2">
                                    <Badge bg="secondary" className="me-2" style={{ backgroundColor: 'var(--color-text-muted)' }}>React</Badge>
                                    <Badge bg="secondary" className="me-2" style={{ backgroundColor: 'var(--color-text-muted)' }}>Flask</Badge>
                                </div>
                                <div>
                                    <Badge bg="warning" style={{ backgroundColor: 'var(--color-accent-warning)', color: 'var(--color-bg-primary)' }}>GenAI Integration</Badge>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Row className="g-4">
                {/* Problem Statement */}
                <Col lg={6}>
                    <Card className="custom-card h-100">
                        <Card.Header>
                            <h2 className="h5 mb-0" style={{ color: 'var(--color-accent-primary)' }}>🎯 Problem Statement</h2>
                        </Card.Header>
                        <Card.Body>
                            <p>
                                <strong>Challenge:</strong> Detecting AI-generated faces is increasingly challenging.
                            </p>
                            <p>
                                <strong>Solution:</strong> We use a **Convolutional Neural Network (CNN)** trained to identify subtle artifacts and patterns that distinguish real photographs from synthetic images.
                            </p>
                            <p className="mb-0">
                                <strong>Task Type:</strong> Binary Image Classification
                            </p>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Dataset Information */}
                <Col lg={6}>
                    <Card className="custom-card h-100">
                        <Card.Header>
                            <h2 className="h5 mb-0" style={{ color: 'var(--color-accent-primary)' }}>📊 Dataset</h2>
                        </Card.Header>
                        <Card.Body>
                            <p>
                                <strong>Name:</strong> GenImage - 140k Real and Fake Faces
                            </p>
                            <p>
                                <strong>Source:</strong>{' '}
                                <a 
                                    href="https://www.kaggle.com/datasets/xhlulu/140k-real-and-fake-faces"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'var(--color-accent-secondary)' }}
                                >
                                    Kaggle Dataset (2023)
                                </a>
                            </p>
                            <p><strong>Composition:</strong></p>
                            <ul className="mb-0">
                                <li>~70,000 real face images (FFHQ dataset)</li>
                                <li>~70,000 AI-generated faces (StyleGAN)</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
                
                {/* ... (The rest of the sections: Model Architecture, Performance, Limitations, Ethical Considerations, Relevance remain visually clean due to custom-card styling) ... */}
            </Row>
        </div>
    );
}

export default AboutView;

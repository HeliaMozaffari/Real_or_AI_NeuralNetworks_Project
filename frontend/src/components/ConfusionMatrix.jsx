/**
 * ConfusionMatrix Component
 * 
 * Purpose: Displays a visual confusion matrix for binary classification.
 * Shows True Negatives, False Positives, False Negatives, True Positives
 * in a grid format with color coding.
 * 
 * Matrix Layout:
 *                  Predicted
 *              Real      Fake
 * Actual Real [ TN ]    [ FP ]
 * Actual Fake [ FN ]    [ TP ]
 */

/**
 * ConfusionMatrix Component (Refined)
 * - Uses nested divs for better alignment and application of the custom CSS grid.
 */
function ConfusionMatrix({ matrix }) {
    // ... (Calculations remain the same) ...
    const [[tn, fp], [fn, tp]] = matrix;
    const total = tn + fp + fn + tp;
    
    const formatNumber = (num) => {
        return num.toLocaleString();
    };

    // Recalculate metrics using your logic for display
    const accuracy = ((tn + tp) / total * 100).toFixed(1);
    const precision = (tp / (tp + fp) * 100).toFixed(1);
    const recall = (tp / (tp + fn) * 100).toFixed(1);
    
    // Safety check for F1 score division by zero
    const p = parseFloat(precision);
    const r = parseFloat(recall);
    const f1Score = (p + r > 0) ? (2 * p * r / (p + r)).toFixed(1) : 'N/A';


    return (
        <div>
            {/* Metrics Summary - Using your dark-mode metric-value/label styles */}
            <div className="row g-3 mb-4">
                {/* Accuracy */}
                <div className="col-6 col-md-3">
                    <div className="text-center p-3 custom-card h-100">
                        <div className="metric-value" style={{ color: 'var(--color-accent-primary)' }}>{accuracy}%</div>
                        <div className="metric-label">Accuracy</div>
                    </div>
                </div>
                {/* Precision */}
                <div className="col-6 col-md-3">
                    <div className="text-center p-3 custom-card h-100">
                        <div className="metric-value" style={{ color: 'var(--color-accent-success)' }}>{precision}%</div>
                        <div className="metric-label">Precision</div>
                    </div>
                </div>
                {/* Recall */}
                <div className="col-6 col-md-3">
                    <div className="text-center p-3 custom-card h-100">
                        <div className="metric-value" style={{ color: 'var(--color-accent-success)' }}>{recall}%</div>
                        <div className="metric-label">Recall</div>
                    </div>
                </div>
                {/* F1 Score */}
                <div className="col-6 col-md-3">
                    <div className="text-center p-3 custom-card h-100">
                        <div className="metric-value" style={{ color: 'var(--color-accent-primary)' }}>{f1Score}%</div>
                        <div className="metric-label">F1 Score</div>
                    </div>
                </div>
            </div>
            
            <h3 className="h6 text-center mb-3" style={{ color: 'var(--color-text-primary)' }}>Raw Counts</h3>
            
            {/* Confusion Matrix Grid */}
            <div className="confusion-matrix mb-4">
                {/* Row 1: Predicted Labels */}
                <div className="confusion-cell header"></div>
                <div className="confusion-cell header">Pred. Real</div>
                <div className="confusion-cell header">Pred. Fake</div>
                
                {/* Row 2: Actual Real */}
                <div className="confusion-cell header">Actual Real</div>
                <div 
                    className="confusion-cell tn" 
                    title="True Negatives: Real images correctly classified as Real"
                >
                    {formatNumber(tn)}
                </div>
                <div 
                    className="confusion-cell fp" 
                    title="False Positives: Real images incorrectly classified as Fake"
                >
                    {formatNumber(fp)}
                </div>
                
                {/* Row 3: Actual Fake */}
                <div className="confusion-cell header">Actual Fake</div>
                <div 
                    className="confusion-cell fn" 
                    title="False Negatives: Fake images incorrectly classified as Real"
                >
                    {formatNumber(fn)}
                </div>
                <div 
                    className="confusion-cell tp" 
                    title="True Positives: Fake images correctly classified as Fake"
                >
                    {formatNumber(tp)}
                </div>
            </div>

            {/* Explanation/Legend section */}
            <div 
                className="mt-4 p-3 custom-card" 
                style={{ 
                    background: 'var(--color-bg-primary)', 
                    border: '1px solid var(--color-bg-tertiary)'
                }}
            >
                <p className="mb-2 fw-bold" style={{ color: 'var(--color-text-primary)' }}>
                    Reading the Matrix:
                </p>
                <ul className="mb-0 ps-3" style={{ lineHeight: 1.8, fontSize: '0.875rem' }}>
                    <li><strong style={{ color: 'var(--color-accent-success)' }}>Correct:</strong> TN (Real→Real) and TP (Fake→Fake)</li>
                    <li><strong style={{ color: 'var(--color-accent-danger)' }}>Incorrect:</strong> FP (Real→Fake - Type I Error) and FN (Fake→Real - Type II Error)</li>
                </ul>
            </div>
        </div>
    );
}

export default ConfusionMatrix;
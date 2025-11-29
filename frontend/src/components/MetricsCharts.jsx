/**
 * MetricsCharts Component
 * 
 * Purpose: Displays training metrics using Recharts.
 * Shows:
 * - Accuracy over epochs (train vs validation)
 * - Loss over epochs (train vs validation)
 */

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Custom tooltip styling to match theme
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div 
        style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-bg-tertiary)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <p style={{ 
          margin: 0, 
          marginBottom: '0.5rem',
          color: 'var(--color-text-primary)',
          fontWeight: 600 
        }}>
          Epoch {label}
        </p>
        {payload.map((entry, index) => (
          <p 
            key={index} 
            style={{ 
              margin: 0, 
              color: entry.color,
              fontSize: '0.875rem'
            }}
          >
            {entry.name}: {entry.value.toFixed(4)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function MetricsCharts({ metrics }) {
  // Transform data for Recharts
  // Recharts expects an array of objects with each data point
  const chartData = metrics.epochs.map((epoch, index) => ({
    epoch,
    trainAccuracy: metrics.train_accuracy[index],
    valAccuracy: metrics.val_accuracy[index],
    trainLoss: metrics.train_loss[index],
    valLoss: metrics.val_loss[index],
  }));

  // Chart colors matching our theme
  const colors = {
    trainAccuracy: '#06b6d4', // Cyan - primary
    valAccuracy: '#22d3ee',   // Light cyan
    trainLoss: '#f59e0b',     // Amber
    valLoss: '#fbbf24',       // Light amber
  };

  // Common chart props
  const commonProps = {
    margin: { top: 20, right: 30, left: 20, bottom: 20 },
  };

  // Common axis styling
  const axisStyle = {
    fontSize: 12,
    fill: 'var(--color-text-muted)',
  };

  return (
    <div className="row g-4">
      {/* Accuracy Chart */}
      <div className="col-12 col-lg-6">
        <div className="custom-card p-3">
          <h4 className="mb-3" style={{ fontSize: '1rem' }}>
            Accuracy Over Epochs
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} {...commonProps}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="var(--color-bg-tertiary)" 
              />
              <XAxis 
                dataKey="epoch" 
                tick={axisStyle}
                axisLine={{ stroke: 'var(--color-bg-tertiary)' }}
                tickLine={{ stroke: 'var(--color-bg-tertiary)' }}
                label={{ 
                  value: 'Epoch', 
                  position: 'insideBottom', 
                  offset: -10,
                  style: axisStyle 
                }}
              />
              <YAxis 
                tick={axisStyle}
                axisLine={{ stroke: 'var(--color-bg-tertiary)' }}
                tickLine={{ stroke: 'var(--color-bg-tertiary)' }}
                domain={[0, 1]}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                label={{ 
                  value: 'Accuracy', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: axisStyle 
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '0.75rem' }}
                iconType="line"
              />
              <Line 
                type="monotone" 
                dataKey="trainAccuracy" 
                name="Training" 
                stroke={colors.trainAccuracy}
                strokeWidth={2}
                dot={{ fill: colors.trainAccuracy, strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, stroke: colors.trainAccuracy }}
              />
              <Line 
                type="monotone" 
                dataKey="valAccuracy" 
                name="Validation" 
                stroke={colors.valAccuracy}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: colors.valAccuracy, strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, stroke: colors.valAccuracy }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Loss Chart */}
      <div className="col-12 col-lg-6">
        <div className="custom-card p-3">
          <h4 className="mb-3" style={{ fontSize: '1rem' }}>
            Loss Over Epochs
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} {...commonProps}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="var(--color-bg-tertiary)" 
              />
              <XAxis 
                dataKey="epoch" 
                tick={axisStyle}
                axisLine={{ stroke: 'var(--color-bg-tertiary)' }}
                tickLine={{ stroke: 'var(--color-bg-tertiary)' }}
                label={{ 
                  value: 'Epoch', 
                  position: 'insideBottom', 
                  offset: -10,
                  style: axisStyle 
                }}
              />
              <YAxis 
                tick={axisStyle}
                axisLine={{ stroke: 'var(--color-bg-tertiary)' }}
                tickLine={{ stroke: 'var(--color-bg-tertiary)' }}
                label={{ 
                  value: 'Loss', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: axisStyle 
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '0.75rem' }}
                iconType="line"
              />
              <Line 
                type="monotone" 
                dataKey="trainLoss" 
                name="Training" 
                stroke={colors.trainLoss}
                strokeWidth={2}
                dot={{ fill: colors.trainLoss, strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, stroke: colors.trainLoss }}
              />
              <Line 
                type="monotone" 
                dataKey="valLoss" 
                name="Validation" 
                stroke={colors.valLoss}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: colors.valLoss, strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, stroke: colors.valLoss }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default MetricsCharts;
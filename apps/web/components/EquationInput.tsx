'use client';

interface Props {
  value: string;
  onChange: (val: string) => void;
  onPlot: () => void;
  error: string | null;
}

export default function EquationInput({ value, onChange, onPlot, error }: Props) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onPlot()}
          placeholder="e.g. x^2, sin(x), 2x+1"
          style={{
            flex: 1,
            padding: '10px 14px',
            background: '#1e2433',
            border: '1px solid #2d3748',
            borderRadius: '8px',
            color: '#e2e8f0',
            fontSize: '15px',
            outline: 'none',
          }}
        />
        <button
          onClick={onPlot}
          style={{
            padding: '10px 20px',
            background: '#3b82f6',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '15px',
            fontWeight: 600,
          }}
        >
          Plot
        </button>
      </div>
      {error && (
        <p style={{ color: '#fc8181', fontSize: '13px', marginTop: '6px' }}>{error}</p>
      )}
    </div>
  );
}

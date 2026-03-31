'use client';
import { Equation } from '@mathgraph/core';

interface Props {
  equations: Equation[];
  onRemove: (id: string) => void;
}

export default function EquationTags({ equations, onRemove }: Props) {
  if (equations.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
      {equations.map(eq => (
        <span
          key={eq.id}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            background: eq.color + '22',
            border: `1px solid ${eq.color}55`,
            borderRadius: '20px',
            color: eq.color,
            fontSize: '13px',
          }}
        >
          {eq.expression}
          <button
            onClick={() => onRemove(eq.id)}
            style={{
              background: 'none',
              border: 'none',
              color: eq.color,
              fontSize: '14px',
              lineHeight: 1,
              padding: '0 2px',
              opacity: 0.7,
            }}
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  );
}



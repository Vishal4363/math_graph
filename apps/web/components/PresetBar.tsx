'use client';
import { PRESETS } from '@mathgraph/core';

interface Props {
  onSelect: (expression: string) => void;
}

export default function PresetBar({ onSelect }: Props) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
      {PRESETS.map(preset => (
        <button
          key={preset.expression}
          onClick={() => onSelect(preset.expression)}
          style={{
            padding: '6px 14px',
            background: '#1e2433',
            border: '1px solid #2d3748',
            borderRadius: '8px',
            color: '#a0aec0',
            fontSize: '14px',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            (e.target as HTMLButtonElement).style.background = '#2d3748';
            (e.target as HTMLButtonElement).style.color = '#fff';
          }}
          onMouseLeave={e => {
            (e.target as HTMLButtonElement).style.background = '#1e2433';
            (e.target as HTMLButtonElement).style.color = '#a0aec0';
          }}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}



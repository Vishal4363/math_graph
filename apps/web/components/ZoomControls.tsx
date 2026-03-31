'use client';

interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const btnStyle = {
  width: '36px',
  height: '36px',
  background: '#1e2433',
  border: '1px solid #2d3748',
  borderRadius: '8px',
  color: '#a0aec0',
  fontSize: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default function ZoomControls({ onZoomIn, onZoomOut, onReset }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'absolute', top: '12px', right: '12px' }}>
      <button onClick={onZoomIn} style={btnStyle} title="Zoom in">+</button>
      <button onClick={onZoomOut} style={btnStyle} title="Zoom out">−</button>
      <button onClick={onReset} style={{ ...btnStyle, fontSize: '14px' }} title="Reset view">⌂</button>
    </div>
  );
}




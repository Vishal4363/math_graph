'use client';
import { useEffect, useRef } from 'react';
import { Equation, ViewRange } from '@mathgraph/core';
import { useCanvas } from '../lib/useCanvas';
import ZoomControls from './ZoomControls';

interface Props {
  equations: Equation[];
  view: ViewRange;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export default function GraphCanvas({ equations, view, onZoomIn, onZoomOut, onReset }: Props) {
  const { canvasRef, tooltip, handleMouseMove, handleMouseLeave } = useCanvas(equations, view);

  // Make canvas fill its container
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => ro.disconnect();
  }, [canvasRef]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '480px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e2433' }}
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ display: 'block', width: '100%', height: '100%', cursor: 'crosshair' }}
      />

      {/* Coordinate tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.pixelX + 12,
            top: tooltip.pixelY - 24,
            background: '#1e2433dd',
            border: '1px solid #2d3748',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '12px',
            color: '#a0aec0',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          x: {tooltip.x.toFixed(2)}, y: {tooltip.y.toFixed(2)}
        </div>
      )}

      <ZoomControls onZoomIn={onZoomIn} onZoomOut={onZoomOut} onReset={onReset} />
    </div>
  );
}




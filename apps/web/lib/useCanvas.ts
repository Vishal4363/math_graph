import { useRef, useEffect, useState, useCallback } from 'react';
import { Equation, ViewRange, plotEquation, mathToPixelX, mathToPixelY, pixelToMathX, pixelToMathY, computeGridLines } from '@mathgraph/core';

interface Tooltip {
  x: number;
  y: number;
  pixelX: number;
  pixelY: number;
}

export function useCanvas(equations: Equation[], view: ViewRange) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width  = canvas.width;
    const height = canvas.height;

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#0d1117');
    bg.addColorStop(1, '#0f1420');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    const xLines = computeGridLines(view.xMin, view.xMax, width,  'x');
    const yLines = computeGridLines(view.yMin, view.yMax, height, 'y');

    ctx.strokeStyle = '#1a2035';
    ctx.lineWidth = 1;
    xLines.filter(l => !l.isAxis).forEach(l => {
      ctx.beginPath();
      ctx.moveTo(l.position, 0);
      ctx.lineTo(l.position, height);
      ctx.stroke();
    });
    yLines.filter(l => !l.isAxis).forEach(l => {
      ctx.beginPath();
      ctx.moveTo(0, l.position);
      ctx.lineTo(width, l.position);
      ctx.stroke();
    });

    // Axes
    const axisY = Math.min(Math.max(mathToPixelY(0, view, height), 0), height);
    const axisX = Math.min(Math.max(mathToPixelX(0, view, width),  0), width);

    ctx.strokeStyle = '#3a4a6b';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, axisY); ctx.lineTo(width, axisY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(axisX, 0); ctx.lineTo(axisX, height); ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#3d5080';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    xLines.filter(l => !l.isAxis).forEach(l => {
      const label = l.value % 1 === 0 ? String(l.value) : l.value.toFixed(1);
      ctx.fillText(label, l.position, Math.min(Math.max(axisY + 14, 14), height - 4));
    });
    ctx.textAlign = 'right';
    yLines.filter(l => !l.isAxis).forEach(l => {
      const label = l.value % 1 === 0 ? String(l.value) : l.value.toFixed(1);
      ctx.fillText(label, Math.min(Math.max(axisX - 4, 28), width - 4), l.position + 4);
    });

    // Origin label
    if (axisX > 10 && axisX < width - 10 && axisY > 10 && axisY < height - 10) {
      ctx.textAlign = 'right';
      ctx.fillText('0', axisX - 4, axisY + 14);
    }

    // Plot equations
    equations.forEach(eq => {
      const result = plotEquation(eq.expression, view);
      if (result.hasError || result.points.length === 0) return;

      ctx.strokeStyle = eq.color;
      ctx.lineWidth = 2.2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();

      let penDown = false;
      result.points.forEach(pt => {
        if (isNaN(pt.y)) { penDown = false; return; }
        const px = mathToPixelX(pt.x, view, width);
        const py = mathToPixelY(pt.y, view, height);
        if (py < -height * 2 || py > height * 3) { penDown = false; return; }
        if (!penDown) { ctx.moveTo(px, py); penDown = true; }
        else { ctx.lineTo(px, py); }
      });
      ctx.stroke();
    });

  }, [equations, view]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top)  * scaleY;
    setTooltip({
      x: pixelToMathX(px, view, canvas.width),
      y: pixelToMathY(py, view, canvas.height),
      pixelX: e.clientX - rect.left,
      pixelY: e.clientY - rect.top,
    });
  }, [view]);

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  return { canvasRef, tooltip, handleMouseMove, handleMouseLeave };
}
import { useState, useCallback } from 'react';
import { Equation, ViewRange, DEFAULT_VIEW, EQUATION_COLORS, zoomView } from '@mathgraph/core';

let idCounter = 0;
const nextId = () => `eq-${++idCounter}`;

export function useGraph() {
  const [equations, setEquations] = useState<Equation[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [view, setView] = useState<ViewRange>(DEFAULT_VIEW);
  const [error, setError] = useState<string | null>(null);

  const addEquation = useCallback((expression: string) => {
    const expr = expression.trim();
    if (!expr) return;

    if (equations.some(eq => eq.expression === expr)) {
      setError(`Already plotting: ${expr}`);
      return;
    }

    const color = EQUATION_COLORS[equations.length % EQUATION_COLORS.length];
    setEquations(prev => [...prev, { id: nextId(), expression: expr, color }]);
    setInputValue('');
    setError(null);
  }, [equations]);

  const removeEquation = useCallback((id: string) => {
    setEquations(prev => prev.filter(eq => eq.id !== id));
  }, []);

  const handlePlot = useCallback(() => addEquation(inputValue), [inputValue, addEquation]);

  const zoomIn  = useCallback(() => setView(v => zoomView(v, 'in')), []);
  const zoomOut = useCallback(() => setView(v => zoomView(v, 'out')), []);
  const resetView = useCallback(() => setView(DEFAULT_VIEW), []);

  return {
    equations, inputValue, setInputValue,
    view, setView, error,
    addEquation, removeEquation, handlePlot,
    zoomIn, zoomOut, resetView,
  };
}
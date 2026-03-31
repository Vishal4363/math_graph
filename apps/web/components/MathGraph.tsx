'use client';
import { useGraph } from '../lib/useGraph';
import PresetBar from './PresetBar';
import EquationInput from './EquationInput';
import EquationTags from './EquationTags';
import GraphCanvas from './GraphCanvas';

export default function MathGraph() {
  const {
    equations,
    inputValue,
    setInputValue,
    view,
    error,
    addEquation,
    removeEquation,
    handlePlot,
    zoomIn,
    zoomOut,
    resetView,
  } = useGraph();

  return (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <PresetBar onSelect={expr => { setInputValue(expr); addEquation(expr); }} />
      <EquationInput
        value={inputValue}
        onChange={setInputValue}
        onPlot={handlePlot}
        error={error}
      />
      <EquationTags equations={equations} onRemove={removeEquation} />
      <GraphCanvas
        equations={equations}
        view={view}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetView}
      />
    </div>
  );
}




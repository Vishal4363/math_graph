import React from 'react';
import { View, useWindowDimensions, StyleSheet, ScrollView } from 'react-native';
import { useGraph } from '../hooks/useGraph';
import PresetBar from './PresetBar';
import EquationInput from './EquationInput';
import EquationTags from './EquationTags';
import GraphSVG from './GraphSVG';
import ZoomControls from './ZoomControls';

export default function MathGraph() {
  const { width } = useWindowDimensions();
  const graphWidth = width - 32;
  const graphHeight = 360;

  const {
    equations, inputValue, setInputValue,
    view, setView, error,
    addEquation, removeEquation, handlePlot,
    zoomIn, zoomOut, resetView,
  } = useGraph();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <EquationInput
        value={inputValue}
        onChange={setInputValue}
        onPlot={handlePlot}
        error={error}
      />

      <PresetBar onSelect={expr => { setInputValue(expr); addEquation(expr); }} />

      <EquationTags equations={equations} onRemove={removeEquation} />

      <View style={styles.graphWrapper}>
        <GraphSVG
          equations={equations}
          view={view}
          width={graphWidth}
          height={graphHeight}
          onViewChange={setView}
        />
        <ZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:       { flex: 1 },
  container:    { padding: 16, paddingBottom: 32, gap: 12 },
  graphWrapper: { position: 'relative' },
});
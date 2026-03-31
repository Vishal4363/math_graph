import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';
import Svg, {
  Line, Path, Text as SvgText, Circle,
  Defs, LinearGradient, Stop, Rect,
} from 'react-native-svg';
import {
  Equation, ViewRange,
  plotEquation, mathToPixelX, mathToPixelY,
  pixelToMathX, pixelToMathY, computeGridLines,
} from '@mathgraph/core';

interface TooltipInfo {
  mathX: number;
  mathY: number;
  pixelX: number;
  pixelY: number;
}

interface Props {
  equations: Equation[];
  view: ViewRange;
  width: number;
  height: number;
  onViewChange: (v: ViewRange) => void;
}

function getTouchDistance(t1: any, t2: any): number {
  const dx = t1.pageX - t2.pageX;
  const dy = t1.pageY - t2.pageY;
  return Math.sqrt(dx * dx + dy * dy);
}

function getTouchMidpoint(t1: any, t2: any, containerX: number, containerY: number) {
  return {
    x: (t1.pageX + t2.pageX) / 2 - containerX,
    y: (t1.pageY + t2.pageY) / 2 - containerY,
  };
}

export default function GraphSVG({ equations, view, width, height, onViewChange }: Props) {
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);

  const gestureState = useRef({
    isPanning: false,
    isPinching: false,
    lastX: 0,
    lastY: 0,
    startView: view,
    pinchStartDist: 0,
    pinchStartView: view,
    pinchMidX: 0,
    pinchMidY: 0,
    containerX: 0,
    containerY: 0,
    moved: false,
  });

  const containerRef = useRef<View>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const touches = evt.nativeEvent.touches;
        const g = gestureState.current;
        g.moved = false;

        if (containerRef.current) {
          (containerRef.current as any).measure?.(
            (_x: number, _y: number, _w: number, _h: number, px: number, py: number) => {
              g.containerX = px;
              g.containerY = py;
            }
          );
        }

        if (touches.length === 2) {
          g.isPinching = true;
          g.isPanning = false;
          g.pinchStartDist = getTouchDistance(touches[0], touches[1]);
          g.pinchStartView = view;
          const mid = getTouchMidpoint(touches[0], touches[1], g.containerX, g.containerY);
          g.pinchMidX = mid.x;
          g.pinchMidY = mid.y;
        } else {
          g.isPanning = true;
          g.isPinching = false;
          g.lastX = touches[0].pageX;
          g.lastY = touches[0].pageY;
          g.startView = view;
        }
      },

      onPanResponderMove: (evt) => {
        const touches = evt.nativeEvent.touches;
        const g = gestureState.current;
        g.moved = true;
        setTooltip(null);

        if (touches.length === 2 && g.isPinching) {
          const dist = getTouchDistance(touches[0], touches[1]);
          if (g.pinchStartDist === 0) return;
          const scale = dist / g.pinchStartDist;
          if (scale === 0) return;

          const cx = g.pinchMidX / width;
          const cy = g.pinchMidY / height;
          const factor = 1 / scale;
          const xRange = g.pinchStartView.xMax - g.pinchStartView.xMin;
          const yRange = g.pinchStartView.yMax - g.pinchStartView.yMin;
          const xCenter = g.pinchStartView.xMin + cx * xRange;
          const yCenter = g.pinchStartView.yMax - cy * yRange;
          const newView = {
            xMin: xCenter - cx * xRange * factor,
            xMax: xCenter + (1 - cx) * xRange * factor,
            yMin: yCenter - (1 - cy) * yRange * factor,
            yMax: yCenter + cy * yRange * factor,
          };
          onViewChange(newView);

        } else if (touches.length === 1 && g.isPanning) {
          const dx = touches[0].pageX - g.lastX;
          const dy = touches[0].pageY - g.lastY;
          g.lastX = touches[0].pageX;
          g.lastY = touches[0].pageY;

          const xRange = view.xMax - view.xMin;
          const yRange = view.yMax - view.yMin;
          onViewChange({
            xMin: view.xMin - (dx / width) * xRange,
            xMax: view.xMax - (dx / width) * xRange,
            yMin: view.yMin + (dy / height) * yRange,
            yMax: view.yMax + (dy / height) * yRange,
          });
        }
      },

      onPanResponderRelease: (evt) => {
        const g = gestureState.current;
        const touches = evt.nativeEvent.changedTouches;

        if (!g.moved && touches.length === 1) {
          const t = touches[0];
          const px = t.pageX - g.containerX;
          const py = t.pageY - g.containerY;
          if (px >= 0 && px <= width && py >= 0 && py <= height) {
            const mathX = pixelToMathX(px, view, width);
            const mathY = pixelToMathY(py, view, height);
            setTooltip({ mathX, mathY, pixelX: px, pixelY: py });
            setTimeout(() => setTooltip(null), 2500);
          }
        }

        g.isPanning = false;
        g.isPinching = false;
        g.moved = false;
      },

      onPanResponderTerminate: () => {
        gestureState.current.isPanning = false;
        gestureState.current.isPinching = false;
      },
    })
  ).current;

  const xLines = computeGridLines(view.xMin, view.xMax, width, 'x');
  const yLines = computeGridLines(view.yMin, view.yMax, height, 'y');

  const buildPath = useCallback((eq: Equation): string => {
    const result = plotEquation(eq.expression, view);
    if (result.hasError || result.points.length === 0) return '';

    let d = '';
    let penDown = false;

    result.points.forEach(pt => {
      if (isNaN(pt.y)) { penDown = false; return; }
      const px = mathToPixelX(pt.x, view, width);
      const py = mathToPixelY(pt.y, view, height);
      if (py < -height * 2 || py > height * 3) { penDown = false; return; }
      if (!penDown) {
        d += `M${px.toFixed(1)},${py.toFixed(1)}`;
        penDown = true;
      } else {
        d += `L${px.toFixed(1)},${py.toFixed(1)}`;
      }
    });

    return d;
  }, [view, width, height]);

  const axisY = mathToPixelY(0, view, height);
  const axisX = mathToPixelX(0, view, width);
  const clampedAxisY = Math.min(Math.max(axisY, 0), height);
  const clampedAxisX = Math.min(Math.max(axisX, 0), width);

  return (
    <View
      ref={containerRef}
      style={[styles.container, { width, height }]}
      {...panResponder.panHandlers}
    >
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#0d1117" stopOpacity="1" />
            <Stop offset="1" stopColor="#0f1420" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        <Rect x={0} y={0} width={width} height={height} fill="url(#bgGrad)" />

        {xLines.filter(l => !l.isAxis).map(line => (
          <Line key={`xm-${line.value}`}
            x1={line.position} y1={0} x2={line.position} y2={height}
            stroke="#1a2035" strokeWidth={1} />
        ))}
        {yLines.filter(l => !l.isAxis).map(line => (
          <Line key={`ym-${line.value}`}
            x1={0} y1={line.position} x2={width} y2={line.position}
            stroke="#1a2035" strokeWidth={1} />
        ))}

        <Line x1={0} y1={clampedAxisY} x2={width} y2={clampedAxisY}
          stroke="#3a4a6b" strokeWidth={1.5} />
        <Line x1={clampedAxisX} y1={0} x2={clampedAxisX} y2={height}
          stroke="#3a4a6b" strokeWidth={1.5} />

        {xLines.filter(l => !l.isAxis).map(line => (
          <SvgText key={`xl-${line.value}`}
            x={line.position}
            y={Math.min(Math.max(clampedAxisY + 15, 15), height - 5)}
            fontSize={9} fill="#3d5080" textAnchor="middle">
            {line.value % 1 === 0 ? line.value : line.value.toFixed(1)}
          </SvgText>
        ))}

        {yLines.filter(l => !l.isAxis).map(line => (
          <SvgText key={`yl-${line.value}`}
            x={Math.min(Math.max(clampedAxisX - 5, 24), width - 5)}
            y={line.position + 4}
            fontSize={9} fill="#3d5080" textAnchor="end">
            {line.value % 1 === 0 ? line.value : line.value.toFixed(1)}
          </SvgText>
        ))}

        {clampedAxisX > 10 && clampedAxisX < width - 10 &&
          clampedAxisY > 10 && clampedAxisY < height - 10 && (
          <SvgText x={clampedAxisX - 6} y={clampedAxisY + 14}
            fontSize={9} fill="#3d5080" textAnchor="end">0</SvgText>
        )}

        {equations.map(eq => {
          const d = buildPath(eq);
          if (!d) return null;
          return (
            <Path key={eq.id} d={d}
              stroke={eq.color} strokeWidth={2.2}
              fill="none" strokeLinejoin="round" strokeLinecap="round" />
          );
        })}

        {tooltip && (
  <>
    <Line x1={tooltip.pixelX} y1={0} x2={tooltip.pixelX} y2={height}
      stroke="#ffffff18" strokeWidth={1} strokeDasharray="4,4" />
    <Line x1={0} y1={tooltip.pixelY} x2={width} y2={tooltip.pixelY}
      stroke="#ffffff18" strokeWidth={1} strokeDasharray="4,4" />
    <Circle cx={tooltip.pixelX} cy={tooltip.pixelY} r={5}
      fill="#ffffff22" stroke="#ffffff55" strokeWidth={1} />
    <Rect
      x={Math.min(tooltip.pixelX + 10, width - 118)}
      y={Math.max(tooltip.pixelY - 30, 4)}
      width={112} height={24} rx={6}
      fill="#1e2a40" stroke="#2d3f60" strokeWidth={1} />
    <SvgText
      x={Math.min(tooltip.pixelX + 10, width - 118) + 56}
      y={Math.max(tooltip.pixelY - 14, 20)}
      fontSize={11} fill="#93b4e0" textAnchor="middle">
      {`x:${tooltip.mathX.toFixed(2)}  y:${tooltip.mathY.toFixed(2)}`}
    </SvgText>
  </>
)}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0d1117',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1a2235',
  },
});
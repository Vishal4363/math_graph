import type { GridLine, ViewRange, PlotResult } from './types';
export declare function normalizeExpression(expr: string): string;
export declare function buildFunction(expr: string): ((x: number) => number) | null;
export declare function plotEquation(expr: string, view: ViewRange): PlotResult;
export declare function mathToPixelX(mathX: number, view: ViewRange, width: number): number;
export declare function mathToPixelY(mathY: number, view: ViewRange, height: number): number;
export declare function pixelToMathX(pixelX: number, view: ViewRange, width: number): number;
export declare function pixelToMathY(pixelY: number, view: ViewRange, height: number): number;
export declare function computeGridLines(min: number, max: number, pixelSize: number, axis: 'x' | 'y'): GridLine[];
export declare function zoomView(view: ViewRange, direction: 'in' | 'out', centerFractionX?: number, centerFractionY?: number): ViewRange;
/** Pan by pixel delta */
export declare function panView(view: ViewRange, dx: number, dy: number, width: number, height: number): ViewRange;
/** Pinch-zoom around a focal pixel point */
export declare function pinchView(view: ViewRange, scale: number, focalX: number, focalY: number, width: number, height: number): ViewRange;

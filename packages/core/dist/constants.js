"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZOOM_FACTOR = exports.PLOT_SAMPLES = exports.DEFAULT_VIEW = exports.PRESETS = exports.EQUATION_COLORS = void 0;
exports.EQUATION_COLORS = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
];
exports.PRESETS = [
    { label: 'x²', expression: 'x^2' },
    { label: 'x³', expression: 'x^3' },
    { label: 'sin(x)', expression: 'sin(x)' },
    { label: 'cos(x)', expression: 'cos(x)' },
    { label: 'tan(x)', expression: 'tan(x)' },
    { label: 'sec(x)', expression: 'sec(x)' },
    { label: 'csc(x)', expression: 'csc(x)' },
    { label: 'cot(x)', expression: 'cot(x)' },
    { label: '|x|', expression: 'abs(x)' },
    { label: 'e^x', expression: 'e^x' },
    { label: '√x', expression: 'sqrt(x)' },
    { label: 'ln(x)', expression: 'ln(x)' },
    { label: '1/x', expression: '1/x' },
    { label: 'sinh(x)', expression: 'sinh(x)' },
    { label: 'cosh(x)', expression: 'cosh(x)' },
];
exports.DEFAULT_VIEW = {
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
};
exports.PLOT_SAMPLES = 800; // increased for smoother curves
exports.ZOOM_FACTOR = 0.2;

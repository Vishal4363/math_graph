"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeExpression = normalizeExpression;
exports.buildFunction = buildFunction;
exports.plotEquation = plotEquation;
exports.mathToPixelX = mathToPixelX;
exports.mathToPixelY = mathToPixelY;
exports.pixelToMathX = pixelToMathX;
exports.pixelToMathY = pixelToMathY;
exports.computeGridLines = computeGridLines;
exports.zoomView = zoomView;
exports.panView = panView;
exports.pinchView = pinchView;
const constants_1 = require("./constants");
// ----- Expression Parser -----
function normalizeExpression(expr) {
    let e = expr.trim();
    // Strip "y = ...", "f(x) = ..." prefix
    e = e.replace(/^[yYfF]\s*\(?\s*[xX]\s*\)?\s*=\s*/, '');
    // Constants first
    e = e.replace(/\bpi\b/gi, 'Math.PI');
    // --- Inverse hyperbolic (longest match first) ---
    e = e.replace(/\basinh\b/g, 'Math.asinh');
    e = e.replace(/\bacosh\b/g, 'Math.acosh');
    e = e.replace(/\batanh\b/g, 'Math.atanh');
    // --- Hyperbolic ---
    e = e.replace(/\bsinh\b/g, 'Math.sinh');
    e = e.replace(/\bcosh\b/g, 'Math.cosh');
    e = e.replace(/\btanh\b/g, 'Math.tanh');
    // --- Reciprocal trig: sec, csc, cot (not native JS — use helper functions) ---
    e = e.replace(/\bsec\b/g, '__sec');
    e = e.replace(/\bcsc\b/g, '__csc');
    e = e.replace(/\bcot\b/g, '__cot');
    // --- Inverse trig (before plain trig so "asin" isn't partially matched) ---
    e = e.replace(/\basin\b/g, 'Math.asin');
    e = e.replace(/\bacos\b/g, 'Math.acos');
    e = e.replace(/\batan2\b/g, 'Math.atan2');
    e = e.replace(/\batan\b/g, 'Math.atan');
    // --- Plain trig ---
    e = e.replace(/\bsin\b/g, 'Math.sin');
    e = e.replace(/\bcos\b/g, 'Math.cos');
    e = e.replace(/\btan\b/g, 'Math.tan');
    // --- Other math ---
    e = e.replace(/\bsqrt\b/g, 'Math.sqrt');
    e = e.replace(/\bcbrt\b/g, 'Math.cbrt');
    e = e.replace(/\babs\b/g, 'Math.abs');
    e = e.replace(/\bfloor\b/g, 'Math.floor');
    e = e.replace(/\bceil\b/g, 'Math.ceil');
    e = e.replace(/\bround\b/g, 'Math.round');
    e = e.replace(/\bsign\b/g, 'Math.sign');
    e = e.replace(/\blog2\b/g, 'Math.log2');
    e = e.replace(/\blog10\b/g, 'Math.log10');
    e = e.replace(/\blog\b/g, 'Math.log10'); // bare "log" → log base 10
    e = e.replace(/\bln\b/g, 'Math.log'); // "ln" → natural log
    e = e.replace(/\bexp\b/g, 'Math.exp');
    e = e.replace(/\bpow\b/g, 'Math.pow');
    e = e.replace(/\bmax\b/g, 'Math.max');
    e = e.replace(/\bmin\b/g, 'Math.min');
    // Euler's number — after all function names to avoid mangling "exp" etc.
    e = e.replace(/\be\b/g, 'Math.E');
    // --- Implicit multiplication ---
    e = e.replace(/(\d)(x\b)/g, '$1*$2'); // "2x" → "2*x"
    e = e.replace(/(\d)(\()/g, '$1*$2'); // "2(" → "2*("
    // Fix up any Math.xxx*( or __xxx*( introduced by implicit multiply step
    e = e.replace(/(Math\.[a-zA-Z0-9]+)\*\(/g, '$1(');
    e = e.replace(/(__sec|__csc|__cot)\*\(/g, '$1(');
    // --- Power operator ^ → Math.pow ---
    let prev = '';
    while (prev !== e) {
        prev = e;
        e = e.replace(/([a-zA-Z_$][\w$.]*(?:\([^()]*\))?|\d+(?:\.\d+)?|\))\s*\^\s*(\((?:[^()]*|\([^()]*\))*\)|[a-zA-Z_$][\w$.]*(?:\([^()]*\))?|\d+(?:\.\d+)?|-\d+(?:\.\d+)?)/, 'Math.pow($1,$2)');
    }
    return e;
}
/**
 * Helper source injected into every compiled function so sec/csc/cot work.
 */
const HELPERS = `
  function __sec(a)  { const c = Math.cos(a); return (c === 0 || Math.abs(c) < 1e-12) ? NaN : 1/c; }
  function __csc(a)  { const s = Math.sin(a); return (s === 0 || Math.abs(s) < 1e-12) ? NaN : 1/s; }
  function __cot(a)  { const s = Math.sin(a); return (s === 0 || Math.abs(s) < 1e-12) ? NaN : Math.cos(a)/s; }
`;
function buildFunction(expr) {
    try {
        const normalized = normalizeExpression(expr);
        // eslint-disable-next-line no-new-func
        const fn = new Function('x', `"use strict"; ${HELPERS} return (${normalized});`);
        fn(0);
        fn(1);
        return fn;
    }
    catch (_a) {
        return null;
    }
}
// ----- Plotting -----
function plotEquation(expr, view) {
    const fn = buildFunction(expr);
    if (!fn) {
        return { points: [], hasError: true, errorMessage: `Cannot parse: "${expr}"` };
    }
    const points = [];
    const step = (view.xMax - view.xMin) / constants_1.PLOT_SAMPLES;
    const DISC_THRESHOLD = (view.yMax - view.yMin) * 4;
    for (let i = 0; i <= constants_1.PLOT_SAMPLES; i++) {
        const x = view.xMin + i * step;
        let y;
        try {
            y = fn(x);
        }
        catch (_a) {
            y = NaN;
        }
        if (!isFinite(y) || isNaN(y)) {
            points.push({ x, y: NaN });
            continue;
        }
        // Discontinuity detection — lift pen on large jumps (tan, sec, csc asymptotes)
        if (points.length > 0) {
            const last = points[points.length - 1];
            if (!isNaN(last.y) && Math.abs(y - last.y) > DISC_THRESHOLD) {
                points.push({ x, y: NaN });
            }
        }
        points.push({ x, y });
    }
    return { points, hasError: false };
}
// ----- Coordinate Conversion -----
function mathToPixelX(mathX, view, width) {
    return ((mathX - view.xMin) / (view.xMax - view.xMin)) * width;
}
function mathToPixelY(mathY, view, height) {
    return height - ((mathY - view.yMin) / (view.yMax - view.yMin)) * height;
}
function pixelToMathX(pixelX, view, width) {
    return view.xMin + (pixelX / width) * (view.xMax - view.xMin);
}
function pixelToMathY(pixelY, view, height) {
    return view.yMax - (pixelY / height) * (view.yMax - view.yMin);
}
// ----- Grid Lines -----
function computeGridLines(min, max, pixelSize, axis) {
    var _a;
    const range = max - min;
    const rawStep = range / 10;
    const magnitude = Math.pow(10, Math.floor(Math.log10(Math.abs(rawStep) || 1)));
    const niceSteps = [1, 2, 5, 10];
    const step = magnitude * ((_a = niceSteps.find(s => s * magnitude >= rawStep)) !== null && _a !== void 0 ? _a : 1);
    const lines = [];
    const first = Math.ceil(min / step) * step;
    for (let v = first; v <= max + 1e-10; v += step) {
        const rounded = Math.round(v * 1e10) / 1e10;
        const pos = axis === 'x'
            ? mathToPixelX(rounded, { xMin: min, xMax: max, yMin: 0, yMax: 1 }, pixelSize)
            : mathToPixelY(rounded, { xMin: 0, xMax: 1, yMin: min, yMax: max }, pixelSize);
        lines.push({ value: rounded, position: pos, isAxis: Math.abs(rounded) < step * 0.01 });
    }
    return lines;
}
// ----- Zoom / Pan / Pinch -----
function zoomView(view, direction, centerFractionX = 0.5, centerFractionY = 0.5) {
    const factor = direction === 'in' ? 1 - constants_1.ZOOM_FACTOR : 1 + constants_1.ZOOM_FACTOR;
    const xCenter = view.xMin + centerFractionX * (view.xMax - view.xMin);
    const yCenter = view.yMin + centerFractionY * (view.yMax - view.yMin);
    const xHalf = ((view.xMax - view.xMin) / 2) * factor;
    const yHalf = ((view.yMax - view.yMin) / 2) * factor;
    return { xMin: xCenter - xHalf, xMax: xCenter + xHalf, yMin: yCenter - yHalf, yMax: yCenter + yHalf };
}
/** Pan by pixel delta */
function panView(view, dx, dy, width, height) {
    const mathDx = (dx / width) * (view.xMax - view.xMin);
    const mathDy = (dy / height) * (view.yMax - view.yMin);
    return {
        xMin: view.xMin - mathDx,
        xMax: view.xMax - mathDx,
        yMin: view.yMin + mathDy,
        yMax: view.yMax + mathDy,
    };
}
/** Pinch-zoom around a focal pixel point */
function pinchView(view, scale, focalX, focalY, width, height) {
    const mathFX = pixelToMathX(focalX, view, width);
    const mathFY = pixelToMathY(focalY, view, height);
    const xRange = (view.xMax - view.xMin) / scale;
    const yRange = (view.yMax - view.yMin) / scale;
    const fracX = focalX / width;
    const fracY = 1 - focalY / height;
    return {
        xMin: mathFX - fracX * xRange,
        xMax: mathFX + (1 - fracX) * xRange,
        yMin: mathFY - fracY * yRange,
        yMax: mathFY + (1 - fracY) * yRange,
    };
}

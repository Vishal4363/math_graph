(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/packages/core/src/types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Shared types used across web and mobile
__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/core/src/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_VIEW",
    ()=>DEFAULT_VIEW,
    "EQUATION_COLORS",
    ()=>EQUATION_COLORS,
    "PLOT_SAMPLES",
    ()=>PLOT_SAMPLES,
    "PRESETS",
    ()=>PRESETS,
    "ZOOM_FACTOR",
    ()=>ZOOM_FACTOR
]);
const EQUATION_COLORS = [
    '#3b82f6',
    '#ef4444',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#f97316'
];
const PRESETS = [
    {
        label: 'x²',
        expression: 'x^2'
    },
    {
        label: 'x³',
        expression: 'x^3'
    },
    {
        label: 'sin(x)',
        expression: 'sin(x)'
    },
    {
        label: 'cos(x)',
        expression: 'cos(x)'
    },
    {
        label: 'tan(x)',
        expression: 'tan(x)'
    },
    {
        label: 'sec(x)',
        expression: 'sec(x)'
    },
    {
        label: 'csc(x)',
        expression: 'csc(x)'
    },
    {
        label: 'cot(x)',
        expression: 'cot(x)'
    },
    {
        label: '|x|',
        expression: 'abs(x)'
    },
    {
        label: 'e^x',
        expression: 'e^x'
    },
    {
        label: '√x',
        expression: 'sqrt(x)'
    },
    {
        label: 'ln(x)',
        expression: 'ln(x)'
    },
    {
        label: '1/x',
        expression: '1/x'
    },
    {
        label: 'sinh(x)',
        expression: 'sinh(x)'
    },
    {
        label: 'cosh(x)',
        expression: 'cosh(x)'
    }
];
const DEFAULT_VIEW = {
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10
};
const PLOT_SAMPLES = 800; // increased for smoother curves
const ZOOM_FACTOR = 0.2;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/core/src/graphEngine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildFunction",
    ()=>buildFunction,
    "computeGridLines",
    ()=>computeGridLines,
    "mathToPixelX",
    ()=>mathToPixelX,
    "mathToPixelY",
    ()=>mathToPixelY,
    "normalizeExpression",
    ()=>normalizeExpression,
    "panView",
    ()=>panView,
    "pinchView",
    ()=>pinchView,
    "pixelToMathX",
    ()=>pixelToMathX,
    "pixelToMathY",
    ()=>pixelToMathY,
    "plotEquation",
    ()=>plotEquation,
    "zoomView",
    ()=>zoomView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/constants.ts [app-client] (ecmascript)");
;
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
    while(prev !== e){
        prev = e;
        e = e.replace(/([a-zA-Z_$][\w$.]*(?:\([^()]*\))?|\d+(?:\.\d+)?|\))\s*\^\s*(\((?:[^()]*|\([^()]*\))*\)|[a-zA-Z_$][\w$.]*(?:\([^()]*\))?|\d+(?:\.\d+)?|-\d+(?:\.\d+)?)/, 'Math.pow($1,$2)');
    }
    return e;
}
/**
 * Helper source injected into every compiled function so sec/csc/cot work.
 */ const HELPERS = `
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
    } catch  {
        return null;
    }
}
function plotEquation(expr, view) {
    const fn = buildFunction(expr);
    if (!fn) {
        return {
            points: [],
            hasError: true,
            errorMessage: `Cannot parse: "${expr}"`
        };
    }
    const points = [];
    const step = (view.xMax - view.xMin) / __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PLOT_SAMPLES"];
    const DISC_THRESHOLD = (view.yMax - view.yMin) * 4;
    for(let i = 0; i <= __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PLOT_SAMPLES"]; i++){
        const x = view.xMin + i * step;
        let y;
        try {
            y = fn(x);
        } catch  {
            y = NaN;
        }
        if (!isFinite(y) || isNaN(y)) {
            points.push({
                x,
                y: NaN
            });
            continue;
        }
        // Discontinuity detection — lift pen on large jumps (tan, sec, csc asymptotes)
        if (points.length > 0) {
            const last = points[points.length - 1];
            if (!isNaN(last.y) && Math.abs(y - last.y) > DISC_THRESHOLD) {
                points.push({
                    x,
                    y: NaN
                });
            }
        }
        points.push({
            x,
            y
        });
    }
    return {
        points,
        hasError: false
    };
}
function mathToPixelX(mathX, view, width) {
    return (mathX - view.xMin) / (view.xMax - view.xMin) * width;
}
function mathToPixelY(mathY, view, height) {
    return height - (mathY - view.yMin) / (view.yMax - view.yMin) * height;
}
function pixelToMathX(pixelX, view, width) {
    return view.xMin + pixelX / width * (view.xMax - view.xMin);
}
function pixelToMathY(pixelY, view, height) {
    return view.yMax - pixelY / height * (view.yMax - view.yMin);
}
function computeGridLines(min, max, pixelSize, axis) {
    const range = max - min;
    const rawStep = range / 10;
    const magnitude = Math.pow(10, Math.floor(Math.log10(Math.abs(rawStep) || 1)));
    const niceSteps = [
        1,
        2,
        5,
        10
    ];
    const step = magnitude * (niceSteps.find((s)=>s * magnitude >= rawStep) ?? 1);
    const lines = [];
    const first = Math.ceil(min / step) * step;
    for(let v = first; v <= max + 1e-10; v += step){
        const rounded = Math.round(v * 1e10) / 1e10;
        const pos = axis === 'x' ? mathToPixelX(rounded, {
            xMin: min,
            xMax: max,
            yMin: 0,
            yMax: 1
        }, pixelSize) : mathToPixelY(rounded, {
            xMin: 0,
            xMax: 1,
            yMin: min,
            yMax: max
        }, pixelSize);
        lines.push({
            value: rounded,
            position: pos,
            isAxis: Math.abs(rounded) < step * 0.01
        });
    }
    return lines;
}
function zoomView(view, direction, centerFractionX = 0.5, centerFractionY = 0.5) {
    const factor = direction === 'in' ? 1 - __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ZOOM_FACTOR"] : 1 + __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ZOOM_FACTOR"];
    const xCenter = view.xMin + centerFractionX * (view.xMax - view.xMin);
    const yCenter = view.yMin + centerFractionY * (view.yMax - view.yMin);
    const xHalf = (view.xMax - view.xMin) / 2 * factor;
    const yHalf = (view.yMax - view.yMin) / 2 * factor;
    return {
        xMin: xCenter - xHalf,
        xMax: xCenter + xHalf,
        yMin: yCenter - yHalf,
        yMax: yCenter + yHalf
    };
}
function panView(view, dx, dy, width, height) {
    const mathDx = dx / width * (view.xMax - view.xMin);
    const mathDy = dy / height * (view.yMax - view.yMin);
    return {
        xMin: view.xMin - mathDx,
        xMax: view.xMax - mathDx,
        yMin: view.yMin + mathDy,
        yMax: view.yMax + mathDy
    };
}
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
        yMax: mathFY + (1 - fracY) * yRange
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/core/src/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/graphEngine.ts [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/lib/useCanvas.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCanvas",
    ()=>useCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/core/src/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/graphEngine.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useCanvas(equations, view) {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [tooltip, setTooltip] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCanvas.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            const width = canvas.width;
            const height = canvas.height;
            // Background
            const bg = ctx.createLinearGradient(0, 0, 0, height);
            bg.addColorStop(0, '#0d1117');
            bg.addColorStop(1, '#0f1420');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, width, height);
            // Grid lines
            const xLines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computeGridLines"])(view.xMin, view.xMax, width, 'x');
            const yLines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computeGridLines"])(view.yMin, view.yMax, height, 'y');
            ctx.strokeStyle = '#1a2035';
            ctx.lineWidth = 1;
            xLines.filter({
                "useCanvas.useEffect": (l)=>!l.isAxis
            }["useCanvas.useEffect"]).forEach({
                "useCanvas.useEffect": (l)=>{
                    ctx.beginPath();
                    ctx.moveTo(l.position, 0);
                    ctx.lineTo(l.position, height);
                    ctx.stroke();
                }
            }["useCanvas.useEffect"]);
            yLines.filter({
                "useCanvas.useEffect": (l)=>!l.isAxis
            }["useCanvas.useEffect"]).forEach({
                "useCanvas.useEffect": (l)=>{
                    ctx.beginPath();
                    ctx.moveTo(0, l.position);
                    ctx.lineTo(width, l.position);
                    ctx.stroke();
                }
            }["useCanvas.useEffect"]);
            // Axes
            const axisY = Math.min(Math.max((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathToPixelY"])(0, view, height), 0), height);
            const axisX = Math.min(Math.max((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathToPixelX"])(0, view, width), 0), width);
            ctx.strokeStyle = '#3a4a6b';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, axisY);
            ctx.lineTo(width, axisY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(axisX, 0);
            ctx.lineTo(axisX, height);
            ctx.stroke();
            // Axis labels
            ctx.fillStyle = '#3d5080';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            xLines.filter({
                "useCanvas.useEffect": (l)=>!l.isAxis
            }["useCanvas.useEffect"]).forEach({
                "useCanvas.useEffect": (l)=>{
                    const label = l.value % 1 === 0 ? String(l.value) : l.value.toFixed(1);
                    ctx.fillText(label, l.position, Math.min(Math.max(axisY + 14, 14), height - 4));
                }
            }["useCanvas.useEffect"]);
            ctx.textAlign = 'right';
            yLines.filter({
                "useCanvas.useEffect": (l)=>!l.isAxis
            }["useCanvas.useEffect"]).forEach({
                "useCanvas.useEffect": (l)=>{
                    const label = l.value % 1 === 0 ? String(l.value) : l.value.toFixed(1);
                    ctx.fillText(label, Math.min(Math.max(axisX - 4, 28), width - 4), l.position + 4);
                }
            }["useCanvas.useEffect"]);
            // Origin label
            if (axisX > 10 && axisX < width - 10 && axisY > 10 && axisY < height - 10) {
                ctx.textAlign = 'right';
                ctx.fillText('0', axisX - 4, axisY + 14);
            }
            // Plot equations
            equations.forEach({
                "useCanvas.useEffect": (eq)=>{
                    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["plotEquation"])(eq.expression, view);
                    if (result.hasError || result.points.length === 0) return;
                    ctx.strokeStyle = eq.color;
                    ctx.lineWidth = 2.2;
                    ctx.lineJoin = 'round';
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    let penDown = false;
                    result.points.forEach({
                        "useCanvas.useEffect": (pt)=>{
                            if (isNaN(pt.y)) {
                                penDown = false;
                                return;
                            }
                            const px = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathToPixelX"])(pt.x, view, width);
                            const py = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathToPixelY"])(pt.y, view, height);
                            if (py < -height * 2 || py > height * 3) {
                                penDown = false;
                                return;
                            }
                            if (!penDown) {
                                ctx.moveTo(px, py);
                                penDown = true;
                            } else {
                                ctx.lineTo(px, py);
                            }
                        }
                    }["useCanvas.useEffect"]);
                    ctx.stroke();
                }
            }["useCanvas.useEffect"]);
        }
    }["useCanvas.useEffect"], [
        equations,
        view
    ]);
    const handleMouseMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCanvas.useCallback[handleMouseMove]": (e)=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const px = (e.clientX - rect.left) * scaleX;
            const py = (e.clientY - rect.top) * scaleY;
            setTooltip({
                x: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pixelToMathX"])(px, view, canvas.width),
                y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pixelToMathY"])(py, view, canvas.height),
                pixelX: e.clientX - rect.left,
                pixelY: e.clientY - rect.top
            });
        }
    }["useCanvas.useCallback[handleMouseMove]"], [
        view
    ]);
    const handleMouseLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCanvas.useCallback[handleMouseLeave]": ()=>setTooltip(null)
    }["useCanvas.useCallback[handleMouseLeave]"], []);
    return {
        canvasRef,
        tooltip,
        handleMouseMove,
        handleMouseLeave
    };
}
_s(useCanvas, "sLCe1A4xKfk+L7XjwMhx4B3xMrs=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/components/ZoomControls.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// 'use client';
// interface Props {
//   onZoomIn: () => void;
//   onZoomOut: () => void;
//   onReset: () => void;
// }
// const btnStyle = {
//   width: '36px',
//   height: '36px',
//   background: '#1e2433',
//   border: '1px solid #2d3748',
//   borderRadius: '8px',
//   color: '#a0aec0',
//   fontSize: '18px',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
// };
// export default function ZoomControls({ onZoomIn, onZoomOut, onReset }: Props) {
//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'absolute', top: '12px', right: '12px' }}>
//       <button onClick={onZoomIn} style={btnStyle} title="Zoom in">+</button>
//       <button onClick={onZoomOut} style={btnStyle} title="Zoom out">−</button>
//       <button onClick={onReset} style={{ ...btnStyle, fontSize: '14px' }} title="Reset view">⌂</button>
//     </div>
//   );
// }
__turbopack_context__.s([
    "default",
    ()=>ZoomControls
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'react-native'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
function ZoomControls({ onZoomIn, onZoomOut, onReset }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
        style: styles.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TouchableOpacity, {
                onPress: onZoomIn,
                style: styles.btn,
                activeOpacity: 0.7,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                    style: styles.btnText,
                    children: "+"
                }, void 0, false, {
                    fileName: "[project]/apps/web/components/ZoomControls.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/components/ZoomControls.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TouchableOpacity, {
                onPress: onZoomOut,
                style: styles.btn,
                activeOpacity: 0.7,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                    style: styles.btnText,
                    children: "−"
                }, void 0, false, {
                    fileName: "[project]/apps/web/components/ZoomControls.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/components/ZoomControls.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TouchableOpacity, {
                onPress: onReset,
                style: styles.btn,
                activeOpacity: 0.7,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                    style: [
                        styles.btnText,
                        {
                            fontSize: 12,
                            fontWeight: '700'
                        }
                    ],
                    children: "R"
                }, void 0, false, {
                    fileName: "[project]/apps/web/components/ZoomControls.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/components/ZoomControls.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/components/ZoomControls.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
}
_c = ZoomControls;
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 12,
        right: 12,
        gap: 6
    },
    btn: {
        width: 38,
        height: 38,
        backgroundColor: 'rgba(30,27,75,0.95)',
        borderWidth: 1,
        borderColor: '#3730a3',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnText: {
        color: '#a78bfa',
        fontSize: 20,
        lineHeight: 24
    }
});
var _c;
__turbopack_context__.k.register(_c, "ZoomControls");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/components/GraphCanvas.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GraphCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$useCanvas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/useCanvas.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$ZoomControls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/components/ZoomControls.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function GraphCanvas({ equations, view, onZoomIn, onZoomOut, onReset }) {
    _s();
    const { canvasRef, tooltip, handleMouseMove, handleMouseLeave } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$useCanvas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCanvas"])(equations, view);
    // Make canvas fill its container
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GraphCanvas.useEffect": ()=>{
            const container = containerRef.current;
            const canvas = canvasRef.current;
            if (!container || !canvas) return;
            const resize = {
                "GraphCanvas.useEffect.resize": ()=>{
                    canvas.width = container.clientWidth;
                    canvas.height = container.clientHeight;
                }
            }["GraphCanvas.useEffect.resize"];
            resize();
            const ro = new ResizeObserver(resize);
            ro.observe(container);
            return ({
                "GraphCanvas.useEffect": ()=>ro.disconnect()
            })["GraphCanvas.useEffect"];
        }
    }["GraphCanvas.useEffect"], [
        canvasRef
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        style: {
            position: 'relative',
            width: '100%',
            height: '480px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #1e2433'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                onMouseMove: handleMouseMove,
                onMouseLeave: handleMouseLeave,
                style: {
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    cursor: 'crosshair'
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            tooltip && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
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
                    whiteSpace: 'nowrap'
                },
                children: [
                    "x: ",
                    tooltip.x.toFixed(2),
                    ", y: ",
                    tooltip.y.toFixed(2)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                lineNumber: 48,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$ZoomControls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onZoomIn: onZoomIn,
                onZoomOut: onZoomOut,
                onReset: onReset
            }, void 0, false, {
                fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/components/GraphCanvas.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_s(GraphCanvas, "WkFCoVqJczhrw0+RXD05avJQvtU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$useCanvas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCanvas"]
    ];
});
_c = GraphCanvas;
var _c;
__turbopack_context__.k.register(_c, "GraphCanvas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=_0f0zx66._.js.map
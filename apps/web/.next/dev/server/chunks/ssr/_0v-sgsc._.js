module.exports = [
"[project]/packages/core/src/constants.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/packages/core/src/graphEngine.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/constants.ts [app-ssr] (ecmascript)");
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
    const step = (view.xMax - view.xMin) / __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PLOT_SAMPLES"];
    const DISC_THRESHOLD = (view.yMax - view.yMin) * 4;
    for(let i = 0; i <= __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PLOT_SAMPLES"]; i++){
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
    const factor = direction === 'in' ? 1 - __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ZOOM_FACTOR"] : 1 + __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ZOOM_FACTOR"];
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
}),
"[project]/packages/core/src/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/graphEngine.ts [app-ssr] (ecmascript)");
;
;
;
}),
"[project]/apps/web/lib/useCanvas.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCanvas",
    ()=>useCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/core/src/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/graphEngine.ts [app-ssr] (ecmascript)");
;
;
function useCanvas(equations, view) {
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [tooltip, setTooltip] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
        const xLines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["computeGridLines"])(view.xMin, view.xMax, width, 'x');
        const yLines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["computeGridLines"])(view.yMin, view.yMax, height, 'y');
        ctx.strokeStyle = '#1a2035';
        ctx.lineWidth = 1;
        xLines.filter((l)=>!l.isAxis).forEach((l)=>{
            ctx.beginPath();
            ctx.moveTo(l.position, 0);
            ctx.lineTo(l.position, height);
            ctx.stroke();
        });
        yLines.filter((l)=>!l.isAxis).forEach((l)=>{
            ctx.beginPath();
            ctx.moveTo(0, l.position);
            ctx.lineTo(width, l.position);
            ctx.stroke();
        });
        // Axes
        const axisY = Math.min(Math.max((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathToPixelY"])(0, view, height), 0), height);
        const axisX = Math.min(Math.max((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathToPixelX"])(0, view, width), 0), width);
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
        xLines.filter((l)=>!l.isAxis).forEach((l)=>{
            const label = l.value % 1 === 0 ? String(l.value) : l.value.toFixed(1);
            ctx.fillText(label, l.position, Math.min(Math.max(axisY + 14, 14), height - 4));
        });
        ctx.textAlign = 'right';
        yLines.filter((l)=>!l.isAxis).forEach((l)=>{
            const label = l.value % 1 === 0 ? String(l.value) : l.value.toFixed(1);
            ctx.fillText(label, Math.min(Math.max(axisX - 4, 28), width - 4), l.position + 4);
        });
        // Origin label
        if (axisX > 10 && axisX < width - 10 && axisY > 10 && axisY < height - 10) {
            ctx.textAlign = 'right';
            ctx.fillText('0', axisX - 4, axisY + 14);
        }
        // Plot equations
        equations.forEach((eq)=>{
            const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["plotEquation"])(eq.expression, view);
            if (result.hasError || result.points.length === 0) return;
            ctx.strokeStyle = eq.color;
            ctx.lineWidth = 2.2;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.beginPath();
            let penDown = false;
            result.points.forEach((pt)=>{
                if (isNaN(pt.y)) {
                    penDown = false;
                    return;
                }
                const px = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathToPixelX"])(pt.x, view, width);
                const py = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathToPixelY"])(pt.y, view, height);
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
            });
            ctx.stroke();
        });
    }, [
        equations,
        view
    ]);
    const handleMouseMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const px = (e.clientX - rect.left) * scaleX;
        const py = (e.clientY - rect.top) * scaleY;
        setTooltip({
            x: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pixelToMathX"])(px, view, canvas.width),
            y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pixelToMathY"])(py, view, canvas.height),
            pixelX: e.clientX - rect.left,
            pixelY: e.clientY - rect.top
        });
    }, [
        view
    ]);
    const handleMouseLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>setTooltip(null), []);
    return {
        canvasRef,
        tooltip,
        handleMouseMove,
        handleMouseLeave
    };
}
}),
"[project]/apps/web/components/ZoomControls.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'react-native'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
function ZoomControls({ onZoomIn, onZoomOut, onReset }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
        style: styles.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TouchableOpacity, {
                onPress: onZoomIn,
                style: styles.btn,
                activeOpacity: 0.7,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TouchableOpacity, {
                onPress: onZoomOut,
                style: styles.btn,
                activeOpacity: 0.7,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TouchableOpacity, {
                onPress: onReset,
                style: styles.btn,
                activeOpacity: 0.7,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
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
}),
"[project]/apps/web/components/GraphCanvas.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GraphCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$useCanvas$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/useCanvas.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$ZoomControls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/components/ZoomControls.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function GraphCanvas({ equations, view, onZoomIn, onZoomOut, onReset }) {
    const { canvasRef, tooltip, handleMouseMove, handleMouseLeave } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$useCanvas$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCanvas"])(equations, view);
    // Make canvas fill its container
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;
        const resize = ()=>{
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(container);
        return ()=>ro.disconnect();
    }, [
        canvasRef
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
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
            tooltip && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$ZoomControls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime;
}),
];

//# sourceMappingURL=_0v-sgsc._.js.map
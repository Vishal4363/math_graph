module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/packages/core/src/constants.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/packages/core/src/graphEngine.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/constants.ts [app-rsc] (ecmascript)");
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
    const step = (view.xMax - view.xMin) / __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PLOT_SAMPLES"];
    const DISC_THRESHOLD = (view.yMax - view.yMin) * 4;
    for(let i = 0; i <= __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PLOT_SAMPLES"]; i++){
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
    const factor = direction === 'in' ? 1 - __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ZOOM_FACTOR"] : 1 + __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ZOOM_FACTOR"];
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
"[project]/packages/core/src/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/graphEngine.ts [app-rsc] (ecmascript)");
;
;
;
}),
"[project]/apps/web/lib/useGraph.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useGraph",
    ()=>useGraph
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/core/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/constants.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/graphEngine.ts [app-rsc] (ecmascript)");
;
;
let idCounter = 0;
const nextId = ()=>`eq-${++idCounter}`;
function useGraph() {
    const [equations, setEquations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"])([]);
    const [inputValue, setInputValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"])('');
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_VIEW"]);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"])(null);
    const addEquation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"])((expression)=>{
        const expr = expression.trim();
        if (!expr) return;
        if (equations.some((eq)=>eq.expression === expr)) {
            setError(`Already plotting: ${expr}`);
            return;
        }
        const color = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EQUATION_COLORS"][equations.length % __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EQUATION_COLORS"].length];
        setEquations((prev)=>[
                ...prev,
                {
                    id: nextId(),
                    expression: expr,
                    color
                }
            ]);
        setInputValue('');
        setError(null);
    }, [
        equations
    ]);
    const removeEquation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        setEquations((prev)=>prev.filter((eq)=>eq.id !== id));
    }, []);
    const handlePlot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"])(()=>addEquation(inputValue), [
        inputValue,
        addEquation
    ]);
    const zoomIn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"])(()=>setView((v)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["zoomView"])(v, 'in')), []);
    const zoomOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"])(()=>setView((v)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["zoomView"])(v, 'out')), []);
    const resetView = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"])(()=>setView(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_VIEW"]), []);
    return {
        equations,
        inputValue,
        setInputValue,
        view,
        setView,
        error,
        addEquation,
        removeEquation,
        handlePlot,
        zoomIn,
        zoomOut,
        resetView
    };
}
}),
"[project]/apps/web/components/PresetBar.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/apps/web/components/PresetBar.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/components/PresetBar.tsx <module evaluation>", "default");
}),
"[project]/apps/web/components/PresetBar.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/apps/web/components/PresetBar.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/components/PresetBar.tsx", "default");
}),
"[project]/apps/web/components/PresetBar.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$PresetBar$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/web/components/PresetBar.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$PresetBar$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/apps/web/components/PresetBar.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$PresetBar$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/apps/web/components/EquationInput.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/apps/web/components/EquationInput.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/components/EquationInput.tsx <module evaluation>", "default");
}),
"[project]/apps/web/components/EquationInput.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/apps/web/components/EquationInput.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/components/EquationInput.tsx", "default");
}),
"[project]/apps/web/components/EquationInput.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$EquationInput$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/web/components/EquationInput.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$EquationInput$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/apps/web/components/EquationInput.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$EquationInput$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/apps/web/components/EquationTags.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/apps/web/components/EquationTags.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/components/EquationTags.tsx <module evaluation>", "default");
}),
"[project]/apps/web/components/EquationTags.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/apps/web/components/EquationTags.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/components/EquationTags.tsx", "default");
}),
"[project]/apps/web/components/EquationTags.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$EquationTags$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/web/components/EquationTags.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$EquationTags$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/apps/web/components/EquationTags.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$EquationTags$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/apps/web/components/ZoomControls.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/apps/web/components/ZoomControls.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/components/ZoomControls.tsx <module evaluation>", "default");
}),
"[project]/apps/web/components/ZoomControls.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/apps/web/components/ZoomControls.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/components/ZoomControls.tsx", "default");
}),
"[project]/apps/web/components/ZoomControls.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$ZoomControls$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/web/components/ZoomControls.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$ZoomControls$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/apps/web/components/ZoomControls.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$ZoomControls$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/apps/web/components/GraphCanvas.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GraphCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
// 'use client';
// import { useEffect, useRef } from 'react';
// import { Equation, ViewRange } from '@mathgraph/core';
// import { useCanvas } from '../lib/useCanvas';
// import ZoomControls from './ZoomControls';
// interface Props {
//   equations: Equation[];
//   view: ViewRange;
//   onZoomIn: () => void;
//   onZoomOut: () => void;
//   onReset: () => void;
// }
// export default function GraphCanvas({ equations, view, onZoomIn, onZoomOut, onReset }: Props) {
//   const { canvasRef, tooltip, handleMouseMove, handleMouseLeave } = useCanvas(equations, view);
//   // Make canvas fill its container
//   const containerRef = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     const container = containerRef.current;
//     const canvas = canvasRef.current;
//     if (!container || !canvas) return;
//     const resize = () => {
//       canvas.width = container.clientWidth;
//       canvas.height = container.clientHeight;
//     };
//     resize();
//     const ro = new ResizeObserver(resize);
//     ro.observe(container);
//     return () => ro.disconnect();
//   }, [canvasRef]);
//   return (
//     <div
//       ref={containerRef}
//       style={{ position: 'relative', width: '100%', height: '480px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e2433' }}
//     >
//       <canvas
//         ref={canvasRef}
//         onMouseMove={handleMouseMove}
//         onMouseLeave={handleMouseLeave}
//         style={{ display: 'block', width: '100%', height: '100%', cursor: 'crosshair' }}
//       />
//       {/* Coordinate tooltip */}
//       {tooltip && (
//         <div
//           style={{
//             position: 'absolute',
//             left: tooltip.pixelX + 12,
//             top: tooltip.pixelY - 24,
//             background: '#1e2433dd',
//             border: '1px solid #2d3748',
//             borderRadius: '6px',
//             padding: '4px 8px',
//             fontSize: '12px',
//             color: '#a0aec0',
//             pointerEvents: 'none',
//             whiteSpace: 'nowrap',
//           }}
//         >
//           x: {tooltip.x.toFixed(2)}, y: {tooltip.y.toFixed(2)}
//         </div>
//       )}
//       <ZoomControls onZoomIn={onZoomIn} onZoomOut={onZoomOut} onReset={onReset} />
//     </div>
//   );
// }
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'react-native'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/core/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/src/graphEngine.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$ZoomControls$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/components/ZoomControls.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
function GraphCanvas({ equations, view, onZoomIn, onZoomOut, onReset }) {
    const [size, setSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"])({
        width: 0,
        height: 380
    });
    const [probe, setProbe] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"])(null);
    const probeTimeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useRef"])(null);
    const W = size.width;
    const H = size.height;
    function computeProbe(touchX) {
        if (!W) return;
        const cx = W / 2;
        const cy = H / 2;
        const mathX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pixelToMathX"])(touchX, view, W);
        const values = equations.map((eq)=>{
            const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["plotEquation"])(eq.expression, view);
            if (result.hasError || !result.points.length) return null;
            const nearest = result.points.reduce((best, pt)=>{
                return Math.abs(pt.x - mathX) < Math.abs(best.x - mathX) ? pt : best;
            });
            if (isNaN(nearest.y) || !isFinite(nearest.y)) return null;
            return {
                expr: eq.expression,
                color: eq.color,
                mathY: nearest.y,
                dotPy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["mathToPixelY"])(nearest.y, view, H)
            };
        }).filter(Boolean);
        setProbe({
            px: touchX,
            mathX,
            values
        });
    }
    const panResponder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useRef"])(PanResponder.create({
        onStartShouldSetPanResponder: ()=>true,
        onMoveShouldSetPanResponder: ()=>true,
        onPanResponderGrant: (e)=>{
            if (probeTimeout.current) clearTimeout(probeTimeout.current);
            computeProbe(e.nativeEvent.locationX);
        },
        onPanResponderMove: (e, gs)=>{
            if (probeTimeout.current) clearTimeout(probeTimeout.current);
            // If mostly horizontal movement treat as probe, vertical as scroll
            computeProbe(e.nativeEvent.locationX);
        },
        onPanResponderRelease: ()=>{
            probeTimeout.current = setTimeout(()=>setProbe(null), 1800);
        }
    })).current;
    // Draw grid, axes, equations, and probe on a plain View + Canvas
    const drawLines = ()=>{
        if (!W) return null;
        const cx = W / 2;
        const cy = H / 2;
        const xLines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["computeGridLines"])(view.xMin, view.xMax, W, 'x');
        const yLines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["computeGridLines"])(view.yMin, view.yMax, H, 'y');
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                xLines.filter((l)=>!l.isAxis).map((l, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
                        style: [
                            styles.gridLine,
                            {
                                left: l.position,
                                top: 0,
                                width: 1,
                                height: H,
                                backgroundColor: 'rgba(124,58,237,0.1)'
                            }
                        ]
                    }, 'gx' + i, false, {
                        fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                        lineNumber: 156,
                        columnNumber: 11
                    }, this)),
                yLines.filter((l)=>!l.isAxis).map((l, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
                        style: [
                            styles.gridLine,
                            {
                                top: l.position,
                                left: 0,
                                height: 1,
                                width: W,
                                backgroundColor: 'rgba(124,58,237,0.1)'
                            }
                        ]
                    }, 'gy' + i, false, {
                        fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                        lineNumber: 159,
                        columnNumber: 11
                    }, this)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
                    style: [
                        styles.gridLine,
                        {
                            top: Math.min(Math.max((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["mathToPixelY"])(0, view, H), 0), H),
                            left: 0,
                            height: 1.5,
                            width: W,
                            backgroundColor: 'rgba(124,58,237,0.45)'
                        }
                    ]
                }, void 0, false, {
                    fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                    lineNumber: 162,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
                    style: [
                        styles.gridLine,
                        {
                            left: Math.min(Math.max((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["mathToPixelX"])(0, view, W), 0), W),
                            top: 0,
                            width: 1.5,
                            height: H,
                            backgroundColor: 'rgba(124,58,237,0.45)'
                        }
                    ]
                }, void 0, false, {
                    fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                    lineNumber: 163,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true);
    };
    const onLayout = (e)=>{
        const { width, height } = e.nativeEvent.layout;
        setSize({
            width,
            height: height || 380
        });
    };
    const tooltipLeft = probe && probe.px > W * 0.6 ? probe.px - 165 : (probe?.px ?? 0) + 14;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
        style: styles.wrapper,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
            style: styles.graphArea,
            onLayout: onLayout,
            ...panResponder.panHandlers,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
                    style: [
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: '#0d0f1e',
                            borderRadius: 12
                        }
                    ]
                }, void 0, false, {
                    fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                    lineNumber: 183,
                    columnNumber: 9
                }, this),
                drawLines(),
                probe && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
                    style: [
                        styles.crosshair,
                        {
                            left: probe.px
                        }
                    ]
                }, void 0, false, {
                    fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                    lineNumber: 190,
                    columnNumber: 11
                }, this),
                probe?.values.map((v, i)=>v.dotPy > 0 && v.dotPy < H ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
                                style: [
                                    styles.dotGlow,
                                    {
                                        left: probe.px - 9,
                                        top: v.dotPy - 9,
                                        backgroundColor: v.color + '22'
                                    }
                                ]
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                                lineNumber: 198,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
                                style: [
                                    styles.dot,
                                    {
                                        left: probe.px - 5.5,
                                        top: v.dotPy - 5.5,
                                        backgroundColor: v.color
                                    }
                                ]
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                                lineNumber: 200,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
                                style: [
                                    styles.dotInner,
                                    {
                                        left: probe.px - 2,
                                        top: v.dotPy - 2
                                    }
                                ]
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                                lineNumber: 202,
                                columnNumber: 15
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                        lineNumber: 196,
                        columnNumber: 13
                    }, this) : null),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
                    style: StyleSheet.absoluteFill,
                    pointerEvents: "none",
                    children: W > 0 && equations.map((eq)=>{
                        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["plotEquation"])(eq.expression, view);
                        if (result.hasError || !result.points.length) return null;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(EquationPath, {
                            points: result.points,
                            view: view,
                            color: eq.color,
                            W: W,
                            H: H
                        }, eq.id, false, {
                            fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                            lineNumber: 213,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                    lineNumber: 208,
                    columnNumber: 9
                }, this),
                probe && probe.values.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
                    style: [
                        styles.tooltip,
                        {
                            left: tooltipLeft,
                            top: 14
                        }
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                            style: styles.tipX,
                            children: [
                                "x = ",
                                probe.mathX.toFixed(3)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                            lineNumber: 221,
                            columnNumber: 13
                        }, this),
                        probe.values.map((v, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
                                style: styles.tipRow,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
                                        style: [
                                            styles.tipDot,
                                            {
                                                backgroundColor: v.color
                                            }
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                                        lineNumber: 224,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                                        style: styles.tipExpr,
                                        children: v.expr
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                                        lineNumber: 225,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                                        style: styles.tipVal,
                                        children: v.mathY.toFixed(3)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                                        lineNumber: 226,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, i, true, {
                                fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                                lineNumber: 223,
                                columnNumber: 15
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                    lineNumber: 220,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$ZoomControls$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                    onZoomIn: onZoomIn,
                    onZoomOut: onZoomOut,
                    onReset: onReset
                }, void 0, false, {
                    fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                    lineNumber: 232,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/components/GraphCanvas.tsx",
            lineNumber: 177,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/components/GraphCanvas.tsx",
        lineNumber: 176,
        columnNumber: 5
    }, this);
}
// Sub-component to draw a single equation as SVG polyline using React Native SVG
function EquationPath({ points, view, color, W, H }) {
    const Svg = __turbopack_context__.r("[project]/node_modules/react-native-svg/lib/module/index.js [app-rsc] (ecmascript)").Svg;
    const Polyline = __turbopack_context__.r("[project]/node_modules/react-native-svg/lib/module/index.js [app-rsc] (ecmascript)").Polyline;
    const segments = [];
    let current = [];
    points.forEach((pt)=>{
        if (isNaN(pt.y) || !isFinite(pt.y)) {
            if (current.length) {
                segments.push(current);
                current = [];
            }
            return;
        }
        const px = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["mathToPixelX"])(pt.x, view, W);
        const py = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$graphEngine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["mathToPixelY"])(pt.y, view, H);
        if (py < -H * 2 || py > H * 3) {
            if (current.length) {
                segments.push(current);
                current = [];
            }
            return;
        }
        current.push(`${px.toFixed(1)},${py.toFixed(1)}`);
    });
    if (current.length) segments.push(current);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        width: W,
        height: H,
        style: StyleSheet.absoluteFill,
        children: segments.map((seg, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Polyline, {
                points: seg.join(' '),
                stroke: color,
                strokeWidth: "2.2",
                fill: "none",
                strokeLinejoin: "round",
                strokeLinecap: "round"
            }, i, false, {
                fileName: "[project]/apps/web/components/GraphCanvas.tsx",
                lineNumber: 258,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/apps/web/components/GraphCanvas.tsx",
        lineNumber: 256,
        columnNumber: 5
    }, this);
}
const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 10,
        paddingVertical: 8
    },
    graphArea: {
        width: '100%',
        height: 400,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(124,58,237,0.25)',
        position: 'relative'
    },
    gridLine: {
        position: 'absolute'
    },
    crosshair: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 1.5,
        backgroundColor: 'rgba(167,139,250,0.3)'
    },
    dotGlow: {
        position: 'absolute',
        width: 18,
        height: 18,
        borderRadius: 9
    },
    dot: {
        position: 'absolute',
        width: 11,
        height: 11,
        borderRadius: 6
    },
    dotInner: {
        position: 'absolute',
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#fff'
    },
    tooltip: {
        position: 'absolute',
        backgroundColor: 'rgba(10,9,30,0.96)',
        borderWidth: 1.5,
        borderColor: '#7c3aed',
        borderRadius: 12,
        padding: 10,
        minWidth: 148,
        zIndex: 10
    },
    tipX: {
        color: '#a78bfa',
        fontSize: 11,
        fontFamily: 'monospace',
        fontWeight: '600',
        marginBottom: 4,
        letterSpacing: 0.5
    },
    tipRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        marginTop: 3
    },
    tipDot: {
        width: 8,
        height: 8,
        borderRadius: 4
    },
    tipExpr: {
        color: 'rgba(200,190,255,0.6)',
        fontSize: 12,
        fontFamily: 'monospace',
        minWidth: 58
    },
    tipVal: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'monospace',
        fontWeight: '700'
    }
});
}),
"[project]/apps/web/components/MathGraph.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// 'use client';
// import { useGraph } from '../lib/useGraph';
// import PresetBar from './PresetBar';
// import EquationInput from './EquationInput';
// import EquationTags from './EquationTags';
// import GraphCanvas from './GraphCanvas';
// export default function MathGraph() {
//   const {
//     equations,
//     inputValue,
//     setInputValue,
//     view,
//     error,
//     addEquation,
//     removeEquation,
//     handlePlot,
//     zoomIn,
//     zoomOut,
//     resetView,
//   } = useGraph();
//   return (
//     <div style={{ width: '100%', maxWidth: '800px' }}>
//       <PresetBar onSelect={expr => { setInputValue(expr); addEquation(expr); }} />
//       <EquationInput
//         value={inputValue}
//         onChange={setInputValue}
//         onPlot={handlePlot}
//         error={error}
//       />
//       <EquationTags equations={equations} onRemove={removeEquation} />
//       <GraphCanvas
//         equations={equations}
//         view={view}
//         onZoomIn={zoomIn}
//         onZoomOut={zoomOut}
//         onReset={resetView}
//       />
//     </div>
//   );
// }
__turbopack_context__.s([
    "default",
    ()=>MathGraph
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'react-native'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$useGraph$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/useGraph.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$PresetBar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/components/PresetBar.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$EquationInput$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/components/EquationInput.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$EquationTags$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/components/EquationTags.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$GraphCanvas$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/components/GraphCanvas.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
function MathGraph() {
    const { equations, inputValue, setInputValue, view, error, addEquation, removeEquation, handlePlot, zoomIn, zoomOut, resetView } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$useGraph$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useGraph"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(SafeAreaView, {
        style: styles.safe,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(KeyboardAvoidingView, {
            style: styles.flex,
            behavior: Platform.OS === 'ios' ? 'padding' : undefined,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ScrollView, {
                style: styles.flex,
                contentContainerStyle: styles.content,
                keyboardShouldPersistTaps: "handled",
                showsVerticalScrollIndicator: false,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
                        style: styles.header,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                                style: styles.headerTitle,
                                children: "📐 MathGraph"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/MathGraph.tsx",
                                lineNumber: 79,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                                style: styles.headerSub,
                                children: "Visualize equations instantly"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/MathGraph.tsx",
                                lineNumber: 80,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/components/MathGraph.tsx",
                        lineNumber: 78,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
                        style: styles.divider
                    }, void 0, false, {
                        fileName: "[project]/apps/web/components/MathGraph.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$PresetBar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        onSelect: (expr)=>{
                            setInputValue(expr);
                            addEquation(expr);
                        }
                    }, void 0, false, {
                        fileName: "[project]/apps/web/components/MathGraph.tsx",
                        lineNumber: 87,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
                        style: styles.divider
                    }, void 0, false, {
                        fileName: "[project]/apps/web/components/MathGraph.tsx",
                        lineNumber: 89,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
                        style: styles.section,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$EquationInput$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            value: inputValue,
                            onChange: setInputValue,
                            onPlot: handlePlot,
                            error: error
                        }, void 0, false, {
                            fileName: "[project]/apps/web/components/MathGraph.tsx",
                            lineNumber: 93,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/components/MathGraph.tsx",
                        lineNumber: 92,
                        columnNumber: 11
                    }, this),
                    equations.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
                                style: styles.divider
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/MathGraph.tsx",
                                lineNumber: 104,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$EquationTags$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                equations: equations,
                                onRemove: removeEquation
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/MathGraph.tsx",
                                lineNumber: 105,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(View, {
                        style: styles.divider
                    }, void 0, false, {
                        fileName: "[project]/apps/web/components/MathGraph.tsx",
                        lineNumber: 109,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$GraphCanvas$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        equations: equations,
                        view: view,
                        onZoomIn: zoomIn,
                        onZoomOut: zoomOut,
                        onReset: resetView
                    }, void 0, false, {
                        fileName: "[project]/apps/web/components/MathGraph.tsx",
                        lineNumber: 112,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                        style: styles.hint,
                        children: "Touch the graph to inspect values"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/components/MathGraph.tsx",
                        lineNumber: 121,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/components/MathGraph.tsx",
                lineNumber: 71,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/web/components/MathGraph.tsx",
            lineNumber: 67,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/components/MathGraph.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#0d0f1e'
    },
    flex: {
        flex: 1
    },
    content: {
        paddingBottom: 30
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 14,
        backgroundColor: '#11132a',
        alignItems: 'center'
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: -0.3
    },
    headerSub: {
        fontSize: 12,
        color: 'rgba(167,139,250,0.5)',
        marginTop: 3
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(124,58,237,0.15)'
    },
    section: {
        paddingTop: 12
    },
    hint: {
        textAlign: 'center',
        fontSize: 11,
        color: 'rgba(124,58,237,0.35)',
        marginTop: 8
    }
});
}),
"[project]/apps/web/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$MathGraph$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/components/MathGraph.tsx [app-rsc] (ecmascript)");
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '24px 16px',
            minHeight: '100vh'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                style: {
                    fontSize: '24px',
                    fontWeight: 700,
                    marginBottom: '24px',
                    color: '#fff'
                },
                children: "📈 MathGraph"
            }, void 0, false, {
                fileName: "[project]/apps/web/app/page.tsx",
                lineNumber: 6,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$MathGraph$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/apps/web/app/page.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/app/page.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/web/app/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__054xqqi._.js.map
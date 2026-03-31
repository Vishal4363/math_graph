export interface Point {
    x: number;
    y: number;
}
export interface Equation {
    id: string;
    expression: string;
    color: string;
}
export interface GridLine {
    value: number;
    position: number;
    isAxis: boolean;
}
export interface ViewRange {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
}
export interface PlotResult {
    points: Point[];
    hasError: boolean;
    errorMessage?: string;
}

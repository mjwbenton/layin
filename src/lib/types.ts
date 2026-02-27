export interface PaperSize {
  name: string;
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
  bleed?: Bleed;
}

export interface Layout {
  label: string;
  rows: number;
  cols: number;
}

export type FitMode = "fill" | "fit";

export type Orientation = "portrait" | "landscape";

export interface SlotImage {
  url: string;
  element: HTMLImageElement;
  fitMode: FitMode;
}

export interface Slot {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Margins {
  edgeMm: number;
  gutterMm: number;
}

export interface Bleed {
  topMm: number;
  bottomMm: number;
  leftMm: number;
  rightMm: number;
}

export interface EffectiveMargins {
  topPx: number;
  bottomPx: number;
  leftPx: number;
  rightPx: number;
  gutterPx: number;
}

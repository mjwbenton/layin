export interface PaperSize {
  name: string;
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
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

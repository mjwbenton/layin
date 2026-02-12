import type { PaperSize } from "./types";

const DPI = 300;
const MM_PER_INCH = 25.4;

export function mmToPx(mm: number): number {
  return Math.round((mm / MM_PER_INCH) * DPI);
}

export const PAPER_SIZES: PaperSize[] = [
  {
    name: "Postcard",
    widthMm: 100,
    heightMm: 148,
    widthPx: 1181,
    heightPx: 1748,
  },
  {
    name: "L Size",
    widthMm: 89,
    heightMm: 119,
    widthPx: 1051,
    heightPx: 1406,
  },
  {
    name: "Card",
    widthMm: 54,
    heightMm: 86,
    widthPx: 638,
    heightPx: 1016,
  },
];

export const DEFAULT_PAPER = PAPER_SIZES[0];

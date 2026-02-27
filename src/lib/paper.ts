import type { PaperSize, Bleed } from "./types";

const DPI = 300;
const MM_PER_INCH = 25.4;

export function mmToPx(mm: number): number {
  return Math.round((mm / MM_PER_INCH) * DPI);
}

// Bleed values measured from the Canon Selphy CP1000 in portrait orientation
export const SELPHY_BLEED: Bleed = {
  topMm: 4,
  bottomMm: 5.5,
  leftMm: 3.5,
  rightMm: 3,
};

// Rotate bleed from portrait to landscape orientation.
// Matches the export's 90° CW rotation (translate(W,0) + rotate(PI/2)):
// landscape left → physical top, landscape top → physical right, etc.
export function rotateBleedLandscape(bleed: Bleed): Bleed {
  return {
    topMm: bleed.rightMm,
    rightMm: bleed.bottomMm,
    bottomMm: bleed.leftMm,
    leftMm: bleed.topMm,
  };
}

export const PAPER_SIZES: PaperSize[] = [
  {
    name: "Canon Selphy CP1000 Postcard",
    widthMm: 100,
    heightMm: 148,
    widthPx: 1181,
    heightPx: 1748,
    bleed: SELPHY_BLEED,
  },
];

export const DEFAULT_PAPER = PAPER_SIZES[0];

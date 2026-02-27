import type { Layout, Slot, Margins, Bleed, EffectiveMargins } from "./types";
import { mmToPx } from "./paper";

export const LAYOUTS: Layout[] = [
  { label: "1x1", rows: 1, cols: 1 },
  { label: "1x2", rows: 1, cols: 2 },
  { label: "2x1", rows: 2, cols: 1 },
  { label: "2x2", rows: 2, cols: 2 },
];

export const DEFAULT_LAYOUT = LAYOUTS[0];

export const DEFAULT_MARGINS: Margins = {
  edgeMm: 2,
  gutterMm: 2,
};

export function computeEffectiveMargins(margins: Margins, bleed?: Bleed): EffectiveMargins {
  const topMm = margins.edgeMm + (bleed?.topMm ?? 0);
  const bottomMm = margins.edgeMm + (bleed?.bottomMm ?? 0);
  const leftMm = margins.edgeMm + (bleed?.leftMm ?? 0);
  const rightMm = margins.edgeMm + (bleed?.rightMm ?? 0);

  return {
    topPx: mmToPx(topMm),
    bottomPx: mmToPx(bottomMm),
    leftPx: mmToPx(leftMm),
    rightPx: mmToPx(rightMm),
    gutterPx: mmToPx(margins.gutterMm),
  };
}

export function calculateSlots(
  paperWidthPx: number,
  paperHeightPx: number,
  layout: Layout,
  margins: EffectiveMargins,
): Slot[] {
  const { topPx, bottomPx, leftPx, rightPx, gutterPx } = margins;

  const totalGutterX = gutterPx * (layout.cols - 1);
  const totalGutterY = gutterPx * (layout.rows - 1);

  const availableWidth = paperWidthPx - leftPx - rightPx - totalGutterX;
  const availableHeight = paperHeightPx - topPx - bottomPx - totalGutterY;

  const slotWidth = Math.floor(availableWidth / layout.cols);
  const slotHeight = Math.floor(availableHeight / layout.rows);

  const slots: Slot[] = [];

  for (let row = 0; row < layout.rows; row++) {
    for (let col = 0; col < layout.cols; col++) {
      slots.push({
        x: leftPx + col * (slotWidth + gutterPx),
        y: topPx + row * (slotHeight + gutterPx),
        width: slotWidth,
        height: slotHeight,
      });
    }
  }

  return slots;
}

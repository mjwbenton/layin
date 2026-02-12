import type { Layout, Slot, Margins } from "./types";
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

export function calculateSlots(
  paperWidthPx: number,
  paperHeightPx: number,
  layout: Layout,
  margins: Margins,
): Slot[] {
  const edgePx = mmToPx(margins.edgeMm);
  const gutterPx = mmToPx(margins.gutterMm);

  const totalGutterX = gutterPx * (layout.cols - 1);
  const totalGutterY = gutterPx * (layout.rows - 1);

  const availableWidth = paperWidthPx - 2 * edgePx - totalGutterX;
  const availableHeight = paperHeightPx - 2 * edgePx - totalGutterY;

  const slotWidth = Math.floor(availableWidth / layout.cols);
  const slotHeight = Math.floor(availableHeight / layout.rows);

  const slots: Slot[] = [];

  for (let row = 0; row < layout.rows; row++) {
    for (let col = 0; col < layout.cols; col++) {
      slots.push({
        x: edgePx + col * (slotWidth + gutterPx),
        y: edgePx + row * (slotHeight + gutterPx),
        width: slotWidth,
        height: slotHeight,
      });
    }
  }

  return slots;
}

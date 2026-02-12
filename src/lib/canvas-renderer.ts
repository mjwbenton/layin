import type { Slot, FitMode } from "./types";

export interface ImageDrawRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

export function calculateImageDrawRect(
  imgWidth: number,
  imgHeight: number,
  slotX: number,
  slotY: number,
  slotWidth: number,
  slotHeight: number,
  fitMode: FitMode,
): ImageDrawRect {
  const imgAspect = imgWidth / imgHeight;
  const slotAspect = slotWidth / slotHeight;

  if (fitMode === "fill") {
    // Scale image to cover the slot, center-crop
    let sx: number, sy: number, sw: number, sh: number;

    if (imgAspect > slotAspect) {
      // Image is wider than slot — crop sides
      sh = imgHeight;
      sw = imgHeight * slotAspect;
      sx = (imgWidth - sw) / 2;
      sy = 0;
    } else {
      // Image is taller than slot — crop top/bottom
      sw = imgWidth;
      sh = imgWidth / slotAspect;
      sx = 0;
      sy = (imgHeight - sh) / 2;
    }

    return { sx, sy, sw, sh, dx: slotX, dy: slotY, dw: slotWidth, dh: slotHeight };
  } else {
    // Fit: scale image to fit within the slot, letterbox
    let dw: number, dh: number;

    if (imgAspect > slotAspect) {
      // Image is wider — fit to width
      dw = slotWidth;
      dh = slotWidth / imgAspect;
    } else {
      // Image is taller — fit to height
      dh = slotHeight;
      dw = slotHeight * imgAspect;
    }

    const dx = slotX + (slotWidth - dw) / 2;
    const dy = slotY + (slotHeight - dh) / 2;

    return { sx: 0, sy: 0, sw: imgWidth, sh: imgHeight, dx, dy, dw, dh };
  }
}

export interface RenderSlotData {
  slot: Slot;
  image?: {
    element: HTMLImageElement;
    fitMode: FitMode;
  };
}

export function renderLayout(
  ctx: CanvasRenderingContext2D,
  paperWidthPx: number,
  paperHeightPx: number,
  slotData: RenderSlotData[],
) {
  // White background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, paperWidthPx, paperHeightPx);

  for (const { slot, image } of slotData) {
    if (image) {
      const rect = calculateImageDrawRect(
        image.element.naturalWidth,
        image.element.naturalHeight,
        slot.x,
        slot.y,
        slot.width,
        slot.height,
        image.fitMode,
      );

      // For fit mode, fill slot background white first
      if (image.fitMode === "fit") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(slot.x, slot.y, slot.width, slot.height);
      }

      ctx.drawImage(
        image.element,
        rect.sx,
        rect.sy,
        rect.sw,
        rect.sh,
        rect.dx,
        rect.dy,
        rect.dw,
        rect.dh,
      );
    }
  }
}

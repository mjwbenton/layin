import type { Slot, FitMode } from "./types";

/**
 * Pre-downsample a source image by repeatedly halving until within 2x of target size.
 * This avoids aliasing artifacts from large single-step downscales.
 */
function downsampleImage(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
): { source: CanvasImageSource; width: number; height: number } {
  let currentWidth = sourceWidth;
  let currentHeight = sourceHeight;
  let currentSource: CanvasImageSource = source;

  while (currentWidth > targetWidth * 2 || currentHeight > targetHeight * 2) {
    const nextWidth = Math.max(Math.ceil(currentWidth / 2), targetWidth);
    const nextHeight = Math.max(Math.ceil(currentHeight / 2), targetHeight);

    const stepCanvas = document.createElement("canvas");
    stepCanvas.width = nextWidth;
    stepCanvas.height = nextHeight;
    const stepCtx = stepCanvas.getContext("2d")!;
    stepCtx.imageSmoothingEnabled = true;
    stepCtx.imageSmoothingQuality = "high";
    stepCtx.drawImage(currentSource, 0, 0, currentWidth, currentHeight, 0, 0, nextWidth, nextHeight);

    currentSource = stepCanvas;
    currentWidth = nextWidth;
    currentHeight = nextHeight;
  }

  return { source: currentSource, width: currentWidth, height: currentHeight };
}

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

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

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

      // Pre-downsample to avoid aliasing from large single-step downscales
      const { source, width, height } = downsampleImage(
        image.element,
        image.element.naturalWidth,
        image.element.naturalHeight,
        rect.dw,
        rect.dh,
      );

      if (source === image.element) {
        // No pre-downsampling needed, draw directly with source crop
        ctx.drawImage(
          image.element,
          rect.sx, rect.sy, rect.sw, rect.sh,
          rect.dx, rect.dy, rect.dw, rect.dh,
        );
      } else {
        // Source was pre-downsampled — recalculate crop coordinates for the smaller source
        const scaleX = width / image.element.naturalWidth;
        const scaleY = height / image.element.naturalHeight;
        ctx.drawImage(
          source,
          rect.sx * scaleX, rect.sy * scaleY,
          rect.sw * scaleX, rect.sh * scaleY,
          rect.dx, rect.dy, rect.dw, rect.dh,
        );
      }
    }
  }
}

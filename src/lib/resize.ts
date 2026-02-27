import Pica from "pica";

const pica = new Pica();

/**
 * Extract a region from an image onto a new canvas.
 */
export function cropToCanvas(
  source: HTMLImageElement,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(sw);
  canvas.height = Math.round(sh);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  return canvas;
}

/**
 * Resize a canvas to target dimensions using Lanczos3 via pica.
 */
export async function resizeImage(
  source: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number,
): Promise<HTMLCanvasElement> {
  const dest = document.createElement("canvas");
  dest.width = Math.round(targetWidth);
  dest.height = Math.round(targetHeight);
  await pica.resize(source, dest, { filter: "lanczos3" });
  return dest;
}

import { save } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { renderLayout, type RenderSlotData } from "./canvas-renderer";
import { calculateSlots } from "./layout";
import type { PaperSize, Layout, EffectiveMargins, SlotImage, Orientation } from "./types";

function defaultFilename(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 8).replace(/:/g, "");
  return `layin-${date}-${time}.jpg`;
}

export async function exportJpeg(
  paper: PaperSize,
  layout: Layout,
  margins: EffectiveMargins,
  images: (SlotImage | null)[],
  orientation: Orientation = "portrait",
): Promise<void> {
  const slots = calculateSlots(paper.widthPx, paper.heightPx, layout, margins);

  // Render at full resolution on an offscreen canvas
  const canvas = document.createElement("canvas");
  canvas.width = paper.widthPx;
  canvas.height = paper.heightPx;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const slotData: RenderSlotData[] = slots.map((slot, i) => ({
    slot,
    image: images[i]
      ? { element: images[i].element, fitMode: images[i].fitMode }
      : undefined,
  }));

  await renderLayout(ctx, paper.widthPx, paper.heightPx, slotData);

  // For landscape, rotate 90° CW onto a portrait canvas for the printer
  let outputCanvas: HTMLCanvasElement;
  if (orientation === "landscape") {
    outputCanvas = document.createElement("canvas");
    // Swap dimensions back to portrait for output
    outputCanvas.width = paper.heightPx;
    outputCanvas.height = paper.widthPx;
    const outCtx = outputCanvas.getContext("2d");
    if (!outCtx) throw new Error("Could not get output canvas context");
    outCtx.translate(outputCanvas.width, 0);
    outCtx.rotate(Math.PI / 2);
    outCtx.drawImage(canvas, 0, 0);
  } else {
    outputCanvas = canvas;
  }

  // Convert to JPEG blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    outputCanvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to create JPEG blob"))),
      "image/jpeg",
      0.95,
    );
  });

  const arrayBuffer = await blob.arrayBuffer();
  const data = Array.from(new Uint8Array(arrayBuffer));

  // Show native save dialog
  const path = await save({
    defaultPath: defaultFilename(),
    filters: [{ name: "JPEG Image", extensions: ["jpg", "jpeg"] }],
  });

  if (!path) return; // User cancelled

  await invoke("save_image", { path, data });
}

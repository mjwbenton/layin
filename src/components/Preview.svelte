<script lang="ts">
  import { calculateSlots } from "../lib/layout";
  import { renderLayout, type RenderSlotData } from "../lib/canvas-renderer";
  import Slot from "./Slot.svelte";
  import type { PaperSize, Layout, Margins, SlotImage } from "../lib/types";

  interface Props {
    paper: PaperSize;
    layout: Layout;
    margins: Margins;
    images: (SlotImage | null)[];
    onSlotDrop: (index: number, image: SlotImage) => void;
    onSlotClear: (index: number) => void;
    onSlotToggleFit: (index: number) => void;
  }

  let { paper, layout, margins, images, onSlotDrop, onSlotClear, onSlotToggleFit }: Props = $props();

  let canvas: HTMLCanvasElement | undefined = $state();
  let container: HTMLDivElement | undefined = $state();
  let containerWidth = $state(0);
  let containerHeight = $state(0);

  let slots = $derived(
    calculateSlots(paper.widthPx, paper.heightPx, layout, margins),
  );

  let scale = $derived.by(() => {
    if (!containerWidth || !containerHeight) return 1;
    const scaleX = containerWidth / paper.widthPx;
    const scaleY = containerHeight / paper.heightPx;
    return Math.min(scaleX, scaleY);
  });

  let displayWidth = $derived(Math.floor(paper.widthPx * scale));
  let displayHeight = $derived(Math.floor(paper.heightPx * scale));

  $effect(() => {
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      containerWidth = entry.contentRect.width;
      containerHeight = entry.contentRect.height;
    });
    observer.observe(container);
    return () => observer.disconnect();
  });

  $effect(() => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const slotData: RenderSlotData[] = slots.map((slot, i) => ({
      slot,
      image: images[i]
        ? { element: images[i].element, fitMode: images[i].fitMode }
        : undefined,
    }));

    renderLayout(ctx, paper.widthPx, paper.heightPx, slotData);
  });
</script>

<div class="preview-container" bind:this={container}>
  <canvas
    bind:this={canvas}
    width={paper.widthPx}
    height={paper.heightPx}
    style="width: {displayWidth}px; height: {displayHeight}px;"
    class="preview-canvas"
  ></canvas>

  <div
    class="slot-overlay-container"
    style="width: {displayWidth}px; height: {displayHeight}px;"
  >
    {#each slots as slot, i}
      <Slot
        index={i}
        image={images[i]}
        style="left: {slot.x * scale}px; top: {slot.y * scale}px; width: {slot.width * scale}px; height: {slot.height * scale}px;"
        onDrop={onSlotDrop}
        onClear={onSlotClear}
        onToggleFit={onSlotToggleFit}
      />
    {/each}
  </div>
</div>

<style>
  .preview-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    overflow: hidden;
    position: relative;
  }

  .preview-canvas {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  }

  .slot-overlay-container {
    position: absolute;
    pointer-events: none;
  }
</style>

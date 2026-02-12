<script lang="ts">
  import { calculateSlots } from "../lib/layout";
  import type { PaperSize, Layout, Margins } from "../lib/types";

  interface Props {
    paper: PaperSize;
    layout: Layout;
    margins: Margins;
  }

  let { paper, layout, margins }: Props = $props();

  let slots = $derived(
    calculateSlots(paper.widthPx, paper.heightPx, layout, margins),
  );

  let aspectRatio = $derived(paper.widthPx / paper.heightPx);
</script>

<div class="preview-container">
  <div
    class="preview-page"
    style="aspect-ratio: {aspectRatio};"
  >
    {#each slots as slot, i}
      <div
        class="preview-slot"
        style="
          left: {(slot.x / paper.widthPx) * 100}%;
          top: {(slot.y / paper.heightPx) * 100}%;
          width: {(slot.width / paper.widthPx) * 100}%;
          height: {(slot.height / paper.heightPx) * 100}%;
        "
      >
        <span class="slot-label">Drop image {i + 1}</span>
      </div>
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
  }

  .preview-page {
    position: relative;
    background: #fff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: 100%;
  }

  .preview-slot {
    position: absolute;
    border: 2px dashed #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .slot-label {
    color: #999;
    font-size: 12px;
    pointer-events: none;
  }
</style>

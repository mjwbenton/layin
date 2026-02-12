<script lang="ts">
  import type { SlotImage, FitMode } from "../lib/types";

  interface Props {
    index: number;
    image: SlotImage | null;
    style: string;
    onDrop: (index: number, image: SlotImage) => void;
    onClear: (index: number) => void;
    onToggleFit: (index: number) => void;
  }

  let { index, image, style, onDrop, onClear, onToggleFit }: Props = $props();
  let dragOver = $state(false);

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    dragOver = true;
  }

  function handleDragLeave() {
    dragOver = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragOver = false;

    const file = e.dataTransfer?.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      onDrop(index, { url, element: img, fitMode: "fill" as FitMode });
    };
    img.src = url;
  }
</script>

<div
  class="slot"
  class:drag-over={dragOver}
  class:has-image={!!image}
  {style}
  role="button"
  tabindex="-1"
  ondragover={handleDragOver}
  ondragleave={handleDragLeave}
  ondrop={handleDrop}
>
  {#if !image}
    <span class="slot-label">Drop image {index + 1}</span>
  {:else}
    <div class="slot-controls">
      <button
        class="slot-btn"
        onclick={() => onToggleFit(index)}
        title="Toggle fill/fit"
      >
        {image.fitMode === "fill" ? "Fill" : "Fit"}
      </button>
      <button
        class="slot-btn slot-btn-clear"
        onclick={() => onClear(index)}
        title="Remove image"
      >
        X
      </button>
    </div>
  {/if}
</div>

<style>
  .slot {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed #ccc;
    border-radius: 4px;
    transition: border-color 0.15s, background-color 0.15s;
    pointer-events: auto;
  }

  .slot.has-image {
    border-color: transparent;
  }

  .slot.drag-over {
    border-color: #4a90d9;
    border-style: solid;
    background: rgba(74, 144, 217, 0.08);
  }

  .slot-label {
    color: #aaa;
    font-size: 12px;
    pointer-events: none;
    text-align: center;
    line-height: 1.4;
  }

  .slot-controls {
    position: absolute;
    top: 4px;
    right: 4px;
    display: flex;
    gap: 3px;
    opacity: 0;
    transition: opacity 0.15s;
  }

  .slot:hover .slot-controls {
    opacity: 1;
  }

  .slot-btn {
    padding: 3px 8px;
    font-size: 11px;
    font-weight: 500;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    backdrop-filter: blur(4px);
  }

  .slot-btn:hover {
    background: rgba(0, 0, 0, 0.75);
  }
</style>

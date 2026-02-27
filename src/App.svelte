<script lang="ts">
  import { onMount } from "svelte";
  import "./styles/global.css";
  import Toolbar from "./components/Toolbar.svelte";
  import Preview from "./components/Preview.svelte";
  import ExportButton from "./components/ExportButton.svelte";
  import { DEFAULT_PAPER } from "./lib/paper";
  import { DEFAULT_LAYOUT, DEFAULT_MARGINS, computeEffectiveMargins } from "./lib/layout";
  import { exportJpeg } from "./lib/export";
  import { rotateBleedLandscape } from "./lib/paper";
  import type { PaperSize, Layout, Margins, SlotImage, Orientation, EffectiveMargins } from "./lib/types";

  let paper: PaperSize = $state(DEFAULT_PAPER);
  let layout: Layout = $state(DEFAULT_LAYOUT);
  let margins: Margins = $state(DEFAULT_MARGINS);
  let images: (SlotImage | null)[] = $state([]);
  let orientation = $state<Orientation>("portrait");

  let effectivePaper: PaperSize = $derived(
    orientation === "landscape"
      ? {
          ...paper,
          widthMm: paper.heightMm,
          heightMm: paper.widthMm,
          widthPx: paper.heightPx,
          heightPx: paper.widthPx,
          bleed: paper.bleed ? rotateBleedLandscape(paper.bleed) : undefined,
        }
      : paper,
  );

  let effectiveMargins: EffectiveMargins = $derived(
    computeEffectiveMargins(margins, effectivePaper.bleed),
  );

  $effect(() => {
    const count = layout.rows * layout.cols;
    images = Array.from({ length: count }, () => null);
  });

  function handleSlotDrop(index: number, image: SlotImage) {
    // Revoke old URL if replacing
    if (images[index]) {
      URL.revokeObjectURL(images[index].url);
    }
    images[index] = image;
  }

  function handleSlotClear(index: number) {
    if (images[index]) {
      URL.revokeObjectURL(images[index].url);
      images[index] = null;
    }
  }

  function handleSlotToggleFit(index: number) {
    const img = images[index];
    if (img) {
      images[index] = {
        ...img,
        fitMode: img.fitMode === "fill" ? "fit" : "fill",
      };
    }
  }

  // Prevent browser from navigating to dropped files
  onMount(() => {
    const prevent = (e: Event) => e.preventDefault();
    window.addEventListener("dragover", prevent);
    window.addEventListener("drop", prevent);
    return () => {
      window.removeEventListener("dragover", prevent);
      window.removeEventListener("drop", prevent);
    };
  });

  async function handleExport() {
    await exportJpeg(effectivePaper, layout, effectiveMargins, images, orientation);
  }
</script>

<Toolbar
  {paper}
  {layout}
  {margins}
  {orientation}
  onPaperChange={(p) => (paper = p)}
  onLayoutChange={(l) => (layout = l)}
  onMarginsChange={(m) => (margins = m)}
  onOrientationChange={(o) => (orientation = o)}
/>

<Preview
  paper={effectivePaper}
  {layout}
  margins={effectiveMargins}
  {images}
  onSlotDrop={handleSlotDrop}
  onSlotClear={handleSlotClear}
  onSlotToggleFit={handleSlotToggleFit}
/>

<ExportButton onexport={handleExport} />
